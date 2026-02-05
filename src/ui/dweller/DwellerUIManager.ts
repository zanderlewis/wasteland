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
      fieldset.querySelectorAll('input, select, button')
        .forEach(el => (el as HTMLInputElement).disabled = false);
    }

    if (statusText) {
      statusText.textContent = 'Editing dweller';
      statusText.className = 'text-green-500';
    }
  }

  closeDwellerEditor(): void {
    const fieldset = document.getElementById('dwellerFieldset') as HTMLFieldSetElement;
    const statusText = document.getElementById('dwellerEditorStatus');

    if (fieldset) {
      fieldset.disabled = true;
      fieldset.querySelectorAll('input, select, button')
        .forEach(el => (el as HTMLInputElement).disabled = true);
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

  updateDwellersList(dwellers: Dweller[]): void {
    const container = document.getElementById('dwellerListScroll');
    if (!container) return;

    container.innerHTML = `
      <div class="min-w-[1100px]">
        <div class="sticky top-0 z-20 bg-gray-900 border-b border-green-900 flex items-center gap-3 px-3 py-2 text-green-500">
          <div class="basis-[13%]">Name</div>
          <div class="w-12 text-center">Gender</div>
          <div class="w-12 text-center">Lvl</div>
          <div class="w-18 text-right">XP</div>
          <div class="w-10 text-right">😊</div>
          <div class="w-[140px] text-center">SPECIAL</div>
          <div class="w-[65px] text-center">Health</div>
        </div>
        ${dwellers.map(d => this.renderDwellerRow(d)).join('')}
      </div>
    `;
  }

  private renderDwellerRow(d: Dweller): string {
    const name = `${d.name} ${d.lastName || ''}`.trim();
    const level = d.experience?.currentLevel ?? 1;
    const xp = d.experience?.experienceValue ?? 0;
    const happy = Math.round(d.happiness?.happinessValue ?? 50);

    const hp = d.health?.healthValue ?? 100;
    const maxHp = d.health?.maxHealth ?? 100;
    const rad = d.health?.radiationValue ?? 0;

    const pregnant = d.pregnancy?.isPregnant;
    const gender = d.gender === 1 ? `♀${pregnant ? '+' : ''}` : '♂';

    return `
      <div class="dweller-row flex items-center gap-3 px-3 py-1 text-green-500 hover:bg-gray-800 cursor-pointer"
           data-dweller-id="${d.serializeId}">
        <div class="basis-[13%] truncate">${this.escape(name)}</div>
        <div class="w-12 text-center">${gender}</div>
        <div class="w-12 text-center">${level}</div>
        <div class="w-18 text-right">${xp}</div>
        <div class="w-10 text-right">${happy}%</div>
        <div class="w-[140px] flex justify-center">
          ${this.renderSpecialMiniChart(d)}
        </div>
        <div class="w-[65px]">
          ${this.renderHealthMiniBar(hp, maxHp, rad)}
        </div>
      </div>
    `;
  }

  private renderSpecialMiniChart(d: Dweller): string {
    const vals = this.getSpecialValues(d);
    const labels = ['S','P','E','C','I','A','L'];

    return `
      <div class="flex gap-1">
        ${vals.map((v,i) => `
          <div title="${labels[i]}: ${v}">
            <div class="h-[20px] w-2 bg-gray-700 overflow-hidden">
              <div class="bg-green-500 w-full" style="height:${(v/10)*20}px"></div>
            </div>
          </div>`).join('')}
      </div>
    `;
  }

  private renderHealthMiniBar(hp:number,max:number,rad:number):string {
    const hpPct = (hp/max)*100;
    const radPct = (rad/max)*100;
    return `
      <div title="HP ${hp}/${max}">
        <div class="relative h-3 bg-gray-700">
          <div class="absolute left-0 h-full bg-green-500" style="width:${hpPct}%"></div>
          <div class="absolute right-0 h-full bg-orange-500" style="width:${radPct}%"></div>
        </div>
      </div>
    `;
  }

  private getSpecialValues(d: Dweller): number[] {
    const s = d.stats?.stats;
    return [1,2,3,4,5,6,7].map(i => s?.[i]?.value ?? 1);
  }

  private escape(v:string):string {
    return v.replace(/[&<>"']/g,m=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    }[m]!));
  }
}
