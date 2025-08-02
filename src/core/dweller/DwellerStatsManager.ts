import type { Dweller, SpecialStatType } from '../../types/saveFile';
import { SpecialStat } from '../../types/saveFile';
import { GAME_LIMITS, validateValue } from '../../constants/gameConstants';

/**
 * Manages dweller SPECIAL stats and experience
 */
export class DwellerStatsManager {
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
      const statData = dweller.stats.stats[statType];
      if (typeof statData === 'object' && statData !== null && 'value' in statData) {
        (statData as any).value = clampedValue;
      } else {
        // Convert number to object format
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
        this.setDwellerSpecial(dweller, stat, GAME_LIMITS.SPECIAL_MAX);
      }
    });
  }

  /**
   * Set dweller level and experience
   * @param dweller - The dweller to modify
   * @param level - Level to set (1-50)
   * @param experience - Experience value (optional)
   */
  setDwellerLevel(dweller: Dweller, level: number, experience?: number): void {
    if (!dweller.experience) {
      dweller.experience = { currentLevel: 1, experienceValue: 0, wastelandExperience: 0 };
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
   * Set dweller happiness
   * @param dweller - The dweller to modify 
   * @param happiness - Happiness value (0-100)
   */
  setDwellerHappiness(dweller: Dweller, happiness: number): void {
    if (!dweller.happiness) dweller.happiness = {};
    dweller.happiness.happinessValue = validateValue.happiness(happiness);
  }
}
