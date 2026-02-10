// Storage-specific UI management
import { SaveEditor } from '../core/SaveEditor';
import { WEAPON_LIST } from '../constants/weaponConstants';
import { OUTFIT_LIST } from '../constants/outfitConstants';
import { PET_LIST } from '../constants/petConstants';
import type { ItemsItem } from '../types/saveFile';
import { toastManager } from './toastManager';

type StorageCategory = 'Weapon' | 'Outfit' | 'Junk' | 'Pet';

export class StorageUI {
  private saveEditor: SaveEditor;
  private activeCategory: StorageCategory = 'Weapon';

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
  }

  bindEvents(): void {
    // Sub-tabs
    const subtabs = document.querySelectorAll('.storage-subtab');
    subtabs.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const type = (el.dataset.type || 'Weapon') as StorageCategory;
        this.setActiveCategory(type);
      });
    });

    // Add button + form
    const addBtn = document.getElementById('storageAddBtn');
    const addForm = document.getElementById('storageAddForm');
    const addSelect = document.getElementById('storageAddSelect') as HTMLSelectElement | null;
    const addQty = document.getElementById('storageAddQty') as HTMLInputElement | null;
    const addConfirm = document.getElementById('storageAddConfirm');
    const addCancel = document.getElementById('storageAddCancel');

    addBtn?.addEventListener('click', () => {
      addForm?.classList.remove('hidden');
      addBtn.classList.add('hidden');
      this.populateAddSelect();
      addSelect?.focus();
    });

    addCancel?.addEventListener('click', () => {
      addForm?.classList.add('hidden');
      addBtn?.classList.remove('hidden');
    });

    addConfirm?.addEventListener('click', () => {
      if (!this.saveEditor.isLoaded()) {
        this.showMessage('No save file loaded!', 'error');
        return;
      }

      const qty = Math.max(1, parseInt(addQty?.value || '1', 10) || 1);
      const selected = addSelect?.value || '';
      if (!selected) {
        this.showMessage('Please choose an item to add', 'info');
        return;
      }

      for (let i = 0; i < qty; i++) {
        this.saveEditor.addStorageItem(this.activeCategory, selected);
      }

      this.showMessage(`Added ${qty} item${qty === 1 ? '' : 's'} to storage`, 'success');
      this.renderList();

      // Hide the form after add
      addForm?.classList.add('hidden');
      addBtn?.classList.remove('hidden');
    });
  }

  loadStorageData(): void {
    this.renderList();
  }

  private setActiveCategory(category: StorageCategory): void {
    this.activeCategory = category;

    // Toggle active state on buttons
    const subtabs = document.querySelectorAll('.storage-subtab');
    subtabs.forEach((btn) => {
      btn.classList.remove('active');
      if ((btn as HTMLElement).dataset.type === category) {
        btn.classList.add('active');
      }
    });

    // Reset add form state
    const addForm = document.getElementById('storageAddForm');
    const addBtn = document.getElementById('storageAddBtn');
    addForm?.classList.add('hidden');
    addBtn?.classList.remove('hidden');

    this.renderList();
  }

  private getDisplayName(item: ItemsItem): string {
    const id = item.id;

    if (this.activeCategory === 'Weapon') {
      return (WEAPON_LIST as any)[id] || id;
    }
    if (this.activeCategory === 'Outfit') {
      return (OUTFIT_LIST as any)[id] || id;
    }
    if (this.activeCategory === 'Pet') {
      return (PET_LIST as any)[id] || id;
    }

    // Junk (no canonical list in this project yet)
    return id;
  }

  private populateAddSelect(): void {
    const select = document.getElementById('storageAddSelect') as HTMLSelectElement | null;
    if (!select) return;

    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '-- select item --';
    select.appendChild(placeholder);

    let entries: Array<[string, string]> = [];
    if (this.activeCategory === 'Weapon') {
      entries = Object.entries(WEAPON_LIST as Record<string, string>);
    } else if (this.activeCategory === 'Outfit') {
      entries = Object.entries(OUTFIT_LIST as Record<string, string>);
    } else if (this.activeCategory === 'Pet') {
      entries = Object.entries(PET_LIST as Record<string, string>);
    } else {
      // Junk: allow manual ID entry by providing a single "Custom" option
      // and prompting the user; keeps UI simple without a dedicated junk constants list.
      const opt = document.createElement('option');
      opt.value = '__CUSTOM__';
      opt.textContent = 'Custom Junk ID...';
      select.appendChild(opt);

      select.addEventListener('change', () => {
        if (select.value === '__CUSTOM__') {
          const id = window.prompt('Enter Junk item ID');
          if (id && id.trim()) {
            const custom = document.createElement('option');
            custom.value = id.trim();
            custom.textContent = id.trim();
            // Insert custom option right after placeholder
            select.insertBefore(custom, select.children[1] || null);
            select.value = custom.value;
          } else {
            select.value = '';
          }
        }
      }, { once: true });

      return;
    }

    // Sort by label for easier scanning
    entries
      .sort((a, b) => (a[1] || a[0]).localeCompare(b[1] || b[0]))
      .forEach(([id, label]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = label;
        select.appendChild(opt);
      });
  }

  private renderList(): void {
    const container = document.getElementById('storageList');
    if (!container) return;

    if (!this.saveEditor.isLoaded()) {
      container.innerHTML = '<div class="p-3 text-green-500/80">Load a save file to view storage.</div>';
      return;
    }

    const items = this.saveEditor.getStorageItems(this.activeCategory);

    if (items.length === 0) {
      container.innerHTML = '<div class="p-3 text-green-500/80">No items in this category.</div>';
      return;
    }

    container.innerHTML = items
      .map((item) => {
        const name = this.escapeHtml(this.getDisplayName(item));
        const id = this.escapeHtml(item.id);
        return `
          <div class="storage-list-row">
            <div class="storage-item-name" title="${name}">${name}</div>
            <div class="storage-item-id" title="${id}">${id}</div>
          </div>
        `;
      })
      .join('');
  }

  private escapeHtml(str: string): string {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    switch (type) {
      case 'success':
        toastManager.showSuccess(message);
        break;
      case 'error':
        toastManager.showError(message);
        break;
      default:
        toastManager.showInfo(message);
        break;
    }
  }
}
