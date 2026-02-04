import { WEAPON_LIST, OUTFIT_LIST, PET_LIST } from '../../constants/gameConstants';

// Convert an equipment ID into a human-readable label without ever returning undefined - futureproofing.
function getSafeLabel(
  id: string,
  list: Record<string, string | undefined>,
  type: string
): string {
  return list[id] ?? `Unknown ${type} (${id})`;
}

/**
 * Handles equipment selector management for the dweller editor
 */
export class DwellerEquipmentManager {
  /**
   * Load all equipment selectors.
   *
   * Pass the currently equipped IDs so they can be included even if they aren't in the constants.
   */
  loadEquipmentSelectors(
    currentWeaponId?: string,
    currentOutfitId?: string,
    currentPetId?: string
  ): void {
    this.loadWeaponSelector(currentWeaponId);
    this.loadOutfitSelector(currentOutfitId);
    this.loadPetSelector(currentPetId);
  }

  /**
   * Load weapon selector options
   */
  loadWeaponSelector(currentWeaponId?: string): void {
    const weaponSelect = document.getElementById('dwellerWeapon') as HTMLSelectElement;
    if (!weaponSelect) return;

    weaponSelect.innerHTML = '<option value="">No Weapon</option>';

    // Add currently equipped weapon near the top if unknown
    if (currentWeaponId && !(currentWeaponId in WEAPON_LIST)) {
      const option = document.createElement('option');
      option.value = currentWeaponId;
      option.textContent = getSafeLabel(currentWeaponId, WEAPON_LIST, 'weapon');
      weaponSelect.appendChild(option);
    }

    // Add known weapons (sorted by display name)
    Object.entries(WEAPON_LIST)
      .sort((a, b) => String(a[1]).localeCompare(String(b[1])))
      .forEach(([weaponId, weaponName]) => {
        const option = document.createElement('option');
        option.value = weaponId;
        option.textContent = weaponName as string;
        weaponSelect.appendChild(option);
      });

    // Select current weapon
    weaponSelect.value = currentWeaponId ?? '';
  }

  /**
   * Load outfit selector options
   */
  loadOutfitSelector(currentOutfitId?: string): void {
    const outfitSelect = document.getElementById('dwellerOutfit') as HTMLSelectElement;
    if (!outfitSelect) return;

    outfitSelect.innerHTML = '<option value="">No Outfit</option>';

    // Add currently equipped outfit near the top if unknown
    if (currentOutfitId && !(currentOutfitId in OUTFIT_LIST)) {
      const option = document.createElement('option');
      option.value = currentOutfitId;
      option.textContent = getSafeLabel(currentOutfitId, OUTFIT_LIST, 'outfit');
      outfitSelect.appendChild(option);
    }

    // Add known outfits (sorted by display name)
    Object.entries(OUTFIT_LIST)
      .sort((a, b) => String(a[1]).localeCompare(String(b[1])))
      .forEach(([outfitId, outfitName]) => {
        const option = document.createElement('option');
        option.value = outfitId;
        option.textContent = outfitName;
        outfitSelect.appendChild(option);
      });

    // Select current outfit
    outfitSelect.value = currentOutfitId ?? '';
  }

  /**
   * Load pet selector options
   */
  loadPetSelector(currentPetId?: string): void {
    const petSelect = document.getElementById('dwellerPet') as HTMLSelectElement;
    if (!petSelect) return;

    petSelect.innerHTML = '<option value="">No Pet</option>';

    // Add currently equipped pet near the top if unknown
    if (currentPetId && !(currentPetId in PET_LIST)) {
      const option = document.createElement('option');
      option.value = currentPetId;
      option.textContent = getSafeLabel(currentPetId, PET_LIST, 'pet');
      petSelect.appendChild(option);
    }

    // Add known pets (sorted by display name)
    Object.entries(PET_LIST)
      .sort((a, b) => String(a[1]).localeCompare(String(b[1])))
      .forEach(([petId, petName]) => {
        const option = document.createElement('option');
        option.value = petId;
        option.textContent = petName;
        petSelect.appendChild(option);
      });

    // Select current pet
    petSelect.value = currentPetId ?? '';
  }
}
