// Tools-specific UI management
import { SaveEditor } from '../core/SaveEditor';
import type { VaultUI } from './vaultUI';
import type { DwellerUI } from './dwellerUI';
import { toastManager } from './toastManager';

export class ToolsUI {
  private saveEditor: SaveEditor;
  private vaultUI: VaultUI | null = null;
  private dwellerUI: DwellerUI | null = null;

  constructor(
    saveEditor: SaveEditor, 
    vaultUI?: VaultUI, 
    dwellerUI?: DwellerUI
  ) {
    this.saveEditor = saveEditor;
    this.vaultUI = vaultUI || null;
    this.dwellerUI = dwellerUI || null;
  }

  bindEvents(): void {
    // Quick action buttons
    this.bindQuickActionEvents();
    
    // Export/backup buttons
    this.bindExportEvents();

    // Examples dropdown
    this.bindExampleLoader();
  }

  private bindExampleLoader(): void {
    const select = document.getElementById('exampleFilesSelect') as HTMLSelectElement | null;
    const loadBtn = document.getElementById('loadExampleBtn');

    if (!select || !loadBtn) return;

    // Fetch a simple manifest of example filenames from /examples/examples.json
    // Fallback to a single hardcoded example if manifest fetch fails.
    (async () => {
      let files: string[] = [];
      // Compute base-aware URL for the examples manifest so it works on GH Pages or any subpath.
      // Prefer Vite's BASE_URL during dev/build, otherwise use the page's base (document.baseURI).
      const viteBase = (import.meta as any)?.env?.BASE_URL;
      const baseForExamples = viteBase ? new URL(viteBase, window.location.href).href : (document.baseURI || window.location.href);
      const manifestUrl = new URL('examples/examples.json', baseForExamples).href;

      try {
        const resp = await fetch(manifestUrl);
        if (!resp.ok) throw new Error(`manifest fetch failed: ${resp.status}`);
        files = await resp.json();
        if (!Array.isArray(files) || files.length === 0) {
          files = [];
        }
      } catch (err) {
        // Manifest not available; use fallback single example path
        console.warn('Could not load examples manifest, falling back to single example', err);
        files = ['maxBaseVault.json'];
      }

      // Populate select
      select.innerHTML = '';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = '-- select example --';
      select.appendChild(placeholder);

      files.forEach((fileName) => {
        const opt = document.createElement('option');
        opt.value = fileName; // store just filename
        opt.textContent = fileName;
        select.appendChild(opt);
      });
    })();

    loadBtn.addEventListener('click', async () => {
      const val = select.value;
      if (!val) {
        this.showMessage('Please choose an example file to load', 'info');
        return;
      }

      try {
  // Build a base-aware URL for the selected example so this works from any base path
  const viteBase2 = (import.meta as any)?.env?.BASE_URL;
  const baseForFetch = viteBase2 ? new URL(viteBase2, window.location.href).href : (document.baseURI || window.location.href);
  const url = new URL(`examples/${val}`, baseForFetch).href;
  const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status} ${resp.statusText}`);

        // Try to parse JSON (manifest ensures .json)
        const text = await resp.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(`Failed to parse JSON from ${url}: ${parseErr}`);
        }

        const fileName = val || 'example.json';

        // Mimic file upload behavior: update file UI status (same elements used by EventManager)
        const fileStatus = document.getElementById('fileStatus');
        const fileNameEl = document.getElementById('fileName');
        if (fileNameEl) fileNameEl.textContent = fileName;
        if (fileStatus) fileStatus.classList.remove('hidden');

        // Load into save editor (this should set internal filename/state)
        this.saveEditor.loadSave(data, fileName);

        // Clear file input so selecting a file will always trigger change
        const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
        console.info(`Loaded example ${fileName}`);
        this.showMessage(`Loaded ${fileName}`, 'success');

        // Ensure editor UI is visible and refreshed
        const editorSection = document.getElementById('editorSection');
        if (editorSection) editorSection.classList.remove('hidden');
        this.refreshVaultUI();
        this.refreshDwellersUI();
      } catch (err) {
        console.error('Error loading example file:', err);
        this.showMessage(`Error loading example file: ${err instanceof Error ? err.message : String(err)}`, 'error');
      }
    });
  }

  private bindQuickActionEvents(): void {
    // Max caps
    const maxCapsBtn = document.getElementById('maxCaps');
    maxCapsBtn?.addEventListener('click', () => {
      this.saveEditor.maxCaps();
      this.showMessage('Caps maxed!', 'success');
      this.refreshVaultUI();
    });

    // Max resources
    const maxResourcesBtn = document.getElementById('maxResources');
    maxResourcesBtn?.addEventListener('click', () => {
      this.saveEditor.maxAllResources();
      this.showMessage('All resources maxed!', 'success');
      this.refreshVaultUI();
    });

    // Max lunchboxes
    const maxLunchboxesBtn = document.getElementById('maxLunchboxes');
    maxLunchboxesBtn?.addEventListener('click', () => {
      this.saveEditor.maxLunchboxes();
      this.showMessage('Lunchboxes maxed!', 'success');
      this.refreshVaultUI();
    });

    // Max everything
    const maxAllBtn = document.getElementById('maxAll');
    maxAllBtn?.addEventListener('click', () => {
      this.saveEditor.maxCaps();
      this.saveEditor.maxAllResources();
      this.saveEditor.maxLunchboxes();
      this.saveEditor.maxNukaCola();
      this.showMessage('Everything maxed!', 'success');
      this.refreshVaultUI();
    });

    // Max all dwellers
    const maxAllDwellersBtn = document.getElementById('maxAllDwellers');
    maxAllDwellersBtn?.addEventListener('click', () => {
      this.saveEditor.healAllDwellers();
      this.saveEditor.maxAllDwellersSpecial();
      this.saveEditor.maxAllHappiness();
      this.showMessage('All dwellers maxed out (health, SPECIAL, and happiness)!', 'success');
      this.refreshDwellersUI();
    });

    // Unlock all rooms
    const unlockAllRoomsBtn = document.getElementById('unlockAllRooms');
    unlockAllRoomsBtn?.addEventListener('click', () => {
      this.saveEditor.unlockAllRooms();
      this.showMessage('All rooms unlocked!', 'success');
      this.refreshVaultUI();
    });

    // Unlock all recipes
    const unlockAllRecipesBtn = document.getElementById('unlockAllRecipes');
    unlockAllRecipesBtn?.addEventListener('click', () => {
      this.saveEditor.unlockAllRecipes();
      this.showMessage('All recipes unlocked!', 'success');
    });

    // Remove all rocks
    const removeAllRocksBtn = document.getElementById('removeAllRocks');
    removeAllRocksBtn?.addEventListener('click', () => {
      this.saveEditor.removeAllRocks();
      this.showMessage('All rocks removed!', 'success');
    });
  }

  private bindExportEvents(): void {
    // Create backup
    const createBackupBtn = document.getElementById('createBackup');
    createBackupBtn?.addEventListener('click', () => {
      this.createBackup();
    });

    // Export as JSON
    const exportJsonBtn = document.getElementById('exportJson');
    exportJsonBtn?.addEventListener('click', () => {
      this.exportAsJson();
    });

    // Export as .sav
    const exportSavBtn = document.getElementById('exportSav');
    exportSavBtn?.addEventListener('click', () => {
      this.exportAsSav();
    });
  }

  private async createBackup(): Promise<void> {
    try {
      const save = this.saveEditor.getSave();
      if (!save) {
        this.showMessage('No save file loaded!', 'error');
        return;
      }

      const backupData = JSON.stringify(save, null, 2);
      const fileName = `backup_${this.saveEditor.getFileName()}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
      
      await this.downloadFile(backupData, fileName, 'application/json');
      this.showMessage('Backup created successfully!', 'success');
    } catch (error) {
      console.error('Error creating backup:', error);
      this.showMessage('Error creating backup!', 'error');
    }
  }

  private async exportAsJson(): Promise<void> {
    try {
      const save = this.saveEditor.getSave();
      if (!save) {
        this.showMessage('No save file loaded!', 'error');
        return;
      }

      const jsonData = JSON.stringify(save, null, 2);
      const fileName = this.changeFileExtension(this.saveEditor.getFileName(), 'json');
      
      await this.downloadFile(jsonData, fileName, 'application/json');
      this.showMessage('JSON export completed!', 'success');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      this.showMessage('Error exporting JSON!', 'error');
    }
  }

  private async exportAsSav(): Promise<void> {
    try {
      const save = this.saveEditor.getSave();
      if (!save) {
        this.showMessage('No save file loaded!', 'error');
        return;
      }

      const { encryptSaveFile } = await import('../utils/crypto');
      const encryptedData = encryptSaveFile(save);
      const fileName = this.changeFileExtension(this.saveEditor.getFileName(), 'sav');
      
      await this.downloadFile(encryptedData, fileName, 'application/octet-stream');
      this.showMessage('.sav export completed!', 'success');
    } catch (error) {
      console.error('Error exporting .sav:', error);
      this.showMessage('Error exporting .sav file!', 'error');
    }
  }

  private async downloadFile(content: string, fileName: string, mimeType: string): Promise<void> {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private changeFileExtension(fileName: string, newExtension: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return `${fileName}.${newExtension}`;
    }
    return `${fileName.substring(0, lastDotIndex)}.${newExtension}`;
  }

  private refreshVaultUI(): void {
    // Directly call the vault UI load method if available
    if (this.vaultUI) {
      this.vaultUI.loadVaultData();
    }
  }

  private refreshDwellersUI(): void {
    // Directly call the dwellers UI load method if available
    if (this.dwellerUI) {
      this.dwellerUI.loadDwellersList();
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
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
}
