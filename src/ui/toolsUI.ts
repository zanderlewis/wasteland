// Tools-specific UI management
import { SaveEditor } from '../core/SaveEditor';

export class ToolsUI {
  private saveEditor: SaveEditor;

  constructor(saveEditor: SaveEditor) {
    this.saveEditor = saveEditor;
  }

  bindEvents(): void {
    // Quick action buttons
    this.bindQuickActionEvents();
    
    // Export/backup buttons
    this.bindExportEvents();
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
      this.showMessage('All dwellers healed!', 'success');
      this.refreshDwellersUI();
    });

    // Unlock all rooms
    const unlockAllRoomsBtn = document.getElementById('unlockAllRooms');
    unlockAllRoomsBtn?.addEventListener('click', () => {
      this.saveEditor.unlockAllRooms();
      this.showMessage('All rooms unlocked!', 'success');
    });

    // Unlock all recipes
    const unlockAllRecipesBtn = document.getElementById('unlockAllRecipes');
    unlockAllRecipesBtn?.addEventListener('click', () => {
      this.saveEditor.unlockAllRecipes();
      this.showMessage('All recipes unlocked!', 'success');
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
    // Trigger vault UI refresh
    const event = new CustomEvent('refreshVaultUI');
    document.dispatchEvent(event);
  }

  private refreshDwellersUI(): void {
    // Trigger dwellers UI refresh
    const event = new CustomEvent('refreshDwellersUI');
    document.dispatchEvent(event);
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    // This could dispatch an event or call a global message handler
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}
