import './style.css';
import { decryptSaveFile, encryptSaveFile, isValidJSON } from './utils/crypto';
import { readFileAsText, saveFile, getFileExtension, changeFileExtension } from './utils/fileHandler';

class DecryptorApp {
  constructor() {
    this.init();
  }

  private init(): void {
    this.setupUI();
    this.bindEvents();
  }

  private setupUI(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="container">
        <h1 class="text-4xl font-bold text-center mb-8 text-gray-100">Fallout Shelter Save Decryptor</h1>
        
        <div class="max-w-2xl mx-auto">
          <!-- Decrypt Section -->
          <div class="card mb-6">
            <div class="card-header">
              <h2 class="text-xl font-semibold">Decrypt Save File (.sav → .json)</h2>
            </div>
            <div class="card-body">
              <div id="decryptDropZone" class="drop-zone">
                <p class="text-gray-400 mb-4">Drag and drop your .sav file here or click to select</p>
                <input type="file" id="decryptFileInput" class="hidden" accept=".sav" />
                <button id="selectDecryptBtn" class="btn btn-primary">Select .sav File</button>
                <p class="text-sm text-gray-500 mt-2">
                  This will decrypt your encrypted save file to readable JSON format
                </p>
              </div>
            </div>
          </div>

          <!-- Encrypt Section -->
          <div class="card mb-6">
            <div class="card-header">
              <h2 class="text-xl font-semibold">Encrypt JSON File (.json → .sav)</h2>
            </div>
            <div class="card-body">
              <div id="encryptDropZone" class="drop-zone">
                <p class="text-gray-400 mb-4">Drag and drop your .json file here or click to select</p>
                <input type="file" id="encryptFileInput" class="hidden" accept=".json" />
                <button id="selectEncryptBtn" class="btn btn-primary">Select .json File</button>
                <p class="text-sm text-gray-500 mt-2">
                  This will encrypt your JSON save file back to .sav format
                </p>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="card">
            <div class="card-body text-center">
              <p class="text-gray-400 mb-4">Need to edit your save file?</p>
              <a href="index.html" class="btn btn-secondary">Go to Save Editor</a>
            </div>
          </div>

          <!-- Status Messages -->
          <div id="statusMessage" class="mt-6 hidden">
            <div class="p-4 rounded-md">
              <p id="statusText"></p>
            </div>
          </div>
        </div>

        <a href="index.html" class="text-blue-500 hover:underline">Go to Save Editor</a>
      </div>
    `;
  }

  private bindEvents(): void {
    // Decrypt file events
    const decryptFileInput = document.getElementById('decryptFileInput') as HTMLInputElement;
    const selectDecryptBtn = document.getElementById('selectDecryptBtn') as HTMLButtonElement;
    const decryptDropZone = document.getElementById('decryptDropZone') as HTMLDivElement;

    selectDecryptBtn?.addEventListener('click', () => decryptFileInput?.click());
    decryptFileInput?.addEventListener('change', (e) => this.handleDecryptFileSelect(e));

    // Encrypt file events
    const encryptFileInput = document.getElementById('encryptFileInput') as HTMLInputElement;
    const selectEncryptBtn = document.getElementById('selectEncryptBtn') as HTMLButtonElement;
    const encryptDropZone = document.getElementById('encryptDropZone') as HTMLDivElement;

    selectEncryptBtn?.addEventListener('click', () => encryptFileInput?.click());
    encryptFileInput?.addEventListener('change', (e) => this.handleEncryptFileSelect(e));

    // Drag and drop events
    decryptDropZone?.addEventListener('dragover', this.handleDragOver.bind(this));
    decryptDropZone?.addEventListener('drop', (e) => this.handleDecryptDrop(e));

    encryptDropZone?.addEventListener('dragover', this.handleDragOver.bind(this));
    encryptDropZone?.addEventListener('drop', (e) => this.handleEncryptDrop(e));
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone?.classList.add('dragover');
  }

  private async handleDecryptFileSelect(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      await this.decryptFile(file);
    }
  }

  private async handleEncryptFileSelect(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      await this.encryptFile(file);
    }
  }

  private async handleDecryptDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone?.classList.remove('dragover');
    
    const file = event.dataTransfer?.files[0];
    if (file) {
      await this.decryptFile(file);
    }
  }

  private async handleEncryptDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone?.classList.remove('dragover');
    
    const file = event.dataTransfer?.files[0];
    if (file) {
      await this.encryptFile(file);
    }
  }

  private async decryptFile(file: File): Promise<void> {
    try {
      const extension = getFileExtension(file.name);
      
      if (extension !== 'sav') {
        throw new Error('Please select a .sav file for decryption');
      }

      this.showStatus('Decrypting file...', 'info');
      
      const fileContent = await readFileAsText(file);
      const decryptedContent = decryptSaveFile(fileContent);
      
      if (!isValidJSON(decryptedContent)) {
        throw new Error('Decrypted content is not valid JSON');
      }

      // Format the JSON for better readability
      const parsedJson = JSON.parse(decryptedContent);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      
      const newFileName = changeFileExtension(file.name, 'json');
      saveFile(formattedJson, newFileName, 'application/json');
      
      this.showStatus(`Successfully decrypted ${file.name} to ${newFileName}`, 'success');
      
    } catch (error) {
      this.showStatus(`Error decrypting file: ${error}`, 'error');
    }
  }

  private async encryptFile(file: File): Promise<void> {
    try {
      const extension = getFileExtension(file.name);
      
      if (extension !== 'json') {
        throw new Error('Please select a .json file for encryption');
      }

      this.showStatus('Encrypting file...', 'info');
      
      const fileContent = await readFileAsText(file);
      
      if (!isValidJSON(fileContent)) {
        throw new Error('File is not valid JSON');
      }

      const saveData = JSON.parse(fileContent);
      const encryptedContent = encryptSaveFile(saveData);
      
      const newFileName = changeFileExtension(file.name, 'sav');
      saveFile(encryptedContent, newFileName, 'text/plain');
      
      this.showStatus(`Successfully encrypted ${file.name} to ${newFileName}`, 'success');
      
    } catch (error) {
      this.showStatus(`Error encrypting file: ${error}`, 'error');
    }
  }

  private showStatus(message: string, type: 'success' | 'error' | 'info'): void {
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    
    if (statusMessage && statusText) {
      statusText.textContent = message;
      statusMessage.classList.remove('hidden');
      
      // Reset classes
      statusMessage.className = 'mt-6 fade-in';
      
      // Add appropriate styling
      const messageDiv = statusMessage.querySelector('div');
      if (messageDiv) {
        messageDiv.className = 'p-4 rounded-md';
        
        if (type === 'success') {
          messageDiv.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-300');
        } else if (type === 'error') {
          messageDiv.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-300');
        } else {
          messageDiv.classList.add('bg-blue-100', 'text-blue-700', 'border', 'border-blue-300');
        }
      }
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        statusMessage.classList.add('hidden');
      }, 5000);
    }
  }
}

// Initialize the decryptor application
new DecryptorApp();
