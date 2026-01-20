import type { DwellersItem as Dweller } from '../../types/saveFile';
import { validateValue } from '../../constants/gameConstants';

/**
 * Manages dweller health, radiation, and basic attributes
 */
export class DwellerHealthManager {
  /**
   * Set dweller health
   * @param dweller - The dweller to modify
   * @param health - Health value
   * @param maxHealth - Maximum health value (optional)
   */
  setDwellerHealth(dweller: Dweller, health: number, maxHealth?: number): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0, permaDeath: false, lastLevelUpdated: 0 };
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
   * Heal a dweller completely
   * @param dweller - The dweller to heal
   */
  healDweller(dweller: Dweller): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0, permaDeath: false, lastLevelUpdated: 0 };
    }
    
    const maxHealth = dweller.health.maxHealth || 100;
    dweller.health.healthValue = maxHealth;
    dweller.health.radiationValue = 0;
  }

  /**
   * Set dweller radiation
   * @param dweller - The dweller to modify
   * @param radiation - Radiation value (0-100)
   */
  setDwellerRadiation(dweller: Dweller, radiation: number): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0, permaDeath: false, lastLevelUpdated: 0 };
    }
    dweller.health.radiationValue = validateValue.radiation(radiation);
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
      dweller.babyReady = false; // Will be true when baby is ready
    } else {
      dweller.relations.partner = -1;
      dweller.babyReady = false;
    }
  }
}
