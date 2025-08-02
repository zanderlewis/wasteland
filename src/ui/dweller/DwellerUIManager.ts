import type { Dweller } from '../../types/saveFile';

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
    }
    
    if (statusText) {
      statusText.textContent = 'Editing dweller';
      statusText.className = 'text-sm text-green-600';
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
    }
    
    if (statusText) {
      statusText.textContent = 'Select a dweller to edit';
      statusText.className = 'text-sm text-gray-500';
    }
    
    this.selectedDweller = null;
  }

  /**
   * Show a message to the user
   */
  showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      max-width: 300px;
      word-wrap: break-word;
      background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
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
      <div class="dweller-item cursor-pointer" 
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
            ${dweller.pregnant ? '<span class="text-xs bg-pink-800 text-pink-200 px-2 py-1 rounded">Pregnant</span>' : ''}
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
