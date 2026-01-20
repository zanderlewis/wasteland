import type { SaveEditor } from '../../core/SaveEditor';
import type { DwellersItem as Dweller } from '../../types/saveFile';

/**
 * Handles batch operations for dwellers
 */
export class DwellerBatchOperations {
  private saveEditor: SaveEditor;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
  }

  /**
   * Max happiness for all dwellers
   */
  maxHappinessAll(): void {
    if (!this.saveEditor.isLoaded()) return;
    
    const dwellers = this.saveEditor.getDwellers();
    dwellers.forEach(dweller => {
      this.saveEditor.setDwellerHappiness(dweller, 100);
    });
  }

  /**
   * Heal all dwellers
   */
  healAll(): void {
    if (!this.saveEditor.isLoaded()) return;
    
    const dwellers = this.saveEditor.getDwellers();
    dwellers.forEach(dweller => {
      if (dweller.health) {
        this.saveEditor.setDwellerRadiation(dweller, 0);
        this.saveEditor.setDwellerHealth(dweller, dweller.health.maxHealth || 100, dweller.health.maxHealth || 100);
      }
    });
  }

  /**
   * Max all SPECIAL stats for all dwellers
   */
  maxSpecialAll(): void {
    if (!this.saveEditor.isLoaded()) return;
    
    const dwellers = this.saveEditor.getDwellers();
    dwellers.forEach(dweller => {
      for (let i = 1; i <= 7; i++) {
        this.saveEditor.setDwellerSpecial(dweller, i as any, 10);
      }
    });
  }

  /**
   * Max SPECIAL stats for a single dweller
   */
  maxSpecial(dweller: Dweller): void {
    for (let i = 1; i <= 7; i++) {
      this.saveEditor.setDwellerSpecial(dweller, i as any, 10);
    }
  }
}
