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
    const dwellersList = document.getElementById('dwellerList');
    if (!dwellersList) return;

    if (dwellers.length === 0) {
      dwellersList.innerHTML =
        '<p class="text-green-200/70 text-center py-4 font-semibold">No dwellers found</p>';
      return;
    }

    (dwellersList as any).__dwellers = dwellers;

    dwellersList.innerHTML = `
      <div class="min-w-[1200px] font-semibold">

        <div class="hidden lg:flex items-center gap-3 px-3 py-2 text-xs uppercase font-bold sticky top-0 z-10 bg-gray-900 border-b border-green-900/60">
          <div class="basis-[18%] shrink-0">Name</div>
          <div class="w-12 text-center">Gender</div>
          <div class="w-12 text-center">Lvl</div>
          <div class="w-24 text-right">XP</div>
          <div class="w-10 text-right">😊</div>
          <div class="w-[220px] text-right">SPECIAL</div>
          <div class="w-[100px] text-right">Health</div>
        </div>

        <div class="divide-y divide-green-900/50">
          ${dwellers.map((d) => this.renderDwellerRow(d)).join('')}
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

  private renderDwellerRow(dweller: Dweller): string {
    const name = `${dweller.name} ${dweller.lastName || ''}`.trim();
    const genderSymbol = dweller.gender === 1 ? '♀' : '♂';
    const level = dweller.experience?.currentLevel ?? 1;
    const xp = dweller.experience?.experienceValue ?? 0;
    const happy = dweller.happiness?.happinessValue ?? 50;

    const hp = dweller.health?.healthValue ?? 100;
    const maxHp = dweller.health?.maxHealth ?? 100;
    const rad = dweller.health?.radiationValue ?? 0;

    return `
      <div
        class="dweller-row flex items-center gap-3 px-3 py-2 bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors text-green-200 font-semibold"
        data-dweller-id="${dweller.serializeId}"
      >
        <div class="basis-[18%] shrink-0 truncate text-green-100">
          ${this.escapeHtml(name)}
        </div>

        <div class="w-12 text-center text-green-400 text-lg font-bold">
          ${genderSymbol}
        </div>

        <div class="w-12 text-center tabular-nums text-green-100">
          ${level}
        </div>

        <div class="w-24 text-right tabular-nums text-green-100">
          ${xp}
        </div>

        <div class="w-10 text-right tabular-nums text-green-300">
          ${happy}%
        </div>

        <div class="w-[220px] flex justify-end">
          ${this.renderSpecialMiniChart(dweller)}
        </div>

        <div class="w-[100px] flex justify-end">
          ${this.renderHealthMiniBar(hp, maxHp, rad)}
        </div>
      </div>
    `;
  }

  private renderSpecialMiniChart(dweller: Dweller): string {
    const values = this.getSpecialValues(dweller);
    const labels = ['S', 'P', 'E', 'C', 'I', 'A', 'L'];

    return `
      <div class="flex items-end gap-2">
        ${values
          .map((v, i) => {
            const h = Math.round((this.clamp(v, 0, 10) / 10) * 20);
            return `
              <div class="flex flex-col items-center gap-1">
                <div class="h-[20px] w-2 bg-gray-700 rounded overflow-hidden">
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

  private renderHealthMiniBar(hp: number, maxHp: number, rad: number): string {
    const safeMax = Math.max(1, maxHp);
    const hpPct = (this.clamp(hp, 0, safeMax) / safeMax) * 100;
    const radPct = (this.clamp(rad, 0, safeMax) / safeMax) * 100;

    return `
      <div class="w-full">
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
