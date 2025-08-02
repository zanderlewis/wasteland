// Vault-related types
export interface Vault {
  VaultName: string;
  LunchBoxesByType: number[];
  rocks: any[];
  rooms: Room[];
  storage: Storage;
  inventory: Inventory;
  emergencyData: EmergencyData;
  roomConsumption: RoomConsumption;
  dwellerWaterConsumption: DwellerConsumption;
  dwellerFoodConsumption: DwellerConsumption;
  lunchboxRandomGenerator: string;
  VaultTheme: number;
  unlockedThemes?: number[];
  wasteland: Wasteland;
  survivalW?: any;
  achievements?: Achievements;
  [key: string]: any;
}

export interface Room {
  emergencyDone: boolean;
  type: string;
  class: string;
  mergeLevel: number;
  row: number;
  col: number;
  power: boolean;
  roomHealth: RoomHealth;
  mrHandyList: any[];
  rushTask: number;
  level: number;
  dwellers: any[];
  deadDwellers: any[];
  currentStateName: string;
  currentState: any;
  deserializeID: number;
  assignedDecoration: string;
  roomVisibility: boolean;
  roomOutline?: boolean;
  broken?: boolean;
  withHole?: boolean;
  ExperienceRewardIsDirty?: boolean;
  partners?: any[];
}

export interface RoomHealth {
  damageValue: number;
  initialValue: number;
}

export interface Storage {
  resources: Resources;
  bonus?: any;
}

export interface Resources {
  CraftedTheme?: number;
  Nuka?: number; // This is Caps in the save file
  NukaColaQuantum?: number;
  Food?: number;
  Energy?: number;
  Water?: number;
  RadAway?: number;
  StimPack?: number;
  [key: string]: number | undefined;
}

export interface Inventory {
  items: any[];
}

export interface EmergencyData {
  active: boolean;
  randomEventTaskId: number;
}

export interface RoomConsumption {
  taskIdOnline: number;
  taskIDShutDown: number;
}

export interface DwellerConsumption {
  taskIdOnline: number;
}

export interface Achievements {
  objectivesInProgress: any[];
  completed: any[];
}

export interface Wasteland {
  state: WastelandState;
  teams: any[];
  cycles: any[];
  mrHandyCycles: any[];
  questCycles: any[];
  allTimeTeamsCounter: number;
  lastSurpriseQuest: string;
  lastSurprisePopupTime: number;
}

export interface WastelandState {
  randomEventTaskId: number;
  globalTimerGPTime: number;
  localTimerOccurr: any;
  randomEvent: string;
  currentProgress: number;
  maxTime: number;
  rewards: any[];
  isQuestAssigned: boolean;
  questRewardType: string;
  maleQuestDuration: number;
  femaleQuestDuration: number;
}

// Resource types constant
export const ResourceType = {
  CAPS: 'Caps',
  NUKACOLAQUANTUM: 'NukaColaQuantum',
  FOOD: 'Food',
  ENERGY: 'Energy',
  WATER: 'Water',
  RADAWAY: 'RadAway',
  STIMPACK: 'StimPack'
} as const;

export type ResourceTypeValue = typeof ResourceType[keyof typeof ResourceType];
