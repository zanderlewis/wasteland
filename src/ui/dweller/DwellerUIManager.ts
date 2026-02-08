import type { DwellersItem as Dweller } from '../../types/saveFile';
import { toastManager } from '../toastManager';

/**
 * Handles UI state management for the dweller editor
 */
export class DwellerUIManager {
  private selectedDweller: Dweller | null = null;

  // Sorting state for the list
  private sortKey:
    | 'name'
    | 'gender'
    | 'level'
    | 'xp'
    | 'happy'
    | 'special'
    | 'health' = 'name';
  private sortDir: 'asc' | 'desc' = 'asc';

  // When sorting SPECIAL, we cycle S,P,E,C,I,A,L
  private specialSortIndex = 0; // 0..6
  private readonly specialNames = [
    'Strength',
    'Perception',
    'Endurance',
    'Charisma',
    'Intelligence',
    'Agility',
    'Luck'
  ];
  private readonly specialLetters = ['S', 'P', 'E', 'C', 'I', 'A', 'L'];

  // Column layout (header and rows MUST match)
  private readonly COL_NAME = 'basis-[15%] shrink-0 pl-3 pr-2 text-left border-r border-green-700/60';
  private readonly COL_SMALL = 'w-12 shrink-0 px-1 text-center border-r border-green-700/60';
  private readonly COL_XP = 'w-16 shrink-0 px-1 text-center border-r border-green-700/60';
  private readonly COL_SPECIAL = 'w-[110px] shrink-0 px-1 text-center border-r border-green-700/60';
  private readonly COL_HEALTH = 'w-[90px] shrink-0 px-1 text-center';
  private readonly COL_BORDER = 'border-green-900/60 border-r';

  private readonly SPECIAL_BAR_H = 28; // px, must match h-[28px] in the SPECIAL mini chart

  // NOTE: Column widths are defined once (W_*) in updateDwellersList().
  // Keep this class focused on behavior (sorting/selection), not layout constants.

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
      const formElements = fieldset.querySelectorAll(
        'input, select, button'
      ) as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>;
      formElements.forEach((element) => (element.disabled = false));
    }

    // Status text is redundant (header already says "Edit Dweller")
    if (statusText) {
      statusText.textContent = '';
      statusText.className = 'hidden';
    }
  }

  showEvictedDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');

    if (statusText) {
      statusText.textContent = 'Dweller is evicted - Only undo eviction is available';
      statusText.className = 'text-red-300';
    }

    if (fieldset) {
      const formElements = fieldset.querySelectorAll(
        'input, select, button'
      ) as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>;
      formElements.forEach((element) => {
        element.disabled = element.id !== 'evictDweller';
      });
    }
  }

  closeDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');

    if (fieldset) {
      fieldset.disabled = true;
      const formElements = fieldset.querySelectorAll(
        'input, select, button'
      ) as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>;
      formElements.forEach((element) => (element.disabled = true));
    }

    if (statusText) {
      statusText.textContent = 'Select a dweller to edit';
      statusText.className = 'text-green-500/80';
    }

    this.selectedDweller = null;
  }

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
    const dwellersList = document.getElementById('dwellerListScroll');
    if (!dwellersList) return;

    if (dwellers.length === 0) {
      dwellersList.innerHTML =
        '<p class="text-green-500/80 text-center py-4">No dwellers found</p>';
      return;
    }

    // Keep raw list for click selection
    (dwellersList as any).__dwellers = dwellers;

    // Sort copy for rendering
    const sorted = [...dwellers].sort((a, b) => this.compareDwellers(a, b));

    const specialHeaderLabel =
      this.sortKey === 'special'
        ? this.specialNames[this.specialSortIndex]
        : 'Special';

    dwellersList.innerHTML = `
      <div class="pip-table w-full">
        <!-- HEADER -->
        <div class="dw-header hidden lg:flex items-stretch px-0 py-2 sticky top-0 z-30 bg-gray-900 border-b border-green-900/60">
          ${this.renderHeaderCell('name', 'Name', this.COL_NAME)}
          ${this.renderHeaderCell('gender', 'M/F', this.COL_SMALL)}
          ${this.renderHeaderCell('level', 'LVL', this.COL_SMALL)}
          ${this.renderHeaderCell('xp', 'XP', this.COL_XP)}
          ${this.renderHeaderCell('happy', '😊', this.COL_SMALL)}
          ${this.renderHeaderCell('special', specialHeaderLabel, this.COL_SPECIAL)}
          ${this.renderHeaderCell('health', 'Health', this.COL_HEALTH)}
        </div>

        <!-- ROWS -->
        <div class="dw-rows">
          ${sorted.map((d) => this.renderDwellerRow(d)).join('')}
        </div>
      </div>
    `;

    // Bind header sorting once
    if (!(dwellersList as any).__dwellerSortBound) {
      (dwellersList as any).__dwellerSortBound = true;

      dwellersList.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        // Sorting click
        const header = target.closest('[data-sort]') as HTMLElement | null;
        if (header) {
          const key = (header.dataset.sort as any) || '';
          this.onHeaderClick(key);
          // Re-render with new sort state
          const list: Dweller[] = (dwellersList as any).__dwellers || [];
          this.updateDwellersList(list);
          return;
        }

        // Row selection click
        const row = target.closest('.dweller-row') as HTMLElement | null;
        if (!row) return;

        const id = parseInt(row.dataset.dwellerId || '0', 10);
        const list: Dweller[] = (dwellersList as any).__dwellers;
        const dweller = list.find((d) => d.serializeId === id);
        if (dweller) this.selectDweller(dweller);
      });
    }
  }

  /**
   * Header click behavior:
   * - Clicking same column toggles asc/desc
   * - SPECIAL cycles S/P/E/C/I/A/L when clicked (and sets sort key to special)
   */

  private onHeaderClick(key: string): void {
    if (key === 'special') {
      if (this.sortKey !== 'special') {
        this.sortKey = 'special';
        this.specialSortIndex = 0;
        this.sortDir = 'asc';
        return;
      }

      // Cycle: Stat asc -> same Stat desc -> next Stat asc -> ...
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else {
        this.sortDir = 'asc';
        this.specialSortIndex = (this.specialSortIndex + 1) % 7;
      }
      return;
    }

    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key as any;
      this.sortDir = 'asc';
    }
  }


  private renderHeaderCell(
  key:
    | 'name'
    | 'gender'
    | 'level'
    | 'xp'
    | 'happy'
    | 'special'
    | 'health',
  label: string,
  extraClasses: string
): string {
  const active = this.sortKey === key;
  const desc = active && this.sortDir === 'desc';

  return `
    <div
      class="relative ${extraClasses} cursor-pointer select-none text-green-500 hover:text-green-400 pb-2"
      data-sort="${key}"
      role="button"
      tabindex="0"
    >
      <div class="w-full uppercase ${key === 'name' ? 'text-left' : 'text-center'}">${this.escapeHtml(label)}</div>
      <span class="dw-sort-indicator ${active ? 'is-active' : ''} ${desc ? 'desc' : ''}" aria-hidden="true"></span>
    </div>
  `;
}


  private renderDwellerRow(dweller: Dweller): string {
    const name = `${dweller.name} ${dweller.lastName || ''}`.trim();

    // Gender: symbols, plus sign for pregnant female
    const isFemale = dweller.gender === 1;
    const genderSymbol = isFemale ? '♀' : '♂';
    const isPregnant = this.isDwellerPregnant(dweller);
    const genderText = isFemale && isPregnant ? `${genderSymbol}+` : genderSymbol;

    const level = dweller.experience?.currentLevel ?? 1;
    const xp = dweller.experience?.experienceValue ?? 0;

    const happyRaw = dweller.happiness?.happinessValue ?? 50;
    const happy = Math.round(happyRaw);

    const hp = dweller.health?.healthValue ?? 100;
    const maxHp = dweller.health?.maxHealth ?? 100;
    const rad = dweller.health?.radiationValue ?? 0;

    return `
      <div
        class="dweller-row flex items-center gap-0 px-0 py-1 bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors text-green-500 font-normal"
        data-dweller-id="${dweller.serializeId}"
      >
        <div class="${this.COL_NAME} ${this.COL_BORDER}">
          ${this.escapeHtml(name)}
        </div>

        <div class="${this.COL_SMALL} ${this.COL_BORDER}">
          ${genderText}
        </div>

        <div class="${this.COL_SMALL} ${this.COL_BORDER} tabular-nums">
          ${level}
        </div>

        <div class="${this.COL_XP} ${this.COL_BORDER} tabular-nums">
          ${xp}
        </div>

        <div class="${this.COL_SMALL} ${this.COL_BORDER} tabular-nums">
          ${happy}%
        </div>

        <div class="${this.COL_SPECIAL} ${this.COL_BORDER} flex justify-center">
          ${this.renderSpecialMiniChart(dweller)}
        </div>

        <div class="${this.COL_HEALTH} flex justify-center">
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
    const labels = this.specialLetters;

return `
  <div class="inline-flex items-end gap-px" aria-label="SPECIAL stats">
    ${values
      .map((v, i) => {
        const clamped = this.clamp(v ?? 1, 0, 10);
        const h = Math.round((clamped / 10) * this.SPECIAL_BAR_H);
        const tooltip = `${labels[i]}: ${clamped}`;

        return `
          <div class="cursor-default" title="${tooltip}">
            <div class="h-[28px] w-[6px] bg-gray-700 rounded overflow-hidden">
              <div
                class="w-full bg-green-500 pip-bar"
                style="height:${h}px; margin-top:${this.SPECIAL_BAR_H - h}px"
              ></div>
            </div>
          </div>
        `;
      })
      .join('')}
  </div>
`;
  }

  /**
   * Health bar:
   * Tooltips: put title on OUTER wrapper so it triggers even if inner bars overlap.
   */
  private renderHealthMiniBar(hp: number, maxHp: number, rad: number): string {
    const safeMax = Math.max(1, maxHp);
    const safeHp = this.clamp(hp, 0, safeMax);
    const safeRad = this.clamp(rad, 0, safeMax);

    const hpPct = (safeHp / safeMax) * 100;
    const radPct = (safeRad / safeMax) * 100;

    const tooltip = `HP ${safeHp}/${safeMax} • Rad ${safeRad}`;

    return `
      <div class="w-full cursor-default pip-bars" title="${tooltip}" aria-label="Health">
        <div class="relative h-3 bg-gray-700 rounded overflow-hidden">
          <div class="absolute left-0 top-0 h-full bg-green-500 pip-bar" style="width:${hpPct}%"></div>
          <div class="absolute right-0 top-0 h-full bg-orange-500 pip-bar" style="width:${radPct}%"></div>
        </div>
      </div>
    `;
  }

  private compareDwellers(a: Dweller, b: Dweller): number {
    const dir = this.sortDir === 'asc' ? 1 : -1;

    const aName = `${a.name ?? ''} ${a.lastName ?? ''}`.trim().toLowerCase();
    const bName = `${b.name ?? ''} ${b.lastName ?? ''}`.trim().toLowerCase();

    const aLevel = a.experience?.currentLevel ?? 1;
    const bLevel = b.experience?.currentLevel ?? 1;

    const aXp = a.experience?.experienceValue ?? 0;
    const bXp = b.experience?.experienceValue ?? 0;

    const aHappy = Math.round(a.happiness?.happinessValue ?? 50);
    const bHappy = Math.round(b.happiness?.happinessValue ?? 50);

    const aHp = a.health?.healthValue ?? 100;
    const bHp = b.health?.healthValue ?? 100;

    const aGender = a.gender ?? 1;
    const bGender = b.gender ?? 1;

    const aSpecial = this.getSpecialValues(a)[this.specialSortIndex] ?? 1;
    const bSpecial = this.getSpecialValues(b)[this.specialSortIndex] ?? 1;

    let cmp = 0;

    switch (this.sortKey) {
      case 'name':
        cmp = aName.localeCompare(bName);
        break;
      case 'gender':
        cmp = aGender - bGender;
        break;
      case 'level':
        cmp = aLevel - bLevel;
        break;
      case 'xp':
        cmp = aXp - bXp;
        break;
      case 'happy':
        cmp = aHappy - bHappy;
        break;
      case 'health':
        cmp = aHp - bHp;
        break;
      case 'special':
        cmp = aSpecial - bSpecial;
        break;
      default:
        cmp = 0;
    }

    // Tie-breakers to keep stable
    if (cmp === 0) cmp = aName.localeCompare(bName);

    return cmp * dir;
  }

  private isDwellerPregnant(dweller: Dweller): boolean {
    const p: any = (dweller as any).pregnant;
    if (typeof p === 'boolean') return p;
    if (p && typeof p === 'object') return !!p.isPregnant;
    return false;
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