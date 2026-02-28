import type { DwellersItem as Dweller } from '../../types/saveFile';

/**
 * Manages dweller appearance (colors, styling)
 *
 * Fallout Shelter stores colors as 32-bit unsigned integers (0xAARRGGBB) in JSON.
 * JavaScript bitwise ops yield signed 32-bit ints, so we must normalize to unsigned
 * when writing to avoid negative numbers being emitted in exported saves.
 */
export class DwellerAppearanceManager {
  /**
   * Set dweller hair color
   * @param dweller - The dweller to modify
   * @param colorValue - Color value (as hex string or number)
   */
  setDwellerHairColor(dweller: Dweller, colorValue: string | number): void {
    if (typeof colorValue === 'string') {
      dweller.hairColor = this.convertColor(colorValue, false) as number;
    } else {
      dweller.hairColor = this.normalizeUint32(colorValue);
    }
  }

  /**
   * Set dweller skin color
   * @param dweller - The dweller to modify
   * @param colorValue - Color value (as hex string or number)
   */
  setDwellerSkinColor(dweller: Dweller, colorValue: string | number): void {
    if (typeof colorValue === 'string') {
      dweller.skinColor = this.convertColor(colorValue, false) as number;
    } else {
      dweller.skinColor = this.normalizeUint32(colorValue);
    }
  }

  /**
   * Set dweller outfit color
   * @param dweller - The dweller to modify
   * @param colorValue - Color value (as hex string or number)
   */
  setDwellerOutfitColor(dweller: Dweller, colorValue: string | number): void {
    if (typeof colorValue === 'string') {
      dweller.outfitColor = this.convertColor(colorValue, false) as number;
    } else {
      dweller.outfitColor = this.normalizeUint32(colorValue);
    }
  }

  /**
   * Get dweller hair color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerHairColorHex(dweller: Dweller): string {
    if (!dweller.hairColor) return '#8B4513'; // Default hair color
    const hex = this.convertColor(dweller.hairColor, true) as string;
    return '#' + hex;
  }

  /**
   * Get dweller skin color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerSkinColorHex(dweller: Dweller): string {
    if (!dweller.skinColor) return '#FFDBAC'; // Default skin color (UI default)
    const hex = this.convertColor(dweller.skinColor, true) as string;
    return '#' + hex;
  }

  /**
   * Get dweller outfit color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerOutfitColorHex(dweller: Dweller): string {
    if (!dweller.outfitColor) return '#FFFFFF'; // Default white
    const hex = this.convertColor(dweller.outfitColor, true) as string;
    return '#' + hex;
  }

  /**
   * Color conversion utility
   * @param colorValue - Hex color string or number
   * @param reverse - Whether to reverse the conversion (number to hex)
   */
  private convertColor(colorValue: string | number, reverse: boolean = false): string | number {
    if (reverse) {
      // Convert from Fallout Shelter integer to hex color for HTML input.
      // Supports values already stored as unsigned (e.g. 4294967295) or signed (-1).
      const colorInt = typeof colorValue === 'string' ? parseInt(colorValue, 10) : colorValue;
      const normalized = this.normalizeUint32(colorInt);
      const rgb = normalized & 0xFFFFFF;
      return rgb.toString(16).padStart(6, '0').toUpperCase();
    } else {
      // Convert from hex color to Fallout Shelter uint32 (0xFFRRGGBB).
      const cleanHex = colorValue.toString().replace('#', '');
      const rgb = parseInt(cleanHex, 16) & 0xFFFFFF;
      return this.normalizeUint32((0xFF000000 | rgb) as any);
    }
  }

  /**
   * Normalize any JS number into a uint32 in the range 0..4294967295.
   */
  private normalizeUint32(value: number): number {
    // >>> 0 converts the 32-bit pattern to an unsigned JS number.
    return (value >>> 0);
  }
}
