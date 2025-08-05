// Vault-specific UI management
import { SaveEditor } from '../core/SaveEditor';
import { toastManager } from './toastManager';

export class VaultUI {
  private saveEditor: SaveEditor;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
  }

  bindEvents(): void {
    // Vault name
    const vaultNameInput = document.getElementById('vaultName') as HTMLInputElement;
    vaultNameInput?.addEventListener('blur', () => {
      if (this.saveEditor.isLoaded()) {
        this.saveEditor.setVaultName(vaultNameInput.value);
        this.showMessage(`Vault name updated to "${vaultNameInput.value}"`, 'success');
      }
    });

    // Resources
    this.bindResourceEvents();

    // Vault settings
    this.bindVaultSettingsEvents();
  }

  private bindResourceEvents(): void {
    const resourceIds = ['caps', 'food', 'water', 'energy', 'radaway', 'stimpacks', 'nuka'];
    
    resourceIds.forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement;
      input?.addEventListener('blur', () => {
        if (this.saveEditor.isLoaded()) {
          const value = parseInt(input.value) || 0;
          this.updateResource(id, value);
          this.showMessage(`${this.getResourceDisplayName(id)} updated to ${value.toLocaleString()}`, 'success');
        }
      });
    });

    // Lunchboxes
    const lunchboxesInput = document.getElementById('lunchboxes') as HTMLInputElement;
    lunchboxesInput?.addEventListener('blur', () => {
      if (this.saveEditor.isLoaded()) {
        const value = parseInt(lunchboxesInput.value) || 0;
        this.saveEditor.setLunchboxCount(value);
        this.showMessage(`Lunchboxes updated to ${value.toLocaleString()}`, 'success');
      }
    });

    // Mr. Handies
    const mrHandiesInput = document.getElementById('mrHandies') as HTMLInputElement;
    mrHandiesInput?.addEventListener('blur', () => {
      if (this.saveEditor.isLoaded()) {
        const value = parseInt(mrHandiesInput.value) || 0;
        this.saveEditor.setMrHandyCount(value);
        this.showMessage(`Mr. Handies updated to ${value.toLocaleString()}`, 'success');
      }
    });

    // Pet Carriers
    const petCarriersInput = document.getElementById('petCarriers') as HTMLInputElement;
    petCarriersInput?.addEventListener('blur', () => {
      if (this.saveEditor.isLoaded()) {
        const value = parseInt(petCarriersInput.value) || 0;
        this.saveEditor.setPetCarrierCount(value);
        this.showMessage(`Pet Carriers updated to ${value.toLocaleString()}`, 'success');
      }
    });

    // Starter Packs
    const starterPacksInput = document.getElementById('starterPacks') as HTMLInputElement;
    starterPacksInput?.addEventListener('blur', () => {
      if (this.saveEditor.isLoaded()) {
        const value = parseInt(starterPacksInput.value) || 0;
        this.saveEditor.setStarterPackCount(value);
        this.showMessage(`Starter Packs updated to ${value.toLocaleString()}`, 'success');
      }
    });
  }

  private bindVaultSettingsEvents(): void {
    // Vault theme
    const vaultThemeSelect = document.getElementById('vaultTheme') as HTMLSelectElement;
    vaultThemeSelect?.addEventListener('change', () => {
      if (this.saveEditor.isLoaded()) {
        const value = parseInt(vaultThemeSelect.value) || 0;
        this.saveEditor.setVaultTheme(value);
        this.showMessage(`Vault theme updated`, 'success');
      }
    });

    // Vault mode
    const vaultModeSelect = document.getElementById('vaultMode') as HTMLSelectElement;
    vaultModeSelect?.addEventListener('change', () => {
      if (this.saveEditor.isLoaded()) {
        this.saveEditor.setVaultMode(vaultModeSelect.value);
        this.showMessage(`Vault mode updated to ${vaultModeSelect.value}`, 'success');
      }
    });
  }

  private updateResource(resourceId: string, value: number): void {
    switch (resourceId) {
      case 'caps':
        this.saveEditor.setResource('Caps', value);
        break;
      case 'food':
        this.saveEditor.setResource('Food', value);
        break;
      case 'water':
        this.saveEditor.setResource('Water', value);
        break;
      case 'energy':
        this.saveEditor.setResource('Energy', value);
        break;
      case 'radaway':
        this.saveEditor.setResource('RadAway', value);
        break;
      case 'stimpacks':
        this.saveEditor.setResource('StimPack', value);
        break;
      case 'nuka':
        this.saveEditor.setResource('NukaColaQuantum', value);
        break;
    }
  }

  loadVaultData(): void {
    if (!this.saveEditor.isLoaded()) return;

    // Load vault name
    const vaultNameInput = document.getElementById('vaultName') as HTMLInputElement;
    if (vaultNameInput) {
      vaultNameInput.value = this.saveEditor.getVaultName();
    }

    // Load resources
    this.loadResourceValues();

    // Load vault settings
    this.loadVaultSettings();
  }

  private loadResourceValues(): void {
    const save = this.saveEditor.getSave();
    if (!save) return;

    // Set resource values
    const capsInput = document.getElementById('caps') as HTMLInputElement;
    if (capsInput) {
      capsInput.value = this.saveEditor.getResource('Caps').toString();
    }

    const foodInput = document.getElementById('food') as HTMLInputElement;
    if (foodInput) {
      foodInput.value = this.saveEditor.getResource('Food').toString();
    }

    const waterInput = document.getElementById('water') as HTMLInputElement;
    if (waterInput) {
      waterInput.value = this.saveEditor.getResource('Water').toString();
    }

    const energyInput = document.getElementById('energy') as HTMLInputElement;
    if (energyInput) {
      energyInput.value = this.saveEditor.getResource('Energy').toString();
    }

    const radawayInput = document.getElementById('radaway') as HTMLInputElement;
    if (radawayInput) {
      radawayInput.value = this.saveEditor.getResource('RadAway').toString();
    }

    const stimpacksInput = document.getElementById('stimpacks') as HTMLInputElement;
    if (stimpacksInput) {
      stimpacksInput.value = this.saveEditor.getResource('StimPack').toString();
    }

    const nukaInput = document.getElementById('nuka') as HTMLInputElement;
    if (nukaInput) {
      nukaInput.value = this.saveEditor.getResource('NukaColaQuantum').toString();
    }

    // Set item counts
    const lunchboxesInput = document.getElementById('lunchboxes') as HTMLInputElement;
    if (lunchboxesInput) {
      lunchboxesInput.value = this.saveEditor.getLunchboxCount().toString();
    }

    const mrHandiesInput = document.getElementById('mrHandies') as HTMLInputElement;
    if (mrHandiesInput) {
      mrHandiesInput.value = this.saveEditor.getMrHandyCount().toString();
    }

    const petCarriersInput = document.getElementById('petCarriers') as HTMLInputElement;
    if (petCarriersInput) {
      petCarriersInput.value = this.saveEditor.getPetCarrierCount().toString();
    }

    const starterPacksInput = document.getElementById('starterPacks') as HTMLInputElement;
    if (starterPacksInput) {
      starterPacksInput.value = this.saveEditor.getStarterPackCount().toString();
    }
  }

  private loadVaultSettings(): void {
    const save = this.saveEditor.getSave();
    if (!save) return;

    // Vault theme
    const vaultThemeSelect = document.getElementById('vaultTheme') as HTMLSelectElement;
    if (vaultThemeSelect) {
      vaultThemeSelect.value = this.saveEditor.getVaultTheme().toString();
    }

    // Vault mode
    const vaultModeSelect = document.getElementById('vaultMode') as HTMLSelectElement;
    if (vaultModeSelect) {
      vaultModeSelect.value = this.saveEditor.getVaultMode();
    }
  }

  /**
   * Show a message to the user using the global toast system
   */
  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    switch (type) {
      case 'success':
        toastManager.showSuccess(message);
        break;
      case 'error':
        toastManager.showError(message);
        break;
      case 'info':
      default:
        toastManager.showInfo(message);
        break;
    }
  }

  /**
   * Get display name for resource
   */
  private getResourceDisplayName(resourceId: string): string {
    const displayNames: { [key: string]: string } = {
      'caps': 'Caps',
      'food': 'Food',
      'water': 'Water', 
      'energy': 'Energy',
      'radaway': 'RadAway',
      'stimpacks': 'Stimpacks',
      'nuka': 'Nuka Cola'
    };
    return displayNames[resourceId] || resourceId;
  }
}
