// Quick action operations for SaveEditor
import { QuickActions } from '../QuickActions';

/**
 * Mixin for quick action operations
 */
export class SaveEditorQuickActionsMixin {
  private quickActions: QuickActions;

  constructor(quickActions: QuickActions) {
    this.quickActions = quickActions;
  }

  /**
   * Max caps
   */
  maxCaps(): void {
    this.quickActions.maxCaps();
  }

  /**
   * Max Nuka Cola Quantum
   */
  maxNukaCola(): void {
    this.quickActions.maxNukaCola();
  }

  /**
   * Max lunchboxes
   */
  maxLunchboxes(): void {
    this.quickActions.maxLunchboxes();
  }

  /**
   * Max all resources
   */
  maxAllResources(): void {
    this.quickActions.maxAllResources();
  }

  /**
   * Unlock all rooms
   */
  unlockAllRooms(): void {
    this.quickActions.unlockAllRooms();
  }

  /**
   * Unlock all recipes
   */
  unlockAllRecipes(): void {
    this.quickActions.unlockAllRecipes();
  }

  /**
   * Unlock everything (rooms, recipes, themes)
   */
  unlockEverything(): void {
    this.quickActions.unlockEverything();
  }

  /**
   * Remove all rocks from the vault
   */
  removeAllRocks(): void {
    this.quickActions.removeAllRocks();
  }
}
