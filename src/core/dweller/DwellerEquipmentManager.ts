import type { Dweller, EquipedItem } from '../../types/saveFile';
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
    const outfitData: EquipedItem = {
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
    const weaponData: EquipedItem = {
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
    // Set both pet and equippedPet properties for compatibility
    if (!dweller.pet) {
      dweller.pet = {};
    }
    if (!dweller.equippedPet) {
      dweller.equippedPet = {};
    }
    
    // Get pet bonus data based on pet ID
    const petBonusData = this.getPetBonusData(petId);
    
    dweller.pet.id = petId;
    dweller.pet.type = petType || "Pet";
    dweller.pet.hasBeenAssigned = true;
    dweller.pet.hasRandonWeaponBeenAssigned = false;
    
    // Set extraData with pet bonus information
    if (petBonusData) {
      dweller.pet.extraData = petBonusData;
    }
    
    dweller.equippedPet.id = petId;
    dweller.equippedPet.type = petType || "Pet";
    dweller.equippedPet.hasBeenAssigned = true;
    dweller.equippedPet.hasRandonWeaponBeenAssigned = false;
    
    // Set extraData for equippedPet as well
    if (petBonusData) {
      dweller.equippedPet.extraData = petBonusData;
    }
  }

  /**
   * Remove dweller's pet
   * @param dweller - The dweller to modify
   */
  removeDwellerPet(dweller: Dweller): void {
    dweller.pet = undefined;
    dweller.equippedPet = undefined;
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
