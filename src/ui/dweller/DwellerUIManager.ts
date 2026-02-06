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

    if (statusText) {
      statusText.textContent = 'Editing dweller';
      statusText.className = 'text-green-300';
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
      statusText.className = 'text-green-200/80';
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
        '<p class="text-green-200/80 text-center py-4">No dwellers found</p>';
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
      <div class="min-w-[1100px]">

        <!-- HEADER -->
        <div class="hidden lg:flex items-center gap-3 px-0 py-2 sticky top-0 z-20 bg-gray-900 border-b border-green-900/60">
          ${this.renderHeaderCell('name', 'Name', 'basis-[12%] shrink-0 pl-3 text-left')}
          ${this.renderHeaderCell('gender', 'M/F', 'w-10 shrink-0 text-center')}
          ${this.renderHeaderCell('level', 'Level', 'w-12 shrink-0 text-center')}
          ${this.renderHeaderCell('xp', 'XP', 'w-[72px] shrink-0 text-right')}
          ${this.renderHeaderCell('happy', '😊', 'w-10 shrink-0 text-right')}
          ${this.renderHeaderCell('special', specialHeaderLabel, 'w-[140px] shrink-0 text-center')}
          ${this.renderHeaderCell('health', 'Health', 'w-[90px] shrink-0 text-center')}
        </div>

        <!-- ROWS -->
        <div class="divide-y divide-green-900/50">
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
      if (this.sortKey === 'special') {
        // cycle special stat
        this.specialSortIndex = (this.specialSortIndex + 1) % 7;
        // keep direction as-is
      } else {
        // first click sets to SPECIAL sorting
        this.sortKey = 'special';
        this.sortDir = 'asc';
        // keep current index
      }
      return;
    }

    // Normal columns
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
    const arrow = !active ? '' : this.sortDir === 'asc' ? '▲' : '▼';

    // IMPORTANT:
    // - Reserve indicator space with pr-5 always so headers to the right never shift
    // - Use absolute-positioned indicator so width stays identical
    return `
      <div
        class="relative ${extraClasses} pr-5 cursor-pointer select-none text-green-200 hover:text-green-100"
        data-sort="${key}"
        role="button"
        tabindex="0"
      >
        <span class="uppercase">${this.escapeHtml(label)}</span>
        <span class="dw-sort-indicator ${active ? '' : 'opacity-0'}">${arrow}</span>
      </div>
    `;
  }

  private renderDwellerRow(dweller: Dweller): string {
    const name = `${dweller.name} ${dweller.lastName || ''}`.trim();

    // Gender: M/F, plus sign for pregnant female
    const isFemale = dweller.gender === 1;
    const baseGender = isFemale ? 'F' : 'M';
    const isPregnant = this.isDwellerPregnant(dweller);
    const genderText = isFemale && isPregnant ? `${baseGender}+` : baseGender;

    const level = dweller.experience?.currentLevel ?? 1;
    const xp = dweller.experience?.experienceValue ?? 0;

    const happyRaw = dweller.happiness?.happinessValue ?? 50;
    const happy = Math.round(happyRaw); // 0 decimals

    const hp = dweller.health?.healthValue ?? 100;
    const maxHp = dweller.health?.maxHealth ?? 100;
    const rad = dweller.health?.radiationValue ?? 0;

    return `
      <div
        class="dweller-row flex items-center gap-3 px-0 py-1 bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors text-green-200 font-normal"
        data-dweller-id="${dweller.serializeId}"
      >
        <div class="basis-[12%] shrink-0 pl-3 text-green-200 truncate">
          ${this.escapeHtml(name)}
        </div>

        <div class="w-10 shrink-0 text-center text-green-200">
          ${genderText}
        </div>

        <div class="w-12 shrink-0 text-center tabular-nums text-green-200">
          ${level}
        </div>

        <div class="w-[72px] shrink-0 text-right tabular-nums text-green-200">
          ${xp}
        </div>

        <div class="w-[56px] shrink-0 text-right tabular-nums text-green-200">
          ${happy}%
        </div>

        <div class="w-[140px] shrink-0 flex justify-center">
          ${this.renderSpecialMiniChart(dweller)}
        </div>

        <div class="w-[90px] shrink-0 flex justify-center">
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
      <div class="inline-flex items-end gap-2" aria-label="SPECIAL stats">
        ${values
          .map((v, i) => {
            const clamped = this.clamp(v ?? 1, 0, 10);
            const h = Math.round((clamped / 10) * 20);
            const tooltip = `${labels[i]}: ${clamped}`;

            return `
              <div class="flex flex-col items-center gap-1 cursor-default" title="${tooltip}">
                <div class="h-[20px] w-2 bg-gray-700 rounded overflow-hidden">
                  <div
                    class="w-full bg-green-500"
                    style="height:${h}px; margin-top:${20 - h}px"
                  ></div>
                </div>
                <div class="text-green-200/70">${labels[i]}</div>
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
      <div class="w-full cursor-default" title="${tooltip}" aria-label="Health">
        <div class="relative h-3 bg-gray-700 rounded overflow-hidden">
          <div class="absolute left-0 top-0 h-full bg-green-500" style="width:${hpPct}%"></div>
          <div class="absolute right-0 top-0 h-full bg-orange-500" style="width:${radPct}%"></div>
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
