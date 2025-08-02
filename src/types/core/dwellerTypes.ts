// Dweller-related types
export interface Dwellers {
  dwellers: Dweller[];
  actors: Actor[];
}

export interface Dweller {
  serializeId: number;
  name: string;
  lastName: string;
  gender: number;
  lastChildBorn: number;
  pregnant: boolean;
  babyReady: boolean;
  assigned: boolean;
  sawIncident: boolean;
  WillGoToWasteland: boolean;
  WillBeEvicted: boolean;
  IsEvictedWaitingForFollowers: boolean;
  relations: Relations;
  hairColor: number;
  skinColor: number;
  outfitColor: number;
  pendingExperienceReward: number;
  experience: Experience;
  experienceValue: number;
  level: number;
  health: Health;
  happiness: Happiness;
  lastLevelUpTime: number;
  lastLevelUpThreshold: number;
  equippedOutfit: EquippedItem;
  equippedWeapon: EquippedItem;
  equippedPet?: EquippedPet;
  savedRoom: number;
  assignedRoom?: number;
  daysOnWasteland?: number;
  hoursOnWasteland?: number;
  WastelandExploration?: any;
  WastelandInventory?: any;
  raidTime?: number;
  WastelandRandomEncounter?: any;
  stats: Stats;
  hair: string;
  equipedOutfit?: EquippedItem;
  equipedWeapon?: EquippedItem;
  pet?: EquippedItem;
  rarity: string;
  deathTime: number;
  [key: string]: any;
}

export interface Actor {
  serializeId: number;
  name: string;
  lastName: string;
  happiness: Happiness;
  health: Health;
  experience: Experience;
  relations: Relations;
  gender: number;
  stats: Stats;
  pregnant: boolean;
  babyReady: boolean;
  assigned: boolean;
  sawIncident: boolean;
  WillGoToWasteland: boolean;
  WillBeEvicted: boolean;
  IsEvictedWaitingForFollowers: boolean;
  skinColor: number;
  hairColor: number;
  outfitColor: number;
  pendingExperienceReward: number;
  hair: string;
  equipedOutfit: EquipedItem;
  equipedWeapon: EquipedItem;
  savedRoom: number;
  lastChildBorn: number;
  rarity: string;
  deathTime: number;
  [key: string]: any;
}

export interface Relations {
  relations: any[];
  relationsLocked: boolean;
  ascendants: any;
  partner?: number;
  lastPartner?: number;
}

export interface Experience {
  experienceValue: number;
  currentLevel: number;
  storage?: any[];
  accum?: number;
  wastelandExperience: number;
  questExperience?: number;
}

export interface Health {
  healthValue: number;
  maxHealth: number;
  radiationValue: number;
  permaDeath?: boolean;
  lastLevelUpHealAmount?: number;
}

export interface Happiness {
  happinessValue?: number;
}

export interface EquippedItem {
  id?: string;
  type?: string;
  hasBeenAssigned?: boolean;
  hasRandonWeaponBeenAssigned?: boolean;
  extraData?: {
    uniqueName?: string;
    bonus?: string;
    bonusValue?: number;
  };
}

// Legacy interface name for backward compatibility (with typo)
export interface EquipedItem {
  id?: string;
  type?: string;
  hasBeenAssigned?: boolean;
  hasRandonWeaponBeenAssigned?: boolean;
  extraData?: {
    uniqueName?: string;
    bonus?: string;
    bonusValue?: number;
  };
}

export interface EquippedPet {
  id?: string;
  type?: string;
  hasBeenAssigned?: boolean;
  hasRandonWeaponBeenAssigned?: boolean;
  uniqueName?: string;
  bonusValue?: number;
  bonusType?: string;
  extraData?: {
    uniqueName?: string;
    bonus?: string;
    bonusValue?: number;
  };
}

export interface Stats {
  stats: StatValue[];
  [key: string]: any;
}

export interface StatValue {
  value: number;
  mod?: number;
  exp?: number;
}

// Alias for backward compatibility
export interface Stat {
  value: number;
}

// SPECIAL stats constant
export const SpecialStat = {
  STRENGTH: 1,
  PERCEPTION: 2,
  ENDURANCE: 3,
  CHARISMA: 4,
  INTELLIGENCE: 5,
  AGILITY: 6,
  LUCK: 7
} as const;

export type SpecialStatType = typeof SpecialStat[keyof typeof SpecialStat];
