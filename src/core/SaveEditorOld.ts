import type { 
  FalloutShelterSave, 
  Dweller, 
  Actor, 
  SpecialStatType,
  ResourceTypeValue 
} from '../types/saveFile';
import { SpecialStat } from '../types/saveFile';
import { 
  GAME_LIMITS, 
  validateValue, 
  ROOM_UNLOCKS, 
  RECIPE_UNLOCKS 
} from '../constants/gameConstants';

export class SaveEditor {
  private save: FalloutShelterSave | null = null;
  private fileName: string = '';

  /**
   * Load a save file
   * @param saveData - The parsed save file data
   * @param fileName - The original filename
   */
  loadSave(saveData: FalloutShelterSave, fileName: string): void {
    this.save = saveData;
    this.fileName = fileName;
  }

  /**
   * Get the current save data
   */
  getSave(): FalloutShelterSave | null {
    return this.save;
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

  // Vault Operations
  
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
      this.save.vault.storage = { resources: {} };
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
   * Update the LunchBoxesByType array based on the original implementation
   * @param type - The type of item to update
   * @param newCount - The new count for this type
   */
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
    
    // Update the save data
    (this.save.vault as any).LunchBoxesByType = newLunchBoxesByType;
    this.save.vault.LunchBoxesCount = newLunchBoxesByType.length;
  }

  /**
   * Set vault theme
   * @param theme - Theme number (0=Normal, 1=Christmas, 2=Halloween, 3=Thanksgiving)
   */
  setVaultTheme(theme: number): void {
    if (!this.save) throw new Error('No save loaded');
    this.save.vault.VaultTheme = theme;
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

  // Dweller Operations

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

  /**
   * Set dweller's SPECIAL stat
   * @param dweller - The dweller to modify
   * @param statType - The SPECIAL stat type
   * @param value - The value to set (0-10)
   */
  setDwellerSpecial(dweller: Dweller, statType: SpecialStatType, value: number): void {
    if (!dweller.stats) dweller.stats = { stats: new Array(8).fill(null) };
    if (!dweller.stats.stats) dweller.stats.stats = new Array(8).fill(null);
    
    const clampedValue = validateValue.special(value);
    
    // Initialize the stat object if it doesn't exist
    if (!dweller.stats.stats[statType]) {
      dweller.stats.stats[statType] = { value: clampedValue };
    } else {
      // Handle both object format { value: number } and direct number format
      const statData = dweller.stats.stats[statType];
      if (typeof statData === 'object' && statData !== null && 'value' in statData) {
        (statData as any).value = clampedValue;
      } else {
        // Convert to object format
        dweller.stats.stats[statType] = { value: clampedValue };
      }
    }
  }

  /**
   * Get dweller's SPECIAL stat
   * @param dweller - The dweller
   * @param statType - The SPECIAL stat type
   */
  getDwellerSpecial(dweller: Dweller, statType: SpecialStatType): number {
    if (!dweller.stats?.stats?.[statType]) return GAME_LIMITS.SPECIAL_MIN;
    
    const statData = dweller.stats.stats[statType];
    
    // Handle both object format { value: number } and direct number format
    if (typeof statData === 'object' && statData !== null && 'value' in statData) {
      return (statData as any).value || GAME_LIMITS.SPECIAL_MIN;
    }
    
    // Fallback to direct number
    return typeof statData === 'number' ? statData : GAME_LIMITS.SPECIAL_MIN;
  }

  /**
   * Max out all SPECIAL stats for a dweller
   * @param dweller - The dweller to modify
   */
  maxDwellerSpecial(dweller: Dweller): void {
    Object.values(SpecialStat).forEach(stat => {
      if (typeof stat === 'number') {
        this.setDwellerSpecial(dweller, stat, 10);
      }
    });
  }

  /**
   * Max out all SPECIAL stats for all dwellers
   */
  maxAllDwellersSpecial(): void {
    this.getDwellers().forEach(dweller => {
      this.maxDwellerSpecial(dweller);
    });
  }

  /**
   * Set dweller health
   * @param dweller - The dweller to modify
   * @param health - Health value
   * @param maxHealth - Maximum health value (optional)
   */
  setDwellerHealth(dweller: Dweller, health: number, maxHealth?: number): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0 };
    }
    
    dweller.health.healthValue = Math.max(0, health);
    if (maxHealth !== undefined) {
      dweller.health.maxHealth = Math.max(1, maxHealth);
    }
    
    // Ensure health doesn't exceed max health
    if (dweller.health.healthValue > (dweller.health.maxHealth || 100)) {
      dweller.health.healthValue = dweller.health.maxHealth || 100;
    }
  }

  /**
   * Set dweller level and experience
   * @param dweller - The dweller to modify
   * @param level - Level to set (1-50)
   * @param experience - Experience value (optional)
   */
  setDwellerLevel(dweller: Dweller, level: number, experience?: number): void {
    if (!dweller.experience) {
      dweller.experience = { currentLevel: 1, experienceValue: 0 };
    }
    
    const clampedLevel = Math.max(1, Math.min(50, level));
    dweller.experience.currentLevel = clampedLevel;
    
    if (experience !== undefined) {
      dweller.experience.experienceValue = Math.max(0, experience);
    } else {
      // Calculate approximate experience for the level
      dweller.experience.experienceValue = Math.pow(clampedLevel, 2) * 1000;
    }
  }

  /**
   * Set dweller gender
   * @param dweller - The dweller to modify
   * @param gender - Gender (1 = Female, 2 = Male)
   */
  setDwellerGender(dweller: Dweller, gender: number): void {
    dweller.gender = gender === 1 ? 1 : 2; // Default to male if not female
  }

  /**
   * Set dweller pregnancy status
   * @param dweller - The dweller to modify
   * @param isPregnant - Whether the dweller is pregnant
   * @param partner - Partner's serialize ID (optional)
   */
  setDwellerPregnancy(dweller: Dweller, isPregnant: boolean): void {
    dweller.pregnant = isPregnant;
    if (isPregnant) {
      dweller.babyReadyTime = Date.now() + (3600000); // 1 hour from now
    } else {
      dweller.partner = undefined;
      dweller.babyReadyTime = undefined;
    }
  }

  /**
   * Set dweller outfit
   * @param dweller - The dweller to modify
   * @param outfitId - Outfit ID
   * @param outfitType - Outfit type string
   */
  setDwellerOutfit(dweller: Dweller, outfitId: number | string, outfitType?: string): void {
    // Handle both 'outfit' and 'equipedOutfit' properties
    const outfitData = {
      id: String(outfitType || outfitId), // Convert to string for actual save format
      type: "Outfit",
      hasBeenAssigned: true,
      hasRandonWeaponBeenAssigned: false
    };
    
    dweller.outfit = outfitData;
    dweller.equipedOutfit = outfitData;
  }

  /**
   * Set dweller weapon
   * @param dweller - The dweller to modify
   * @param weaponId - Weapon ID
   * @param weaponType - Weapon type string
   */
  setDwellerWeapon(dweller: Dweller, weaponId: number | string, weaponType?: string): void {
    // Handle both 'weapon' and 'equipedWeapon' properties
    const weaponData = {
      id: String(weaponType || weaponId), // Convert to string for actual save format
      type: "Weapon",
      hasBeenAssigned: true,
      hasRandonWeaponBeenAssigned: false
    };
    
    dweller.weapon = weaponData;
    dweller.equipedWeapon = weaponData;
  }

  /**
   * Set dweller pet
   * @param dweller - The dweller to modify
   * @param petId - Pet ID
   * @param petType - Pet type string
   */
  setDwellerPet(dweller: Dweller, petId: number, petType?: string): void {
    if (!dweller.pet) {
      dweller.pet = {};
    }
    dweller.pet.id = petId;
    if (petType) {
      dweller.pet.type = petType;
    }
    dweller.pet.hasBeenAssigned = true;
  }

  /**
   * Remove dweller's pet
   * @param dweller - The dweller to modify
   */
  removeDwellerPet(dweller: Dweller): void {
    dweller.pet = undefined;
  }

  /**
   * Set dweller to super health (999999 HP)
   * @param dweller - The dweller to modify
   */
  setDwellerSuperHealth(dweller: Dweller): void {
    this.setDwellerHealth(dweller, 999999, 999999);
    if (dweller.health) {
      dweller.health.radiationValue = 0;
    }
  }

  /**
   * Set all dwellers to super health
   */
  setAllDwellersSuperHealth(): void {
    this.getDwellers().forEach(dweller => {
      this.setDwellerSuperHealth(dweller);
    });
  }

  /**
   * Heal a dweller completely
   * @param dweller - The dweller to heal
   */
  healDweller(dweller: Dweller): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0 };
    }
    
    const maxHealth = dweller.health.maxHealth || 100;
    dweller.health.healthValue = maxHealth;
    dweller.health.radiationValue = 0;
  }
  /**
   * Set dweller happiness
   * @param dweller - The dweller to modify 
   * @param happiness - Happiness value (0-100)
   */
  setDwellerHappiness(dweller: Dweller, happiness: number): void {
    if (!dweller.happiness) dweller.happiness = {};
    dweller.happiness.happinessValue = validateValue.happiness(happiness);
  }

  /**
   * Max happiness for all dwellers
   */
  maxAllHappiness(): void {
    this.getDwellers().forEach(dweller => {
      this.setDwellerHappiness(dweller, 100);
    });
  }

  /**
   * Heal all dwellers to full health
   */
  healAllDwellers(): void {
    this.getDwellers().forEach(dweller => {
      const maxHealth = dweller.health?.maxHealth || 100;
      this.setDwellerHealth(dweller, maxHealth);
      // Remove radiation
      if (dweller.health) {
        dweller.health.radiationValue = 0;
      }
    });
  }

  /**
   * Revive all dead dwellers
   */
  reviveAllDwellers(): void {
    this.getDwellers().forEach(dweller => {
      if (dweller.health) {
        const maxHealth = dweller.health.maxHealth || 100;
        dweller.health.healthValue = maxHealth;
        dweller.health.radiationValue = 0;
        // Set alive status if it exists
        if ('alive' in dweller) {
          (dweller as any).alive = true;
        }
      }
    });
  }

  /**
   * Remove rocks from vault (clear incidents)
   */
  removeRocks(): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Clear emergency incidents
    if (this.save.vault && 'emergencyData' in this.save.vault) {
      (this.save.vault as any).emergencyData = {};
    }
    
    // Clear room incidents
    if ('rooms' in this.save.vault && Array.isArray((this.save.vault as any).rooms)) {
      (this.save.vault as any).rooms.forEach((room: any) => {
        if (room.emergencyData) {
          room.emergencyData = {};
        }
      });
    }
  }

  /**
   * Accept all waiting dwellers
   */
  acceptWaitingDwellers(): void {
    if (!this.save) throw new Error('No save loaded');
    
    // In Fallout Shelter, waiting dwellers are typically stored in the vault.emergencyData
    // or as separate entries that need to be moved to the main dwellers array
    
    let acceptedCount = 0;
    
    // Check for dwellers waiting at the vault door
    if (this.save.vault && 'emergencyData' in this.save.vault) {
      const emergencyData = (this.save.vault as any).emergencyData;
      
      // Look for waiting dwellers in emergency data
      if (emergencyData && emergencyData.waitingDwellers) {
        const waitingDwellers = emergencyData.waitingDwellers;
        
        // Move waiting dwellers to main dwellers array
        if (Array.isArray(waitingDwellers) && waitingDwellers.length > 0) {
          if (!this.save.dwellers) {
            this.save.dwellers = { dwellers: [] };
          }
          if (!this.save.dwellers.dwellers) {
            this.save.dwellers.dwellers = [];
          }
          
          waitingDwellers.forEach((dweller: any) => {
            // Ensure the dweller has proper structure
            const newDweller: Dweller = {
              name: dweller.name || 'New',
              lastName: dweller.lastName || 'Dweller',
              happiness: dweller.happiness || { happinessValue: 50 },
              health: dweller.health || { healthValue: 100, maxHealth: 100, radiationValue: 0 },
              stats: dweller.stats || { stats: new Array(8).fill(1) },
              ...dweller
            };
            
            this.save!.dwellers!.dwellers!.push(newDweller);
            acceptedCount++;
          });
          
          // Clear the waiting dwellers list
          emergencyData.waitingDwellers = [];
        }
      }
    }
    
    // Also check for any dwellers in a potential 'waitingRoom' or similar structure
    if (this.save.vault && 'waitingRoom' in this.save.vault) {
      const waitingRoom = (this.save.vault as any).waitingRoom;
      
      if (waitingRoom && waitingRoom.dwellers && Array.isArray(waitingRoom.dwellers)) {
        waitingRoom.dwellers.forEach((dweller: any) => {
          if (!this.save!.dwellers) {
            this.save!.dwellers = { dwellers: [] };
          }
          if (!this.save!.dwellers.dwellers) {
            this.save!.dwellers.dwellers = [];
          }
          
          const newDweller: Dweller = {
            name: dweller.name || 'New',
            lastName: dweller.lastName || 'Dweller',
            happiness: dweller.happiness || { happinessValue: 50 },
            health: dweller.health || { healthValue: 100, maxHealth: 100, radiationValue: 0 },
            stats: dweller.stats || { stats: new Array(8).fill(1) },
            ...dweller
          };
          
          this.save!.dwellers!.dwellers!.push(newDweller);
          acceptedCount++;
        });
        
        // Clear the waiting room
        waitingRoom.dwellers = [];
      }
    }
    
    // Check for dwellers in vault door queue (another possible location)
    if (this.save.vault && 'door' in this.save.vault) {
      const door = (this.save.vault as any).door;
      
      if (door && door.queue && Array.isArray(door.queue)) {
        door.queue.forEach((dweller: any) => {
          if (!this.save!.dwellers) {
            this.save!.dwellers = { dwellers: [] };
          }
          if (!this.save!.dwellers.dwellers) {
            this.save!.dwellers.dwellers = [];
          }
          
          const newDweller: Dweller = {
            name: dweller.name || 'New',
            lastName: dweller.lastName || 'Dweller',
            happiness: dweller.happiness || { happinessValue: 50 },
            health: dweller.health || { healthValue: 100, maxHealth: 100, radiationValue: 0 },
            stats: dweller.stats || { stats: new Array(8).fill(1) },
            ...dweller
          };
          
          this.save!.dwellers!.dwellers!.push(newDweller);
          acceptedCount++;
        });
        
        // Clear the door queue
        door.queue = [];
      }
    }
    
    if (acceptedCount === 0) {
      console.log('No waiting dwellers found to accept');
    } else {
      console.log(`Accepted ${acceptedCount} waiting dweller(s)`);
    }
  }

  /**
   * Unlock all themes
   */
  unlockAllThemes(): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Based on the original code, themes are managed through vault properties
    this.save.vault.VaultTheme = this.save.vault.VaultTheme || 0;
    
    // Set unlocked themes if the property exists
    if ('unlockedThemes' in this.save.vault) {
      (this.save.vault as any).unlockedThemes = [0, 1, 2, 3]; // Normal, Xmas, Halloween, ThanksGiving
    }
  }

  /**
   * Unlock all rooms
   */
  unlockAllRooms(): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Add room unlocks to the vault save data
    if ('roomsUnlocked' in this.save.vault) {
      (this.save.vault as any).roomsUnlocked = ROOM_UNLOCKS;
    }
  }

  /**
   * Unlock all recipes (for survival mode)
   */
  unlockAllRecipes(): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Check if survival mode data exists
    if ('survivalW' in this.save && typeof (this.save as any).survivalW === 'object') {
      ((this.save as any).survivalW as any).recipes = RECIPE_UNLOCKS;
    }
  }

  /**
   * Max all resources
   */
  maxAllResources(): void {
    if (!this.save) throw new Error('No save loaded');

    this.setResource('Food', GAME_LIMITS.FOOD_MAX);
    this.setResource('Water', GAME_LIMITS.WATER_MAX);
    this.setResource('Energy', GAME_LIMITS.ENERGY_MAX);
    this.setResource('RadAway', GAME_LIMITS.RADAWAY_MAX);
    this.setResource('StimPack', GAME_LIMITS.STIMPACKS_MAX);
  }

  /**
   * Level all dwellers to max level (50)
   */
  levelAllDwellers(): void {
    if (!this.save) throw new Error('No save loaded');
    
    this.getDwellers().forEach(dweller => {
      if (!dweller.experience) dweller.experience = {};
      dweller.experience.currentLevel = 50;
      dweller.experience.experienceValue = 99999999; // Max experience
    });
  }

  /**
   * Clear radiation from all dwellers
   */
  clearAllRadiation(): void {
    if (!this.save) throw new Error('No save loaded');
    
    this.getDwellers().forEach(dweller => {
      if (dweller.health) {
        dweller.health.radiationValue = 0;
      }
    });
  }

  /**
   * Randomize all dweller names
   */
  randomizeAllNames(): void {
    if (!this.save) throw new Error('No save loaded');
    
    const firstNames = [
      'Alex', 'Blake', 'Casey', 'Drew', 'Ellis', 'Finley', 'Gale', 'Harper',
      'Ivan', 'Jordan', 'Kelly', 'Logan', 'Morgan', 'Nova', 'Ocean', 'Parker',
      'Quinn', 'Riley', 'Sage', 'Taylor', 'Uma', 'Vale', 'Wren', 'Xander',
      'Yuki', 'Zara', 'Atom', 'Boost', 'Cipher', 'Delta', 'Echo', 'Flux'
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
      'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
      'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall',
      'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker',
      'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker'
    ];
    
    this.getDwellers().forEach(dweller => {
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      dweller.name = randomFirstName;
      dweller.lastName = randomLastName;
    });
  }

  /**
   * Clear emergency situations
   */
  clearEmergency(): void {
    if (!this.save) throw new Error('No save loaded');
    
    // Clear vault-wide emergencies
    if (this.save.vault && 'emergencyData' in this.save.vault) {
      (this.save.vault as any).emergencyData = {};
    }
    
    // Clear emergency incidents
    if ('incidents' in this.save.vault) {
      (this.save.vault as any).incidents = [];
    }
    
    // Clear room emergencies
    if ('rooms' in this.save.vault && Array.isArray((this.save.vault as any).rooms)) {
      (this.save.vault as any).rooms.forEach((room: any) => {
        if (room.emergencyData) {
          room.emergencyData = {};
        }
        if (room.incidents) {
          room.incidents = [];
        }
      });
    }
  }

  /**
   * Delete a dweller
   * @param dweller - The dweller to delete
   */
  deleteDweller(dweller: Dweller): void {
    if (!this.save?.dwellers?.dwellers) return;
    
    const index = this.save.dwellers.dwellers.indexOf(dweller);
    if (index > -1) {
      this.save.dwellers.dwellers.splice(index, 1);
    }
  }

  /**
   * Set dweller skin color
   * @param dweller - The dweller to modify
   * @param hexColor - Hex color string (without #)
   */
  setDwellerSkinColor(dweller: Dweller, hexColor: string): void {
    dweller.skinColor = this.convertColor(hexColor) as number;
  }

  /**
   * Set dweller hair color
   * @param dweller - The dweller to modify
   * @param hexColor - Hex color string (without #)
   */
  setDwellerHairColor(dweller: Dweller, hexColor: string): void {
    dweller.hairColor = this.convertColor(hexColor) as number;
  }

  /**
   * Set dweller outfit color
   * @param dweller - The dweller to modify
   * @param hexColor - Hex color string (without #)
   */
  setDwellerOutfitColor(dweller: Dweller, hexColor: string): void {
    dweller.outfitColor = this.convertColor(hexColor) as number;
  }

  /**
   * Get dweller skin color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerSkinColorHex(dweller: Dweller): string {
    if (!dweller.skinColor) return '#FFDBAC'; // Default skin color
    const hex = this.convertColor(dweller.skinColor.toString(), true) as string;
    return '#' + hex;
  }

  /**
   * Get dweller hair color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerHairColorHex(dweller: Dweller): string {
    if (!dweller.hairColor) return '#8B4513'; // Default hair color
    const hex = this.convertColor(dweller.hairColor.toString(), true) as string;
    return '#' + hex;
  }

  /**
   * Get dweller outfit color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerOutfitColorHex(dweller: Dweller): string {
    if (!dweller.outfitColor) return '#FFFFFF'; // Default white
    const hex = this.convertColor(dweller.outfitColor.toString(), true) as string;
    return '#' + hex;
  }

  /**
   * Color conversion utility
   * @param colorValue - Hex color string or number
   * @param reverse - Whether to reverse the conversion (number to hex)
   */
  convertColor(colorValue: string | number, reverse: boolean = false): string | number {
    if (reverse) {
      // Convert from FOS integer to hex color for HTML input
      const colorInt = typeof colorValue === 'string' ? parseInt(colorValue) : colorValue;
      // FOS colors are stored as ARGB, we need RGB
      // Extract RGB components by masking out alpha channel
      const rgb = colorInt & 0xFFFFFF;
      const hex = rgb.toString(16).padStart(6, '0').toUpperCase();
      return hex;
    } else {
      // Convert from hex color to FOS integer
      const cleanHex = colorValue.toString().replace('#', '');
      // Add alpha channel (FF) to make it ARGB format
      const fosColor = 0xFF000000 | parseInt(cleanHex, 16);
      return fosColor;
    }
  }
}
