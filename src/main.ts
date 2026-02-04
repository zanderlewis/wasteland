import './style.css';
import { SaveEditor } from './core/SaveEditor';
import { EventManager } from './ui/eventManager';
import { createMainTemplate } from './ui/templates';

declare const __APP_CHANNEL__: string;

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

    // Show a banner for non-main builds (e.g. layout-update)
    if (typeof __APP_CHANNEL__ !== 'undefined' && __APP_CHANNEL__ !== 'main') {
      const banner = document.createElement('div');
      banner.textContent = `TEST BUILD: ${__APP_CHANNEL__}`;
      banner.className =
        'w-full bg-yellow-600 text-black text-center text-sm font-semibold py-2';

      // Insert banner before the app container
      app.parentElement?.insertBefore(banner, app);
    }

    app.innerHTML = createMainTemplate();
  }

  private bindEvents(): void {
    this.eventManager.bindEvents();
  }
}

// Initialize the application
new WastelandApp();
