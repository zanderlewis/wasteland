/**
 * Modularized save file types - main export file
 * 
 * This file serves as the main entry point for all save file types.
 * It exports all types from the modular structure while maintaining
 * backward compatibility with existing code.
 * 
 * The types are now organized into domain-specific modules:
 * - saveFileCore: Core save file structure and main interfaces
 * - dwellerTypes: Dweller-related types and interfaces
 * - vaultTypes: Vault, rooms, and storage-related types
 * - gameTypes: Game mechanics, tutorials, and managers
 * - utilityTypes: Utility types and constants
 */

// Export all types from modular structure
export * from './core/saveFileCore';
export * from './core/dwellerTypes';
export * from './core/vaultTypes';
export * from './core/gameTypes';
export * from './core/utilityTypes';

// Explicit re-exports for better IDE support and documentation
export type { 
  FalloutShelterSave,
  TimeMgr,
  LocalNotificationMgr,
  TaskMgr,
  Task,
  RatingMgr,
  SpecialTheme,
  ConstructMgr,
  DwellerSpawner
} from './core/saveFileCore';

export type {
  Dwellers,
  Dweller,
  Actor,
  Relations,
  Experience,
  Health,
  Happiness,
  Stats,
  Stat,
  EquippedItem,
  EquipedItem,
  EquippedPet
} from './core/dwellerTypes';

export type {
  Vault,
  Room,
  RoomHealth,
  Storage,
  Resources,
  Inventory,
  EmergencyData,
  RoomConsumption,
  DwellerConsumption,
  Achievements,
  Wasteland,
  WastelandState
} from './core/vaultTypes';

export type {
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
} from './core/gameTypes';

export type {
  SpecialStatType
} from './core/dwellerTypes';

export type {
  ResourceTypeValue
} from './core/vaultTypes';

export {
  SpecialStat
} from './core/dwellerTypes';

export {
  ResourceType
} from './core/vaultTypes';
