import type {
  FalloutShelterSave,
  DwellersItem as Dweller
} from '../types/saveFile';

type SpecialStatType = number;

type Actor = any;
import { 
  DwellerStatsManager,
  DwellerHealthManager,
  DwellerEquipmentManager,
  DwellerAppearanceManager,
  DwellerBatchOperations
} from './dweller';

/**
 * Dweller-specific operations for the save editor
 * Delegates to specialized manager classes for better organization
 */
export class DwellerManager {
  private save: FalloutShelterSave | null = null;
  private statsManager: DwellerStatsManager;
  private healthManager: DwellerHealthManager;
  private equipmentManager: DwellerEquipmentManager;
  private appearanceManager: DwellerAppearanceManager;
  private batchOperations: DwellerBatchOperations;

  constructor(save: FalloutShelterSave | null) {
    this.save = save;
    
    // Initialize specialized managers
    this.statsManager = new DwellerStatsManager();
    this.healthManager = new DwellerHealthManager();
    this.equipmentManager = new DwellerEquipmentManager();
    this.appearanceManager = new DwellerAppearanceManager();
    this.batchOperations = new DwellerBatchOperations(
      this.statsManager,
      this.healthManager
    );
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

  // Delegate SPECIAL stats operations
  setDwellerSpecial(dweller: Dweller, statType: SpecialStatType, value: number): void {
    this.statsManager.setDwellerSpecial(dweller, statType, value);
  }

  getDwellerSpecial(dweller: Dweller, statType: SpecialStatType): number {
    return this.statsManager.getDwellerSpecial(dweller, statType);
  }

  maxDwellerSpecial(dweller: Dweller): void {
    this.statsManager.maxDwellerSpecial(dweller);
  }

  setDwellerLevel(dweller: Dweller, level: number, experience?: number): void {
    this.statsManager.setDwellerLevel(dweller, level, experience);
  }

  setDwellerHappiness(dweller: Dweller, happiness: number): void {
    this.statsManager.setDwellerHappiness(dweller, happiness);
  }

  // Delegate health operations
  setDwellerHealth(dweller: Dweller, health: number, maxHealth?: number): void {
    this.healthManager.setDwellerHealth(dweller, health, maxHealth);
  }

  setDwellerSuperHealth(dweller: Dweller): void {
    this.healthManager.setDwellerSuperHealth(dweller);
  }

  healDweller(dweller: Dweller): void {
    this.healthManager.healDweller(dweller);
  }

  setDwellerRadiation(dweller: Dweller, radiation: number): void {
    this.healthManager.setDwellerRadiation(dweller, radiation);
  }

  setDwellerGender(dweller: Dweller, gender: number): void {
    this.healthManager.setDwellerGender(dweller, gender);
  }

  setDwellerPregnancy(dweller: Dweller, isPregnant: boolean): void {
    this.healthManager.setDwellerPregnancy(dweller, isPregnant);
  }

  // Delegate equipment operations
  setDwellerOutfit(dweller: Dweller, outfitId: number | string, outfitType?: string): void {
    this.equipmentManager.setDwellerOutfit(dweller, outfitId, outfitType);
  }

  setDwellerWeapon(dweller: Dweller, weaponId: number | string, weaponType?: string): void {
    this.equipmentManager.setDwellerWeapon(dweller, weaponId, weaponType);
  }

  setDwellerPet(dweller: Dweller, petId: string, petType?: string): void {
    this.equipmentManager.setDwellerPet(dweller, petId, petType);
  }

  removeDwellerPet(dweller: Dweller): void {
    this.equipmentManager.removeDwellerPet(dweller);
  }

  // Delegate appearance operations
  setDwellerHairColor(dweller: Dweller, colorValue: string | number): void {
    this.appearanceManager.setDwellerHairColor(dweller, colorValue);
  }

  setDwellerOutfitColor(dweller: Dweller, colorValue: string | number): void {
    this.appearanceManager.setDwellerOutfitColor(dweller, colorValue);
  }

  getDwellerHairColorHex(dweller: Dweller): string {
    return this.appearanceManager.getDwellerHairColorHex(dweller);
  }

  getDwellerOutfitColorHex(dweller: Dweller): string {
    return this.appearanceManager.getDwellerOutfitColorHex(dweller);
  }

  // Delegate batch operations
  maxAllDwellersSpecial(): void {
    this.batchOperations.maxAllDwellersSpecial(this.getDwellers());
  }

  setAllDwellersSuperHealth(): void {
    this.batchOperations.setAllDwellersSuperHealth(this.getDwellers());
  }

  maxAllHappiness(): void {
    this.batchOperations.maxAllHappiness(this.getDwellers());
  }

  healAllDwellers(): void {
    this.batchOperations.healAllDwellers(this.getDwellers());
  }

  removeAllRadiation(): void {
    this.batchOperations.removeAllRadiation(this.getDwellers());
  }

  /**
   * Evict a dweller from the vault
   */
  evictDweller(dweller: Dweller): void {
    if (!dweller) return;
    
    // Mark dweller for eviction
    dweller.WillBeEvicted = true;
    dweller.IsEvictedWaitingForFollowers = false;
    dweller.assigned = false;
    dweller.savedRoom = -1;
    
    // Room assignment is stored under `savedRoom` in the generated format; already cleared above.
    
    console.log(`Dweller ${dweller.name} ${dweller.lastName} marked for eviction`);
  }

  /**
   * Undo eviction of a dweller
   */
  unevictDweller(dweller: Dweller): void {
    if (!dweller) return;
    
    // Remove eviction flags
    dweller.WillBeEvicted = false;
    dweller.IsEvictedWaitingForFollowers = false;
    
    console.log(`Dweller ${dweller.name} ${dweller.lastName} eviction undone`);
  }
}
