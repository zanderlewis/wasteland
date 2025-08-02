// Fallout Shelter Game Constants
// These values represent the actual limits and constraints from the game

// --------- NOTES ---------
// The game handles 2,147,483,648 as -2,147,483,648, which is quite literally infinity in-game

export const GAME_LIMITS = {
  // Vault limits
  VAULT_NAME_MAX_LENGTH: 50,
  
  // Currency
  CAPS_MAX: 2147483648,
  NUKA_COLA_MAX: 2147483648,

  // Items
  LUNCHBOXES_MAX: 999,
  MR_HANDIES_MAX: 999,
  PET_CARRIERS_MAX: 999,
  STARTER_PACKS_MAX: 999,
  
  // Resources
  FOOD_MAX: 2147483648,
  WATER_MAX: 2147483648,
  ENERGY_MAX: 2147483648,

  // Health Resources
  RADAWAY_MAX: 2147483648,
  STIMPACKS_MAX: 2147483648,
  
  // Dweller stats
  SPECIAL_MIN: 0,
  SPECIAL_MAX: 10,
  HAPPINESS_MIN: 0,
  HAPPINESS_MAX: 100,
  HEALTH_MIN: 0,
  HEALTH_MAX: 100,
  LEVEL_MIN: 1,
  LEVEL_MAX: 50,
  RADIATION_MIN: 0,
  RADIATION_MAX: 100,
  
  // Vault configuration
  VAULT_THEMES: {
    NORMAL: 0,
    CHRISTMAS: 1,
    HALLOWEEN: 2,
    THANKSGIVING: 3
  } as const,
  
  VAULT_MODES: {
    NORMAL: 'Normal',
    SURVIVAL: 'Survival'
  } as const
} as const;

// SPECIAL stat names for UI display
export const SPECIAL_STAT_NAMES = [
  'Unknown',
  'Strength',     // S
  'Perception',   // P
  'Endurance',    // E
  'Charisma',     // C
  'Intelligence', // I
  'Agility',      // A
  'Luck'          // L
] as const;

// Short SPECIAL stat names for compact display
export const SPECIAL_STAT_SHORT_NAMES = [
  'Unknown',
  'S',  // Strength
  'P',  // Perception
  'E',  // Endurance
  'C',  // Charisma
  'I',  // Intelligence
  'A',  // Agility
  'L'   // Luck
] as const;

// Resource types with their display names
export const RESOURCE_TYPES = {
  CAPS: { key: 'Caps', display: 'Caps', max: GAME_LIMITS.CAPS_MAX },
  FOOD: { key: 'Food', display: 'Food', max: GAME_LIMITS.FOOD_MAX },
  WATER: { key: 'Water', display: 'Water', max: GAME_LIMITS.WATER_MAX },
  ENERGY: { key: 'Energy', display: 'Energy', max: GAME_LIMITS.ENERGY_MAX },
  RADAWAY: { key: 'RadAway', display: 'RadAway', max: GAME_LIMITS.RADAWAY_MAX },
  STIMPACK: { key: 'StimPack', display: 'Stimpacks', max: GAME_LIMITS.STIMPACKS_MAX },
  NUKA_COLA: { key: 'NukaColaQuantum', display: 'Nuka Cola Quantum', max: GAME_LIMITS.NUKA_COLA_MAX }
} as const;

// Validation functions
export const validateValue = {
  special: (value: number): number => Math.max(GAME_LIMITS.SPECIAL_MIN, Math.min(GAME_LIMITS.SPECIAL_MAX, value)),
  happiness: (value: number): number => Math.max(GAME_LIMITS.HAPPINESS_MIN, Math.min(GAME_LIMITS.HAPPINESS_MAX, value)),
  health: (value: number): number => Math.max(GAME_LIMITS.HEALTH_MIN, Math.min(GAME_LIMITS.HEALTH_MAX, value)),
  level: (value: number): number => Math.max(GAME_LIMITS.LEVEL_MIN, Math.min(GAME_LIMITS.LEVEL_MAX, value)),
  radiation: (value: number): number => Math.max(GAME_LIMITS.RADIATION_MIN, Math.min(GAME_LIMITS.RADIATION_MAX, value)),
  caps: (value: number): number => Math.max(0, Math.min(GAME_LIMITS.CAPS_MAX, value)),
  resource: (value: number, max: number): number => Math.max(0, Math.min(max, value)),
  lunchboxes: (value: number): number => Math.max(0, Math.min(GAME_LIMITS.LUNCHBOXES_MAX, value)),
  mrHandies: (value: number): number => Math.max(0, Math.min(GAME_LIMITS.MR_HANDIES_MAX, value)),
  petCarriers: (value: number): number => Math.max(0, Math.min(GAME_LIMITS.PET_CARRIERS_MAX, value)),
  starterPacks: (value: number): number => Math.max(0, Math.min(GAME_LIMITS.STARTER_PACKS_MAX, value))
} as const;

// Room unlock list
export { ROOM_UNLOCKS } from "./roomConstants";

// Recipe unlock list
export { RECIPE_UNLOCKS } from "./recipeConstants";

// Weapon Lists
export { WEAPON_LIST } from "./weaponConstants";

// Outfit Lists
export { OUTFIT_LIST } from "./outfitConstants";

// Pet list
export { PET_LIST } from "./petConstants";
