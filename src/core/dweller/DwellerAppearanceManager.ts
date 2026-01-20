import type { DwellersItem as Dweller } from '../../types/saveFile';

/**
 * Manages dweller appearance (colors, styling)
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
      dweller.hairColor = colorValue;
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
      dweller.outfitColor = colorValue;
    }
  }

  /**
   * Get dweller hair color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerHairColorHex(dweller: Dweller): string {
    if (!dweller.hairColor) return '#8B4513'; // Default hair color
    const hex = this.convertColor(dweller.hairColor.toString(), true) as string;
    return '#' + hex;
  }

  /**
   * Get dweller outfit color as hex
   * @param dweller - The dweller
   * @returns Hex color string with # prefix
   */
  getDwellerOutfitColorHex(dweller: Dweller): string {
    if (!dweller.outfitColor) return '#FFFFFF'; // Default white
    const hex = this.convertColor(dweller.outfitColor.toString(), true) as string;
    return '#' + hex;
  }

  /**
   * Color conversion utility
   * @param colorValue - Hex color string or number
   * @param reverse - Whether to reverse the conversion (number to hex)
   */
  private convertColor(colorValue: string | number, reverse: boolean = false): string | number {
    if (reverse) {
      // Convert from FOS integer to hex color for HTML input
      const colorInt = typeof colorValue === 'string' ? parseInt(colorValue) : colorValue;
      // FOS colors are stored as ARGB, we need RGB
      // Extract RGB components by masking out alpha channel
      const rgb = colorInt & 0xFFFFFF;
      const hex = rgb.toString(16).padStart(6, '0').toUpperCase();
      return hex;
    } else {
      // Convert from hex color to FOS integer
      const cleanHex = colorValue.toString().replace('#', '');
      // Add alpha channel (FF) to make it ARGB format
      const fosColor = 0xFF000000 | parseInt(cleanHex, 16);
      return fosColor;
    }
  }
}
