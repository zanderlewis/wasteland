import type { DwellersItem as Dweller, EquipedOutfit, EquipedWeapon } from '../../types/saveFile';
import { petBonusMap } from '../../constants/petConstants';

/**
 * Manages dweller equipment (outfits, weapons, pets)
 */
export class DwellerEquipmentManager {
  /**
   * Set dweller outfit
   * @param dweller - The dweller to modify
   * @param outfitId - Outfit ID
   * @param outfitType - Outfit type string
   */
  setDwellerOutfit(dweller: Dweller, outfitId: number | string, outfitType?: string): void {
    // Handle only 'equipedOutfit' property as per Vault3.json structure
    const outfitData: EquipedOutfit = {
      id: String(outfitType || outfitId), // Convert to string for actual save format
      type: "Outfit",
      hasBeenAssigned: true,
      hasRandonWeaponBeenAssigned: false
    };
    
    dweller.equipedOutfit = outfitData;
  }

  /**
   * Set dweller weapon
   * @param dweller - The dweller to modify
   * @param weaponId - Weapon ID
   * @param weaponType - Weapon type string
   */
  setDwellerWeapon(dweller: Dweller, weaponId: number | string, weaponType?: string): void {
    // Handle only 'equipedWeapon' property as per Vault3.json structure
    const weaponData: EquipedWeapon = {
      id: String(weaponType || weaponId), // Convert to string for actual save format
      type: "Weapon",
      hasBeenAssigned: true,
      hasRandonWeaponBeenAssigned: false
    };
    
    dweller.equipedWeapon = weaponData;
  }

  /**
   * Set dweller pet
   * @param dweller - The dweller to modify
   * @param petId - Pet ID (string like "militarymacaw_l")
   * @param petType - Pet type string (defaults to "Pet")
   */
  setDwellerPet(dweller: Dweller, petId: string, petType?: string): void {
    // Set both pet and equippedPet properties for compatibility (save shape may not include these fields)
    if (!(dweller as any).pet) {
      (dweller as any).pet = {};
    }
    if (!(dweller as any).equippedPet) {
      (dweller as any).equippedPet = {};
    }
    
    // Get pet bonus data based on pet ID
    const petBonusData = this.getPetBonusData(petId);
    
    (dweller as any).pet.id = petId;
    (dweller as any).pet.type = petType || "Pet";
    (dweller as any).pet.hasBeenAssigned = true;
    (dweller as any).pet.hasRandonWeaponBeenAssigned = false;

    // Set extraData with pet bonus information
    if (petBonusData) {
      (dweller as any).pet.extraData = petBonusData;
    }

    (dweller as any).equippedPet.id = petId;
    (dweller as any).equippedPet.type = petType || "Pet";
    (dweller as any).equippedPet.hasBeenAssigned = true;
    (dweller as any).equippedPet.hasRandonWeaponBeenAssigned = false;

    // Set extraData for equippedPet as well
    if (petBonusData) {
      (dweller as any).equippedPet.extraData = petBonusData;
    }
  }

  /**
   * Remove dweller's pet
   * @param dweller - The dweller to modify
   */
  removeDwellerPet(dweller: Dweller): void {
    (dweller as any).pet = undefined;
    (dweller as any).equippedPet = undefined;
  }

  /**
   * Get pet bonus data based on pet ID
   * @param petId - Pet ID (string like "militarymacaw_l")
   * @returns Pet bonus data object
   */
  private getPetBonusData(petId: string): any {
    return petBonusMap[petId] || null;
  }
}
