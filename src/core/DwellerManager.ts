import type { 
  FalloutShelterSave, 
  Dweller, 
  Actor, 
  SpecialStatType 
} from '../types/saveFile';
import { SpecialStat } from '../types/saveFile';
import { 
  GAME_LIMITS, 
  validateValue 
} from '../constants/gameConstants';

/**
 * Dweller-specific operations for the save editor
 */
export class DwellerManager {
  private save: FalloutShelterSave | null = null;

  constructor(save: FalloutShelterSave | null) {
    this.save = save;
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
   * @param petId - Pet ID (string like "militarymacaw_l")
   * @param petType - Pet type string (defaults to "Pet")
   */
  setDwellerPet(dweller: Dweller, petId: string, petType?: string): void {
    // Set both pet and equippedPet properties for compatibility
    if (!dweller.pet) {
      dweller.pet = {};
    }
    if (!dweller.equippedPet) {
      dweller.equippedPet = {};
    }
    
    // Get pet bonus data based on pet ID
    const petBonusData = this.getPetBonusData(petId);
    
    dweller.pet.id = petId;
    dweller.pet.type = petType || "Pet";
    dweller.pet.hasBeenAssigned = true;
    dweller.pet.hasRandonWeaponBeenAssigned = false;
    
    // Set extraData with pet bonus information
    if (petBonusData) {
      dweller.pet.extraData = petBonusData;
    }
    
    dweller.equippedPet.id = petId;
    dweller.equippedPet.type = petType || "Pet";
    dweller.equippedPet.hasBeenAssigned = true;
    dweller.equippedPet.hasRandonWeaponBeenAssigned = false;
    
    // Set extraData for equippedPet as well
    if (petBonusData) {
      dweller.equippedPet.extraData = petBonusData;
    }
  }

  /**
   * Get pet bonus data based on pet ID
   * @param petId - Pet ID (string like "militarymacaw_l")
   * @returns Pet bonus data object
   */
  private getPetBonusData(petId: string): any {
    // Pet bonus mapping based on the comprehensive data provided
    const petBonusMap: { [key: string]: { uniqueName: string; bonus: string; bonusValue: number } } = {
      // Cats
      "abyssinian_r": { uniqueName: "Abyssinian", bonus: "Resistance", bonusValue: 38 },
      "abyssinian_c": { uniqueName: "Abyssinian", bonus: "Resistance", bonusValue: 22 },
      "abyssinian_l": { uniqueName: "Zula", bonus: "Resistance", bonusValue: 48 },
      "american_r": { uniqueName: "American Shorthair", bonus: "WastelandCapsBoost", bonusValue: 25.5 },
      "american_c": { uniqueName: "American Shorthair", bonus: "WastelandCapsBoost", bonusValue: 10.5 },
      "american_l": { uniqueName: "Sterling", bonus: "WastelandCapsBoost", bonusValue: 40.5 },
      "bombay_c": { uniqueName: "Bombay", bonus: "AddMaxHP", bonusValue: 29 },
      "bombay_r": { uniqueName: "Bombay", bonus: "AddMaxHP", bonusValue: 62 },
      "bombay_l": { uniqueName: "Shadow", bonus: "AddMaxHP", bonusValue: 95.5 },
      "british_c": { uniqueName: "British Shorthair", bonus: "HealingBoost", bonusValue: 2 },
      "british_r": { uniqueName: "British Shorthair", bonus: "HealingBoost", bonusValue: 3 },
      "british_l": { uniqueName: "Ashes", bonus: "HealingBoost", bonusValue: 4 },
      "burmilla_r": { uniqueName: "Burmilla", bonus: "CheaperCrafting", bonusValue: 8 },
      "burmilla_l2": { uniqueName: "Cloudy", bonus: "CheaperCrafting", bonusValue: 17 },
      "burmilla_l": { uniqueName: "Diamond", bonus: "CheaperCrafting", bonusValue: 28 },
      "havanabrown_r2": { uniqueName: "Havana Brown", bonus: "FasterCrafting", bonusValue: 10.5 },
      "havanabrown_r": { uniqueName: "Havana Brown", bonus: "FasterCrafting", bonusValue: 25.5 },
      "havanabrown_l": { uniqueName: "Merlin", bonus: "FasterCrafting", bonusValue: 40.5 },
      "laperm_l3": { uniqueName: "Luna", bonus: "WastelandJunkBoost", bonusValue: 62 },
      "laperm_l": { uniqueName: "Pouncer", bonus: "WastelandJunkBoost", bonusValue: 95.5 },
      "laperm_l2": { uniqueName: "Static", bonus: "WastelandJunkBoost", bonusValue: 29 },
      "lykoi_r": { uniqueName: "Lykoi", bonus: "DamageBoost", bonusValue: 4 },
      "lykoi_c": { uniqueName: "Lykoi", bonus: "DamageBoost", bonusValue: 2 },
      "lykoi_l": { uniqueName: "Calypso", bonus: "DamageBoost", bonusValue: 6 },
      "mainecoon_c": { uniqueName: "Maine Coon", bonus: "TrainingBoost", bonusValue: 8 },
      "mainecoon_r": { uniqueName: "Maine Coon", bonus: "TrainingBoost", bonusValue: 18 },
      "mainecoon_l": { uniqueName: "Bangor", bonus: "TrainingNonStopBoost", bonusValue: 28 },
      "manx_l2": { uniqueName: "Genius", bonus: "ChildMultiplier", bonusValue: 25 },
      "manx_l": { uniqueName: "Shakespeare", bonus: "ChildMultiplier", bonusValue: 75 },
      "manx_l3": { uniqueName: "Stubbs", bonus: "ChildMultiplier", bonusValue: 50 },
      "ocicat_r": { uniqueName: "Ocicat", bonus: "WastelandItemBoost", bonusValue: 18 },
      "ocicat_c": { uniqueName: "Ocicat", bonus: "WastelandItemBoost", bonusValue: 8 },
      "ocicat_l": { uniqueName: "Speckle", bonus: "WastelandItemBoost", bonusValue: 28 },
      "pallascat_c": { uniqueName: "Pallass Cat", bonus: "WastelandJunkBoost", bonusValue: 29 },
      "pallascat_r": { uniqueName: "Pallass Cat", bonus: "WastelandJunkBoost", bonusValue: 62 },
      "pallascat_l": { uniqueName: "Cinder", bonus: "WastelandJunkBoost", bonusValue: 95.5 },
      "persian_r": { uniqueName: "Persian", bonus: "HappinessBoost", bonusValue: 62 },
      "persian_c": { uniqueName: "Persian", bonus: "HappinessBoost", bonusValue: 29 },
      "persian_l": { uniqueName: "Mr, Pebbles", bonus: "HappinessBoost", bonusValue: 95.5 },
      "persian_l_2": { uniqueName: "Pugsley", bonus: "TrainingNonStopBoost", bonusValue: 28 },
      "scottishfold_r": { uniqueName: "Scottish Fold", bonus: "XPBoost", bonusValue: 25.5 },
      "scottishfold_c": { uniqueName: "Scottish Fold", bonus: "XPBoost", bonusValue: 10.5 },
      "scottishfold_l": { uniqueName: "Ginger", bonus: "XPBoost", bonusValue: 40.5 },
      "siamese_c": { uniqueName: "Siamese", bonus: "RadHealingBoost", bonusValue: 2 },
      "siamese_r": { uniqueName: "Siamese", bonus: "RadHealingBoost", bonusValue: 3 },
      "siamese_l": { uniqueName: "Goblet", bonus: "RadHealingBoost", bonusValue: 4 },
      "somali_r2": { uniqueName: "Somali", bonus: "FasterCrafting", bonusValue: 10.5 },
      "somali_r": { uniqueName: "Somali", bonus: "FasterCrafting", bonusValue: 25.5 },
      "somali_l": { uniqueName: "Saffron", bonus: "FasterCrafting", bonusValue: 40.5 },
      "sphynx_c": { uniqueName: "Sphynx", bonus: "FasterWastelandReturnSpeed", bonusValue: 1.25 },
      "sphynx_r": { uniqueName: "Sphynx", bonus: "FasterWastelandReturnSpeed", bonusValue: 2 },
      "sphynx_l": { uniqueName: "Bastet", bonus: "FasterWastelandReturnSpeed", bonusValue: 4 },
      "toyger_r": { uniqueName: "Toyger", bonus: "MysteriousMagnet", bonusValue: 5 },
      "toyger_c": { uniqueName: "Toyger", bonus: "MysteriousMagnet", bonusValue: 2.5 },
      "toyger_l": { uniqueName: "Kato", bonus: "MysteriousMagnet", bonusValue: 7.5 },
      "turkishvan_r": { uniqueName: "Turkish Van", bonus: "ChildSpecialBoost", bonusValue: 1 },
      "turkishvan_l2": { uniqueName: "Pumpkin", bonus: "ChildSpecialBoost", bonusValue: 2 },
      "turkishvan_l": { uniqueName: "Duchess", bonus: "ChildSpecialBoost", bonusValue: 3 },

      // Dogs
      "akita_r": { uniqueName: "Akita", bonus: "MysteriousMagnet", bonusValue: 2.5 },
      "akita_l2": { uniqueName: "Kabosu", bonus: "MysteriousMagnet", bonusValue: 5 },
      "akita_l": { uniqueName: "Kuma", bonus: "MysteriousMagnet", bonusValue: 7.5 },
      "australianshepherd_r2": { uniqueName: "Australian Shepherd", bonus: "ChildSpecialBoost", bonusValue: 1 },
      "australianshepherd_r": { uniqueName: "Australian Shepherd", bonus: "ChildSpecialBoost", bonusValue: 2 },
      "australianshepherd_l": { uniqueName: "Bandit", bonus: "ChildSpecialBoost", bonusValue: 3 },
      "blacklab_r": { uniqueName: "Black Lab", bonus: "TrainingBoost", bonusValue: 18 },
      "blacklab_c": { uniqueName: "Black Lab", bonus: "TrainingBoost", bonusValue: 8 },
      "blacklab_l": { uniqueName: "Muttface", bonus: "TrainingNonStopBoost", bonusValue: 28 },
      "bloodhound_l": { uniqueName: "Duke", bonus: "WastelandJunkBoost", bonusValue: 95.5 },
      "bloodhound_l3": { uniqueName: "Moose", bonus: "WastelandJunkBoost", bonusValue: 62 },
      "bloodhound_l2": { uniqueName: "Valentine", bonus: "WastelandJunkBoost", bonusValue: 29 },
      "boxer_c": { uniqueName: "Boxer", bonus: "XPBoost", bonusValue: 10.5 },
      "boxer_r": { uniqueName: "Boxer", bonus: "XPBoost", bonusValue: 25.5 },
      "boxer_l": { uniqueName: "Scavver", bonus: "XPBoost", bonusValue: 40.5 },
      "brittany_c": { uniqueName: "Brittany", bonus: "FasterAndCheaperCrafting", bonusValue: 8 },
      "brittany_r": { uniqueName: "Brittany", bonus: "FasterAndCheaperCrafting", bonusValue: 18 },
      "brittany_l": { uniqueName: "Gaston", bonus: "FasterAndCheaperCrafting", bonusValue: 28 },
      "cattledog_c": { uniqueName: "Cattle Dog", bonus: "WastelandCapsBoost", bonusValue: 10.5 },
      "cattledog_r": { uniqueName: "Cattle Dog", bonus: "WastelandCapsBoost", bonusValue: 25.5 },
      "cattledog_l": { uniqueName: "Four Score", bonus: "WastelandCapsBoost", bonusValue: 40.5 },
      "collie_r": { uniqueName: "Collie", bonus: "CheaperCrafting", bonusValue: 18 },
      "collie_c": { uniqueName: "Collie", bonus: "CheaperCrafting", bonusValue: 8 },
      "collie_l": { uniqueName: "Pal", bonus: "CheaperCrafting", bonusValue: 28 },
      "dalmatian_r": { uniqueName: "Dalmatian", bonus: "ChildMultiplier", bonusValue: 25 },
      "dalmatian_l2": { uniqueName: "Lucky", bonus: "ChildMultiplier", bonusValue: 50 },
      "dalmatian_l": { uniqueName: "Pongo", bonus: "ChildMultiplier", bonusValue: 75 },
      "doberman_c": { uniqueName: "Doberman", bonus: "HealingBoost", bonusValue: 2 },
      "doberman_r": { uniqueName: "Doberman", bonus: "HealingBoost", bonusValue: 3 },
      "doberman_l": { uniqueName: "Apolda", bonus: "HealingBoost", bonusValue: 4 },
      "englishmastiff_r2": { uniqueName: "English Mastiff", bonus: "CheaperCrafting", bonusValue: 8 },
      "englishmastiff_r": { uniqueName: "English Mastiff", bonus: "CheaperCrafting", bonusValue: 18 },
      "englishmastiff_l": { uniqueName: "Goliath", bonus: "CheaperCrafting", bonusValue: 28 },
      "germanpointer_r": { uniqueName: "German Pointer", bonus: "RadHealingBoost", bonusValue: 3 },
      "germanpointer_c": { uniqueName: "German Pointer", bonus: "RadHealingBoost", bonusValue: 2 },
      "germanpointer_l2": { uniqueName: "Cocoa Bean", bonus: "FasterWastelandReturnSpeed", bonusValue: 4 },
      "germanpointer_l": { uniqueName: "Mr, Peepers", bonus: "RadHealingBoost", bonusValue: 4 },
      "germanshepherd_r": { uniqueName: "German Shepherd", bonus: "ObjectiveMultiplier", bonusValue: 2 },
      "germanshepherd_l": { uniqueName: "Dogmeat", bonus: "ObjectiveMultiplier", bonusValue: 3 },
      "goldenret_c": { uniqueName: "Golden Retriever", bonus: "WastelandItemBoost", bonusValue: 8 },
      "goldenret_r": { uniqueName: "Golden Retriever", bonus: "WastelandItemBoost", bonusValue: 18 },
      "goldenret_l": { uniqueName: "Cindy", bonus: "WastelandItemBoost", bonusValue: 28 },
      "greyhound_c": { uniqueName: "Greyhound", bonus: "FasterCrafting", bonusValue: 10.5 },
      "greyhound_r": { uniqueName: "Greyhound", bonus: "FasterCrafting", bonusValue: 25.5 },
      "greyhound_l": { uniqueName: "Little Helper", bonus: "FasterCrafting", bonusValue: 40.5 },
      "husky_r": { uniqueName: "Husky", bonus: "FasterWastelandReturnSpeed", bonusValue: 2 },
      "husky_c": { uniqueName: "Husky", bonus: "FasterWastelandReturnSpeed", bonusValue: 1.25 },
      "husky_l": { uniqueName: "Trench", bonus: "FasterWastelandReturnSpeed", bonusValue: 4 },
      "pitbullterrier_l": { uniqueName: "Hulk", bonus: "DamageBoost", bonusValue: 6 },
      "pitbullterrier_l2": { uniqueName: "Ranger", bonus: "DamageBoost", bonusValue: 2 },
      "pitbullterrier_l3": { uniqueName: "Titan", bonus: "DamageBoost", bonusValue: 4 },
      "poodle_r": { uniqueName: "Poodle", bonus: "HappinessBoost", bonusValue: 62 },
      "poodle_c": { uniqueName: "Poodle", bonus: "HappinessBoost", bonusValue: 29 },
      "poodle_l": { uniqueName: "Lord Puffington", bonus: "HappinessBoost", bonusValue: 95.5 },
      "rottweiler_r": { uniqueName: "Rottweiler", bonus: "AddMaxHP", bonusValue: 62 },
      "rottweiler_c": { uniqueName: "Rottweiler", bonus: "AddMaxHP", bonusValue: 29 },
      "rottweiler_l": { uniqueName: "Maizie Rai", bonus: "AddMaxHP", bonusValue: 95.5 },
      "stbernard_r": { uniqueName: "St, Bernard", bonus: "WastelandJunkBoost", bonusValue: 62 },
      "stbernard_c": { uniqueName: "St, Bernard", bonus: "WastelandJunkBoost", bonusValue: 29 },
      "stbernard_l": { uniqueName: "Barry", bonus: "WastelandJunkBoost", bonusValue: 95.5 },

      // Parrots/Macaws
      "militarymacaw_l2": { uniqueName: "Butch", bonus: "DamageBoost", bonusValue: 4 },
      "militarymacaw_l": { uniqueName: "Polly", bonus: "DamageBoost", bonusValue: 6 },
      "militarymacaw_r": { uniqueName: "Military Macaw", bonus: "DamageBoost", bonusValue: 2 },
      "blueyellowmacaw_l": { uniqueName: "Pip", bonus: "ObjectiveMultiplier", bonusValue: 3 },
      "blueyellowmacaw_l2": { uniqueName: "Vinnie", bonus: "ObjectiveMultiplier", bonusValue: 2 },
      "scarletmacaw_c": { uniqueName: "Pirate Parrot", bonus: "Resistance", bonusValue: 22 },
      "scarletmacaw_r": { uniqueName: "Pirate Parrot", bonus: "Resistance", bonusValue: 38 },
      "scarletmacaw_l": { uniqueName: "Wanderer", bonus: "Resistance", bonusValue: 48 }
    };

    return petBonusMap[petId] || null;
  }

  /**
   * Remove dweller's pet
   * @param dweller - The dweller to modify
   */
  removeDwellerPet(dweller: Dweller): void {
    dweller.pet = undefined;
    dweller.equippedPet = undefined;
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
   * Set dweller radiation
   * @param dweller - The dweller to modify
   * @param radiation - Radiation value (0-100)
   */
  setDwellerRadiation(dweller: Dweller, radiation: number): void {
    if (!dweller.health) {
      dweller.health = { healthValue: 100, maxHealth: 100, radiationValue: 0 };
    }
    dweller.health.radiationValue = validateValue.radiation(radiation);
  }

  /**
   * Remove radiation from all dwellers
   */
  removeAllRadiation(): void {
    this.getDwellers().forEach(dweller => {
      this.setDwellerRadiation(dweller, 0);
    });
  }

  /**
   * Set dweller hair color
   * @param dweller - The dweller to modify
   * @param colorValue - Color value (as hex string or number)
   */
  setDwellerHairColor(dweller: Dweller, colorValue: string | number): void {
    if (typeof colorValue === 'string') {
      dweller.hairColor = this.convertColor(colorValue, false) as number;
    } else {
      dweller.hairColor = colorValue;
    }
  }

  /**
   * Set dweller outfit color
   * @param dweller - The dweller to modify
   * @param colorValue - Color value (as hex string or number)
   */
  setDwellerOutfitColor(dweller: Dweller, colorValue: string | number): void {
    if (typeof colorValue === 'string') {
      dweller.outfitColor = this.convertColor(colorValue, false) as number;
    } else {
      dweller.outfitColor = colorValue;
    }
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
  private convertColor(colorValue: string | number, reverse: boolean = false): string | number {
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
