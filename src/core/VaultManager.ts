import type { 
  FalloutShelterSave, 
  ResourceTypeValue 
} from '../types/saveFile';
import { 
  GAME_LIMITS, 
  validateValue 
} from '../constants/gameConstants';

/**
 * Vault-specific operations for the save editor
 */
export class VaultManager {
  private save: FalloutShelterSave | null = null;

  constructor(save: FalloutShelterSave | null) {
    this.save = save;
  }

  updateSave(save: FalloutShelterSave | null): void {
    this.save = save;
  }

  /**
   * Set vault name
   * @param name - New vault name
   */
  setVaultName(name: string): void {
    if (!this.save) throw new Error('No save loaded');
    this.save.vault.VaultName = name;
  }

  /**
   * Get vault name
   */
  getVaultName(): string {
    if (!this.save) return '';
    return this.save.vault.VaultName || '';
  }

  /**
   * Set resource amount
   * @param resourceType - Type of resource
   * @param amount - Amount to set
   */
  setResource(resourceType: ResourceTypeValue, amount: number): void {
    if (!this.save) throw new Error('No save loaded');
    if (!this.save.vault.storage) {
      this.save.vault.storage = { resources: {}, bonus: {} };
    }
    if (!this.save.vault.storage.resources) {
      this.save.vault.storage.resources = {};
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
    
    (this.save.vault.storage.resources as Record<string, number>)[saveFileResourceName] = validateValue.resource(amount, maxValue);
  }

  /**
   * Get resource amount
   * @param resourceType - Type of resource
   */
  getResource(resourceType: ResourceTypeValue): number {
    if (!this.save?.vault?.storage?.resources) return 0;
    
    // Map our internal resource names to save file names
    const saveFileResourceName = resourceType === 'Caps' ? 'Nuka' : resourceType;

    return (this.save.vault.storage.resources as Record<string, number>)[saveFileResourceName] || 0;
  }

  /**
   * Set lunchbox count using LunchBoxesByType array
   * @param count - Number of lunchboxes
   */
  setLunchboxCount(count: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Initialize LunchBoxesByType if it doesn't exist
    if (!this.save.vault.LunchBoxesByType) {
      (this.save.vault as any).LunchBoxesByType = [];
    }
    
    this.updateLunchBoxesByType('lunchboxes', validateValue.lunchboxes(count));
  }

  /**
   * Get lunchbox count from LunchBoxesByType array
   */
  getLunchboxCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 0).length;
  }

  /**
   * Set Mr. Handy count using LunchBoxesByType array
   * @param count - Number of Mr. Handies
   */
  setMrHandyCount(count: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!this.save.vault.LunchBoxesByType) {
      (this.save.vault as any).LunchBoxesByType = [];
    }
    
    this.updateLunchBoxesByType('mrHandies', validateValue.mrHandies(count));
  }

  /**
   * Get Mr. Handy count from LunchBoxesByType array
   */
  getMrHandyCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 1).length;
  }

  /**
   * Set Pet Carrier count using LunchBoxesByType array
   * @param count - Number of Pet Carriers
   */
  setPetCarrierCount(count: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!this.save.vault.LunchBoxesByType) {
      (this.save.vault as any).LunchBoxesByType = [];
    }
    
    this.updateLunchBoxesByType('petCarriers', validateValue.petCarriers(count));
  }

  /**
   * Get Pet Carrier count from LunchBoxesByType array
   */
  getPetCarrierCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 2).length;
  }

  /**
   * Set Starter Pack count using LunchBoxesByType array
   * @param count - Number of Starter Packs
   */
  setStarterPackCount(count: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!this.save.vault.LunchBoxesByType) {
      (this.save.vault as any).LunchBoxesByType = [];
    }
    
    this.updateLunchBoxesByType('starterPacks', validateValue.starterPacks(count));
  }

  /**
   * Get Starter Pack count from LunchBoxesByType array
   */
  getStarterPackCount(): number {
    if (!this.save?.vault?.LunchBoxesByType) return 0;
    const lunchBoxesByType = (this.save.vault as any).LunchBoxesByType;
    return lunchBoxesByType.filter((type: number) => type === 3).length;
  }

  /**
   * Set vault theme
   * @param themeId - Theme ID to set
   */
  setVaultTheme(themeId: number): void {
    if (!this.save) throw new Error('No save loaded');
    
    const validatedTheme = validateValue.caps(themeId); // Using caps validation as it has similar range
    this.save.vault.VaultTheme = validatedTheme;
  }

  /**
   * Get vault theme
   */
  getVaultTheme(): number {
    return this.save?.vault?.VaultTheme || 0;
  }

  /**
   * Set vault mode
   * @param mode - Vault mode ('Normal' or 'Survival')
   */
  setVaultMode(mode: string): void {
    if (!this.save) throw new Error('No save loaded');
    (this.save.vault as any).VaultMode = mode;
  }

  /**
   * Get vault mode
   */
  getVaultMode(): string {
    return (this.save?.vault as any)?.VaultMode || 'Normal';
  }

  /**
   * Unlock all vault themes
   */
  unlockAllThemes(): void {
    if (!this.save) throw new Error('No save loaded');
    
    if (!this.save.vault.unlockedThemes) {
      this.save.vault.unlockedThemes = [];
    }

    // Unlock themes 1-20 (0 is default)
    for (let i = 1; i <= 20; i++) {
      if (!this.save.vault.unlockedThemes.includes(i)) {
        this.save.vault.unlockedThemes.push(i);
      }
    }
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
