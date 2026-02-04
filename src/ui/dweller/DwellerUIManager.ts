import type { DwellersItem as Dweller } from '../../types/saveFile';
import { toastManager } from '../toastManager';

/**
 * Handles UI state management for the dweller editor
 */
export class DwellerUIManager {
  private selectedDweller: Dweller | null = null;

  /**
   * Set the currently selected dweller
   */
  setSelectedDweller(dweller: Dweller | null): void {
    this.selectedDweller = dweller;
  }

  /**
   * Get the currently selected dweller
   */
  getSelectedDweller(): Dweller | null {
    return this.selectedDweller;
  }

  /**
   * Enable the dweller editor form
   */
  showDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');
    
    if (fieldset) {
      fieldset.disabled = false;
      // Also ensure all individual elements are enabled
      const formElements = fieldset.querySelectorAll('input, select, button') as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>;
      formElements.forEach(element => {
        element.disabled = false;
      });
    }
    
    if (statusText) {
      statusText.textContent = 'Editing dweller';
      statusText.className = 'text-sm text-green-600';
    }
  }

  /**
   * Show dweller editor in evicted state (read-only except for undo eviction)
   */
  showEvictedDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');
    
    if (statusText) {
      statusText.textContent = 'Dweller is evicted - Only undo eviction is available';
      statusText.className = 'text-sm text-red-600';
    }
    
    // Disable all form inputs except the evict button
    if (fieldset) {
      const formElements = fieldset.querySelectorAll('input, select, button') as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>;
      formElements.forEach(element => {
        if (element.id !== 'evictDweller') {
          element.disabled = true;
        } else {
          element.disabled = false;
        }
      });
    }
  }

  /**
   * Disable the dweller editor form
   */
  closeDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');
    
    if (fieldset) {
      fieldset.disabled = true;
      // Also ensure all individual elements are disabled
      const formElements = fieldset.querySelectorAll('input, select, button') as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>;
      formElements.forEach(element => {
        element.disabled = true;
      });
    }
    
    if (statusText) {
      statusText.textContent = 'Select a dweller to edit';
      statusText.className = 'text-sm text-gray-500';
    }
    
    this.selectedDweller = null;
  }

  /**
   * Show a message to the user using the global toast system
   */
  showMessage(message: string, type: 'success' | 'error' | 'info'): void {
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
   * Update the dweller list display
   */
  updateDwellersList(dwellers: Dweller[]): void {
    const dwellersList = document.getElementById('dwellerList');
    if (!dwellersList) return;

    if (dwellers.length === 0) {
      dwellersList.innerHTML = '<p class="text-gray-500 text-center py-4">No dwellers found</p>';
      return;
    }

    dwellersList.innerHTML = dwellers.map(dweller => `
      <div class="dweller-item cursor-pointer${dweller.WillBeEvicted ? ' border-red-500 bg-red-900' : ''}" 
           data-dweller-id="${dweller.serializeId}">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="dweller-name">${dweller.name} ${dweller.lastName}</h4>
            <p class="dweller-stats">
              Level ${dweller.experience?.currentLevel || 1} • 
              ${dweller.gender === 1 ? 'Female' : 'Male'} • 
              HP: ${dweller.health?.healthValue || 100}/${dweller.health?.maxHealth || 100}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-blue-400">
              Happiness: ${dweller.happiness?.happinessValue || 50}%
            </p>
            <div class="flex flex-wrap gap-1 mt-1">
              ${dweller.pregnant ? '<span class="text-xs bg-pink-800 text-pink-200 px-2 py-1 rounded">Pregnant</span>' : ''}
              ${dweller.WillBeEvicted ? '<span class="text-xs bg-red-800 text-red-200 px-2 py-1 rounded">Evicted</span>' : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Add click handlers
    dwellersList.querySelectorAll('.dweller-item').forEach(item => {
      item.addEventListener('click', () => {
        const dwellerId = parseInt(item.getAttribute('data-dweller-id') || '0');
        const dweller = dwellers.find(d => d.serializeId === dwellerId);
        if (dweller) {
          this.selectDweller(dweller);
        }
      });
    });
  }

  /**
   * Select a dweller for editing
   */
  private selectDweller(dweller: Dweller): void {
    this.selectedDweller = dweller;
    
    // Dispatch custom event
    const event = new CustomEvent('dwellerSelected', { 
      detail: { dweller } 
    });
    document.dispatchEvent(event);
  }
}
