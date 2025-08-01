import type { 
  FalloutShelterSave, 
  Dweller, 
  Actor, 
  SpecialStatType 
} from '../types/saveFile';
import { SpecialStat } from '../types/saveFile';
import { 
  GAME_LIMITS, 
  validateValue 
} from '../constants/gameConstants';

/**
 * Dweller-specific operations for the save editor
 */
export class DwellerManager {
  private save: FalloutShelterSave | null = null;

  constructor(save: FalloutShelterSave | null) {
    this.save = save;
  }

  updateSave(save: FalloutShelterSave | null): void {
    this.save = save;
  }

  /**
   * Get all dwellers
   */
  getDwellers(): Dweller[] {
    return this.save?.dwellers?.dwellers || [];
  }

  /**
   * Get all actors (NPCs)
   */
  getActors(): Actor[] {
    return this.save?.dwellers?.actors || [];
  }

  /**
   * Set dweller's SPECIAL stat
   * @param dweller - The dweller to modify
   * @param statType - The SPECIAL stat type
   * @param value - The value to set (0-10)
   */
  setDwellerSpecial(dweller: Dweller, statType: SpecialStatType, value: number): void {
    if (!dweller.stats) dweller.stats = { stats: new Array(8).fill(null) };
    if (!dweller.stats.stats) dweller.stats.stats = new Array(8).fill(null);
    
    const clampedValue = validateValue.special(value);
    
    // Initialize the stat object if it doesn't exist
    if (!dweller.stats.stats[statType]) {
      dweller.stats.stats[statType] = { value: clampedValue };
    } else {
      // Handle both object format { value: number } and direct number format
      const statData = dweller.stats.stats[statType];
      if (typeof statData === 'object' && statData !== null && 'value' in statData) {
        (statData as any).value = clampedValue;
      } else {
        // Convert to object format
        dweller.stats.stats[statType] = { value: clampedValue };
      }
    }
  }

  /**
   * Get dweller's SPECIAL stat
   * @param dweller - The dweller
   * @param statType - The SPECIAL stat type
   */
  getDwellerSpecial(dweller: Dweller, statType: SpecialStatType): number {
    if (!dweller.stats?.stats?.[statType]) return GAME_LIMITS.SPECIAL_MIN;
    
    const statData = dweller.stats.stats[statType];
    
    // Handle both object format { value: number } and direct number format
    if (typeof statData === 'object' && statData !== null && 'value' in statData) {
      return (statData as any).value || GAME_LIMITS.SPECIAL_MIN;
    }
    
    // Fallback to direct number
    return typeof statData === 'number' ? statData : GAME_LIMITS.SPECIAL_MIN;
  }

  /**
   * Max out all SPECIAL stats for a dweller
   * @param dweller - The dweller to modify
   */
  maxDwellerSpecial(dweller: Dweller): void {
    Object.values(SpecialStat).forEach(stat => {
      if (typeof stat === 'number') {
        this.setDwellerSpecial(dweller, stat, 10);
      }
    });
  }

  /**
   * Max out all SPECIAL stats for all dwellers
   */
  maxAllDwellersSpecial(): void {
    this.getDwellers().forEach(dweller => {
      this.maxDwellerSpecial(dweller);
    });
  }

  /**
   * Set dweller health
   * @param dweller - The dweller to modify
   * @param health - Health value
   * @param maxHealth - Maximum health value (optional)
   */
  setDwellerHealth(dweller: Dweller, health: number, maxHealth?: number): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0 };
    }
    
    dweller.health.healthValue = Math.max(0, health);
    if (maxHealth !== undefined) {
      dweller.health.maxHealth = Math.max(1, maxHealth);
    }
    
    // Ensure health doesn't exceed max health
    if (dweller.health.healthValue > (dweller.health.maxHealth || 100)) {
      dweller.health.healthValue = dweller.health.maxHealth || 100;
    }
  }

  /**
   * Set dweller level and experience
   * @param dweller - The dweller to modify
   * @param level - Level to set (1-50)
   * @param experience - Experience value (optional)
   */
  setDwellerLevel(dweller: Dweller, level: number, experience?: number): void {
    if (!dweller.experience) {
      dweller.experience = { currentLevel: 1, experienceValue: 0 };
    }
    
    const clampedLevel = Math.max(1, Math.min(50, level));
    dweller.experience.currentLevel = clampedLevel;
    
    if (experience !== undefined) {
      dweller.experience.experienceValue = Math.max(0, experience);
    } else {
      // Calculate approximate experience for the level
      dweller.experience.experienceValue = Math.pow(clampedLevel, 2) * 1000;
    }
  }

  /**
   * Set dweller gender
   * @param dweller - The dweller to modify
   * @param gender - Gender (1 = Female, 2 = Male)
   */
  setDwellerGender(dweller: Dweller, gender: number): void {
    dweller.gender = gender === 1 ? 1 : 2; // Default to male if not female
  }

  /**
   * Set dweller pregnancy status
   * @param dweller - The dweller to modify
   * @param isPregnant - Whether the dweller is pregnant
   */
  setDwellerPregnancy(dweller: Dweller, isPregnant: boolean): void {
    dweller.pregnant = isPregnant;
    if (isPregnant) {
      dweller.babyReadyTime = Date.now() + (3600000); // 1 hour from now
    } else {
      dweller.partner = undefined;
      dweller.babyReadyTime = undefined;
    }
  }

  /**
   * Set dweller outfit
   * @param dweller - The dweller to modify
   * @param outfitId - Outfit ID
   * @param outfitType - Outfit type string
   */
  setDwellerOutfit(dweller: Dweller, outfitId: number | string, outfitType?: string): void {
    // Handle both 'outfit' and 'equipedOutfit' properties
    const outfitData = {
      id: String(outfitType || outfitId), // Convert to string for actual save format
      type: "Outfit",
      hasBeenAssigned: true,
      hasRandonWeaponBeenAssigned: false
    };
    
    dweller.outfit = outfitData;
    dweller.equipedOutfit = outfitData;
  }

  /**
   * Set dweller weapon
   * @param dweller - The dweller to modify
   * @param weaponId - Weapon ID
   * @param weaponType - Weapon type string
   */
  setDwellerWeapon(dweller: Dweller, weaponId: number | string, weaponType?: string): void {
    // Handle both 'weapon' and 'equipedWeapon' properties
    const weaponData = {
      id: String(weaponType || weaponId), // Convert to string for actual save format
      type: "Weapon",
      hasBeenAssigned: true,
      hasRandonWeaponBeenAssigned: false
    };
    
    dweller.weapon = weaponData;
    dweller.equipedWeapon = weaponData;
  }

  /**
   * Set dweller pet
   * @param dweller - The dweller to modify
   * @param petId - Pet ID
   * @param petType - Pet type string
   */
  setDwellerPet(dweller: Dweller, petId: number, petType?: string): void {
    if (!dweller.pet) {
      dweller.pet = {};
    }
    dweller.pet.id = petId;
    if (petType) {
      dweller.pet.type = petType;
    }
    dweller.pet.hasBeenAssigned = true;
  }

  /**
   * Remove dweller's pet
   * @param dweller - The dweller to modify
   */
  removeDwellerPet(dweller: Dweller): void {
    dweller.pet = undefined;
  }

  /**
   * Set dweller to super health (999999 HP)
   * @param dweller - The dweller to modify
   */
  setDwellerSuperHealth(dweller: Dweller): void {
    this.setDwellerHealth(dweller, 999999, 999999);
    if (dweller.health) {
      dweller.health.radiationValue = 0;
    }
  }

  /**
   * Set all dwellers to super health
   */
  setAllDwellersSuperHealth(): void {
    this.getDwellers().forEach(dweller => {
      this.setDwellerSuperHealth(dweller);
    });
  }

  /**
   * Heal a dweller completely
   * @param dweller - The dweller to heal
   */
  healDweller(dweller: Dweller): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0 };
    }
    
    const maxHealth = dweller.health.maxHealth || 100;
    dweller.health.healthValue = maxHealth;
    dweller.health.radiationValue = 0;
  }

  /**
   * Set dweller happiness
   * @param dweller - The dweller to modify 
   * @param happiness - Happiness value (0-100)
   */
  setDwellerHappiness(dweller: Dweller, happiness: number): void {
    if (!dweller.happiness) dweller.happiness = {};
    dweller.happiness.happinessValue = validateValue.happiness(happiness);
  }

  /**
   * Max happiness for all dwellers
   */
  maxAllHappiness(): void {
    this.getDwellers().forEach(dweller => {
      this.setDwellerHappiness(dweller, 100);
    });
  }

  /**
   * Heal all dwellers to full health
   */
  healAllDwellers(): void {
    this.getDwellers().forEach(dweller => {
      const maxHealth = dweller.health?.maxHealth || 100;
      this.setDwellerHealth(dweller, maxHealth);
      // Remove radiation
      if (dweller.health) {
        dweller.health.radiationValue = 0;
      }
    });
  }

  /**
   * Set dweller radiation
   * @param dweller - The dweller to modify
   * @param radiation - Radiation value (0-100)
   */
  setDwellerRadiation(dweller: Dweller, radiation: number): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0 };
    }
    dweller.health.radiationValue = validateValue.radiation(radiation);
  }

  /**
   * Remove radiation from all dwellers
   */
  removeAllRadiation(): void {
    this.getDwellers().forEach(dweller => {
      this.setDwellerRadiation(dweller, 0);
    });
  }

  /**
   * Set dweller hair color
   * @param dweller - The dweller to modify
   * @param colorValue - Color value (as hex string or number)
   */
  setDwellerHairColor(dweller: Dweller, colorValue: string | number): void {
    if (typeof colorValue === 'string') {
      dweller.hairColor = this.convertColor(colorValue, false) as number;
    } else {
      dweller.hairColor = colorValue;
    }
  }

  /**
   * Set dweller outfit color
   * @param dweller - The dweller to modify
   * @param colorValue - Color value (as hex string or number)
   */
  setDwellerOutfitColor(dweller: Dweller, colorValue: string | number): void {
    if (typeof colorValue === 'string') {
      dweller.outfitColor = this.convertColor(colorValue, false) as number;
    } else {
      dweller.outfitColor = colorValue;
    }
  }

  /**
   * Get dweller hair color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerHairColorHex(dweller: Dweller): string {
    if (!dweller.hairColor) return '#8B4513'; // Default hair color
    const hex = this.convertColor(dweller.hairColor.toString(), true) as string;
    return '#' + hex;
  }

  /**
   * Get dweller outfit color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerOutfitColorHex(dweller: Dweller): string {
    if (!dweller.outfitColor) return '#FFFFFF'; // Default white
    const hex = this.convertColor(dweller.outfitColor.toString(), true) as string;
    return '#' + hex;
  }

  /**
   * Color conversion utility
   * @param colorValue - Hex color string or number
   * @param reverse - Whether to reverse the conversion (number to hex)
   */
  private convertColor(colorValue: string | number, reverse: boolean = false): string | number {
    if (reverse) {
      // Convert from FOS integer to hex color for HTML input
      const colorInt = typeof colorValue === 'string' ? parseInt(colorValue) : colorValue;
      // FOS colors are stored as ARGB, we need RGB
      // Extract RGB components by masking out alpha channel
      const rgb = colorInt & 0xFFFFFF;
      const hex = rgb.toString(16).padStart(6, '0').toUpperCase();
      return hex;
    } else {
      // Convert from hex color to FOS integer
      const cleanHex = colorValue.toString().replace('#', '');
      // Add alpha channel (FF) to make it ARGB format
      const fosColor = 0xFF000000 | parseInt(cleanHex, 16);
      return fosColor;
    }
  }
}
