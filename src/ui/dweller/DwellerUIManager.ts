import type { DwellersItem as Dweller } from '../../types/saveFile';
import { toastManager } from '../toastManager';

type SortKey = 'name' | 'level' | 'xp' | 'happy' | 'health';
type SortDir = 'asc' | 'desc';

/**
 * Handles UI state management for the dweller editor
 */
export class DwellerUIManager {
  private selectedDweller: Dweller | null = null;

  // Sorting state
  private sortKey: SortKey = 'name';
  private sortDir: SortDir = 'asc';

  // Store last dwellers so we can re-render on sort toggle
  private lastDwellers: Dweller[] = [];

  setSelectedDweller(dweller: Dweller | null): void {
    this.selectedDweller = dweller;
  }

  getSelectedDweller(): Dweller | null {
    return this.selectedDweller;
  }

  showDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');

    if (fieldset) {
      fieldset.disabled = false;
      fieldset.querySelectorAll('input, select, button').forEach((el) => {
        (el as HTMLInputElement | HTMLSelectElement | HTMLButtonElement).disabled = false;
      });
    }

    if (statusText) {
      statusText.textContent = 'Editing dweller';
      statusText.className = 'text-green-500';
    }
  }

  showEvictedDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');

    if (statusText) {
      statusText.textContent = 'Dweller is evicted - Only undo eviction is available';
      statusText.className = 'text-red-400';
    }

    if (fieldset) {
      fieldset.querySelectorAll('input, select, button').forEach((el) => {
        const element = el as HTMLInputElement | HTMLSelectElement | HTMLButtonElement;
        element.disabled = (element as any).id !== 'evictDweller';
      });
    }
  }

  closeDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');

    if (fieldset) {
      fieldset.disabled = true;
      fieldset.querySelectorAll('input, select, button').forEach((el) => {
        (el as HTMLInputElement | HTMLSelectElement | HTMLButtonElement).disabled = true;
      });
    }

    if (statusText) {
      statusText.textContent = 'Select a dweller to edit';
      statusText.className = 'text-green-500/70';
    }

    this.selectedDweller = null;
  }

  showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    if (type === 'success') toastManager.showSuccess(message);
    else if (type === 'error') toastManager.showError(message);
    else toastManager.showInfo(message);
  }

  /**
   * Update the dweller list display
   */
  updateDwellersList(dwellers: Dweller[]): void {
    const scroll = document.getElementById('dwellerListScroll');
    if (!scroll) return;

    this.lastDwellers = dwellers;

    if (dwellers.length === 0) {
      scroll.innerHTML =
        '<p class="text-green-500/70 text-center py-4">No dwellers found</p>';
      return;
    }

    // Store dwellers for delegated click handler
    (scroll as any).__dwellers = dwellers;

    // Render sorted list
    this.renderList(scroll);

    // Bind click handler once: row select + header sort
    if (!(scroll as any).__dwellerClickBound) {
      (scroll as any).__dwellerClickBound = true;

      scroll.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        // 1) Header sort click
        const sortBtn = target.closest('[data-sort-key]') as HTMLElement | null;
        if (sortBtn) {
          const key = sortBtn.getAttribute('data-sort-key') as SortKey | null;
          if (!key) return;

          if (this.sortKey === key) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
          } else {
            this.sortKey = key;
            this.sortDir = 'asc';
          }

          this.renderList(scroll);
          return;
        }

        // 2) Row click
        const row = target.closest('.dweller-row') as HTMLElement | null;
        if (!row) return;

        const id = parseInt(row.dataset.dwellerId || '0', 10);
        const list: Dweller[] = (scroll as any).__dwellers || [];
        const dweller = list.find((d) => d.serializeId === id);
        if (dweller) this.selectDweller(dweller);
      });
    }
  }

  private renderList(scroll: HTMLElement): void {
    const dwellers: Dweller[] = (scroll as any).__dwellers || this.lastDwellers || [];
    const sorted = this.sortDwellers([...dwellers]);

    const sortArrow = (key: SortKey) => {
      if (this.sortKey !== key) return '';
      return this.sortDir === 'asc' ? ' ▲' : ' ▼';
    };

    // Column sizing changes per your spec:
    // - Name smaller (-30%) => basis 13%
    // - XP smaller 25% => w-18 (72px-ish) instead of w-24
    // - SPECIAL smaller 35% => 140px
    // - Health narrow => 65px
    scroll.innerHTML = `
      <div class="min-w-[1000px]">
        <div class="sticky top-0 z-20 pip-header-row">
          <button type="button" class="pip-head basis-[13%] text-left" data-sort-key="name">
            Name${sortArrow('name')}
          </button>
          <div class="pip-head w-12 text-center">Gender</div>
          <button type="button" class="pip-head w-12 text-center" data-sort-key="level">
            Lvl${sortArrow('level')}
          </button>
          <button type="button" class="pip-head w-18 text-right" data-sort-key="xp">
            XP${sortArrow('xp')}
          </button>
          <button type="button" class="pip-head w-10 text-right" data-sort-key="happy">
            😊${sortArrow('happy')}
          </button>
          <div class="pip-head w-[140px] text-center">SPECIAL</div>
          <button type="button" class="pip-head w-[65px] text-center" data-sort-key="health">
            Health${sortArrow('health')}
          </button>
        </div>

        <div class="pip-row-wrap">
          ${sorted.map((d) => this.renderDwellerRow(d)).join('')}
        </div>
      </div>
    `;
  }

  private sortDwellers(list: Dweller[]): Dweller[] {
    const dirMul = this.sortDir === 'asc' ? 1 : -1;

    const getName = (d: Dweller) =>
      `${d.name ?? ''} ${d.lastName ?? ''}`.trim().toLowerCase();

    const getLevel = (d: Dweller) => d.experience?.currentLevel ?? 1;
    const getXp = (d: Dweller) => d.experience?.experienceValue ?? 0;
    const getHappy = (d: Dweller) => d.happiness?.happinessValue ?? 0;

    // Health sort: percent HP remaining (hp/max). If max missing, treat as 0.
    const getHealthPct = (d: Dweller) => {
      const hp = d.health?.healthValue ?? 0;
      const max = d.health?.maxHealth ?? 0;
      if (!max) return 0;
      return hp / max;
    };

    list.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;

      switch (this.sortKey) {
        case 'name':
          av = getName(a);
          bv = getName(b);
          break;
        case 'level':
          av = getLevel(a);
          bv = getLevel(b);
          break;
        case 'xp':
          av = getXp(a);
          bv = getXp(b);
          break;
        case 'happy':
          av = getHappy(a);
          bv = getHappy(b);
          break;
        case 'health':
          av = getHealthPct(a);
          bv = getHealthPct(b);
          break;
      }

      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * dirMul;
      }
      return ((av as number) - (bv as number)) * dirMul;
    });

    return list;
  }

  private renderDwellerRow(dweller: Dweller): string {
    const name = `${dweller.name} ${dweller.lastName || ''}`.trim();

    const level = dweller.experience?.currentLevel ?? 1;
    const xp = dweller.experience?.experienceValue ?? 0;

    // Round to 0 decimals as requested
    const happy = Math.round(dweller.happiness?.happinessValue ?? 50);

    const hp = dweller.health?.healthValue ?? 100;
    const maxHp = dweller.health?.maxHealth ?? 100;
    const rad = dweller.health?.radiationValue ?? 0;

    const isFemale = dweller.gender === 1;
    const isPregnant = !!dweller.pregnant;
    const genderSymbol = isFemale ? `♀${isPregnant ? '+' : ''}` : '♂';

    return `
      <div
        class="dweller-row pip-row"
        data-dweller-id="${dweller.serializeId}"
      >
        <div class="basis-[13%] truncate text-left">
          ${this.escapeHtml(name)}
        </div>

        <div class="w-12 text-center pip-gender">
          ${genderSymbol}
        </div>

        <div class="w-12 text-center tabular-nums">
          ${level}
        </div>

        <div class="w-18 text-right tabular-nums">
          ${xp}
        </div>

        <div class="w-10 text-right tabular-nums">
          ${happy}%
        </div>

        <div class="w-[140px] flex justify-center">
          ${this.renderSpecialMiniChart(dweller)}
        </div>

        <div class="w-[65px]">
          ${this.renderHealthMiniBar(hp, maxHp, rad)}
        </div>
      </div>
    `;
  }

  /**
   * SPECIAL: 7 vertical bars with labels S P E C I A L
   * Tooltip shows the value for the hovered stat only
   */
  private renderSpecialMiniChart(dweller: Dweller): string {
    const values = this.getSpecialValues(dweller);
    const labels = ['S', 'P', 'E', 'C', 'I', 'A', 'L'];

    return `
      <div class="inline-flex items-end gap-1" aria-label="SPECIAL stats">
        ${values
          .map((v, i) => {
            const clamped = this.clamp(v ?? 1, 0, 10);
            const h = Math.round((clamped / 10) * 20);
            const tooltip = `${labels[i]}: ${clamped}`;

            return `
              <div class="flex flex-col items-center gap-1 cursor-default" title="${tooltip}">
                <div class="h-[20px] w-2 bg-gray-700 overflow-hidden">
                  <div class="w-full pip-bar-fill" style="height:${h}px; margin-top:${20 - h}px"></div>
                </div>
                <div class="pip-mini-label">${labels[i]}</div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }

  /**
   * Health bar:
   * Tooltip on wrapper
   */
  private renderHealthMiniBar(hp: number, maxHp: number, rad: number): string {
    const safeMax = Math.max(1, maxHp);
    const safeHp = this.clamp(hp, 0, safeMax);
    const safeRad = this.clamp(rad, 0, safeMax);

    const hpPct = (safeHp / safeMax) * 100;
    const radPct = (safeRad / safeMax) * 100;

    const tooltip = `HP ${safeHp}/${safeMax} • Rad ${safeRad}`;

    return `
      <div class="w-full cursor-default" title="${tooltip}" aria-label="Health">
        <div class="relative h-3 bg-gray-700 overflow-hidden">
          <div class="absolute left-0 top-0 h-full pip-bar-fill" style="width:${hpPct}%"></div>
          <div class="absolute right-0 top-0 h-full pip-rad-fill" style="width:${radPct}%"></div>
        </div>
      </div>
    `;
  }

  private getSpecialValues(dweller: Dweller): number[] {
    const s = dweller.stats?.stats;
    return [1, 2, 3, 4, 5, 6, 7].map((i) => s?.[i]?.value ?? 1);
  }

  private clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
  }

  private selectDweller(dweller: Dweller): void {
    this.selectedDweller = dweller;
    document.dispatchEvent(new CustomEvent('dwellerSelected', { detail: { dweller } }));
  }

  private escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
