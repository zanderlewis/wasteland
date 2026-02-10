import type {
  FalloutShelterSave,
  DwellersItem as Dweller,
  ItemsItem
} from '../types/saveFile';

type Actor = any;

type SpecialStatType = number;

type StorageCategory = 'Weapon' | 'Outfit' | 'Junk' | 'Pet';

type ResourceTypeValue =
  | 'Caps'
  | 'Nuka'
  | 'Food'
  | 'Energy'
  | 'Water'
  | 'StimPack'
  | 'RadAway'
  | 'Lunchbox'
  | 'MrHandy'
  | 'PetCarrier'
  | 'CraftedOutfit'
  | 'CraftedWeapon'
  | 'NukaColaQuantum'
  | 'CraftedTheme';
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
  // STORAGE OPERATIONS
  // ============================================================================

  /**
   * Return items currently in vault storage inventory for the given category.
   * NOTE: Fallout Shelter represents stored items as entries in vault.inventory.items.
   */
  getStorageItems(category: StorageCategory): ItemsItem[] {
    const save = this.save;
    if (!save) return [];

    const items = save.vault?.inventory?.items || [];
    const wanted = category.toLowerCase();

    // Be tolerant of different casing/wording across platform versions.
    return items.filter((it) => {
      const t = (it.type || '').toLowerCase();
      if (!t) return false;
      if (wanted === 'weapon') return t === 'weapon' || t === 'weapons';
      if (wanted === 'outfit') return t === 'outfit' || t === 'outfits';
      if (wanted === 'pet') return t === 'pet' || t === 'pets';
      if (wanted === 'junk') return t === 'junk' || t === 'scrap' || t === 'item';
      return false;
    });
  }

  /**
   * Add a single item to vault storage inventory.
   */
  addStorageItem(category: StorageCategory, id: string): void {
    if (!this.save) return;

    // Ensure inventory exists
    if (!this.save.vault.inventory) {
      // Some save-file variants/older typings may not include inventory.
      // Mutate via a loose cast to keep runtime behaviour while satisfying TS.
      (this.save.vault as any).inventory = { items: [] };
    }
    if (!Array.isArray(this.save.vault.inventory.items)) {
      this.save.vault.inventory.items = [];
    }

    const item: ItemsItem = {
      id,
      type: category,
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        partsCollectedCount: 0,
        IsCraftingInProgress: false,
        IsCrafted: false,
        IsClaimed: false,
        IsClaimedInCraftingRoom: false,
        IsNew: true,
      },
    };

    this.save.vault.inventory.items.push(item);
  }


  /**
   * Total number of items currently in vault storage inventory.
   */
  getStorageUsed(): number {
    const save = this.save;
    if (!save) return 0;
    const items = save.vault?.inventory?.items || [];
    return Array.isArray(items) ? items.length : 0;
  }

  /**
   * Storage capacity is based on Storage Rooms + Warehouses, plus a base capacity of 10.
   * Storage per room = 5 x Size x (Level + 1)
   * Size is 1..3 (mergeLevel + 1), Level is 1..3.
   *
   * Note: In save files, room.level is commonly 0-based (0..2), so we convert to 1..3.
   */
  getStorageCapacity(): number {
    const save = this.save;
    if (!save) return 0;

    const base = 10;
    const rooms = save.vault?.rooms || [];
    if (!Array.isArray(rooms)) return base;

    const isStorageRoomOrWarehouse = (r: any): boolean => {
      const t = String(r?.type || '').toLowerCase();
      const c = String(r?.class || '').toLowerCase();
      // Fallout Shelter has both Storage Rooms and Warehouses contributing to capacity.
      return (
        t.includes('storage') ||
        c.includes('storage') ||
        t.includes('warehouse') ||
        c.includes('warehouse')
      );
    };

    const roomCap = rooms
      .filter(isStorageRoomOrWarehouse)
      .reduce((sum: number, r: any) => {
        const size = Math.min(3, Math.max(1, (Number(r?.mergeLevel) || 0) + 1));
        // Save file often stores level 0..2 (representing in-game levels 1..3)
        const level = Math.min(3, Math.max(1, (Number(r?.level) || 0) + 1));
        return sum + 5 * size * (level + 1);
      }, 0);

    return base + roomCap;
  }

  /**
   * Get current count of a specific item in storage for a given category.
   */
  getStorageItemCount(category: StorageCategory, id: string): number {
    const items = this.getStorageItems(category);
    return items.filter((it) => it.id === id).length;
  }

  /**
   * Set the quantity for a specific item in storage (0 deletes).
   * Returns true if applied; false if it would exceed storage capacity or no save loaded.
   */
  setStorageItemQuantity(category: StorageCategory, id: string, qty: number): boolean {
    if (!this.save) return false;

    const desired = Math.max(0, Math.floor(Number(qty) || 0));

    // Ensure inventory exists
    if (!this.save.vault.inventory) {
      (this.save.vault as any).inventory = { items: [] };
    }
    if (!Array.isArray(this.save.vault.inventory.items)) {
      this.save.vault.inventory.items = [];
    }

    const wanted = category.toLowerCase();
    const matchesCategory = (it: any): boolean => {
      const t = String(it?.type || '').toLowerCase();
      if (!t) return false;
      if (wanted === 'weapon') return t === 'weapon' || t === 'weapons';
      if (wanted === 'outfit') return t === 'outfit' || t === 'outfits';
      if (wanted === 'pet') return t === 'pet' || t === 'pets';
      if (wanted === 'junk') return t === 'junk' || t === 'scrap' || t === 'item';
      return false;
    };

    const items = this.save.vault.inventory.items;
    const current = items.filter((it) => matchesCategory(it) && it.id === id).length;
    const delta = desired - current;

    if (delta > 0) {
      const used = this.getStorageUsed();
      const cap = this.getStorageCapacity();
      if (used + delta > cap) return false;
    }

    // Remove all existing instances of this item (in the target category)
    const remaining = items.filter((it) => !(matchesCategory(it) && it.id === id));
    this.save.vault.inventory.items = remaining;

    // Add back desired quantity
    for (let i = 0; i < desired; i++) {
      this.addStorageItem(category, id);
    }

    return true;
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
