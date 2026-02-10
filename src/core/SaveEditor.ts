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
   * Total number of items currently occupying storage.
   * (Fallout Shelter represents stored items as entries in vault.inventory.items.)
   */
  getStorageUsage(): number {
    const save = this.save;
    if (!save) return 0;
    return (save.vault?.inventory?.items || []).length;
  }

  /**
   * Compute storage capacity.
   * Base capacity is 10, plus for each storage room:
   *   5 x Size x (Level + 1)
   * Where Size is 1..3 (mergeLevel + 1) and Level is 1..3.
   */
  getStorageCapacity(): number {
    const save = this.save;
    if (!save) return 0;

    const base = 10;
    const rooms = save.vault?.rooms || [];

    const storageRooms = rooms.filter((r) => {
      const t = (r.type || '').toLowerCase();
      return t.includes('storage');
    });

    const roomCapacity = storageRooms.reduce((sum, room) => {
      const size = Math.min(3, Math.max(1, (room.mergeLevel ?? 0) + 1));
      const level = Math.min(3, Math.max(1, room.level ?? 1));
      return sum + (5 * size * (level + 1));
    }, 0);

    return base + roomCapacity;
  }

  /**
   * Set the quantity for a given item in storage.
   * - If qty is 0, the item is removed.
   * - If qty increases, capacity must not be exceeded (otherwise no change is applied).
   */
  setStorageItemQuantity(category: StorageCategory, id: string, qty: number): boolean {
    if (!this.save) return false;

    // Ensure inventory exists
    if (!this.save.vault.inventory) {
      (this.save.vault as any).inventory = { items: [] };
    }
    if (!Array.isArray(this.save.vault.inventory.items)) {
      this.save.vault.inventory.items = [];
    }

    const items = this.save.vault.inventory.items;
    const currentIndexes: number[] = [];
    items.forEach((it, idx) => {
      if (it.id === id && (it.type || '').toLowerCase() === category.toLowerCase()) {
        currentIndexes.push(idx);
      }
    });

    const currentQty = currentIndexes.length;
    const targetQty = Math.max(0, Math.floor(qty));

    // Capacity check for net increase
    const usage = this.getStorageUsage();
    const capacity = this.getStorageCapacity();
    const newUsage = usage - currentQty + targetQty;
    if (newUsage > capacity) {
      return false;
    }

    // Remove all occurrences if setting to 0
    if (targetQty === 0) {
      this.save.vault.inventory.items = items.filter(
        (it) => !(it.id === id && (it.type || '').toLowerCase() === category.toLowerCase())
      );
      return currentQty > 0;
    }

    // Reduce quantity
    if (targetQty < currentQty) {
      const toRemove = currentQty - targetQty;
      let removed = 0;
      this.save.vault.inventory.items = items.filter((it) => {
        if (removed < toRemove && it.id === id && (it.type || '').toLowerCase() === category.toLowerCase()) {
          removed++;
          return false;
        }
        return true;
      });
      return true;
    }

    // Increase quantity
    if (targetQty > currentQty) {
      const toAdd = targetQty - currentQty;
      for (let i = 0; i < toAdd; i++) {
        this.addStorageItem(category, id);
      }
      return true;
    }

    return false;
  }

  /**
   * Add a single item to vault storage inventory.
   */
  addStorageItem(category: StorageCategory, id: string): boolean {
    if (!this.save) return false;

    // Capacity guard
    if (this.getStorageUsage() >= this.getStorageCapacity()) {
      return false;
    }

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
