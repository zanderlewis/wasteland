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
   * Update the dweller list display (full width, one row per dweller)
   */
  updateDwellersList(dwellers: Dweller[]): void {
    const dwellersList = document.getElementById('dwellerList');
    if (!dwellersList) return;

    if (dwellers.length === 0) {
      dwellersList.innerHTML = '<p class="text-green-200/70 text-center py-4">No dwellers found</p>';
      return;
    }

    // Store dwellers for delegated click handler
    (dwellersList as any).__dwellers = dwellers;

    dwellersList.innerHTML = `
      <div class="w-full overflow-x-auto text-green-200">
        <div class="min-w-[1200px] space-y-2">

          <!-- Header -->
          <div class="hidden lg:flex items-center gap-3 px-3 py-2 text-xs uppercase text-green-200/70">
            <div class="min-w-0 basis-[18%] shrink-0">Name</div>
            <div class="shrink-0 w-12 text-right">Gender</div>
            <div class="shrink-0 w-12 text-right">Lvl</div>
            <div class="shrink-0 w-24 text-right">XP</div>
            <div class="shrink-0 w-10 text-right">😊</div>
            <div class="shrink-0 w-[220px] text-right">SPECIAL</div>
            <div class="shrink-0 w-[50px] text-right">Health</div>
          </div>

          ${dwellers.map((dweller) => this.renderDwellerRow(dweller)).join('')}

        </div>
      </div>
    `;

    // Bind click handler once
    if (!(dwellersList as any).__dwellerClickBound) {
      (dwellersList as any).__dwellerClickBound = true;

      dwellersList.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const row = target.closest('.dweller-row') as HTMLElement | null;
        if (!row) return;

        const dwellerId = parseInt(row.getAttribute('data-dweller-id') || '0', 10);
        const listDwellers: Dweller[] = (dwellersList as any).__dwellers || [];
        const dweller = listDwellers.find((d) => d.serializeId === dwellerId);
        if (dweller) this.selectDweller(dweller);
      });
    }
  }

  private renderDwellerRow(dweller: Dweller): string {
    const name = `${dweller.name} ${dweller.lastName || ''}`.trim();
    const gender = dweller.gender === 1 ? 'F' : 'M';
    const level = dweller.experience?.currentLevel ?? 1;
    const xp = dweller.experience?.experienceValue ?? 0;
    const happy = dweller.happiness?.happinessValue ?? 50;

    const hp = dweller.health?.healthValue ?? 100;
    const maxHp = dweller.health?.maxHealth ?? 100;
    const rad = dweller.health?.radiationValue ?? 0;

    const statuses = [
      dweller.pregnant
        ? '<span class="text-xs bg-pink-800 text-pink-200 px-2 py-1 rounded">Pregnant</span>'
        : '',
      dweller.WillBeEvicted
        ? '<span class="text-xs bg-red-800 text-red-200 px-2 py-1 rounded">Evicted</span>'
        : ''
    ]
      .filter(Boolean)
      .join(' ');

    const rowClasses = [
      'dweller-row',
      'w-full',
      'flex',
      'items-center',
      'gap-3',
      'px-3',
      'py-2',
      'rounded-lg',
      'border',
      'border-green-900/60',
      'bg-gray-800',
      'hover:bg-gray-700',
      'cursor-pointer',
      'transition-colors',
      'text-green-200'
    ];

    if (dweller.WillBeEvicted) {
      rowClasses.push('border-red-500', 'bg-red-900', 'hover:bg-red-800');
    }

    return `
      <div class="${rowClasses.join(' ')}" data-dweller-id="${dweller.serializeId}">
        <!-- NAME (about 30% smaller than before) -->
        <div class="min-w-0 basis-[18%] shrink-0">
          <div class="truncate font-medium text-green-100">${this.escapeHtml(name)}</div>
          <div class="mt-1 flex flex-wrap gap-1">${statuses}</div>
        </div>

        <div class="shrink-0 w-12 text-right text-green-200/80">${gender}</div>
        <div class="shrink-0 w-12 text-right tabular-nums text-green-100">${level}</div>
        <div class="shrink-0 w-24 text-right tabular-nums text-green-100">${xp}</div>

        <!-- HAPPY (75% smaller) -->
        <div class="shrink-0 w-10 text-right tabular-nums text-green-300">${happy}%</div>

        <!-- SPECIAL (bars green already) -->
        <div class="shrink-0 w-[220px] flex justify-end">
          ${this.renderSpecialMiniChart(dweller)}
        </div>

        <!-- HEALTH (50% of previous width) -->
        <div class="shrink-0 w-[50px] flex justify-end">
          ${this.renderHealthMiniBar(hp, maxHp, rad)}
        </div>
      </div>
    `;
  }

  /**
   * SPECIAL: 7 vertical bars with labels S P E C I A L
   * Values assumed 1..10; we clamp to 0..10 and map to a fixed height.
   */
  private renderSpecialMiniChart(dweller: Dweller): string {
    const values = this.getSpecialValues(dweller); // [S,P,E,C,I,A,L]
    const labels = ['S', 'P', 'E', 'C', 'I', 'A', 'L'];

    return `
      <div class="flex items-end gap-2" aria-label="SPECIAL stats">
        ${values
          .map((v, i) => {
            const clamped = this.clamp(v, 0, 10);
            const h = Math.round((clamped / 10) * 20); // 0..20 px
            return `
              <div class="flex flex-col items-center gap-1">
                <div class="h-[20px] w-2 bg-gray-700 rounded-sm overflow-hidden" title="${labels[i]}: ${clamped}">
                  <div class="w-full bg-green-500" style="height:${h}px; margin-top:${20 - h}px"></div>
                </div>
                <div class="text-[10px] text-green-200/70">${labels[i]}</div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }

  /**
   * Health bar:
   * - fixed width for every row
   * - background represents max HP
   * - green fills from left = current HP
   * - orange fills from right = radiation
   *
   * NOTE: Outer width is controlled by the caller (we keep this as w-full).
   */
  private renderHealthMiniBar(hp: number, maxHp: number, rad: number): string {
    const safeMax = Math.max(1, maxHp);
    const safeHp = this.clamp(hp, 0, safeMax);
    const safeRad = this.clamp(rad, 0, safeMax);

    const hpPct = (safeHp / safeMax) * 100;
    const radPct = (safeRad / safeMax) * 100;

    return `
      <div class="w-full" aria-label="Health">
        <div class="relative h-3 w-full bg-gray-700 rounded overflow-hidden" title="HP ${safeHp}/${safeMax}, Rad ${safeRad}">
          <!-- HP from left -->
          <div class="absolute left-0 top-0 h-full bg-green-500" style="width:${hpPct}%"></div>
          <!-- Radiation from right -->
          <div class="absolute right-0 top-0 h-full bg-orange-500" style="width:${radPct}%"></div>
        </div>
      </div>
    `;
  }

  private getSpecialValues(dweller: Dweller): number[] {
    const stats = dweller.stats?.stats;
    // Indices 1..7 => S P E C I A L
    return [
      stats?.[1]?.value ?? 1,
      stats?.[2]?.value ?? 1,
      stats?.[3]?.value ?? 1,
      stats?.[4]?.value ?? 1,
      stats?.[5]?.value ?? 1,
      stats?.[6]?.value ?? 1,
      stats?.[7]?.value ?? 1
    ].map((n) => (typeof n === 'number' ? n : 1));
  }

  private clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
  }

  /**
   * Select a dweller for editing
   */
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
