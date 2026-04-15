import "./style.css";
import { SaveEditor } from "./core/SaveEditor";
import { EventManager } from "./ui/eventManager";
import { createMainTemplate } from "./ui/templates";

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
    const app = document.getElementById("app");
    if (!app) return;

    const channel = import.meta.env.VITE_APP_CHANNEL as string | undefined;
    const sha = import.meta.env.VITE_BUILD_SHA as string | undefined;

    // Show a banner only for non-main builds (e.g. layout-update)
    if (channel && channel !== "main") {
      const shortSha = sha ? sha.slice(0, 7) : "";

      const banner = document.createElement("div");
      banner.textContent = shortSha
        ? `TEST BUILD: ${channel} • ${shortSha}`
        : `TEST BUILD: ${channel}`;
      // Ensure the banner sits flush to the very top
      banner.className =
        "m-0 w-full bg-green-600 text-black text-center text-sm font-semibold py-2";
      banner.style.marginTop = "0";

      app.parentElement?.insertBefore(banner, app);
    }

    app.innerHTML = createMainTemplate();
  }

  private bindEvents(): void {
    this.eventManager.bindEvents();
  }
}

new WastelandApp();
