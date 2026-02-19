// Storage-specific UI management
import { SaveEditor } from '../core/SaveEditor';
import { WEAPON_LIST } from '../constants/weaponConstants';
import { OUTFIT_LIST, OUTFIT_SPECIAL_BONUSES } from '../constants/outfitConstants';
import { PET_LIST } from '../constants/petConstants';
import type { ItemsItem } from '../types/saveFile';
import { toastManager } from './toastManager';

type StorageCategory = 'Weapon' | 'Outfit' | 'Junk' | 'Pet';

type AggregatedRow = {
  id: string;
  name: string;
  qty: number;
  attrs: string;
};

export class StorageUI {
  private saveEditor: SaveEditor;
  private activeCategory: StorageCategory = 'Weapon';
  private selectedId: string | null = null;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
  }

  bindEvents(): void {
    // Sub-tabs in the title bar
    const subtabs = document.querySelectorAll('.storage-subtab');
    subtabs.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const type = (el.dataset.type || 'Weapon') as StorageCategory;
        this.setActiveCategory(type);
      });
    });

    const updateBtn = document.getElementById('storageUpdateBtn');
    const newBtn = document.getElementById('storageNewBtn');

    updateBtn?.addEventListener('click', () => this.handleUpdate());
    newBtn?.addEventListener('click', () => this.clearSelection());
  }

  loadStorageData(): void {
    this.populateEditSelect();
    this.renderList();
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

    this.populateEditSelect();
    this.renderList();
  }

  private clearSelection(): void {
    this.selectedId = null;
    const select = document.getElementById('storageEditSelect') as HTMLSelectElement | null;
    const qty = document.getElementById('storageEditQty') as HTMLInputElement | null;
    if (select) select.value = '';
    if (qty) qty.value = '1';
    this.updateEditHint();
    this.renderList();
  }

  private updateEditHint(): void {
    const hint = document.getElementById('storageEditHint');
    if (!hint) return;
    if (this.selectedId) hint.classList.add('hidden');
    else hint.classList.remove('hidden');
  }

  private handleUpdate(): void {
    if (!this.saveEditor.isLoaded()) {
      this.showMessage('No save file loaded!', 'error');
      return;
    }

    const select = document.getElementById('storageEditSelect') as HTMLSelectElement | null;
    const qtyEl = document.getElementById('storageEditQty') as HTMLInputElement | null;
    if (!select || !qtyEl) return;

    const id = (select.value || '').trim();
    if (!id) {
      this.showMessage('Please choose an item', 'info');
      return;
    }

    const desiredQty = Math.max(0, Math.floor(Number(qtyEl.value || '0') || 0));

    const ok = this.saveEditor.setStorageItemQuantity(this.activeCategory, id, desiredQty);
    if (!ok) {
      const used = this.saveEditor.getStorageUsed();
      const cap = this.saveEditor.getStorageCapacity();
      this.showMessage(`Storage capacity exceeded (${used}/${cap}). Action ignored.`, 'error');
      return;
    }

    this.selectedId = id;
    this.populateEditSelect(); // keep list fresh and include any new items
    this.renderList();

    if (desiredQty === 0) {
      this.showMessage('Item removed from storage', 'success');
      this.clearSelection();
      return;
    }

    this.showMessage('Storage updated', 'success');
  }

  private getDisplayNameById(id: string): string {
    if (this.activeCategory === 'Weapon') return (WEAPON_LIST as any)[id] || id;
    if (this.activeCategory === 'Outfit') return (OUTFIT_LIST as any)[id] || id;
    if (this.activeCategory === 'Pet') return (PET_LIST as any)[id] || id;
    return id;
  }

  private getAttributesText(id: string): string {
    if (this.activeCategory !== 'Outfit') return '—';

    const sp = (OUTFIT_SPECIAL_BONUSES as any)[id] as
      | { S: number; P: number; E: number; C: number; I: number; A: number; L: number }
      | undefined;

    if (!sp) return '—';

    const parts: string[] = [];
    if (sp.S) parts.push(`S+${sp.S}`);
    if (sp.P) parts.push(`P+${sp.P}`);
    if (sp.E) parts.push(`E+${sp.E}`);
    if (sp.C) parts.push(`C+${sp.C}`);
    if (sp.I) parts.push(`I+${sp.I}`);
    if (sp.A) parts.push(`A+${sp.A}`);
    if (sp.L) parts.push(`L+${sp.L}`);

    return parts.length ? parts.join(' ') : '—';
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
      // Junk: include what exists in the save first (plus allow custom IDs)
      const existing = this.saveEditor.isLoaded()
        ? Array.from(new Set(this.saveEditor.getStorageItems('Junk').map((it) => it.id)))
        : [];
      entries = existing.map((id) => [id, id]);
    }

    entries
      .sort((a, b) => (a[1] || a[0]).localeCompare(b[1] || b[0]))
      .forEach(([id, label]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = label;
        select.appendChild(opt);
      });

    // Restore selection if possible
    if (this.selectedId) {
      select.value = this.selectedId;
    }

    // When user selects from dropdown, treat it as selection
    select.onchange = () => {
      const id = (select.value || '').trim();
      this.selectedId = id || null;
      const qtyEl = document.getElementById('storageEditQty') as HTMLInputElement | null;
      if (qtyEl && id) {
        const current = this.saveEditor.getStorageItemCount(this.activeCategory, id);
        qtyEl.value = String(current);
      }
      this.updateEditHint();
      this.renderList();
    };
  }

  private aggregateRows(items: ItemsItem[]): AggregatedRow[] {
    const map = new Map<string, AggregatedRow>();

    items.forEach((it) => {
      const id = it.id;
      const row = map.get(id);
      if (row) {
        row.qty += 1;
      } else {
        map.set(id, {
          id,
          name: this.getDisplayNameById(id),
          qty: 1,
          attrs: this.getAttributesText(id),
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  private renderList(): void {
    const container = document.getElementById('storageList');
    if (!container) return;

    const capText = document.getElementById('storageCapacityText');
    if (capText && this.saveEditor.isLoaded()) {
      capText.textContent = `${this.saveEditor.getStorageUsed()}/${this.saveEditor.getStorageCapacity()}`;
    } else if (capText) {
      capText.textContent = '0/0';
    }

    this.updateEditHint();

    if (!this.saveEditor.isLoaded()) {
      container.innerHTML = '<div class="p-3 text-green-500/80">Load a save file to view storage.</div>';
      return;
    }

    const items = this.saveEditor.getStorageItems(this.activeCategory);
    const rows = this.aggregateRows(items);

    if (rows.length === 0) {
      container.innerHTML = '<div class="p-3 text-green-500/80">No items in this category.</div>';
      return;
    }

    const header = `
      <table class="storage-table">
        <thead>
          <tr>
            <th class="col-item">Item</th>
            <th class="col-qty">Qty</th>
            <th class="col-attrs">Attributes</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((r) => {
              const selected = this.selectedId === r.id ? 'selected' : '';
              const name = this.escapeHtml(r.name);
              const attrs = this.escapeHtml(r.attrs);
              const id = this.escapeHtml(r.id);
              return `
                <tr class="${selected}" data-id="${id}">
                  <td title="${name}">${name}</td>
                  <td>${r.qty}</td>
                  <td title="${attrs}">${attrs}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    `;

    container.innerHTML = header;

    // Row click selection
    const rowsEls = container.querySelectorAll('tbody tr[data-id]');
    rowsEls.forEach((tr) => {
      tr.addEventListener('click', () => {
        const id = (tr as HTMLElement).dataset.id || '';
        this.selectedId = id || null;

        const select = document.getElementById('storageEditSelect') as HTMLSelectElement | null;
        const qtyEl = document.getElementById('storageEditQty') as HTMLInputElement | null;

        if (select) select.value = id;
        if (qtyEl && id) {
          const current = this.saveEditor.getStorageItemCount(this.activeCategory, id);
          qtyEl.value = String(current);
        }

        this.updateEditHint();
        this.renderList();
      });
    });
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
