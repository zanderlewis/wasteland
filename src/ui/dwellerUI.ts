// src/ui/dwellerUI.ts
import type { DwellersItem as Dweller } from '../types/saveFile';
import { SaveEditor } from '../core/SaveEditor';
import { DwellerUIManager } from './dweller/DwellerUIManager';
import { toastManager } from './toastManager';

export class DwellerUI {
  private saveEditor: SaveEditor;
  private ui: DwellerUIManager;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
    this.ui = new DwellerUIManager();
  }

  bindEvents(): void {
    // ---- Prevent the eviction modal from ever showing unless we explicitly show it ----
    this.bindEvictionModal();

    // Dweller selection event (fired by DwellerUIManager when a row is clicked)
    document.addEventListener('dwellerSelected', (e: Event) => {
      const ce = e as CustomEvent<{ dweller: Dweller }>;
      const dweller = ce.detail?.dweller;
      if (!dweller) return;

      this.ui.setSelectedDweller(dweller);

      // If evicted, lock down; otherwise enable editor
      if ((dweller as any).WillBeEvicted) {
        this.ui.showEvictedDwellerEditor();
      } else {
        this.ui.showDwellerEditor();
      }

      this.populateDwellerForm(dweller);
    });

    // Form submit -> save
    const form = document.getElementById('dwellerForm') as HTMLFormElement | null;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = this.ui.getSelectedDweller();
      if (!selected) {
        toastManager.showInfo('Select a dweller first.');
        return;
      }

      try {
        this.applyFormToDweller(selected);
        this.persistDweller(selected);
        toastManager.showSuccess('Dweller updated.');
        this.loadDwellersList(); // refresh list view
      } catch (err) {
        console.error(err);
        toastManager.showError(
          `Failed to save dweller: ${err instanceof Error ? err.message : 'Unknown error'}`
        );
      }
    });

    // Reset
    const resetBtn = document.getElementById('resetDwellerForm') as HTMLButtonElement | null;
    resetBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = this.ui.getSelectedDweller();
      if (selected) this.populateDwellerForm(selected);
    });

    // Max SPECIAL (single dweller)
    const maxSpecialBtn = document.getElementById('maxSpecial') as HTMLButtonElement | null;
    maxSpecialBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = this.ui.getSelectedDweller();
      if (!selected) return;

      const stats = (selected as any).stats?.stats;
      if (stats) {
        for (let i = 1; i <= 7; i++) {
          if (!stats[i]) stats[i] = {};
          stats[i].value = 10;
        }
      }
      this.populateDwellerForm(selected);
      this.persistDweller(selected);
      toastManager.showSuccess('SPECIAL maxed.');
      this.loadDwellersList();
    });

    // Evict button -> show eviction modal
    const evictBtn = document.getElementById('evictDweller') as HTMLButtonElement | null;
    evictBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = this.ui.getSelectedDweller();
      if (!selected) return;

      // If already evicted, do nothing (your UIManager already locks most controls)
      if ((selected as any).WillBeEvicted) {
        toastManager.showInfo('Dweller is already marked for eviction.');
        return;
      }

      this.showEvictionModalFor(selected);
    });

    // Pregnancy section visibility (basic)
    const genderSelect = document.getElementById('dwellerGender') as HTMLSelectElement | null;
    const pregnancySection = document.getElementById('pregnancySection') as HTMLDivElement | null;
    const updatePregnancyVisibility = () => {
      // Your save uses 1 = Female, 2 = Male
      const isFemale = (genderSelect?.value ?? '2') === '1';
      if (pregnancySection) pregnancySection.style.display = isFemale ? 'block' : 'none';
    };
    genderSelect?.addEventListener('change', updatePregnancyVisibility);
    updatePregnancyVisibility();
  }

  closeDwellerEditor(): void {
    this.ui.closeDwellerEditor();
  }

  loadDwellersList(): void {
    const dwellers = this.getDwellersFromSave();
    this.ui.updateDwellersList(dwellers);
  }

  // -----------------------------
  // Eviction modal (id: evictionModal, cancelEviction, confirmEviction)
  // -----------------------------
  private bindEvictionModal(): void {
    const evictionModal = document.getElementById('evictionModal') as HTMLDivElement | null;
    const cancelBtn = document.getElementById('cancelEviction') as HTMLButtonElement | null;
    const confirmBtn = document.getElementById('confirmEviction') as HTMLButtonElement | null;

    const hide = () => {
      if (!evictionModal) return;
      evictionModal.classList.add('modal-hidden');
      evictionModal.style.display = 'none';
      (evictionModal as any).__pendingDwellerId = undefined;
    };

    const show = () => {
      if (!evictionModal) return;
      evictionModal.classList.remove('modal-hidden');
      evictionModal.style.display = 'flex';
    };

    // Hard force hidden on init
    hide();

    cancelBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      hide();
    });

    confirmBtn?.addEventListener('click', (e) => {
      e.preventDefault();

      const selected = this.ui.getSelectedDweller();
      if (!selected) {
        hide();
        return;
      }

      // Mark for eviction (your list rendering already highlights WillBeEvicted)
      (selected as any).WillBeEvicted = true;

      this.persistDweller(selected);
      toastManager.showSuccess('Dweller marked for eviction.');
      this.ui.showEvictedDwellerEditor();
      this.loadDwellersList();
      hide();
    });

    // Backdrop click closes
    evictionModal?.addEventListener('click', (e) => {
      if (e.target === evictionModal) hide();
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && evictionModal && evictionModal.style.display !== 'none') {
        hide();
      }
    });

    // Stash helpers
    (this as any).__hideEvictionModal = hide;
    (this as any).__showEvictionModal = show;
  }

  private showEvictionModalFor(dweller: Dweller): void {
    const nameEl = document.getElementById('evictionDwellerName') as HTMLSpanElement | null;
    const fullName = `${dweller.name} ${dweller.lastName || ''}`.trim();
    if (nameEl) nameEl.textContent = fullName;

    const show = (this as any).__showEvictionModal as (() => void) | undefined;
    if (show) show();
  }

  // -----------------------------
  // Form <-> Dweller mapping
  // -----------------------------
  private populateDwellerForm(dweller: Dweller): void {
    const setVal = (id: string, v: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
      if (el) (el as any).value = v;
    };

    setVal('dwellerName', dweller.name ?? '');
    setVal('dwellerLastName', dweller.lastName ?? '');
    setVal('dwellerGender', String(dweller.gender ?? 2));

    setVal('dwellerLevel', String(dweller.experience?.currentLevel ?? 1));
    setVal('dwellerExperience', String(dweller.experience?.experienceValue ?? 0));
    setVal('dwellerHappiness', String(dweller.happiness?.happinessValue ?? 50));

    setVal('dwellerHealth', String(dweller.health?.healthValue ?? 100));
    setVal('dwellerMaxHealth', String(dweller.health?.maxHealth ?? 100));
    setVal('dwellerRadiation', String(dweller.health?.radiationValue ?? 0));

    // Appearance (best-effort)
    setVal('dwellerSkinColor', String((dweller as any).skinColor ?? '#FFDBAC'));
    setVal('dwellerHairColor', String((dweller as any).hairColor ?? '#8B4513'));

    // Pregnancy (your save object appears to use dweller.pregnant?.isPregnant etc.)
    const isPreg = !!(dweller as any).pregnant?.isPregnant;
    setVal('dwellerPregnant', isPreg ? 'true' : 'false');
    const babyReady = !!(dweller as any).pregnant?.babyReady;
    setVal('dwellerBabyReadyTime', babyReady ? 'true' : 'false');

    // SPECIAL stats
    const stats = (dweller as any).stats?.stats;
    setVal('dwellerStrength', String(stats?.[1]?.value ?? 1));
    setVal('dwellerPerception', String(stats?.[2]?.value ?? 1));
    setVal('dwellerEndurance', String(stats?.[3]?.value ?? 1));
    setVal('dwellerCharisma', String(stats?.[4]?.value ?? 1));
    setVal('dwellerIntelligence', String(stats?.[5]?.value ?? 1));
    setVal('dwellerAgility', String(stats?.[6]?.value ?? 1));
    setVal('dwellerLuck', String(stats?.[7]?.value ?? 1));

    // Equipment / pet (best-effort; will depend on your save schema)
    setVal('dwellerWeapon', String((dweller as any).equip?.weapon ?? ''));
    setVal('dwellerOutfit', String((dweller as any).equip?.outfit ?? ''));
    setVal('dwellerPet', String((dweller as any).pet ?? ''));

    // Pregnancy section visibility (female only)
    const pregnancySection = document.getElementById('pregnancySection') as HTMLDivElement | null;
    if (pregnancySection) pregnancySection.style.display = dweller.gender === 1 ? 'block' : 'none';
  }

  private applyFormToDweller(dweller: Dweller): void {
    const getVal = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
      return el ? (el as any).value : '';
    };
    const getNum = (id: string, fallback = 0) => {
      const raw = getVal(id);
      const n = Number(raw);
      return Number.isFinite(n) ? n : fallback;
    };

    dweller.name = getVal('dwellerName');
    dweller.lastName = getVal('dwellerLastName');
    dweller.gender = getNum('dwellerGender', 2) as any;

    if (!dweller.experience) dweller.experience = {} as any;
    dweller.experience.currentLevel = getNum('dwellerLevel', 1) as any;
    dweller.experience.experienceValue = getNum('dwellerExperience', 0) as any;

    if (!dweller.happiness) dweller.happiness = {} as any;
    dweller.happiness.happinessValue = getNum('dwellerHappiness', 50) as any;

    if (!dweller.health) dweller.health = {} as any;
    dweller.health.healthValue = getNum('dwellerHealth', 100) as any;
    dweller.health.maxHealth = getNum('dwellerMaxHealth', 100) as any;
    dweller.health.radiationValue = getNum('dwellerRadiation', 0) as any;

    // Pregnancy (only meaningful for female; but keep whatever user sets)
    const pregVal = getVal('dwellerPregnant') === 'true';
    const babyReadyVal = getVal('dwellerBabyReadyTime') === 'true';
    if (!(dweller as any).pregnant) (dweller as any).pregnant = {};
    (dweller as any).pregnant.isPregnant = pregVal;
    (dweller as any).pregnant.babyReady = babyReadyVal;

    // SPECIAL stats
    if (!(dweller as any).stats) (dweller as any).stats = {};
    if (!(dweller as any).stats.stats) (dweller as any).stats.stats = {};
    const stats = (dweller as any).stats.stats;
    const setStat = (idx: number, id: string) => {
      if (!stats[idx]) stats[idx] = {};
      stats[idx].value = getNum(id, 1);
    };
    setStat(1, 'dwellerStrength');
    setStat(2, 'dwellerPerception');
    setStat(3, 'dwellerEndurance');
    setStat(4, 'dwellerCharisma');
    setStat(5, 'dwellerIntelligence');
    setStat(6, 'dwellerAgility');
    setStat(7, 'dwellerLuck');

    // Equipment / pet best-effort
    if (!(dweller as any).equip) (dweller as any).equip = {};
    (dweller as any).equip.weapon = getVal('dwellerWeapon');
    (dweller as any).equip.outfit = getVal('dwellerOutfit');
    (dweller as any).pet = getVal('dwellerPet');
  }

  // -----------------------------
  // SaveEditor integration (best-effort; uses any-casts to match your existing SaveEditor API)
  // -----------------------------
  private getDwellersFromSave(): Dweller[] {
    // Try common patterns without requiring you to rename anything.
    const se: any = this.saveEditor as any;

    // If you already have a helper:
    if (typeof se.getDwellers === 'function') {
      const list = se.getDwellers();
      return Array.isArray(list) ? list : [];
    }

    // Otherwise try to crawl save structure
    const save = typeof se.getSave === 'function' ? se.getSave() : se.saveData ?? se.save ?? null;

    const candidates =
      save?.vault?.dwellers?.dwellers ??
      save?.vault?.dwellers ??
      save?.dwellers ??
      save?.Vault?.Dwellers ??
      null;

    if (Array.isArray(candidates)) return candidates as Dweller[];
    if (Array.isArray(candidates?.dwellers)) return candidates.dwellers as Dweller[];

    return [];
  }

  private persistDweller(updated: Dweller): void {
    const se: any = this.saveEditor as any;

    // If you have a direct method, use it
    if (typeof se.updateDweller === 'function') {
      se.updateDweller(updated);
      return;
    }

    // Otherwise replace in-place by serializeId
    const dwellers = this.getDwellersFromSave();
    const idx = dwellers.findIndex((d) => d.serializeId === updated.serializeId);
    if (idx >= 0) dwellers[idx] = updated;

    // If SaveEditor has a "mark dirty" or similar, call it
    if (typeof se.setDirty === 'function') se.setDirty(true);
  }
}
