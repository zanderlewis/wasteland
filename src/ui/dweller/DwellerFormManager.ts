import type { DwellersItem as Dweller } from '../../types/saveFile';

// Default color constants
const DEFAULT_SKIN_COLORS = {
  LIGHT: '#FFDBAC'
} as const;

const DEFAULT_HAIR_COLORS = {
  BROWN: '#8B4513'
} as const;

/**
 * Handles form field management for the dweller editor
 */
export class DwellerFormManager {
  // Store the bound handler once so removeEventListener actually works
  private readonly boundGenderChangeHandler = this.handleGenderChange.bind(this);

  private colorConverter(colorhex: string | number, mode?: boolean): string | number {
    const colorInt = typeof colorhex === 'string' ? parseInt(colorhex) : colorhex;

    if (mode) {
      // Convert from FOS integer to hex color for HTML input
      const rgb = colorInt & 0xFFFFFF;
      const hex = rgb.toString(16).padStart(6, '0').toUpperCase();
      return hex;
    } else {
      // Convert from hex color to FOS integer
      const cleanHex = colorhex.toString().replace('#', '');
      const fosColor = 0xFF000000 | parseInt(cleanHex, 16);
      return fosColor;
    }
  }

  /**
   * Load dweller data into form fields
   */
  loadDwellerToForm(dweller: Dweller): void {
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
    this.setFormValue(
      'dwellerSkinColor',
      dweller.skinColor
        ? '#' + this.colorConverter(dweller.skinColor, true).toString()
        : DEFAULT_SKIN_COLORS.LIGHT
    );
    this.setFormValue(
      'dwellerHairColor',
      dweller.hairColor
        ? '#' + this.colorConverter(dweller.hairColor, true).toString()
        : DEFAULT_HAIR_COLORS.BROWN
    );

    // Pregnancy (only for females)
    if (dweller.gender === 1) {
      this.setFormValue('dwellerPregnant', dweller.pregnant ? 'true' : 'false');
      this.setFormValue('dwellerBabyReadyTime', dweller.babyReady ? 'true' : 'false');
      this.togglePregnancyFields(true);
    } else {
      this.togglePregnancyFields(false);
    }

    // SPECIAL stats
    this.loadSpecialStats(dweller);

    // Set up gender change listener
    this.setupGenderChangeListener();
  }

  /**
   * Load SPECIAL stats into form
   */
  private loadSpecialStats(dweller: Dweller): void {
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
  }

  /**
   * Load equipment values into form
   */
  loadEquipmentToForm(dweller: Dweller): void {
    this.setFormValue('dwellerWeapon', (dweller.equipedWeapon?.id || '').toString());
    this.setFormValue('dwellerOutfit', (dweller.equipedOutfit?.id || '').toString());

    // Set pet value (some generated save shapes don't include pet fields)
    const petId = (dweller as any).equippedPet?.id || (dweller as any).pet?.id || '';
    this.setFormValue('dwellerPet', petId);

    // Verify the pet was set correctly
    const petSelect = document.getElementById('dwellerPet') as HTMLSelectElement;
    if (petSelect && petId) {
      const selectedOption = Array.from(petSelect.options).find(opt => opt.value === petId);
      if (selectedOption) {
        console.log('Pet select value after setting:', petSelect.value);
      }
    }
  }

  /**
   * Set form field value
   */
  setFormValue(fieldId: string, value: string): void {
    const element = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | null;
    if (!element) return;
    if ((element as HTMLInputElement).type === 'checkbox') {
      (element as HTMLInputElement).checked = value === 'true' || value === '1';
    } else {
      element.value = value;
    }
    // Update SPECIAL slider thumb values if present
    if (element.classList?.contains('special-range')) {
      this.updateSpecialThumb(element as HTMLInputElement);
    }
  }

  /**
   * Get form field value
   */
  getFormValue(fieldId: string): string {
    const element = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | null;
    if (!element) return '';
    if ((element as HTMLInputElement).type === 'checkbox') {
      return (element as HTMLInputElement).checked ? 'true' : 'false';
    }
    return element.value ?? '';
  }

  /**
   * Toggle pregnancy fields visibility
   */
  private togglePregnancyFields(show: boolean): void {
    const pregnancySection = document.getElementById('pregnancySection');
    if (pregnancySection) {
      pregnancySection.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Setup gender change listener to toggle pregnancy fields
   */
  private setupGenderChangeListener(): void {
    const genderSelect = document.getElementById('dwellerGender') as HTMLSelectElement;
    if (genderSelect) {
      genderSelect.removeEventListener('change', this.boundGenderChangeHandler);
      genderSelect.addEventListener('change', this.boundGenderChangeHandler);
    }
  }

  /**
   * Handle gender change event
   */
  private handleGenderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const isFemale = target.value === '1';
    this.togglePregnancyFields(isFemale);

    // Reset pregnancy values if switching to male
    if (!isFemale) {
      this.setFormValue('dwellerPregnant', 'false');
      this.setFormValue('dwellerBabyReadyTime', 'false');
    }
  }

  /**
   * Reset all form fields to the dweller's current data
   */
  resetForm(dweller?: Dweller): void {
    if (dweller) {
      // Reload the dweller's actual data instead of using browser form reset
      this.loadDwellerToForm(dweller);
      this.loadEquipmentToForm(dweller);

      // Ensure pregnancy fields are properly set based on dweller's actual data
      if (dweller.gender === 1) {
        this.setFormValue('dwellerPregnant', dweller.pregnant ? 'true' : 'false');
        this.setFormValue('dwellerBabyReadyTime', dweller.babyReady ? 'true' : 'false');
        this.togglePregnancyFields(true);
      } else {
        this.setFormValue('dwellerPregnant', 'false');
        this.setFormValue('dwellerBabyReadyTime', 'false');
        this.togglePregnancyFields(false);
      }
    } else {
      // Fallback to browser reset if no dweller provided
      const form = document.getElementById('dwellerForm') as HTMLFormElement;
      if (form) {
        form.reset();
      }
    }
  }

  /**
   * Get SPECIAL stats from form
   */
  getSpecialStatsFromForm(): Array<{ type: number; value: number }> {
    return [
      { type: 1, value: parseInt(this.getFormValue('dwellerStrength')) || 1 },
      { type: 2, value: parseInt(this.getFormValue('dwellerPerception')) || 1 },
      { type: 3, value: parseInt(this.getFormValue('dwellerEndurance')) || 1 },
      { type: 4, value: parseInt(this.getFormValue('dwellerCharisma')) || 1 },
      { type: 5, value: parseInt(this.getFormValue('dwellerIntelligence')) || 1 },
      { type: 6, value: parseInt(this.getFormValue('dwellerAgility')) || 1 },
      { type: 7, value: parseInt(this.getFormValue('dwellerLuck')) || 1 }
    ];
  }
}
