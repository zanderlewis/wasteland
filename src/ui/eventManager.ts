// Event handlers for the Wasteland Save Editor
import { SaveEditor } from '../core/SaveEditor';
import { DwellerUI } from './dwellerUI';
import { VaultUI } from './vaultUI';
import { ToolsUI } from './toolsUI';

export class EventManager {
  private saveEditor: SaveEditor;
  private dwellerUI: DwellerUI;
  private vaultUI: VaultUI;
  private toolsUI: ToolsUI;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
    this.dwellerUI = new DwellerUI(saveEditor);
    this.vaultUI = new VaultUI(saveEditor);
    this.toolsUI = new ToolsUI(saveEditor);
  }

  bindEvents(): void {
    this.bindFileUploadEvents();
    this.bindTabEvents();
    this.bindVaultEvents();
    this.bindDwellerEvents();
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
        this.handleFileSelect(target.files[0]);
      }
    });

    // Select file button
    selectFileBtn?.addEventListener('click', () => {
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

  private showStatus(message: string, type: 'success' | 'error' | 'info'): void {
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    
    if (statusMessage && statusText) {
      statusText.textContent = message;
      statusMessage.classList.remove('hidden');
      
      // Reset classes
      statusMessage.className = 'mt-4 fade-in';
      
      // Add appropriate styling
      const messageDiv = statusMessage.querySelector('div');
      if (messageDiv) {
        messageDiv.className = 'p-4 rounded-md';
        
        if (type === 'success') {
          messageDiv.classList.add('status-success');
        } else if (type === 'error') {
          messageDiv.classList.add('status-error');
        } else {
          messageDiv.classList.add('status-info');
        }
      }
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        statusMessage.classList.add('hidden');
      }, 5000);
    }
  }
}
