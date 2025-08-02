// Game management and system types
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
