import type { FalloutShelterSave } from '../types/saveFile';

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
import { 
  GAME_LIMITS, 
  ROOM_UNLOCKS, 
  RECIPE_UNLOCKS 
} from '../constants/gameConstants';

/**
 * Quick action operations for the save editor
 */
export class QuickActions {
  private save: FalloutShelterSave | null = null;

  constructor(save: FalloutShelterSave | null) {
    this.save = save;
  }

  updateSave(save: FalloutShelterSave | null): void {
    this.save = save;
  }

  /**
   * Max caps
   */
  maxCaps(): void {
    if (!this.save) throw new Error('No save loaded');
    this.setResource('Caps', GAME_LIMITS.CAPS_MAX);
  }

  /**
   * Max Nuka Cola Quantum
   */
  maxNukaCola(): void {
    if (!this.save) throw new Error('No save loaded');
    this.setResource('NukaColaQuantum', GAME_LIMITS.NUKA_COLA_MAX);
  }

  /**
   * Max lunchboxes
   */
  maxLunchboxes(): void {
    if (!this.save) throw new Error('No save loaded');
    this.setLunchboxCount(GAME_LIMITS.LUNCHBOXES_MAX);
  }

  /**
   * Unlock all rooms
   */
  unlockAllRooms(): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Initialize unlockableMgr if it doesn't exist
    if (!this.save.unlockableMgr) {
      (this.save as any).unlockableMgr = {
        objectivesInProgress: [],
        completed: [],
        claimed: []
      };
    }

    // Clear existing objectives and set all rooms as claimed
    (this.save as any).unlockableMgr.objectivesInProgress = [];
    (this.save as any).unlockableMgr.completed = [];
    (this.save as any).unlockableMgr.claimed = [...ROOM_UNLOCKS];
  }

  /**
   * Unlock all recipes
   */
  unlockAllRecipes(): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!(this.save.vault as any).unlockedRecipes) {
      (this.save.vault as any).unlockedRecipes = [];
    }

    RECIPE_UNLOCKS.forEach(recipe => {
      if (!(this.save!.vault as any).unlockedRecipes.includes(recipe)) {
        (this.save!.vault as any).unlockedRecipes.push(recipe);
      }
    });
  }

  /**
   * Max all resources
   */
  maxAllResources(): void {
    if (!this.save) throw new Error('No save loaded');
    
    this.setResource('Caps', GAME_LIMITS.CAPS_MAX);
    this.setResource('Food', GAME_LIMITS.FOOD_MAX);
    this.setResource('Energy', GAME_LIMITS.ENERGY_MAX);
    this.setResource('Water', GAME_LIMITS.WATER_MAX);
    this.setResource('NukaColaQuantum', GAME_LIMITS.NUKA_COLA_MAX);
    this.setResource('StimPack', GAME_LIMITS.STIMPACKS_MAX);
    this.setResource('RadAway', GAME_LIMITS.RADAWAY_MAX);
    
    this.setLunchboxCount(GAME_LIMITS.LUNCHBOXES_MAX);
    this.setMrHandyCount(GAME_LIMITS.MR_HANDIES_MAX);
    this.setPetCarrierCount(GAME_LIMITS.PET_CARRIERS_MAX);
  }

  /**
   * Unlock everything (rooms, recipes, themes)
   */
  unlockEverything(): void {
    if (!this.save) throw new Error('No save loaded');
    
    this.unlockAllRooms();
    this.unlockAllRecipes();
    this.unlockAllThemes();
  }

  /**
   * Remove all rocks from the vault
   */
  removeAllRocks(): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (this.save.vault.rocks) {
      this.save.vault.rocks = [];
    }
  }

  /**
   * Cap junk items so no junk id has more than `maxPerItem` entries.
   * Junk items are stored as individual inventory entries (not as stacks).
   *
   * @returns number of removed items
   */
  capJunk(maxPerItem: number = 30): number {
    if (!this.save) throw new Error('No save loaded');

    if (!this.save.vault) throw new Error('Invalid save: missing vault');
    if (!this.save.vault.inventory) {
      (this.save.vault as any).inventory = { items: [] };
    }
    if (!Array.isArray((this.save.vault.inventory as any).items)) {
      (this.save.vault.inventory as any).items = [];
    }

    const items = (this.save.vault.inventory as any).items as any[];
    const isJunkType = (type: any): boolean => {
      const t = String(type || '').toLowerCase();
      return t === 'junk' || t === 'scrap' || t === 'item';
    };

    const counts = new Map<string, number>();
    const before = items.length;

    const filtered = items.filter((it) => {
      if (!it) return false;
      if (!isJunkType(it.type)) return true;

      const key = String(it.id ?? '');
      const c = counts.get(key) ?? 0;
      if (c >= maxPerItem) return false;
      counts.set(key, c + 1);
      return true;
    });

    (this.save.vault.inventory as any).items = filtered;

    const after = filtered.length;
    return Math.max(0, before - after);
  }


  // Helper methods that delegate to other managers
  private setResource(resourceType: ResourceTypeValue, amount: number): void {
    if (!this.save) throw new Error('No save loaded');
    if (!this.save.vault.storage) {
      (this.save.vault as any).storage = { resources: {}, bonus: {} };
    }
    if (!(this.save.vault.storage as any).resources) {
      (this.save.vault.storage as any).resources = {};
    }
    
    // Map our internal resource names to save file names
    const saveFileResourceName = resourceType === 'Caps' ? 'Nuka' : resourceType;
    
    // Get the max value for this resource type
    const maxValue = resourceType === 'Caps' ? GAME_LIMITS.CAPS_MAX :
                    resourceType === 'NukaColaQuantum' ? GAME_LIMITS.NUKA_COLA_MAX :
                    resourceType === 'Food' ? GAME_LIMITS.FOOD_MAX :
                    resourceType === 'Water' ? GAME_LIMITS.WATER_MAX :
                    resourceType === 'Energy' ? GAME_LIMITS.ENERGY_MAX :
                    resourceType === 'RadAway' ? GAME_LIMITS.RADAWAY_MAX :
                    resourceType === 'StimPack' ? GAME_LIMITS.STIMPACKS_MAX :
                    GAME_LIMITS.NUKA_COLA_MAX;
    
    (this.save.vault.storage.resources as unknown as Record<string, number>)[saveFileResourceName] = Math.max(0, Math.min(maxValue, amount));
  }

  private setLunchboxCount(count: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Initialize LunchBoxesByType if it doesn't exist
    if (!this.save.vault.LunchBoxesByType) {
      (this.save.vault as any).LunchBoxesByType = [];
    }
    
    this.updateLunchBoxesByType('lunchboxes', Math.max(0, Math.min(GAME_LIMITS.LUNCHBOXES_MAX, count)));
  }

  private setMrHandyCount(count: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!this.save.vault.LunchBoxesByType) {
      (this.save.vault as any).LunchBoxesByType = [];
    }
    
    this.updateLunchBoxesByType('mrHandies', Math.max(0, Math.min(GAME_LIMITS.MR_HANDIES_MAX, count)));
  }

  private setPetCarrierCount(count: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!this.save.vault.LunchBoxesByType) {
      (this.save.vault as any).LunchBoxesByType = [];
    }
    
    this.updateLunchBoxesByType('petCarriers', Math.max(0, Math.min(GAME_LIMITS.PET_CARRIERS_MAX, count)));
  }

  private unlockAllThemes(): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!(this.save.vault as any).unlockedThemes) {
      (this.save.vault as any).unlockedThemes = [];
    }

    // Unlock themes 1-20 (0 is default)
    for (let i = 1; i <= 20; i++) {
      if (!(this.save.vault as any).unlockedThemes.includes(i)) {
        (this.save.vault as any).unlockedThemes.push(i);
      }
    }
  }

  private getLunchboxCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 0).length;
  }

  private getMrHandyCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 1).length;
  }

  private getPetCarrierCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 2).length;
  }

  private getStarterPackCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 3).length;
  }

  private updateLunchBoxesByType(type: 'lunchboxes' | 'mrHandies' | 'petCarriers' | 'starterPacks', newCount: number): void {
    if (!this.save) return;
    
    // Get current counts for all types
    const currentLunchboxes = this.getLunchboxCount();
    const currentMrHandies = this.getMrHandyCount();
    const currentPetCarriers = this.getPetCarrierCount();
    const currentStarterPacks = this.getStarterPackCount();
    
    // Update the specific type count
    let lunchboxCount = currentLunchboxes;
    let mrHandyCount = currentMrHandies;
    let petCarrierCount = currentPetCarriers;
    let starterPackCount = currentStarterPacks;
    
    switch (type) {
      case 'lunchboxes':
        lunchboxCount = newCount;
        break;
      case 'mrHandies':
        mrHandyCount = newCount;
        break;
      case 'petCarriers':
        petCarrierCount = newCount;
        break;
      case 'starterPacks':
        starterPackCount = newCount;
        break;
    }
    
    // Rebuild the LunchBoxesByType array
    const newLunchBoxesByType: number[] = [];
    
    // Add lunchboxes (type 0)
    for (let i = 0; i < lunchboxCount; i++) {
      newLunchBoxesByType.push(0);
    }
    
    // Add Mr. Handies (type 1)
    for (let i = 0; i < mrHandyCount; i++) {
      newLunchBoxesByType.push(1);
    }
    
    // Add Pet Carriers (type 2)
    for (let i = 0; i < petCarrierCount; i++) {
      newLunchBoxesByType.push(2);
    }
    
    // Add Starter Packs (type 3)
    for (let i = 0; i < starterPackCount; i++) {
      newLunchBoxesByType.push(3);
    }
    
    // Update the save
    (this.save.vault as any).LunchBoxesByType = newLunchBoxesByType;
  }
}
