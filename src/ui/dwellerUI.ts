// Dweller-specific UI management
import { SaveEditor } from '../core/SaveEditor';
import type { Dweller } from '../types/saveFile';
import { WEAPON_LIST, OUTFIT_LIST, PET_LIST } from '../constants/gameConstants';
import { hexToFOSColor, fosColorToHex, DEFAULT_SKIN_COLORS, DEFAULT_HAIR_COLORS } from '../utils/colorUtils';

export class DwellerUI {
  private saveEditor: SaveEditor;
  private selectedDweller: Dweller | null = null;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
  }

  // Color converter utility using imported utilities
  private colorConverter(colorhex: string | number, mode?: boolean): string | number {
    if (mode) {
      // Convert from FOS color format to hex
      return fosColorToHex(colorhex as number);
    } else {
      // Convert from hex to FOS color format
      return hexToFOSColor(colorhex as string);
    }
  }

  bindEvents(): void {
    // Save dweller changes
    const saveDwellerChanges = document.getElementById('saveDwellerChanges');
    saveDwellerChanges?.addEventListener('click', () => {
      this.saveDwellerChanges();
    });

    // Reset dweller form
    const resetDwellerForm = document.getElementById('resetDwellerForm');
    resetDwellerForm?.addEventListener('click', () => {
      this.resetDwellerForm();
    });

    // Batch operations
    const maxHappinessAll = document.getElementById('maxHappinessAll');
    maxHappinessAll?.addEventListener('click', () => {
      this.maxHappinessAll();
    });

    const healAll = document.getElementById('healAll');
    healAll?.addEventListener('click', () => {
      this.healAll();
    });

    const maxSpecialAll = document.getElementById('maxSpecialAll');
    maxSpecialAll?.addEventListener('click', () => {
      this.maxSpecialAll();
    });

    // Individual dweller operations
    const maxSpecial = document.getElementById('maxSpecial');
    maxSpecial?.addEventListener('click', () => {
      this.maxSpecial();
    });

    // Bind form field events
    this.bindDwellerFormEvents();
  }

  private bindDwellerFormEvents(): void {
    const formFields = [
      'dwellerName',
      'dwellerLastName', 
      'dwellerGender',
      'dwellerLevel',
      'dwellerExperience',
      'dwellerHappiness',
      'dwellerHealth',
      'dwellerMaxHealth',
      'dwellerRadiation',
      'dwellerStrength',
      'dwellerPerception',
      'dwellerEndurance',
      'dwellerCharisma',
      'dwellerIntelligence',
      'dwellerAgility',
      'dwellerLuck',
      'dwellerWeapon',
      'dwellerOutfit',
      'dwellerSkinColor',
      'dwellerHairColor',
      'dwellerPregnant',
      'dwellerBabyReadyTime',
      'dwellerPet'
    ];

    formFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', () => {
          // Handle real-time updates if needed
        });
      }
    });

    // Special handler for gender changes to toggle pregnancy fields
    const genderField = document.getElementById('dwellerGender');
    if (genderField) {
      genderField.addEventListener('change', () => {
        const isFemale = (genderField as HTMLSelectElement).value === '1';
        this.togglePregnancyFields(isFemale);
      });
    }
  }

  loadDwellersList(): void {
    const dwellerList = document.getElementById('dwellerList');
    if (!dwellerList || !this.saveEditor.isLoaded()) return;

    const dwellers = this.saveEditor.getDwellers();
    dwellerList.innerHTML = '';

    dwellers.forEach((dweller, index) => {
      const dwellerElement = document.createElement('div');
      dwellerElement.className = 'dweller-item';
      dwellerElement.innerHTML = `
        <div class="dweller-info">
          <h4 class="dweller-name">${dweller.name} ${dweller.lastName || ''}</h4>
          <p class="dweller-details">Level ${dweller.experience?.currentLevel || 1} • ${dweller.gender === 2 ? 'Male' : 'Female'}</p>
          <div class="dweller-stats">
            <span class="stat">❤️ ${dweller.health?.healthValue || 100}/${dweller.health?.maxHealth || 100}</span>
            <span class="stat">😊 ${dweller.happiness?.happinessValue || 50}%</span>
          </div>
        </div>
      `;

      dwellerElement.addEventListener('click', () => {
        this.selectDweller(dweller, index);
      });

      dwellerList.appendChild(dwellerElement);
    });
  }

  selectDweller(dweller: Dweller, index: number): void {
    this.selectedDweller = dweller;
    this.loadDwellerToForm(dweller);
    this.showDwellerEditor();

    // Update selected state in list
    const dwellerItems = document.querySelectorAll('.dweller-item');
    dwellerItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  private loadDwellerToForm(dweller: Dweller): void {
    // Basic info
    this.setFormValue('dwellerName', dweller.name);
    this.setFormValue('dwellerLastName', dweller.lastName || '');
    this.setFormValue('dwellerGender', (dweller.gender || 1).toString());
    this.setFormValue('dwellerLevel', (dweller.experience?.currentLevel || 1).toString());
    this.setFormValue('dwellerExperience', (dweller.experience?.experienceValue || 0).toString());
    this.setFormValue('dwellerHappiness', (dweller.happiness?.happinessValue || 50).toString());

    // Health
    this.setFormValue('dwellerHealth', (dweller.health?.healthValue || 100).toString());
    this.setFormValue('dwellerMaxHealth', (dweller.health?.maxHealth || 100).toString());
    this.setFormValue('dwellerRadiation', (dweller.health?.radiationValue || 0).toString());

    // Appearance
    this.setFormValue('dwellerSkinColor', dweller.skinColor ? '#' + this.colorConverter(dweller.skinColor, true).toString() : DEFAULT_SKIN_COLORS.LIGHT);
    this.setFormValue('dwellerHairColor', dweller.hairColor ? '#' + this.colorConverter(dweller.hairColor, true).toString() : DEFAULT_HAIR_COLORS.BROWN);

    // Pregnancy (only for females)
    if (dweller.gender === 1) { // Female
      this.setFormValue('dwellerPregnant', dweller.pregnant ? 'true' : 'false');
      this.setFormValue('dwellerBabyReadyTime', (dweller.babyReadyTime || 0).toString());
      
      // Show pregnancy fields
      this.togglePregnancyFields(true);
    } else {
      // Hide pregnancy fields for males
      this.togglePregnancyFields(false);
    }

    // SPECIAL stats
    if (dweller.stats && dweller.stats.stats) {
      const stats = dweller.stats.stats;
      this.setFormValue('dwellerStrength', stats[1]?.value?.toString() || '1');
      this.setFormValue('dwellerPerception', stats[2]?.value?.toString() || '1');
      this.setFormValue('dwellerEndurance', stats[3]?.value?.toString() || '1');
      this.setFormValue('dwellerCharisma', stats[4]?.value?.toString() || '1');
      this.setFormValue('dwellerIntelligence', stats[5]?.value?.toString() || '1');
      this.setFormValue('dwellerAgility', stats[6]?.value?.toString() || '1');
      this.setFormValue('dwellerLuck', stats[7]?.value?.toString() || '1');
    }

    // Equipment - load selectors first, then set values
    this.loadEquipmentSelectors();
    
    // Set equipment values after a brief delay to ensure DOM is updated
    setTimeout(() => {
      this.setFormValue('dwellerWeapon', (dweller.equipedWeapon?.id || dweller.weapon?.id || '').toString());
      this.setFormValue('dwellerOutfit', (dweller.equipedOutfit?.id || dweller.outfit?.id || '').toString());
      
      // Set pet value - check both pet and equippedPet properties for compatibility
      const petId = dweller.equippedPet?.id || dweller.pet?.id || '';
      console.log('Setting pet ID:', petId, 'for dweller:', dweller.name); // Debug logging
      console.log('Pet data:', { pet: dweller.pet, equippedPet: dweller.equippedPet }); // Debug logging
      this.setFormValue('dwellerPet', petId);
      
      // Verify the pet was set correctly
      const petSelect = document.getElementById('dwellerPet') as HTMLSelectElement;
      if (petSelect && petId) {
        console.log('Pet select value after setting:', petSelect.value); // Debug logging
        console.log('Available pet options:', Array.from(petSelect.options).map(opt => opt.value)); // Debug logging
      }
    }, 10);
  }

  private loadEquipmentSelectors(): void {
    this.loadWeaponSelector();
    this.loadOutfitSelector();
    this.loadPetSelector();
  }

  private loadWeaponSelector(): void {
    const weaponSelect = document.getElementById('dwellerWeapon') as HTMLSelectElement;
    if (!weaponSelect) return;

    weaponSelect.innerHTML = '<option value="">No Weapon</option>';
    
    // WEAPON_LIST is an object, not array
    Object.entries(WEAPON_LIST).forEach(([weaponId, weaponName]) => {
      const option = document.createElement('option');
      option.value = weaponId;
      option.textContent = weaponName;
      weaponSelect.appendChild(option);
    });
  }

  private loadOutfitSelector(): void {
    const outfitSelect = document.getElementById('dwellerOutfit') as HTMLSelectElement;
    if (!outfitSelect) return;

    outfitSelect.innerHTML = '<option value="">No Outfit</option>';
    
    // OUTFIT_LIST is an object, not array
    Object.entries(OUTFIT_LIST).forEach(([outfitId, outfitName]) => {
      const option = document.createElement('option');
      option.value = outfitId;
      option.textContent = outfitName;
      outfitSelect.appendChild(option);
    });
  }

  private loadPetSelector(): void {
    const petSelect = document.getElementById('dwellerPet') as HTMLSelectElement;
    if (!petSelect) return;

    petSelect.innerHTML = '<option value="">No Pet</option>';
    
    // PET_LIST is an object, not array
    Object.entries(PET_LIST).forEach(([petId, petName]) => {
      const option = document.createElement('option');
      option.value = petId;
      option.textContent = petName;
      petSelect.appendChild(option);
    });
  }

  private setFormValue(fieldId: string, value: string): void {
    const field = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement;
    if (field) {
      field.value = value;
    }
  }

  private togglePregnancyFields(show: boolean): void {
    const pregnancyFields = document.querySelectorAll('.pregnancy-field');
    pregnancyFields.forEach(field => {
      const element = field as HTMLElement;
      if (show) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
  }

  private getFormValue(fieldId: string): string {
    const field = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement;
    return field?.value || '';
  }

  private saveDwellerChanges(): void {
    if (!this.selectedDweller) return;

    try {
      // Update basic info directly on the dweller object
      this.selectedDweller.name = this.getFormValue('dwellerName');
      this.selectedDweller.lastName = this.getFormValue('dwellerLastName');
      const newGender = parseInt(this.getFormValue('dwellerGender')) || 1;
      this.selectedDweller.gender = newGender;

      // Update appearance
      const skinColorHex = this.getFormValue('dwellerSkinColor');
      if (skinColorHex) {
        this.selectedDweller.skinColor = this.colorConverter(skinColorHex.replace('#', '')) as number;
      }

      const hairColorHex = this.getFormValue('dwellerHairColor');
      if (hairColorHex) {
        this.selectedDweller.hairColor = this.colorConverter(hairColorHex.replace('#', '')) as number;
      }

      // Update pregnancy (only for females)
      if (newGender === 1) { // Female
        this.selectedDweller.pregnant = this.getFormValue('dwellerPregnant') === 'true';
        this.selectedDweller.babyReadyTime = parseInt(this.getFormValue('dwellerBabyReadyTime')) || 0;
      } else {
        // Clear pregnancy for males
        this.selectedDweller.pregnant = false;
        this.selectedDweller.babyReadyTime = 0;
      }

      // Use SaveEditor methods for validated updates
      const level = parseInt(this.getFormValue('dwellerLevel')) || 1;
      const experience = parseInt(this.getFormValue('dwellerExperience')) || 0;
      this.saveEditor.setDwellerLevel(this.selectedDweller, level, experience);

      const happiness = parseInt(this.getFormValue('dwellerHappiness')) || 50;
      this.saveEditor.setDwellerHappiness(this.selectedDweller, happiness);

      const health = parseInt(this.getFormValue('dwellerHealth')) || 100;
      const maxHealth = parseInt(this.getFormValue('dwellerMaxHealth')) || 100;
      this.saveEditor.setDwellerHealth(this.selectedDweller, health, maxHealth);

      const radiation = parseInt(this.getFormValue('dwellerRadiation')) || 0;
      this.saveEditor.setDwellerRadiation(this.selectedDweller, radiation);

      // Update SPECIAL stats using SaveEditor methods
      const specialStats = [
        { type: 1 as const, value: parseInt(this.getFormValue('dwellerStrength')) || 1 },
        { type: 2 as const, value: parseInt(this.getFormValue('dwellerPerception')) || 1 },
        { type: 3 as const, value: parseInt(this.getFormValue('dwellerEndurance')) || 1 },
        { type: 4 as const, value: parseInt(this.getFormValue('dwellerCharisma')) || 1 },
        { type: 5 as const, value: parseInt(this.getFormValue('dwellerIntelligence')) || 1 },
        { type: 6 as const, value: parseInt(this.getFormValue('dwellerAgility')) || 1 },
        { type: 7 as const, value: parseInt(this.getFormValue('dwellerLuck')) || 1 }
      ];

      specialStats.forEach(stat => {
        this.saveEditor.setDwellerSpecial(this.selectedDweller!, stat.type, stat.value);
      });

      // Handle equipment updates
      const weaponId = this.getFormValue('dwellerWeapon');
      if (weaponId) {
        this.saveEditor.setDwellerWeapon(this.selectedDweller, weaponId);
      } else {
        // Clear weapon if empty
        this.selectedDweller.weapon = undefined;
        this.selectedDweller.equipedWeapon = undefined;
      }

      const outfitId = this.getFormValue('dwellerOutfit');
      if (outfitId) {
        this.saveEditor.setDwellerOutfit(this.selectedDweller, outfitId);
      } else {
        // Clear outfit if empty
        this.selectedDweller.outfit = undefined;
        this.selectedDweller.equipedOutfit = undefined;
      }

      // Handle pet updates
      const petId = this.getFormValue('dwellerPet');
      if (petId) {
        this.saveEditor.setDwellerPet(this.selectedDweller, petId);
      } else {
        // Remove pet if empty
        this.saveEditor.removeDwellerPet(this.selectedDweller);
      }
      
      // Refresh the dweller list to show updated info
      this.loadDwellersList();
      
      // Show success message
      this.showMessage('Dweller changes saved successfully!', 'success');
      
    } catch (error) {
      console.error('Error saving dweller changes:', error);
      this.showMessage('Error saving dweller changes. Please try again.', 'error');
    }
  }

  private resetDwellerForm(): void {
    if (this.selectedDweller) {
      this.loadDwellerToForm(this.selectedDweller);
    }
  }

  showDwellerEditor(): void {
    const dwellerEditor = document.getElementById('dwellerEditor');
    const dwellerListContainer = document.getElementById('dwellerListContainer');
    
    dwellerEditor?.classList.remove('hidden');
    
    // Adjust layout - make list smaller when editor is shown
    if (dwellerListContainer) {
      dwellerListContainer.className = 'card lg:col-span-1';
    }
  }

  closeDwellerEditor(): void {
    const dwellerEditor = document.getElementById('dwellerEditor');
    const dwellerListContainer = document.getElementById('dwellerListContainer');
    
    dwellerEditor?.classList.add('hidden');
    this.selectedDweller = null;

    // Expand list to full width when editor is closed
    if (dwellerListContainer) {
      dwellerListContainer.className = 'card lg:col-span-3';
    }

    // Clear selection in list
    const dwellerItems = document.querySelectorAll('.dweller-item');
    dwellerItems.forEach(item => {
      item.classList.remove('selected');
    });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    
    if (statusMessage && statusText) {
      statusText.textContent = message;
      statusMessage.classList.remove('hidden');
      
      // Reset classes
      statusMessage.className = 'mt-4 fade-in';
      
      // Add appropriate styling
      const messageDiv = statusMessage.querySelector('div');
      if (messageDiv) {
        messageDiv.className = 'p-4 rounded-md';
        
        if (type === 'success') {
          messageDiv.classList.add('status-success');
        } else if (type === 'error') {
          messageDiv.classList.add('status-error');
        } else {
          messageDiv.classList.add('status-info');
        }
      }
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        statusMessage.classList.add('hidden');
      }, 5000);
    } else {
      // Fallback to console if status elements don't exist
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Batch operations (from shelter.js)
  private maxHappinessAll(): void {
    if (!this.saveEditor.isLoaded()) return;
    
    const dwellers = this.saveEditor.getDwellers();
    dwellers.forEach(dweller => {
      this.saveEditor.setDwellerHappiness(dweller, 100);
    });
    
    this.loadDwellersList();
    this.showMessage('Maxed all dwellers happiness!', 'success');
  }

  private healAll(): void {
    if (!this.saveEditor.isLoaded()) return;
    
    const dwellers = this.saveEditor.getDwellers();
    dwellers.forEach(dweller => {
      if (dweller.health) {
        this.saveEditor.setDwellerRadiation(dweller, 0);
        this.saveEditor.setDwellerHealth(dweller, dweller.health.maxHealth || 100, dweller.health.maxHealth || 100);
      }
    });
    
    this.loadDwellersList();
    this.showMessage('Healed all dwellers!', 'success');
  }

  private maxSpecialAll(): void {
    if (!this.saveEditor.isLoaded()) return;
    
    const dwellers = this.saveEditor.getDwellers();
    dwellers.forEach(dweller => {
      for (let i = 1; i <= 7; i++) {
        this.saveEditor.setDwellerSpecial(dweller, i as any, 10);
      }
    });
    
    this.loadDwellersList();
    this.showMessage('Maxed all dwellers SPECIAL stats!', 'success');
  }

  private maxSpecial(): void {
    if (!this.selectedDweller) return;
    
    for (let i = 1; i <= 7; i++) {
      this.saveEditor.setDwellerSpecial(this.selectedDweller, i as any, 10);
    }
    
    // Update form to reflect changes
    this.loadDwellerToForm(this.selectedDweller);
    this.showMessage('Maxed dweller SPECIAL stats!', 'success');
  }
}
