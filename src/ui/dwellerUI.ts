import type { Dweller } from '../types/saveFile';
import type { SaveEditor } from '../core/SaveEditor';
import { DwellerFormManager, DwellerEquipmentManager, DwellerBatchOperations, DwellerUIManager } from './dweller';

/**
 * Handles the dweller editing interface
 */
export class DwellerUI {
  private saveEditor: SaveEditor;
  private selectedDweller: Dweller | null = null;

  // Manager instances
  private formManager: DwellerFormManager;
  private equipmentManager: DwellerEquipmentManager;
  private batchOperations: DwellerBatchOperations;
  private uiManager: DwellerUIManager;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
    
    // Initialize managers
    this.formManager = new DwellerFormManager();
    this.equipmentManager = new DwellerEquipmentManager();
    this.batchOperations = new DwellerBatchOperations(saveEditor);
    this.uiManager = new DwellerUIManager();
  }

  /**
   * Initialize the dweller UI
   */
  initialize(): void {
    this.setupEventListeners();
    this.equipmentManager.loadEquipmentSelectors();
    // Start with form disabled
    this.uiManager.closeDwellerEditor();
  }

  /**
   * Bind event listeners
   */
  bindEvents(): void {
    this.initialize();
  }

  /**
   * Load dwellers list
   */
  loadDwellersList(): void {
    this.loadDwellerList();
  }

  /**
   * Close dweller editor modal
   */
  closeDwellerEditor(): void {
    this.uiManager.closeDwellerEditor();
    this.clearSelection();
    // Reset eviction button to default state
    this.updateEvictionButton(false);
  }

  /**
   * Update the save editor instance
   */
  updateSave(saveEditor: SaveEditor): void {
    this.saveEditor = saveEditor;
    this.batchOperations = new DwellerBatchOperations(saveEditor);
    this.loadDwellerList();
  }

  /**
   * Load and display the list of dwellers
   */
  loadDwellerList(): void {
    const dwellers = this.saveEditor.getDwellers();
    this.uiManager.updateDwellersList(dwellers);
  }

  /**
   * Select a dweller for editing
   */
  selectDweller(dweller: Dweller): void {
    this.selectedDweller = dweller;
    this.formManager.loadDwellerToForm(dweller);
    this.formManager.loadEquipmentToForm(dweller);
    
    // Update UI based on eviction status
    if (dweller.WillBeEvicted) {
      this.uiManager.showEvictedDwellerEditor();
      this.updateEvictionButton(true);
    } else {
      this.uiManager.showDwellerEditor();
      this.updateEvictionButton(false);
    }
  }

  /**
   * Setup event listeners for the dweller UI
   */
  private setupEventListeners(): void {
    // Dweller form submission
    const dwellerForm = document.getElementById('dwellerForm');
    if (dwellerForm) {
      dwellerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveDwellerChanges();
      });
    }

    // Save button
    const saveButton = document.getElementById('saveDwellerChanges');
    if (saveButton) {
      saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveDwellerChanges();
      });
    }

    // Reset form button
    const resetButton = document.getElementById('resetDwellerForm');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (this.selectedDweller) {
          this.formManager.resetForm(this.selectedDweller);
          this.uiManager.showMessage('Form reset to original values', 'info');
        }
      });
    }

    // Max SPECIAL button
    const maxSpecialButton = document.getElementById('maxSpecial');
    if (maxSpecialButton) {
      maxSpecialButton.addEventListener('click', () => {
        if (this.selectedDweller) {
          // Set all SPECIAL stats to 10 in the form only (don't save to dweller yet)
          this.formManager.setFormValue('dwellerStrength', '10');
          this.formManager.setFormValue('dwellerPerception', '10');
          this.formManager.setFormValue('dwellerEndurance', '10');
          this.formManager.setFormValue('dwellerCharisma', '10');
          this.formManager.setFormValue('dwellerIntelligence', '10');
          this.formManager.setFormValue('dwellerAgility', '10');
          this.formManager.setFormValue('dwellerLuck', '10');
          this.uiManager.showMessage(`${this.selectedDweller.name} ${this.selectedDweller.lastName}'s SPECIAL stats set to max (click Save to apply)`, 'info');
        }
      });
    }

    // Listen for dweller selection events
    document.addEventListener('dwellerSelected', (e: any) => {
      const dweller = e.detail.dweller;
      this.selectDweller(dweller);
    });

    // Eviction button
    const evictButton = document.getElementById('evictDweller');
    if (evictButton) {
      evictButton.addEventListener('click', () => {
        if (this.selectedDweller) {
          if (this.selectedDweller.WillBeEvicted) {
            // Undo eviction
            this.undoEviction(this.selectedDweller);
          } else {
            // Show eviction modal
            this.showEvictionModal(this.selectedDweller);
          }
        }
      });
    }

    // Eviction modal events
    this.setupEvictionModalEvents();

    // Batch operation buttons
    this.setupBatchOperationListeners();
  }

  /**
   * Setup batch operation event listeners
   */
  private setupBatchOperationListeners(): void {
    const operations = [
      { id: 'maxSpecialAll', method: () => this.batchOperations.maxSpecialAll() },
      { id: 'healAll', method: () => this.batchOperations.healAll() },
      { id: 'maxHappinessAll', method: () => this.batchOperations.maxHappinessAll() }
    ];

    operations.forEach(({ id, method }) => {
      const button = document.getElementById(id);
      if (button) {
        button.addEventListener('click', () => {
          method();
          this.uiManager.showMessage(`Batch operation completed: ${button.textContent}`, 'success');
          this.loadDwellerList(); // Refresh the list
          if (this.selectedDweller) {
            // Refresh the selected dweller's form
            this.formManager.loadDwellerToForm(this.selectedDweller);
            this.formManager.loadEquipmentToForm(this.selectedDweller);
          }
        });
      }
    });
  }

  /**
   * Save changes made to the currently selected dweller
   */
  private saveDwellerChanges(): void {
    if (!this.selectedDweller) {
      console.warn('No dweller selected for saving');
      this.uiManager.showMessage('No dweller selected for saving', 'error');
      return;
    }

    try {
      // Get form data and update dweller
      this.updateDwellerFromForm(this.selectedDweller);
      
      // Refresh the dweller list and form
      this.loadDwellerList();
      this.formManager.loadDwellerToForm(this.selectedDweller);
      this.formManager.loadEquipmentToForm(this.selectedDweller);
      
      this.uiManager.showMessage(`${this.selectedDweller.name} ${this.selectedDweller.lastName} updated successfully!`, 'success');
      console.log('Dweller changes saved successfully');
    } catch (error) {
      console.error('Error saving dweller changes:', error);
      this.uiManager.showMessage('Failed to save dweller changes. Please try again.', 'error');
    }
  }

  /**
   * Update dweller properties from form data
   */
  private updateDwellerFromForm(dweller: Dweller): void {
    // Basic properties
    dweller.name = this.formManager.getFormValue('dwellerName') || dweller.name;
    dweller.lastName = this.formManager.getFormValue('dwellerLastName') || dweller.lastName;
    
    // Level and experience
    const level = parseInt(this.formManager.getFormValue('dwellerLevel')) || 1;
    const experience = parseInt(this.formManager.getFormValue('dwellerExperience')) || 0;
    this.saveEditor.setDwellerLevel(dweller, level, experience);

    // Health and radiation
    const health = parseInt(this.formManager.getFormValue('dwellerHealth')) || 100;
    const maxHealth = parseInt(this.formManager.getFormValue('dwellerMaxHealth')) || 100;
    this.saveEditor.setDwellerHealth(dweller, health, maxHealth);
    
    const radiation = parseInt(this.formManager.getFormValue('dwellerRadiation')) || 0;
    this.saveEditor.setDwellerRadiation(dweller, radiation);

    // Happiness
    const happiness = parseInt(this.formManager.getFormValue('dwellerHappiness')) || 50;
    this.saveEditor.setDwellerHappiness(dweller, happiness);

    // SPECIAL stats
    const specialStats = this.formManager.getSpecialStatsFromForm();
    specialStats.forEach(({ type, value }) => {
      this.saveEditor.setDwellerSpecial(dweller, type as any, value);
    });

    // Equipment
    const weapon = this.formManager.getFormValue('dwellerWeapon');
    if (weapon) {
      this.saveEditor.setDwellerWeapon(dweller, weapon);
    }

    const outfit = this.formManager.getFormValue('dwellerOutfit');
    if (outfit) {
      this.saveEditor.setDwellerOutfit(dweller, outfit);
    }

    const pet = this.formManager.getFormValue('dwellerPet');
    if (pet) {
      this.saveEditor.setDwellerPet(dweller, pet);
    } else {
      // Remove pet if none selected
      this.saveEditor.removeDwellerPet(dweller);
    }

    // Gender and pregnancy
    const gender = parseInt(this.formManager.getFormValue('dwellerGender')) || 1;
    dweller.gender = gender;

    const pregnant = this.formManager.getFormValue('dwellerPregnant') === 'true';
    dweller.pregnant = pregnant;

    const babyReady = this.formManager.getFormValue('dwellerBabyReadyTime') === 'true';
    if (dweller.babyReadyTime) {
      dweller.babyReadyTime = babyReady;
    }

    // Colors (using form values directly for now)
    const hairColor = this.formManager.getFormValue('dwellerHairColor');
    if (hairColor) {
      dweller.hairColor = parseInt(hairColor.replace('#', ''), 16) | 0xFF000000;
    }

    const skinColor = this.formManager.getFormValue('dwellerSkinColor');
    if (skinColor) {
      dweller.skinColor = parseInt(skinColor.replace('#', ''), 16) | 0xFF000000;
    }
  }

  /**
   * Clear the currently selected dweller
   */
  clearSelection(): void {
    this.selectedDweller = null;
    this.formManager.resetForm();
  }

  /**
   * Get the currently selected dweller
   */
  getSelectedDweller(): Dweller | null {
    return this.selectedDweller;
  }

  /**
   * Refresh the UI with current data
   */
  refresh(): void {
    this.loadDwellerList();
    if (this.selectedDweller) {
      this.formManager.loadDwellerToForm(this.selectedDweller);
      this.formManager.loadEquipmentToForm(this.selectedDweller);
    }
  }

  /**
   * Update the eviction button text and behavior based on dweller state
   */
  private updateEvictionButton(isEvicted: boolean): void {
    const evictButton = document.getElementById('evictDweller') as HTMLButtonElement;
    if (evictButton) {
      if (isEvicted) {
        evictButton.textContent = 'Undo Eviction';
        evictButton.className = 'btn btn-warning';
      } else {
        evictButton.textContent = 'Evict Dweller';
        evictButton.className = 'btn btn-danger';
      }
    }
  }

  /**
   * Show the eviction confirmation modal
   */
  private showEvictionModal(dweller: Dweller): void {
    const modal = document.getElementById('evictionModal');
    const dwellerNameSpan = document.getElementById('evictionDwellerName');
    
    if (modal && dwellerNameSpan) {
      dwellerNameSpan.textContent = `${dweller.name} ${dweller.lastName}`;
      modal.classList.remove('modal-hidden');
    }
  }

  /**
   * Hide the eviction confirmation modal
   */
  private hideEvictionModal(): void {
    const modal = document.getElementById('evictionModal');
    if (modal) {
      modal.classList.add('modal-hidden');
    }
  }

  /**
   * Setup eviction modal event listeners
   */
  private setupEvictionModalEvents(): void {
    const cancelButton = document.getElementById('cancelEviction');
    const confirmButton = document.getElementById('confirmEviction');
    const modal = document.getElementById('evictionModal');

    // Cancel eviction
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        this.hideEvictionModal();
      });
    }

    // Confirm eviction
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        if (this.selectedDweller) {
          this.confirmEviction(this.selectedDweller);
        }
        this.hideEvictionModal();
      });
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideEvictionModal();
        }
      });
    }
  }

  /**
   * Confirm and execute dweller eviction
   */
  private confirmEviction(dweller: Dweller): void {
    try {
      // Execute the eviction
      this.saveEditor.evictDweller(dweller);
      
      // Show success message
      this.uiManager.showMessage(`${dweller.name} ${dweller.lastName} has been evicted from the vault.`, 'success');
      
      // Refresh the dweller list and update UI state
      this.loadDwellerList();
      this.updateEvictionButton(true);
      this.uiManager.showEvictedDwellerEditor();
      
      console.log(`Dweller ${dweller.name} ${dweller.lastName} evicted successfully`);
    } catch (error) {
      console.error('Error evicting dweller:', error);
      this.uiManager.showMessage('Failed to evict dweller. Please try again.', 'error');
    }
  }

  /**
   * Undo dweller eviction
   */
  private undoEviction(dweller: Dweller): void {
    try {
      // Execute the undo eviction
      this.saveEditor.unevictDweller(dweller);
      
      // Show success message
      this.uiManager.showMessage(`${dweller.name} ${dweller.lastName} eviction has been undone.`, 'success');
      
      // Refresh the dweller list and update UI state
      this.loadDwellerList();
      this.updateEvictionButton(false);
      this.uiManager.showDwellerEditor();
      
      console.log(`Dweller ${dweller.name} ${dweller.lastName} eviction undone successfully`);
    } catch (error) {
      console.error('Error undoing dweller eviction:', error);
      this.uiManager.showMessage('Failed to undo eviction. Please try again.', 'error');
    }
  }
}
