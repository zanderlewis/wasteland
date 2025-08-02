// Fallout Shelter Save File Types

export interface FalloutShelterSave {
  timeMgr: TimeMgr;
  localNotificationMgr: LocalNotificationMgr;
  taskMgr: TaskMgr;
  ratingMgr: RatingMgr;
  specialTheme: SpecialTheme;
  dwellers: Dwellers;
  constructMgr: ConstructMgr;
  vault: Vault;
  dwellerSpawner: DwellerSpawner;
  deviceName: string;
  tutorialManager: TutorialManager;
  objectiveMgr: ObjectiveMgr;
  unlockableMgr: UnlockableMgr;
  survivalW: SurvivalW;
  ShopWindow: ShopWindow;
  happinessManager: HappinessManager;
  refugeeSpawner: RefugeeSpawner;
  LunchBoxCollectWindow: any;
  DeathclawManager: DeathclawManager;
  PromoCodesWindow: any;
  JunkGiveAwayWindow: any;
  MysteriousStranger: MysteriousStranger;
  StatsWindow: StatsWindow;
  PromotionFlags: string[];
  appVersion: string;
  BottleAndCappyMgrSerializeKey: BottleAndCappyMgrSerializeKey;
  completedQuestDataManager: CompletedQuestDataManager;
  versionCount: number;
}

export interface TimeMgr {
  gameTime: number;
  questTime: number;
  time: number;
  timeSaveDate: number;
  timeGameBegin: number;
}

export interface LocalNotificationMgr {
  UniqueIDS: any[];
}

export interface TaskMgr {
  id: number;
  time: number;
  tasks: Task[];
  pausedTasks: any[];
}

export interface Task {
  startTime: number;
  endTime: number;
  id: number;
  paused: boolean;
  rescheduleToOldest: boolean;
}

export interface RatingMgr {
  sampleId: number;
  dayRatingId: number;
  currentSamples: any[];
  ratings: any[];
  ratingsLast: any[];
  hasWeekRating: boolean;
  hasLastWeekRating: boolean;
  weekRating: number;
  lastWeekRating: number;
}

export interface SpecialTheme {
  themeByRoomType: any;
  eventsThemes: any;
  lastOverallTheme: string;
}

export interface ConstructMgr {
  roomDeserializeID: number;
}

export interface DwellerSpawner {
  dwellersWaiting: any[];
}

export interface TutorialManager {
  phase: string;
  taskNumber: number;
  objectivesTutorialMessage: boolean;
  lunchboxTutorialMessage: boolean;
  showingObjectiveTutorialMessage: boolean;
  showingLunchboxTutorialMessage: boolean;
  showWastelandMessageTime: number;
  showExploreWastelandMessageTime: number;
  exploreWastelandMessageShown: boolean;
  skippedTutorial: number;
  questTutorialCompleted: number;
  intialTimerTasks: any[];
  MaleTasksQuant: number;
  FemaleTasksQuant: number;
  [key: string]: any;
}

export interface ObjectiveMgr {
  taskID: number;
  canDiscard: boolean;
  nukaQuantumIncrement: number;
  shuffleBags: any[];
  slotArray: any[];
}

export interface UnlockableMgr {
  objectivesInProgress: any[];
  completed: any[];
  claimed: string[];
}

export interface SurvivalW {
  weapons: string[];
  outfits: string[];
  dwellers: string[];
  pets: string[];
  breeds: string[];
  decorations: any[];
  junk: any[];
  recipes: string[];
  claimedRecipes: any[];
  collectedThemes: any;
}

export interface ShopWindow {
  isStarterPackPurchased: boolean;
  hasStarterPackPopupShown: boolean;
}

export interface HappinessManager {
  dweller1: any[];
  dweller2: any[];
  dweller3: any[];
  dweller6: any[];
  dweller7: any[];
  dwellers: number[];
}

export interface RefugeeSpawner {
  newGameTask: number;
  succeed: number;
  currentPool: string;
  currentPoolData: any;
  globalTimerGPTime: number;
  collectedAllRefugees: boolean;
}

export interface DeathclawManager {
  deathclawTotalExtraChance: number;
  canDeathclawEmergencyOccurs: boolean;
  deathclawCooldownID: number;
}

export interface MysteriousStranger {
  currentState: string;
  canAppear: boolean;
  timeToAppear: number;
  remainingTimeToAppear: number;
}

export interface StatsWindow {
  vaultData: any;
}

export interface BottleAndCappyMgrSerializeKey {
  SerializeAccumulatedTriggerChance: number;
  SerializeLocked: boolean;
}

export interface CompletedQuestDataManager {
  taskID: number;
  completedQuests: any[];
  foundClues: any[];
  standaloneQuestPicker: any;
  dailyQuestPicker: any;
  weeklyQuestPicker: any;
  nukaQuantumIncrement: number;
  standaloneQuestSkipper: any;
  dailyQuestSkipper: any;
  weeklyQuestSkipper: any;
}

export interface Vault {
  rocks: any[];
  rooms: Room[];
  storage: Storage;
  inventory: Inventory;
  emergencyData: EmergencyData;
  roomConsumption: RoomConsumption;
  dwellerWaterConsumption: DwellerConsumption;
  dwellerFoodConsumption: DwellerConsumption;
  lunchboxRandomGenerator: string;
  LunchBoxesByType: number[];
  LunchBoxesCount: number;
  VaultName: string;
  VaultMode: string;
  VaultTheme: number;
  Achievements: Achievements;
  wasteland: Wasteland;
  unlockedRooms: string[];
  unlockedRecipes: string[];
  unlockedThemes?: number[];
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
  name: string;
}

export interface Dwellers {
  dwellers: Dweller[];
  actors: Actor[];
  id: number;
  mrhId: number;
  min_happiness: number;
}

export interface Dweller {
  serializeId: number;
  name: string;
  lastName: string;
  happiness: Happiness;
  health: Health;
  experience: Experience;
  relations: Relations;
  gender: number; // 1 = Female, 2 = Male
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
  equipedOutfit?: EquipedItem;
  equipedWeapon?: EquipedItem;
  pet?: EquipedItem;
  equippedPet?: EquipedItem;
  savedRoom: number;
  lastChildBorn: number;
  rarity: string;
  deathTime: number;
}

export interface Happiness {
  happinessValue?: number;
}

export interface Health {
  healthValue?: number;
  maxHealth: number;
  radiationValue?: number;
}

export interface Experience {
  experienceValue?: number;
  currentLevel?: number;
  wastelandExperience?: number;
}

export interface Relations {
  relations?: any[];
  partner?: number;
  lastPartner?: number;
  ascendants?: number[];
}

export interface Stats {
  stats: Stat[];
}

export interface Stat {
  value: number;
}

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
}

// SPECIAL stats
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

// Resource types
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
