import './style.css';
import { SaveEditor } from './core/SaveEditor';
import { EventManager } from './ui/eventManager';
import { createMainTemplate } from './ui/templates';

class WastelandApp {
  private saveEditor: SaveEditor;
  private eventManager: EventManager;

  constructor() {
    this.saveEditor = new SaveEditor();
    this.eventManager = new EventManager(this.saveEditor);
    this.init();
  }

  private init(): void {
    this.setupUI();
    this.bindEvents();
  }

  private setupUI(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = createMainTemplate();
  }

  private bindEvents(): void {
    this.eventManager.bindEvents();
  }
}

// Initialize the application
new WastelandApp();
