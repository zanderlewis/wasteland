// Utility types and general purpose interfaces
export interface BaseEntity {
  id?: string | number;
  serializeId?: number;
  [key: string]: any;
}

export interface TimeBasedEntity extends BaseEntity {
  startTime?: number;
  endTime?: number;
  lastUpdate?: number;
}

export interface NamedEntity extends BaseEntity {
  name: string;
  description?: string;
}

export interface ColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Position {
  x: number;
  y: number;
  row?: number;
  col?: number;
}

export interface GameLimits {
  min: number;
  max: number;
}

// Type guards
export function isValidResource(value: string): value is ResourceTypeValue {
  const validResources = ['Caps', 'Food', 'Water', 'Energy', 'NukaColaQuantum', 'RadAway', 'StimPack'];
  return validResources.includes(value);
}

export function isValidSpecialStat(value: number): value is SpecialStatType {
  const validStats = [1, 2, 3, 4, 5, 6, 7];
  return validStats.includes(value);
}

// Re-import types for convenience
import type { ResourceTypeValue } from './vaultTypes';
import type { SpecialStatType } from './dwellerTypes';
