import type { 
  FalloutShelterSave, 
  Dweller, 
  Actor, 
  SpecialStatType,
  ResourceTypeValue 
} from '../types/saveFile';
import type { ISaveEditor } from './interfaces/ISaveEditor';
import { VaultManager } from './VaultManager';
import { DwellerManager } from './DwellerManager';
import { QuickActions } from './QuickActions';
import { SaveEditorVaultMixin } from './mixins/SaveEditorVaultMixin';
import { SaveEditorDwellerMixin } from './mixins/SaveEditorDwellerMixin';
import { SaveEditorQuickActionsMixin } from './mixins/SaveEditorQuickActionsMixin';

export class SaveEditor implements ISaveEditor {
  private save: FalloutShelterSave | null = null;
  private fileName: string = '';
  
  // Manager instances
  private vaultManager: VaultManager;
  private dwellerManager: DwellerManager;
  private quickActions: QuickActions;

  // Mixins for organized functionality
  private vaultMixin: SaveEditorVaultMixin;
  private dwellerMixin: SaveEditorDwellerMixin;
  private quickActionsMixin: SaveEditorQuickActionsMixin;

  constructor() {
    this.vaultManager = new VaultManager(null);
    this.dwellerManager = new DwellerManager(null);
    this.quickActions = new QuickActions(null);

    // Initialize mixins
    this.vaultMixin = new SaveEditorVaultMixin(this.vaultManager);
    this.dwellerMixin = new SaveEditorDwellerMixin(this.dwellerManager);
    this.quickActionsMixin = new SaveEditorQuickActionsMixin(this.quickActions);
  }

  /**
   * Load a save file
   * @param saveData - The parsed save file data
   * @param fileName - The original filename
   */
  loadSave(saveData: FalloutShelterSave, fileName: string): void {
    this.save = saveData;
    this.fileName = fileName;
    
    // Update all managers with the new save data
    this.vaultManager.updateSave(saveData);
    this.dwellerManager.updateSave(saveData);
    this.quickActions.updateSave(saveData);
  }

  /**
   * Get the current save data
   */
  getSave(): FalloutShelterSave | null {
    return this.save;
  }

  /**
   * Get file name
   */
  getFileName(): string {
    return this.fileName;
  }

  /**
   * Check if a save is loaded
   */
  isLoaded(): boolean {
    return this.save !== null;
  }

  // ============================================================================
  // VAULT OPERATIONS (delegated to VaultMixin)
  // ============================================================================

  setVaultName(name: string): void {
    this.vaultMixin.setVaultName(name);
  }

  getVaultName(): string {
    return this.vaultMixin.getVaultName();
  }

  setResource(resourceType: ResourceTypeValue, amount: number): void {
    this.vaultMixin.setResource(resourceType, amount);
  }

  getResource(resourceType: ResourceTypeValue): number {
    return this.vaultMixin.getResource(resourceType);
  }

  setLunchboxCount(count: number): void {
    this.vaultMixin.setLunchboxCount(count);
  }

  getLunchboxCount(): number {
    return this.vaultMixin.getLunchboxCount();
  }

  setMrHandyCount(count: number): void {
    this.vaultMixin.setMrHandyCount(count);
  }

  getMrHandyCount(): number {
    return this.vaultMixin.getMrHandyCount();
  }

  setPetCarrierCount(count: number): void {
    this.vaultMixin.setPetCarrierCount(count);
  }

  getPetCarrierCount(): number {
    return this.vaultMixin.getPetCarrierCount();
  }

  setStarterPackCount(count: number): void {
    this.vaultMixin.setStarterPackCount(count);
  }

  getStarterPackCount(): number {
    return this.vaultMixin.getStarterPackCount();
  }

  setVaultTheme(themeId: number): void {
    this.vaultMixin.setVaultTheme(themeId);
  }

  getVaultTheme(): number {
    return this.vaultMixin.getVaultTheme();
  }

  setVaultMode(mode: string): void {
    this.vaultMixin.setVaultMode(mode);
  }

  getVaultMode(): string {
    return this.vaultMixin.getVaultMode();
  }

  unlockAllThemes(): void {
    this.vaultMixin.unlockAllThemes();
  }

  // ============================================================================
  // DWELLER OPERATIONS (delegated to DwellerMixin)
  // ============================================================================

  getDwellers(): Dweller[] {
    return this.dwellerMixin.getDwellers();
  }

  getActors(): Actor[] {
    return this.dwellerMixin.getActors();
  }

  setDwellerSpecial(dweller: Dweller, statType: SpecialStatType, value: number): void {
    this.dwellerMixin.setDwellerSpecial(dweller, statType, value);
  }

  getDwellerSpecial(dweller: Dweller, statType: SpecialStatType): number {
    return this.dwellerMixin.getDwellerSpecial(dweller, statType);
  }

  maxDwellerSpecial(dweller: Dweller): void {
    this.dwellerMixin.maxDwellerSpecial(dweller);
  }

  maxAllDwellersSpecial(): void {
    this.dwellerMixin.maxAllDwellersSpecial();
  }

  setDwellerHealth(dweller: Dweller, health: number, maxHealth?: number): void {
    this.dwellerMixin.setDwellerHealth(dweller, health, maxHealth);
  }

  setDwellerLevel(dweller: Dweller, level: number, experience?: number): void {
    this.dwellerMixin.setDwellerLevel(dweller, level, experience);
  }

  setDwellerHappiness(dweller: Dweller, happiness: number): void {
    this.dwellerMixin.setDwellerHappiness(dweller, happiness);
  }

  setDwellerRadiation(dweller: Dweller, radiation: number): void {
    this.dwellerMixin.setDwellerRadiation(dweller, radiation);
  }

  setDwellerWeapon(dweller: Dweller, weaponId: number | string, weaponType?: string): void {
    this.dwellerMixin.setDwellerWeapon(dweller, weaponId, weaponType);
  }

  setDwellerOutfit(dweller: Dweller, outfitId: number | string, outfitType?: string): void {
    this.dwellerMixin.setDwellerOutfit(dweller, outfitId, outfitType);
  }

  setDwellerPet(dweller: Dweller, petId: string, petType?: string): void {
    this.dwellerMixin.setDwellerPet(dweller, petId, petType);
  }

  removeDwellerPet(dweller: Dweller): void {
    this.dwellerMixin.removeDwellerPet(dweller);
  }

  evictDweller(dweller: Dweller): void {
    this.dwellerMixin.evictDweller(dweller);
  }

  unevictDweller(dweller: Dweller): void {
    this.dwellerMixin.unevictDweller(dweller);
  }

  setAllDwellersSuperHealth(): void {
    this.dwellerMixin.setAllDwellersSuperHealth();
  }

  maxAllHappiness(): void {
    this.dwellerMixin.maxAllHappiness();
  }

  healAllDwellers(): void {
    this.dwellerMixin.healAllDwellers();
  }

  removeAllRadiation(): void {
    this.dwellerMixin.removeAllRadiation();
  }

  // ============================================================================
  // QUICK ACTIONS (delegated to QuickActionsMixin)
  // ============================================================================

  maxCaps(): void {
    this.quickActionsMixin.maxCaps();
  }

  maxNukaCola(): void {
    this.quickActionsMixin.maxNukaCola();
  }

  maxLunchboxes(): void {
    this.quickActionsMixin.maxLunchboxes();
  }

  maxAllResources(): void {
    this.quickActionsMixin.maxAllResources();
  }

  unlockAllRooms(): void {
    this.quickActionsMixin.unlockAllRooms();
  }

  unlockAllRecipes(): void {
    this.quickActionsMixin.unlockAllRecipes();
  }

  unlockEverything(): void {
    this.quickActionsMixin.unlockEverything();
  }

  removeAllRocks(): void {
    this.quickActionsMixin.removeAllRocks();
  }
}
