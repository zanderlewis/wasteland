// Dweller-related operations for SaveEditor
import type { Dweller, Actor, SpecialStatType } from '../../types/saveFile';
import { DwellerManager } from '../DwellerManager';

/**
 * Mixin for dweller-related operations
 */
export class SaveEditorDwellerMixin {
  private dwellerManager: DwellerManager;

  constructor(dwellerManager: DwellerManager) {
    this.dwellerManager = dwellerManager;
  }

  /**
   * Get all dwellers
   */
  getDwellers(): Dweller[] {
    return this.dwellerManager.getDwellers();
  }

  /**
   * Get all actors (NPCs)
   */
  getActors(): Actor[] {
    return this.dwellerManager.getActors();
  }

  /**
   * Set dweller's SPECIAL stat
   * @param dweller - The dweller to modify
   * @param statType - The SPECIAL stat type
   * @param value - The value to set (0-10)
   */
  setDwellerSpecial(dweller: Dweller, statType: SpecialStatType, value: number): void {
    this.dwellerManager.setDwellerSpecial(dweller, statType, value);
  }

  /**
   * Get dweller's SPECIAL stat
   * @param dweller - The dweller
   * @param statType - The SPECIAL stat type
   */
  getDwellerSpecial(dweller: Dweller, statType: SpecialStatType): number {
    return this.dwellerManager.getDwellerSpecial(dweller, statType);
  }

  /**
   * Max out all SPECIAL stats for a dweller
   * @param dweller - The dweller to modify
   */
  maxDwellerSpecial(dweller: Dweller): void {
    this.dwellerManager.maxDwellerSpecial(dweller);
  }

  /**
   * Max out all SPECIAL stats for all dwellers
   */
  maxAllDwellersSpecial(): void {
    this.dwellerManager.maxAllDwellersSpecial();
  }

  /**
   * Set dweller health
   * @param dweller - The dweller to modify
   * @param health - Health value
   * @param maxHealth - Maximum health value (optional)
   */
  setDwellerHealth(dweller: Dweller, health: number, maxHealth?: number): void {
    this.dwellerManager.setDwellerHealth(dweller, health, maxHealth);
  }

  /**
   * Set dweller level and experience
   * @param dweller - The dweller to modify
   * @param level - Level to set (1-50)
   * @param experience - Experience value (optional)
   */
  setDwellerLevel(dweller: Dweller, level: number, experience?: number): void {
    this.dwellerManager.setDwellerLevel(dweller, level, experience);
  }

  /**
   * Set dweller happiness
   * @param dweller - The dweller to modify 
   * @param happiness - Happiness value (0-100)
   */
  setDwellerHappiness(dweller: Dweller, happiness: number): void {
    this.dwellerManager.setDwellerHappiness(dweller, happiness);
  }

  /**
   * Set dweller radiation
   * @param dweller - The dweller to modify
   * @param radiation - Radiation value (0-100)
   */
  setDwellerRadiation(dweller: Dweller, radiation: number): void {
    this.dwellerManager.setDwellerRadiation(dweller, radiation);
  }

  setDwellerWeapon(dweller: Dweller, weaponId: number | string, weaponType?: string): void {
    this.dwellerManager.setDwellerWeapon(dweller, weaponId, weaponType);
  }

  setDwellerOutfit(dweller: Dweller, outfitId: number | string, outfitType?: string): void {
    this.dwellerManager.setDwellerOutfit(dweller, outfitId, outfitType);
  }

  setDwellerPet(dweller: Dweller, petId: string, petType?: string): void {
    this.dwellerManager.setDwellerPet(dweller, petId, petType);
  }

  removeDwellerPet(dweller: Dweller): void {
    this.dwellerManager.removeDwellerPet(dweller);
  }

  /**
   * Set all dwellers to super health
   */
  setAllDwellersSuperHealth(): void {
    this.dwellerManager.setAllDwellersSuperHealth();
  }

  /**
   * Max happiness for all dwellers
   */
  maxAllHappiness(): void {
    this.dwellerManager.maxAllHappiness();
  }

  /**
   * Heal all dwellers to full health
   */
  healAllDwellers(): void {
    this.dwellerManager.healAllDwellers();
  }

  /**
   * Remove radiation from all dwellers
   */
  removeAllRadiation(): void {
    this.dwellerManager.removeAllRadiation();
  }
}
