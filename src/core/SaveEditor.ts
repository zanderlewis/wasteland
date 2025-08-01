import type { 
  FalloutShelterSave, 
  Dweller, 
  Actor, 
  SpecialStatType,
  ResourceTypeValue 
} from '../types/saveFile';
import { VaultManager } from './VaultManager';
import { DwellerManager } from './DwellerManager';
import { QuickActions } from './QuickActions';

export class SaveEditor {
  private save: FalloutShelterSave | null = null;
  private fileName: string = '';
  
  // Manager instances
  private vaultManager: VaultManager;
  private dwellerManager: DwellerManager;
  private quickActions: QuickActions;

  constructor() {
    this.vaultManager = new VaultManager(null);
    this.dwellerManager = new DwellerManager(null);
    this.quickActions = new QuickActions(null);
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
  // VAULT OPERATIONS (delegated to VaultManager)
  // ============================================================================

  /**
   * Set vault name
   * @param name - New vault name
   */
  setVaultName(name: string): void {
    this.vaultManager.setVaultName(name);
  }

  /**
   * Get vault name
   */
  getVaultName(): string {
    return this.vaultManager.getVaultName();
  }

  /**
   * Set resource amount
   * @param resourceType - Type of resource
   * @param amount - Amount to set
   */
  setResource(resourceType: ResourceTypeValue, amount: number): void {
    this.vaultManager.setResource(resourceType, amount);
  }

  /**
   * Get resource amount
   * @param resourceType - Type of resource
   */
  getResource(resourceType: ResourceTypeValue): number {
    return this.vaultManager.getResource(resourceType);
  }

  /**
   * Set lunchbox count
   * @param count - Number of lunchboxes
   */
  setLunchboxCount(count: number): void {
    this.vaultManager.setLunchboxCount(count);
  }

  /**
   * Get lunchbox count
   */
  getLunchboxCount(): number {
    return this.vaultManager.getLunchboxCount();
  }

  /**
   * Set Mr. Handy count
   * @param count - Number of Mr. Handies
   */
  setMrHandyCount(count: number): void {
    this.vaultManager.setMrHandyCount(count);
  }

  /**
   * Get Mr. Handy count
   */
  getMrHandyCount(): number {
    return this.vaultManager.getMrHandyCount();
  }

  /**
   * Set Pet Carrier count
   * @param count - Number of Pet Carriers
   */
  setPetCarrierCount(count: number): void {
    this.vaultManager.setPetCarrierCount(count);
  }

  /**
   * Get Pet Carrier count
   */
  getPetCarrierCount(): number {
    return this.vaultManager.getPetCarrierCount();
  }

  /**
   * Set Starter Pack count
   * @param count - Number of Starter Packs
   */
  setStarterPackCount(count: number): void {
    this.vaultManager.setStarterPackCount(count);
  }

  /**
   * Get Starter Pack count
   */
  getStarterPackCount(): number {
    return this.vaultManager.getStarterPackCount();
  }

  /**
   * Set vault theme
   * @param themeId - Theme ID to set
   */
  setVaultTheme(themeId: number): void {
    this.vaultManager.setVaultTheme(themeId);
  }

  /**
   * Get vault theme
   */
  getVaultTheme(): number {
    return this.vaultManager.getVaultTheme();
  }

  /**
   * Set vault mode
   * @param mode - Vault mode ('Normal' or 'Survival')
   */
  setVaultMode(mode: string): void {
    this.vaultManager.setVaultMode(mode);
  }

  /**
   * Get vault mode
   */
  getVaultMode(): string {
    return this.vaultManager.getVaultMode();
  }

  /**
   * Unlock all vault themes
   */
  unlockAllThemes(): void {
    this.vaultManager.unlockAllThemes();
  }

  // ============================================================================
  // DWELLER OPERATIONS (delegated to DwellerManager)
  // ============================================================================

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

  // ============================================================================
  // QUICK ACTIONS (delegated to QuickActions)
  // ============================================================================

  /**
   * Max caps
   */
  maxCaps(): void {
    this.quickActions.maxCaps();
  }

  /**
   * Max Nuka Cola Quantum
   */
  maxNukaCola(): void {
    this.quickActions.maxNukaCola();
  }

  /**
   * Max lunchboxes
   */
  maxLunchboxes(): void {
    this.quickActions.maxLunchboxes();
  }

  /**
   * Max all resources
   */
  maxAllResources(): void {
    this.quickActions.maxAllResources();
  }

  /**
   * Unlock all rooms
   */
  unlockAllRooms(): void {
    this.quickActions.unlockAllRooms();
  }

  /**
   * Unlock all recipes
   */
  unlockAllRecipes(): void {
    this.quickActions.unlockAllRecipes();
  }

  /**
   * Unlock everything (rooms, recipes, themes)
   */
  unlockEverything(): void {
    this.quickActions.unlockEverything();
  }
}
