// Event handlers for the Wasteland Save Editor
import { SaveEditor } from '../core/SaveEditor';
import { DwellerUI } from './dwellerUI';
import { VaultUI } from './vaultUI';
import { StorageUI } from './storageUI';
import { ToolsUI } from './toolsUI';
import { messageModal } from './messageModal';
import { toastManager } from './toastManager';

export class EventManager {
  private saveEditor: SaveEditor;
  private dwellerUI: DwellerUI;
  private vaultUI: VaultUI;
  private storageUI: StorageUI;
  private toolsUI: ToolsUI;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
    this.dwellerUI = new DwellerUI(saveEditor);
    this.vaultUI = new VaultUI(saveEditor);
    this.storageUI = new StorageUI(saveEditor);
    this.toolsUI = new ToolsUI(
      saveEditor, 
      this.vaultUI, 
      this.dwellerUI,
      this.storageUI
    );
  }

  bindEvents(): void {
    // Initialize message modal (for danger confirmations like eviction)
    messageModal.initialize();
    
    // Initialize toast manager (for success/info notifications)
    toastManager.initialize();
    
    this.bindFileUploadEvents();
    this.bindTabEvents();
    this.bindVaultEvents();
    this.bindDwellerEvents();
    this.bindStorageEvents();
    this.bindToolsEvents();
  }

  private bindFileUploadEvents(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const selectFileBtn = document.getElementById('selectFileBtn');
    const dropZone = document.getElementById('dropZone');

    // File input change
    fileInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.handleFileSelect(target.files[0]).finally(() => { (e.target as HTMLInputElement).value = ''; });
      }
    });

    // Select file button
    selectFileBtn?.addEventListener('click', () => {
      if (fileInput) fileInput.value = '';
      fileInput?.click();
    });

    // Drag and drop
    dropZone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone?.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        this.handleFileSelect(files[0]);
      }
    });
  }

  private bindTabEvents(): void {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const section = target.dataset.section;
        if (section) {
          this.switchTab(section);
        }
      });
    });
  }

  private bindVaultEvents(): void {
    this.vaultUI.bindEvents();
  }

  private bindDwellerEvents(): void {
    this.dwellerUI.bindEvents();
    
    // Close dweller editor
    const closeDwellerEditor = document.getElementById('closeDwellerEditor');
    closeDwellerEditor?.addEventListener('click', () => {
      this.dwellerUI.closeDwellerEditor();
    });
  }

  private bindStorageEvents(): void {
    this.storageUI.bindEvents();
  }

  private bindStorageEvents(): void {
    this.storageUI.bindEvents();
  }

  private bindToolsEvents(): void {
    this.toolsUI.bindEvents();
  }

  private async handleFileSelect(file: File): Promise<void> {
    try {
      // Show file status
      const fileStatus = document.getElementById('fileStatus');
      const fileName = document.getElementById('fileName');
      if (fileStatus && fileName) {
        fileName.textContent = file.name;
        fileStatus.classList.remove('hidden');
      }

      const content = await this.readFileAsText(file);
      await this.loadSaveFile(content, file.name);
      
      this.showStatus('Save file loaded successfully!', 'success');
      this.showEditorSection();
      this.loadVaultData();
      this.loadDwellersList();
      this.loadStorageData();
      this.loadStorageList();
      
    } catch (error) {
      console.error('Error loading file:', error);
      this.showStatus(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }

  private async loadSaveFile(content: string, fileName: string): Promise<void> {
    const { decryptSaveFile, isValidJSON } = await import('../utils/crypto');
    
    let saveData;
    
    if (fileName.endsWith('.sav')) {
      // Encrypted file
      const decrypted = decryptSaveFile(content);
      if (!isValidJSON(decrypted)) {
        throw new Error('Decrypted content is not valid JSON');
      }
      saveData = JSON.parse(decrypted);
    } else if (fileName.endsWith('.json')) {
      // Already decrypted
      if (!isValidJSON(content)) {
        throw new Error('File content is not valid JSON');
      }
      saveData = JSON.parse(content);
    } else {
      throw new Error('Unsupported file format');
    }

    this.saveEditor.loadSave(saveData, fileName);
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
  }

  private switchTab(section: string): void {
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if ((tab as HTMLElement).dataset.section === section) {
        tab.classList.add('active');
      }
    });

    // Update tab content
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(s => {
      s.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(`${section}-section`);
    targetSection?.classList.remove('hidden');
  }

  private showEditorSection(): void {
    const editorSection = document.getElementById('editorSection');
    editorSection?.classList.remove('hidden');
  }

  private loadVaultData(): void {
    this.vaultUI.loadVaultData();
  }

  private loadDwellersList(): void {
    this.dwellerUI.loadDwellersList();
  }

  private loadStorageData(): void {
    this.storageUI.loadStorageData();
  }

  private loadStorageData(): void {
    this.storageUI.loadStorageData();
  }

  private loadStorageList(): void {
    this.storageUI.loadStorageData();
  }

  private showStatus(message: string, type: 'success' | 'error' | 'info'): void {
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
