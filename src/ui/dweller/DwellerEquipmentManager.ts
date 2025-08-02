import { WEAPON_LIST, OUTFIT_LIST, PET_LIST } from '../../constants/gameConstants';

/**
 * Handles equipment selector management for the dweller editor
 */
export class DwellerEquipmentManager {
  /**
   * Load all equipment selectors
   */
  loadEquipmentSelectors(): void {
    this.loadWeaponSelector();
    this.loadOutfitSelector();
    this.loadPetSelector();
  }

  /**
   * Load weapon selector options
   */
  loadWeaponSelector(): void {
    const weaponSelect = document.getElementById('dwellerWeapon') as HTMLSelectElement;
    if (!weaponSelect) return;

    weaponSelect.innerHTML = '<option value="">No Weapon</option>';
    
    // WEAPON_LIST is an object, not array
    Object.entries(WEAPON_LIST).forEach(([weaponId, weaponName]) => {
      const option = document.createElement('option');
      option.value = weaponId;
      option.textContent = weaponName as string;
      weaponSelect.appendChild(option);
    });
  }

  /**
   * Load outfit selector options
   */
  private loadOutfitSelector(): void {
    const outfitSelect = document.getElementById('dwellerOutfit') as HTMLSelectElement;
    if (!outfitSelect) return;

    outfitSelect.innerHTML = '<option value="">No Outfit</option>';
    
    // OUTFIT_LIST is an object, not array
    Object.entries(OUTFIT_LIST).forEach(([outfitId, outfitName]) => {
      const option = document.createElement('option');
      option.value = outfitId;
      option.textContent = outfitName;
      outfitSelect.appendChild(option);
    });
  }

  /**
   * Load pet selector options
   */
  private loadPetSelector(): void {
    const petSelect = document.getElementById('dwellerPet') as HTMLSelectElement;
    if (!petSelect) return;

    petSelect.innerHTML = '<option value="">No Pet</option>';
    
    // PET_LIST is an object, not array
    Object.entries(PET_LIST).forEach(([petId, petName]) => {
      const option = document.createElement('option');
      option.value = petId;
      option.textContent = petName;
      petSelect.appendChild(option);
    });
  }
}
