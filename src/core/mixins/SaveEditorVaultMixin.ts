// Vault-related operations for SaveEditor
// ResourceTypeValue is not exported from generated types; provide local alias
type ResourceTypeValue =
  | 'Caps'
  | 'Nuka'
  | 'Food'
  | 'Energy'
  | 'Water'
  | 'StimPack'
  | 'RadAway'
  | 'Lunchbox'
  | 'MrHandy'
  | 'PetCarrier'
  | 'CraftedOutfit'
  | 'CraftedWeapon'
  | 'NukaColaQuantum'
  | 'CraftedTheme';
import { VaultManager } from '../VaultManager';

/**
 * Mixin for vault-related operations
 */
export class SaveEditorVaultMixin {
  private vaultManager: VaultManager;

  constructor(vaultManager: VaultManager) {
    this.vaultManager = vaultManager;
  }

  /**
   * Set vault name
   * @param name - New vault name
   */
  setVaultName(name: string): void {
    this.vaultManager.setVaultName(name);
  }

  /**
   * Get vault name
   */
  getVaultName(): string {
    return this.vaultManager.getVaultName();
  }

  /**
   * Set resource amount
   * @param resourceType - Type of resource
   * @param amount - Amount to set
   */
  setResource(resourceType: ResourceTypeValue, amount: number): void {
    this.vaultManager.setResource(resourceType, amount);
  }

  /**
   * Get resource amount
   * @param resourceType - Type of resource
   */
  getResource(resourceType: ResourceTypeValue): number {
    return this.vaultManager.getResource(resourceType);
  }

  /**
   * Set lunchbox count
   * @param count - Number of lunchboxes
   */
  setLunchboxCount(count: number): void {
    this.vaultManager.setLunchboxCount(count);
  }

  /**
   * Get lunchbox count
   */
  getLunchboxCount(): number {
    return this.vaultManager.getLunchboxCount();
  }

  /**
   * Set Mr. Handy count
   * @param count - Number of Mr. Handies
   */
  setMrHandyCount(count: number): void {
    this.vaultManager.setMrHandyCount(count);
  }

  /**
   * Get Mr. Handy count
   */
  getMrHandyCount(): number {
    return this.vaultManager.getMrHandyCount();
  }

  /**
   * Set Pet Carrier count
   * @param count - Number of Pet Carriers
   */
  setPetCarrierCount(count: number): void {
    this.vaultManager.setPetCarrierCount(count);
  }

  /**
   * Get Pet Carrier count
   */
  getPetCarrierCount(): number {
    return this.vaultManager.getPetCarrierCount();
  }

  /**
   * Set Starter Pack count
   * @param count - Number of Starter Packs
   */
  setStarterPackCount(count: number): void {
    this.vaultManager.setStarterPackCount(count);
  }

  /**
   * Get Starter Pack count
   */
  getStarterPackCount(): number {
    return this.vaultManager.getStarterPackCount();
  }

  /**
   * Set vault theme
   * @param themeId - Theme ID to set
   */
  setVaultTheme(themeId: number): void {
    this.vaultManager.setVaultTheme(themeId);
  }

  /**
   * Get vault theme
   */
  getVaultTheme(): number {
    return this.vaultManager.getVaultTheme();
  }

  /**
   * Set vault mode
   * @param mode - Vault mode ('Normal' or 'Survival')
   */
  setVaultMode(mode: string): void {
    this.vaultManager.setVaultMode(mode);
  }

  /**
   * Get vault mode
   */
  getVaultMode(): string {
    return this.vaultManager.getVaultMode();
  }

  /**
   * Unlock all vault themes
   */
  unlockAllThemes(): void {
    this.vaultManager.unlockAllThemes();
  }
}
