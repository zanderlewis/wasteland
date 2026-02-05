import type { DwellersItem as Dweller } from '../../types/saveFile';
import { toastManager } from '../toastManager';

/**
 * Handles UI state management for the dweller editor
 */
export class DwellerUIManager {
  private selectedDweller: Dweller | null = null;

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
      statusText.className = 'text-sm text-green-400';
    }
  }

  showEvictedDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');

    if (statusText) {
      statusText.textContent = 'Dweller is evicted - Only undo eviction is available';
      statusText.className = 'text-sm text-red-400';
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
      statusText.className = 'text-sm text-green-200/70';
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
        '<p class="text-green-200/70 text-center py-4">No dwellers found</p>';
      return;
    }

    (dwellersList as any).__dwellers = dwellers;

    // Column sizing (per your request)
    const NAME_BASIS = 'basis-[12.5%]'; // 18% -> ~30% smaller
    const XP_W = 'w-[72px]'; // 96px -> 25% smaller
    const SPECIAL_W = 'w-[143px]'; // 220px -> 35% smaller
    const HEALTH_W = 'w-[100px]';

    dwellersList.innerHTML = `
      <div class="min-w-[1100px]">

        <!-- Header (same font size as rows, aligned with row content) -->
        <div class="hidden lg:flex items-center gap-3 px-0 py-2 sticky top-0 z-20 bg-gray-900 border-b border-green-900/60">
          <div class="${NAME_BASIS} shrink-0 pl-3">Name</div>
          <div class="w-12 text-center">Gender</div>
          <div class="w-12 text-center">Lvl</div>
          <div class="${XP_W} text-right">XP</div>
          <div class="w-10 text-right">😊</div>
          <div class="${SPECIAL_W} text-center">SPECIAL</div>
          <div class="${HEALTH_W} text-center">Health</div>
        </div>

        <div class="divide-y divide-green-900/50">
          ${dwellers.map((d) => this.renderDwellerRow(d, { NAME_BASIS, XP_W, SPECIAL_W, HEALTH_W })).join('')}
        </div>

      </div>
    `;

    if (!(dwellersList as any).__dwellerClickBound) {
      (dwellersList as any).__dwellerClickBound = true;

      dwellersList.addEventListener('click', (e) => {
        const row = (e.target as HTMLElement).closest('.dweller-row') as HTMLElement | null;
        if (!row) return;

        const id = parseInt(row.dataset.dwellerId || '0', 10);
        const list: Dweller[] = (dwellersList as any).__dwellers;
        const dweller = list.find((d) => d.serializeId === id);
        if (dweller) this.selectDweller(dweller);
      });
    }
  }

  private renderDwellerRow(
    dweller: Dweller,
    widths: { NAME_BASIS: string; XP_W: string; SPECIAL_W: string; HEALTH_W: string }
  ): string {
    const name = `${dweller.name} ${dweller.lastName || ''}`.trim();

    const isFemale = dweller.gender === 1;
    const isPregnantFemale = isFemale && !!dweller.pregnant;

    const genderHtml = isFemale
      ? `♀${isPregnantFemale ? '<span class="ml-1 text-green-300">+</span>' : ''}`
      : '♂';

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
        <div class="${widths.NAME_BASIS} shrink-0 pl-3 text-green-100 truncate">
          ${this.escapeHtml(name)}
        </div>

        <div class="w-12 text-center text-green-400 text-base">
          ${genderHtml}
        </div>

        <div class="w-12 text-center tabular-nums text-green-100">
          ${level}
        </div>

        <div class="${widths.XP_W} text-right tabular-nums text-green-100">
          ${xp}
        </div>

        <div class="w-10 text-right tabular-nums text-green-300">
          ${happy}%
        </div>

        <div class="${widths.SPECIAL_W} flex justify-center">
          ${this.renderSpecialMiniChart(dweller)}
        </div>

        <div class="${widths.HEALTH_W} flex justify-center">
          ${this.renderHealthMiniBar(hp, maxHp, rad)}
        </div>
      </div>
    `;
  }

  /**
   * SPECIAL: 7 vertical bars
   * Tooltip shows the value for the hovered stat only (per-bar title).
   * Removed tiny labels under bars so there’s no “small text” in the table.
   */
  private renderSpecialMiniChart(dweller: Dweller): string {
    const values = this.getSpecialValues(dweller);
    const labels = ['S', 'P', 'E', 'C', 'I', 'A', 'L'];

    return `
      <div class="inline-flex items-end gap-2" aria-label="SPECIAL stats">
        ${values
          .map((v, i) => {
            const clamped = this.clamp(v ?? 1, 0, 10);
            const h = Math.round((clamped / 10) * 20);
            const tooltip = `${labels[i]}: ${clamped}`;

            return `
              <div class="flex flex-col items-center cursor-default" title="${tooltip}">
                <div class="h-[20px] w-2 bg-gray-700 rounded overflow-hidden">
                  <div class="w-full bg-green-500" style="height:${h}px; margin-top:${20 - h}px"></div>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }

  /**
   * Health bar with tooltip on wrapper.
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
