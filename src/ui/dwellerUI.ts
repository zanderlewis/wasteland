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
    this.uiManager.showDwellerEditor();
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

    // Reset form button
    const resetButton = document.getElementById('resetDwellerForm');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (this.selectedDweller) {
          this.formManager.loadDwellerToForm(this.selectedDweller);
        }
      });
    }

    // Max SPECIAL button
    const maxSpecialButton = document.getElementById('maxSpecial');
    if (maxSpecialButton) {
      maxSpecialButton.addEventListener('click', () => {
        if (this.selectedDweller) {
          this.saveEditor.maxDwellerSpecial(this.selectedDweller);
          this.formManager.loadDwellerToForm(this.selectedDweller);
        }
      });
    }

    // Listen for dweller selection events
    document.addEventListener('dwellerSelected', (e: any) => {
      const dweller = e.detail.dweller;
      this.selectDweller(dweller);
    });

    // Batch operation buttons
    this.setupBatchOperationListeners();
  }

  /**
   * Setup batch operation event listeners
   */
  private setupBatchOperationListeners(): void {
    const operations = [
      { id: 'maxAllStats', method: () => this.batchOperations.maxSpecialAll() },
      { id: 'maxAllHealth', method: () => this.batchOperations.healAll() },
      { id: 'maxAllHappiness', method: () => this.batchOperations.maxHappinessAll() },
      { id: 'healAllDwellers', method: () => this.batchOperations.healAll() }
    ];

    operations.forEach(({ id, method }) => {
      const button = document.getElementById(id);
      if (button) {
        button.addEventListener('click', () => {
          method();
          this.loadDwellerList(); // Refresh the list
          if (this.selectedDweller) {
            // Refresh the selected dweller's form
            this.formManager.loadDwellerToForm(this.selectedDweller);
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
      return;
    }

    try {
      // Get form data and update dweller
      this.updateDwellerFromForm(this.selectedDweller);
      
      // Refresh the dweller list and form
      this.loadDwellerList();
      this.formManager.loadDwellerToForm(this.selectedDweller);
      
      console.log('Dweller changes saved successfully');
    } catch (error) {
      console.error('Error saving dweller changes:', error);
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

    // Health
    const health = parseInt(this.formManager.getFormValue('dwellerHealth')) || 100;
    const maxHealth = parseInt(this.formManager.getFormValue('dwellerMaxHealth')) || 100;
    this.saveEditor.setDwellerHealth(dweller, health, maxHealth);

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
    }

    // Gender and pregnancy
    const gender = parseInt(this.formManager.getFormValue('dwellerGender')) || 1;
    dweller.gender = gender;

    const pregnant = this.formManager.getFormValue('dwellerPregnant') === 'true';
    dweller.pregnant = pregnant;

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
    }
  }
}
