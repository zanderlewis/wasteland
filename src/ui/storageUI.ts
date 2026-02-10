// Storage-specific UI management
import { SaveEditor } from '../core/SaveEditor';
import { WEAPON_LIST } from '../constants/weaponConstants';
import { OUTFIT_LIST } from '../constants/outfitConstants';
import { PET_LIST } from '../constants/petConstants';
import type { ItemsItem } from '../types/saveFile';
import { toastManager } from './toastManager';

type StorageCategory = 'Weapon' | 'Outfit' | 'Junk' | 'Pet';

type AggregatedRow = {
  id: string;
  name: string;
  qty: number;
  attr: string;
};

export class StorageUI {
  private saveEditor: SaveEditor;
  private activeCategory: StorageCategory = 'Weapon';
  private selectedId: string | null = null;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
  }

  bindEvents(): void {
    // Category buttons
    const subtabs = document.querySelectorAll('.storage-subtab');
    subtabs.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const type = (el.dataset.type || 'Weapon') as StorageCategory;
        this.setActiveCategory(type);
      });
    });

    // Edit controls
    const editSelect = document.getElementById('storageEditSelect') as HTMLSelectElement | null;
    const editQty = document.getElementById('storageEditQty') as HTMLInputElement | null;
    const updateBtn = document.getElementById('storageUpdateBtn');
    const newBtn = document.getElementById('storageNewBtn');

    newBtn?.addEventListener('click', () => {
      this.selectedId = null;
      if (editSelect) editSelect.value = '';
      if (editQty) editQty.value = '1';
      editSelect?.focus();
    });

    updateBtn?.addEventListener('click', () => {
      if (!this.saveEditor.isLoaded()) {
        this.showMessage('No save file loaded!', 'error');
        return;
      }

      const id = (editSelect?.value || '').trim();
      const qty = Math.max(0, parseInt(editQty?.value || '0', 10) || 0);
      if (!id) {
        this.showMessage('Please choose an item', 'info');
        return;
      }

      // Junk: allow custom IDs
      if (id === '__CUSTOM__') {
        const custom = window.prompt('Enter Junk item ID');
        if (!custom || !custom.trim()) return;
        this.ensureCustomOption(custom.trim());
        if (editSelect) editSelect.value = custom.trim();
      }

      const applied = this.saveEditor.setStorageItemQuantity(this.activeCategory, id, qty);
      if (!applied) {
        const usage = this.saveEditor.getStorageUsage();
        const cap = this.saveEditor.getStorageCapacity();
        const currentQty = this.saveEditor
          .getStorageItems(this.activeCategory)
          .filter((it) => it.id === id).length;
        const newUsage = usage - currentQty + qty;

        if (newUsage > cap) {
          this.showMessage('Storage capacity exceeded. Action ignored.', 'error');
        } else {
          this.showMessage('No changes applied', 'info');
        }
      } else {
        this.showMessage('Storage updated', 'success');
      }

      this.selectedId = id;
      this.render();
    });

    // Click on rows to load into edit section
    document.getElementById('storageList')?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const row = target.closest('.storage-row') as HTMLElement | null;
      if (!row) return;
      const id = row.dataset.id || '';
      if (!id) return;

      this.selectedId = id;
      if (editSelect) {
        // Ensure option exists (custom ids)
        this.ensureCustomOption(id);
        editSelect.value = id;
      }
      if (editQty) {
        const qtyStr = row.dataset.qty || '0';
        editQty.value = qtyStr;
      }
    });
  }

  loadStorageData(): void {
    // Populate select for the default category
    this.populateEditSelect();
    this.render();
  }

  private setActiveCategory(category: StorageCategory): void {
    this.activeCategory = category;
    this.selectedId = null;

    // Toggle active state on buttons
    const subtabs = document.querySelectorAll('.storage-subtab');
    subtabs.forEach((btn) => {
      btn.classList.remove('active');
      if ((btn as HTMLElement).dataset.type === category) {
        btn.classList.add('active');
      }
    });

    // Reset edit controls
    const editQty = document.getElementById('storageEditQty') as HTMLInputElement | null;
    if (editQty) editQty.value = '1';

    this.populateEditSelect();
    this.render();
  }

  private getDisplayNameById(id: string): string {
    if (this.activeCategory === 'Weapon') {
      return (WEAPON_LIST as any)[id] || id;
    }
    if (this.activeCategory === 'Outfit') {
      return (OUTFIT_LIST as any)[id] || id;
    }
    if (this.activeCategory === 'Pet') {
      return (PET_LIST as any)[id] || id;
    }
    return id;
  }

  private getAttributeText(_item: ItemsItem): string {
    // This project currently only stores ID/type for inventory items.
    // (If future constants include stats, we can display them here.)
    return '—';
  }

  private aggregate(items: ItemsItem[]): AggregatedRow[] {
    const map = new Map<string, { qty: number; sample: ItemsItem }>();
    for (const it of items) {
      const key = it.id;
      const prev = map.get(key);
      if (!prev) {
        map.set(key, { qty: 1, sample: it });
      } else {
        prev.qty += 1;
      }
    }

    const rows: AggregatedRow[] = [];
    for (const [id, v] of map.entries()) {
      rows.push({
        id,
        name: this.getDisplayNameById(id),
        qty: v.qty,
        attr: this.getAttributeText(v.sample),
      });
    }

    // Sort by name for readability
    rows.sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));
    return rows;
  }

  private render(): void {
    const list = document.getElementById('storageList');
    const capText = document.getElementById('storageCapacityText');
    if (!list) return;

    if (!this.saveEditor.isLoaded()) {
      list.innerHTML = '<div class="p-3 text-green-500/80">Load a save file to view storage.</div>';
      if (capText) capText.textContent = '0/0';
      return;
    }

    const usage = this.saveEditor.getStorageUsage();
    const cap = this.saveEditor.getStorageCapacity();
    if (capText) capText.textContent = `${usage}/${cap}`;

    const items = this.saveEditor.getStorageItems(this.activeCategory);
    const rows = this.aggregate(items);

    if (rows.length === 0) {
      list.innerHTML = '<div class="p-3 text-green-500/80">No items in this category.</div>';
      return;
    }

    list.innerHTML = `
      <div class="storage-table">
        <div class="storage-header">
          <div class="storage-cell storage-col-name">Item</div>
          <div class="storage-cell storage-col-qty">Qty</div>
          <div class="storage-cell storage-col-attr">Attributes</div>
          <div class="storage-cell storage-col-id">ID</div>
        </div>
        <div class="storage-body">
          ${rows
            .map((r) => {
              const isSel = this.selectedId === r.id;
              return `
                <div class="storage-row ${isSel ? 'is-selected' : ''}" data-id="${this.escapeHtml(
                  r.id
                )}" data-qty="${r.qty}">
                  <div class="storage-cell storage-col-name" title="${this.escapeHtml(r.name)}">${this.escapeHtml(
                    r.name
                  )}</div>
                  <div class="storage-cell storage-col-qty tabular-nums">${r.qty}</div>
                  <div class="storage-cell storage-col-attr" title="${this.escapeHtml(r.attr)}">${this.escapeHtml(
                    r.attr
                  )}</div>
                  <div class="storage-cell storage-col-id" title="${this.escapeHtml(r.id)}">${this.escapeHtml(
                    r.id
                  )}</div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  private populateEditSelect(): void {
    const select = document.getElementById('storageEditSelect') as HTMLSelectElement | null;
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
      const opt = document.createElement('option');
      opt.value = '__CUSTOM__';
      opt.textContent = 'Custom Junk ID...';
      select.appendChild(opt);
      return;
    }

    entries
      .sort((a, b) => (a[1] || a[0]).localeCompare(b[1] || b[0]))
      .forEach(([id, label]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = label;
        select.appendChild(opt);
      });
  }

  private ensureCustomOption(id: string): void {
    const select = document.getElementById('storageEditSelect') as HTMLSelectElement | null;
    if (!select) return;
    if ([...select.options].some((o) => o.value === id)) return;
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = id;
    // Insert right after placeholder
    select.insertBefore(opt, select.children[1] || null);
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
