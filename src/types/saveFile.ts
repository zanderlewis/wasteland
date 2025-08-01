// Fallout Shelter Save File Types

import { SPECIAL_STAT_SHORT_NAMES } from '../constants/gameConstants';

export interface FalloutShelterSave {
  vault: Vault;
  dwellers: Dwellers;
  [key: string]: any;
}

export interface Vault {
  VaultName: string;
  LunchBoxesCount?: number;
  MrHandyCount?: number;
  PetCarrierCount?: number;
  StarterPackCount?: number;
  VaultTheme?: number;
  storage?: {
    resources?: {
      Caps?: number;
      NukaColaQuantum?: number;
      Food?: number;
      Energy?: number;
      Water?: number;
      RadAway?: number;
      StimPack?: number;
      Lunchbox?: number;
    };
  };
  [key: string]: any;
}

export interface Dwellers {
  dwellers: Dweller[];
  actors?: Actor[];
}

export interface Dweller {
  serializeId?: number;
  name: string;
  lastName?: string;
  gender?: number; // 1 = Female, 2 = Male
  happiness?: {
    happinessValue?: number;
  };
  health?: {
    healthValue?: number;
    maxHealth?: number;
    radiationValue?: number;
    permaDeath?: boolean;
  };
  stats?: {
    stats?: (number | { value: number } | any)[];
  };
  experience?: {
    experienceValue?: number;
    currentLevel?: number;
    wastelandExperience?: number;
  };
  skinColor?: number;
  hairColor?: number;
  outfitColor?: number;
  outfit?: {
    id?: number | string;
    type?: string;
    hasBeenAssigned?: boolean;
    hasRandonWeaponBeenAssigned?: boolean;
  };
  weapon?: {
    id?: number | string;
    type?: string;
    hasBeenAssigned?: boolean;
    hasRandonWeaponBeenAssigned?: boolean;
  };
  // Alternative names used in actual save files
  equipedOutfit?: {
    id?: string;
    type?: string;
    hasBeenAssigned?: boolean;
    hasRandonWeaponBeenAssigned?: boolean;
  };
  equipedWeapon?: {
    id?: string;
    type?: string;
    hasBeenAssigned?: boolean;
    hasRandonWeaponBeenAssigned?: boolean;
  };
  pet?: {
    id?: number;
    type?: string;
    hasBeenAssigned?: boolean;
  };
  hairType?: number;
  facialHair?: number;
  pregnant?: boolean;
  babyReadyTime?: number;
  lastChildBorn?: number;
  relations?: {
    ascendants?: number[];
    descendants?: number[];
    relations?: any[];
  };
  sawIncident?: boolean;
  WillGoToWasteland?: boolean;
  IsSelectedForWasteland?: boolean;
  WillBeEvicted?: boolean;
  IsEvictedWaitingForFollowers?: boolean;
  savedRoom?: number;
  assignedRoom?: number;
  rarity?: string;
  deathTime?: number;
  [key: string]: any;
}

export interface Actor {
  name: string;
  [key: string]: any;
}

export interface WastelandTeam {
  dweller?: Dweller;
  actor?: Actor;
  equipment?: any[];
  elapsedTimeAliveExploring?: number;
  returnTripDuration?: number;
  [key: string]: any;
}

// SPECIAL stats constants for clarity
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

export const SPECIAL_NAMES = SPECIAL_STAT_SHORT_NAMES;

// Resource types
export const ResourceType = {
  CAPS: 'Caps',
  NUKACOLAQUANTUM: 'NukaColaQuantum',
  FOOD: 'Food',
  ENERGY: 'Energy',
  WATER: 'Water',
  RADAWAY: 'RadAway',
  STIMPACK: 'StimPack',
  LUNCHBOX: 'Lunchbox'
} as const;

export type ResourceTypeValue = typeof ResourceType[keyof typeof ResourceType];
