import type { Dweller} from '../../types/saveFile';
import { DwellerStatsManager } from './DwellerStatsManager';
import { DwellerHealthManager } from './DwellerHealthManager';

/**
 * Manages batch operations on dwellers
 */
export class DwellerBatchOperations {
  private statsManager: DwellerStatsManager;
  private healthManager: DwellerHealthManager;

  constructor(
    statsManager: DwellerStatsManager,
    healthManager: DwellerHealthManager,
  ) {
    this.statsManager = statsManager;
    this.healthManager = healthManager;
  }

  /**
   * Max out all SPECIAL stats for all dwellers
   */
  maxAllDwellersSpecial(dwellers: Dweller[]): void {
    dwellers.forEach(dweller => {
      this.statsManager.maxDwellerSpecial(dweller);
    });
  }

  /**
   * Set all dwellers to super health
   */
  setAllDwellersSuperHealth(dwellers: Dweller[]): void {
    dwellers.forEach(dweller => {
      this.healthManager.setDwellerSuperHealth(dweller);
    });
  }

  /**
   * Max happiness for all dwellers
   */
  maxAllHappiness(dwellers: Dweller[]): void {
    dwellers.forEach(dweller => {
      this.statsManager.setDwellerHappiness(dweller, 100);
    });
  }

  /**
   * Heal all dwellers to full health
   */
  healAllDwellers(dwellers: Dweller[]): void {
    dwellers.forEach(dweller => {
      const maxHealth = dweller.health?.maxHealth || 100;
      this.healthManager.setDwellerHealth(dweller, maxHealth);
      // Remove radiation
      if (dweller.health) {
        dweller.health.radiationValue = 0;
      }
    });
  }

  /**
   * Remove radiation from all dwellers
   */
  removeAllRadiation(dwellers: Dweller[]): void {
    dwellers.forEach(dweller => {
      this.healthManager.setDwellerRadiation(dweller, 0);
    });
  }
}
