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

export interface TasksItem {
  startTime: number;
  endTime: number;
  id: number;
  paused: boolean;
  rescheduleToOldest: boolean;
}

export interface TaskMgr {
  id: number;
  time: number;
  tasks: TasksItem[];
  pausedTasks: any[];
}

export interface RatingsItem {
  rating: number;
  time: number;
  collected: boolean;
}

export interface RatingsLastItem {
  rating: number;
  time: number;
  collected: boolean;
}

export interface RatingMgr {
  sampleId: number;
  dayRatingId: number;
  currentSamples: any[];
  ratings: RatingsItem[];
  ratingsLast: RatingsLastItem[];
  hasWeekRating: boolean;
  hasLastWeekRating: boolean;
  weekRating: number;
  lastWeekRating: number;
}

export interface ThemeByRoomType {
  Cafeteria: string;
  LivingQuarters: string;
}

export interface ExtraData {
  partsCollectedCount: number;
  IsCraftingInProgress: boolean;
  IsCrafted: boolean;
  IsClaimed: boolean;
  IsClaimedInCraftingRoom: boolean;
  IsNew: boolean;
}

export interface Cafeteria_Xmas {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface Cafeteria_Halloween {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface Cafeteria_ThanksGiving {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface LivingQuarters_Xmas {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface LivingQuarters_Halloween {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface LivingQuarters_ThanksGiving {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface EventsThemes {
  Cafeteria_Xmas: Cafeteria_Xmas;
  Cafeteria_Halloween: Cafeteria_Halloween;
  Cafeteria_ThanksGiving: Cafeteria_ThanksGiving;
  LivingQuarters_Xmas: LivingQuarters_Xmas;
  LivingQuarters_Halloween: LivingQuarters_Halloween;
  LivingQuarters_ThanksGiving: LivingQuarters_ThanksGiving;
}

export interface SpecialTheme {
  themeByRoomType: ThemeByRoomType;
  eventsThemes: EventsThemes;
  lastOverallTheme: string;
}

export interface ConstructMgr {
  roomDeserializeID: number;
}

export interface CurrentState {
}

export interface RoomsItem {
  emergencyDone: boolean;
  type: string;
  class: string;
  mergeLevel: number;
  row: number;
  col: number;
  power: boolean;
  roomHealth: any;
  mrHandyList: any[];
  rushTask: number;
  level: number;
  dwellers: number[];
  deadDwellers: any[];
  currentStateName: string;
  currentState: CurrentState;
  deserializeID: number;
  assignedDecoration: string;
  roomVisibility: boolean;
  roomOutline: boolean;
  broken: boolean;
}

export interface Resources {
  Nuka: number;
  Food: number;
  Energy: number;
  Water: number;
  StimPack: number;
  RadAway: number;
  Lunchbox: number;
  MrHandy: number;
  PetCarrier: number;
  CraftedOutfit: number;
  CraftedWeapon: number;
  NukaColaQuantum: number;
  CraftedTheme: number;
}

export interface Bonus {
  Nuka: number;
  Food: number;
  Energy: number;
  Water: number;
  StimPack: number;
  RadAway: number;
  Lunchbox: number;
  MrHandy: number;
  PetCarrier: number;
  CraftedOutfit: number;
  CraftedWeapon: number;
  NukaColaQuantum: number;
  CraftedTheme: number;
}

export interface Storage {
  resources: Resources;
  bonus: Bonus;
}

export interface ItemsItem {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface Inventory {
  items: ItemsItem[];
}

export interface EmergencyData {
  active: boolean;
  randomEventTaskId: number;
}

export interface RequirementsItem {
  requirementID: string;
  satisfied: boolean;
  rushCount: number;
}

export interface ObjectivesInProgressItem {
  objectiveID: string;
  requirements: RequirementsItem[];
  completed: boolean;
  incrementLevel: number;
}

export interface Achievements {
  objectivesInProgress: ObjectivesInProgressItem[];
  completed: string[];
}

export interface State {
  name: string;
}

export interface CyclesItem {
  cycleType: string;
  taskId: number;
}

export interface MrHandyCyclesItem {
  cycleType: string;
  taskId: number;
}

export interface Wasteland {
  state: State;
  teams: any[];
  cycles: CyclesItem[];
  mrHandyCycles: MrHandyCyclesItem[];
  questCycles: any[];
  allTimeTeamsCounter: number;
  lastSurpriseQuest: string;
  lastSurprisePopupTime: number;
}

export interface Vault {
  rocks: any[];
  rooms: RoomsItem[];
  storage: Storage;
  inventory: Inventory;
  emergencyData: EmergencyData;
  roomConsumption: any;
  dwellerWaterConsumption: any;
  dwellerFoodConsumption: any;
  lunchboxRandomGenerator: string;
  LunchBoxesByType: number[];
  LunchBoxesCount: number;
  VaultName: string;
  VaultMode: string;
  VaultTheme: number;
  Achievements: Achievements;
  wasteland: Wasteland;
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
  ContextualVaultTecObjectives: boolean;
  ContextualAddFriends: boolean;
  ContextualWasteland: boolean;
  ContextualRadioRoom: boolean;
  ContextualWeaponsAndOutfits: boolean;
  ContextualTrainDweller: boolean;
  ContextualBabies: boolean;
  ContextualDestroyRocks: boolean;
  ContextualStorage: boolean;
  ContextualNoRoomForDwellers: boolean;
  ContextualUnequipedDweller: boolean;
  ContextualBuildAnElevator: boolean;
  ContextualDestroyRockToBuild: boolean;
  ContextualNoBuildZonesAvailableByRock: boolean;
  ContextualDestroyRockToAccessNextFloor: boolean;
  ContextualResourcesAlert: boolean;
  ContextualIncidentOcurs: boolean;
  ContextualLowPowerAlert: boolean;
  ContextualStorageFull: boolean;
  ContextualMergeOrUpgradeRoom: boolean;
  ContextualWastelandMessage: boolean;
  ContextualObjectivesCompleted: boolean;
  ContextualBabiesTutorial: boolean;
  ContextualStimpackMessage: boolean;
  ContextualLunchboxTutorial: boolean;
  ContextualRadwayMessage: boolean;
  ContextualRoomMerge2: boolean;
  ContextualRoomMerge3: boolean;
  ContextualStorage2: boolean;
  ContextualEquippingItemsWeapon: boolean;
  ContextualLuck: boolean;
  ContextualEquppingItemsPet: boolean;
  ContextualCrafting: boolean;
  ContextualDecorations: boolean;
  ContextualRequestJunk: boolean;
  ContextualJunk: boolean;
  ContextualTriggeredBirth: boolean;
  ContextualInventoryFull: boolean;
  ContextualInventoryFullWindow: boolean;
  ContextualJunkGiveAway: boolean;
  ContextualScrapping: boolean;
  ContextualAssignWith3DTouch: boolean;
  ContextualNukaQuantum: boolean;
  ContextualSurpriseQuests: boolean;
  ContextualReturningFromQuests: boolean;
  ContextualRadioRoomToggle: boolean;
  ContextualCraftTheme: boolean;
  ContextualJoystickNavigationInVault: boolean;
  MaleTasksQuant: number;
  FemaleTasksQuant: number;
}

export interface Objective {
  objectiveID: string;
  requirements: RequirementsItem[];
  completed: boolean;
  incrementLevel: number;
}

export interface SlotArrayItem {
  objective: Objective;
  incLevel: number;
  lottery: boolean[];
}

export interface ObjectiveMgr {
  taskID: number;
  canDiscard: boolean;
  nukaQuantumIncrement: number;
  shuffleBags: string[][];
  slotArray: SlotArrayItem[];
}

export interface UnlockableMgr {
  objectivesInProgress: any[];
  completed: any[];
  claimed: string[];
}

export interface ThemeListItem {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData: ExtraData;
}

export interface CollectedThemes {
  themeList: ThemeListItem[];
}

export interface SurvivalW {
  weapons: string[];
  outfits: string[];
  dwellers: string[];
  pets: string[];
  breeds: string[];
  decorations: any[];
  junk: string[];
  recipes: string[];
  claimedRecipes: string[];
  collectedThemes: CollectedThemes;
}

export interface ShopWindow {
  isStarterPackPurchased: boolean;
  hasStarterPackPopupShown: boolean;
}

export interface HappinessManager {
  rooms: number[];
  dwellers: number[];
}

export interface RefugeeSpawner {
  newGameTask: number;
  succeed: number;
  currentPool: string;
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

export interface CollectedRes {
  Nuka: number;
  Food: number;
  Energy: number;
  Water: number;
  StimPack: number;
  RadAway: number;
  Lunchbox: number;
  MrHandy: number;
  PetCarrier: number;
  CraftedOutfit: number;
  CraftedWeapon: number;
  NukaColaQuantum: number;
  CraftedTheme: number;
}

export interface PreviousVResources {
  Nuka: number;
  Food: number;
  Energy: number;
  Water: number;
  StimPack: number;
  RadAway: number;
  Lunchbox: number;
  MrHandy: number;
  PetCarrier: number;
  CraftedOutfit: number;
  CraftedWeapon: number;
  NukaColaQuantum: number;
  CraftedTheme: number;
}

export interface VaultData {
  collectedRes: CollectedRes;
  collectedOutfits: number;
  collectedWeapons: number;
  collectedDecorations: number;
  collectedPets: number;
  raidersKilled: number;
  elevatorRides: number;
  lunchBoxesOpened: number;
  petCarriersOpened: number;
  totalLifetimeDwellers: number;
  babiesBorn: number;
  dwellersRevived: number;
  levelsGained: number;
  specialStatTrained: number;
  takenStimpack: number;
  takenRadaway: number;
  deadDwellers: number;
  evictedDwellers: number;
  soldWeapons: number;
  soldOutfits: number;
  soldDecorations: number;
  soldPets: number;
  scrappedOutfits: number;
  scrappedWeapons: number;
  craftedWeapons: number;
  craftedOutfits: number;
  craftedDecorations: number;
  craftedThemes: number;
  collectedJunk: number;
  soldJunk: number;
  successfulRushes: number;
  failRushes: number;
  firesExtinguised: number;
  emergencyStopRaider: number;
  emergencyStopDeathClaw: number;
  emergencyStopGhoul: number;
  emergencyStopRadroach: number;
  emergencyStopRadscorpion: number;
  emergencyStopMolerat: number;
  dwellersSentWasteland: number;
  wastelandTotalTime: number;
  wastelandCreaturesKilled: number;
  vaultCreatedBeforeUpdate: boolean;
  dwellersCustomized: number;
  measuringSince: number;
  previousVResources: PreviousVResources;
  weaponFactoryBuilt: boolean;
  outfitFactoryBuilt: boolean;
}

export interface StatsWindow {
  vaultData: VaultData;
}

export interface BottleAndCappyMgrSerializeKey {
  SerializeAccumulatedTriggerChance: number;
  SerializeLocked: boolean;
}

export interface StandaloneQuestPicker {
}

export interface CurrentDailiesItem {
  startDate: string;
  endDate: string;
  officialStartDate: string;
  questName: string;
}

export interface HistoryDailiesItem {
  startDate: string;
  endDate: string;
  officialStartDate: string;
  questName: string;
}

export interface DailyQuestPicker {
  currentDailies: CurrentDailiesItem[];
  historyDailies: HistoryDailiesItem[];
}

export interface CurrentWeekliesItem {
  startDate: string;
  endDate: string;
  officialStartDate: string;
  questName: string;
}

export interface HistoryWeekliesItem {
  startDate: string;
  endDate: string;
  officialStartDate: string;
  questName: string;
}

export interface WeeklyQuestPicker {
  currentWeeklies: CurrentWeekliesItem[];
  historyWeeklies: HistoryWeekliesItem[];
}

export interface StandaloneQuestSkipper {
  skippedQuests: any[];
}

export interface DailyQuestSkipper {
  skippedQuests: any[];
}

export interface WeeklyQuestSkipper {
  skippedQuests: any[];
}

export interface CompletedQuestDataManager {
  taskID: number;
  completedQuests: string[];
  foundClues: any[];
  standaloneQuestPicker: StandaloneQuestPicker;
  dailyQuestPicker: DailyQuestPicker;
  weeklyQuestPicker: WeeklyQuestPicker;
  nukaQuantumIncrement: number;
  standaloneQuestSkipper: StandaloneQuestSkipper;
  dailyQuestSkipper: DailyQuestSkipper;
  weeklyQuestSkipper: WeeklyQuestSkipper;
}

export interface QuestConstructionMgr {
  roomDeserializeID: number;
}

export interface RoomListItem {
  emergencyDone: boolean;
  type: string;
  class: string;
  mergeLevel: number;
  row: number;
  col: number;
  power: boolean;
  roomHealth: any;
  mrHandyList: any[];
  rushTask: number;
  level: number;
  dwellers: any[];
  deadDwellers: any[];
  currentStateName: string;
  currentState: CurrentState;
  deserializeID: number;
  assignedDecoration: string;
  roomVisibility: boolean;
  roomOutline: boolean;
  questRoomType: string;
  roomClearOutResult: string;
  roomPickUpResult: string;
  roomName: string;
  enteringLeft: boolean;
  primaryObjective: string;
  secondaryObjective: string;
  thirdObjective: string;
  objectiveTextOverride?: any;
  debugRoomId: string;
  xp: number;
  mainPath: boolean;
}

export interface QuestSetup {
  buildingLenght: number;
  buildingHeight: number;
  buildingUnderground: number;
  seed: number;
  entry: number;
  questConstructionMgr: QuestConstructionMgr;
  roomList: RoomListItem[];
  wasteland: Wasteland;
  entranceId: number;
}

export interface LootsItem {
  LootType: number;
  LootID: string;
  LootQuantity: number;
  FromVaultQuantity: number;
  InitialEquippedQuantity: number;
  CurrentlyEquippedQuantity: number;
}

export interface QuestLootObtained {
  Loots: LootsItem[];
}

export interface Weapon {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
}

export interface Outfit {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
}

export interface InitialEquipmentItem {
  dweller: number;
  weapon: Weapon;
  outfit: Outfit;
}

export interface QuestCurrentPerfomance {
  numberCombatsWon: number;
  numberCriticalHitsPerformed: number;
  numberPerfectCriticalHitsPerformed: number;
  numberContainersCollected: number;
  numberCapsCollected: number;
  numberLevelsGained: number;
  numberLevelsGainedWithBonus: number;
}

export interface QuestTeam {
  CurrentQuestID: string;
  randomIdentifier: number;
  DwellersDictionary: number[];
  QuestLootObtained: QuestLootObtained;
  InitialEquipment: InitialEquipmentItem[];
  initialStimpakCount: number;
  initialRadawayCount: number;
  currentStimpakCount: number;
  currentRadawayCount: number;
  estimatedDwellerReviveCost: number;
  questCurrentPerfomance: QuestCurrentPerfomance;
  questSpentTime: number;
}

export interface QuestDataManager {
  questDone: boolean;
  cancelled: boolean;
  questSucceeded: boolean;
  entranceFlow: boolean;
  questDifficulty: number;
  questTeam: QuestTeam;
  accumulatedRetryCost: number;
  retryCount: number;
  incrementedRetryCount: number;
  vaultCaps: number;
  vaultQuantum: number;
  uniqueID: number;
}

export interface Happiness {
  happinessValue: number;
}

export interface Health {
  healthValue: number;
  radiationValue: number;
  permaDeath: boolean;
  lastLevelUpdated: number;
  maxHealth: number;
}

export interface Experience {
  experienceValue: number;
  currentLevel: number;
  storage: number;
  accum: number;
  needLvUp: boolean;
  wastelandExperience: number;
}

export interface Relations {
  relations: any[];
  partner: number;
  lastPartner: number;
  ascendants: number[];
}

export interface StatsItem {
  value: number;
  mod: number;
  exp: number;
}

export interface Stats {
  stats: StatsItem[];
}

export interface EquipedOutfit {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
}

export interface EquipedWeapon {
  id: string;
  type: string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
}

export interface DwellersItem {
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
  faceMask: string;
  equipedOutfit: EquipedOutfit;
  equipedWeapon: EquipedWeapon;
  savedRoom: number;
  lastChildBorn: number;
  rarity: string;
  deathTime: number;
  dwellerPosition: number[];
  dwellerRoom: number;
  dwellerCriticalMeter: number;
  dwellerCriticalFactor: number;
}

export interface QuestDwellers {
  dwellers: DwellersItem[];
  actors: any[];
  id: number;
  mrhId: number;
  min_happiness: number;
}

export interface QuestDwellerSpawner {
  dwellersWaiting: any[];
}

export interface Task {
  id: number;
  time: number;
  tasks: TasksItem[];
  pausedTasks: any[];
}

export interface Time {
  gameTime: number;
  questTime: number;
  time: number;
  timeSaveDate: number;
  timeGameBegin: number;
}

export interface ViewManager {
  currentRoom: number;
}

export interface maxBaseVault {
  "0": string;
  timeMgr: TimeMgr;
  localNotificationMgr: LocalNotificationMgr;
  taskMgr: TaskMgr;
  ratingMgr: RatingMgr;
  specialTheme: SpecialTheme;
  dwellers: any;
  constructMgr: ConstructMgr;
  vault: Vault;
  dwellerSpawner: any;
  deviceName: string;
  tutorialManager: TutorialManager;
  objectiveMgr: ObjectiveMgr;
  unlockableMgr: UnlockableMgr;
  survivalW: SurvivalW;
  ShopWindow: ShopWindow;
  happinessManager: HappinessManager;
  refugeeSpawner: RefugeeSpawner;
  LunchBoxCollectWindow?: any;
  DeathclawManager: DeathclawManager;
  PromoCodesWindow?: any;
  JunkGiveAwayWindow?: any;
  MysteriousStranger: MysteriousStranger;
  StatsWindow: StatsWindow;
  PromotionFlags: string[];
  appVersion: string;
  BottleAndCappyMgrSerializeKey: BottleAndCappyMgrSerializeKey;
  completedQuestDataManager: CompletedQuestDataManager;
  cameraPosition: number[];
  questSetup: QuestSetup;
  questDataManager: QuestDataManager;
  questDwellers: QuestDwellers;
  questDwellerSpawner: QuestDwellerSpawner;
  task: Task;
  time: Time;
  viewManager: ViewManager;
  versionCount: number;
}

export type FalloutShelterSave = maxBaseVault;
