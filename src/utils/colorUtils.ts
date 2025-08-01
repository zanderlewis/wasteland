// Color conversion utilities for Fallout Shelter save file format

/**
 * Convert hex color to Fallout Shelter color format
 * @param colorhex Hex color string (without #)
 * @returns Number in FOS color format
 */
export function hexToFOSColor(colorhex: string): number {
  const cleanHex = colorhex.replace('#', '');
  const x = "FF" + cleanHex;
  return parseInt(x, 16);
}

/**
 * Convert Fallout Shelter color format to hex
 * @param fosColor FOS color number
 * @returns Hex color string
 */
export function fosColorToHex(fosColor: number): string {
  const hexColor = fosColor.toString(16).substring(2).toUpperCase();
  return hexColor;
}

// Default appearance colors
export const DEFAULT_SKIN_COLORS = {
  LIGHT: '#FFDBAC',
  MEDIUM: '#D2B48C',
  DARK: '#8B4513'
};

export const DEFAULT_HAIR_COLORS = {
  BLONDE: '#FFD700',
  BROWN: '#8B4513',
  BLACK: '#2F2F2F',
  RED: '#B22222',
  GRAY: '#808080',
  WHITE: '#F5F5F5',
  AUBURN: '#A52A2A',
  CHESTNUT: '#954535'
};
