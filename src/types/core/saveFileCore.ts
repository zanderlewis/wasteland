// Core save file structure and main interfaces
import type { Dwellers } from './dwellerTypes';
import type { Vault } from './vaultTypes';
import type { 
  TutorialManager, 
  ObjectiveMgr, 
  UnlockableMgr, 
  SurvivalW, 
  ShopWindow, 
  HappinessManager, 
  RefugeeSpawner, 
  DeathclawManager, 
  MysteriousStranger, 
  StatsWindow, 
  BottleAndCappyMgrSerializeKey, 
  CompletedQuestDataManager 
} from './gameTypes';

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

// Re-export all types
export * from './dwellerTypes';
export * from './vaultTypes';
export * from './gameTypes';
export * from './utilityTypes';
