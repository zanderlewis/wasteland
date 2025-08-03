// SaveEditor interface definitions
import type { 
  FalloutShelterSave, 
  Dweller, 
  Actor, 
  SpecialStatType,
  ResourceTypeValue 
} from '../../types/saveFile';

/**
 * Interface for the main SaveEditor class
 */
export interface ISaveEditor {
  // Core methods
  loadSave(saveData: FalloutShelterSave, fileName: string): void;
  getSave(): FalloutShelterSave | null;
  getFileName(): string;
  isLoaded(): boolean;

  // Vault operations
  setVaultName(name: string): void;
  getVaultName(): string;
  setResource(resourceType: ResourceTypeValue, amount: number): void;
  getResource(resourceType: ResourceTypeValue): number;
  setLunchboxCount(count: number): void;
  getLunchboxCount(): number;
  setMrHandyCount(count: number): void;
  getMrHandyCount(): number;
  setPetCarrierCount(count: number): void;
  getPetCarrierCount(): number;
  setStarterPackCount(count: number): void;
  getStarterPackCount(): number;
  setVaultTheme(themeId: number): void;
  getVaultTheme(): number;
  setVaultMode(mode: string): void;
  getVaultMode(): string;
  unlockAllThemes(): void;

  // Dweller operations
  getDwellers(): Dweller[];
  getActors(): Actor[];
  setDwellerSpecial(dweller: Dweller, statType: SpecialStatType, value: number): void;
  getDwellerSpecial(dweller: Dweller, statType: SpecialStatType): number;
  maxDwellerSpecial(dweller: Dweller): void;
  maxAllDwellersSpecial(): void;
  setDwellerHealth(dweller: Dweller, health: number, maxHealth?: number): void;
  setDwellerLevel(dweller: Dweller, level: number, experience?: number): void;
  setDwellerHappiness(dweller: Dweller, happiness: number): void;
  setDwellerRadiation(dweller: Dweller, radiation: number): void;
  setDwellerWeapon(dweller: Dweller, weaponId: number | string, weaponType?: string): void;
  setDwellerOutfit(dweller: Dweller, outfitId: number | string, outfitType?: string): void;
  setDwellerPet(dweller: Dweller, petId: string, petType?: string): void;
  removeDwellerPet(dweller: Dweller): void;
  evictDweller(dweller: Dweller): void;
  unevictDweller(dweller: Dweller): void;
  setAllDwellersSuperHealth(): void;
  maxAllHappiness(): void;
  healAllDwellers(): void;
  removeAllRadiation(): void;

  // Quick actions
  maxCaps(): void;
  maxNukaCola(): void;
  maxLunchboxes(): void;
  maxAllResources(): void;
  unlockAllRooms(): void;
  unlockAllRecipes(): void;
  unlockEverything(): void;
  removeAllRocks(): void;
}
