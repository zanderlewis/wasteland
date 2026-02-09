// Tools and utilities template

export const createToolsSectionTemplate = (): string => `
  <!-- Tools Section -->
  <div id="tools-section" class="tab-content hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Quick Actions -->
      <div class="pip-panel">
        <div class="pip-panel-title">
          <h3 class="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div class="pip-panel-body p-4">
          <div class="flex flex-wrap gap-3 justify-center">
            <button id="maxCaps" class="btn btn-success">Max Caps</button>
            <button id="maxResources" class="btn btn-success">Max All Resources</button>
            <button id="maxLunchboxes" class="btn btn-success">Max Lunchboxes</button>
            <button id="maxAll" class="btn btn-success">Max Everything</button>
            <button id="maxAllDwellers" class="btn btn-success">Max All Dwellers</button>
            <button id="unlockAllRooms" class="btn btn-success">Unlock All Rooms</button>
            <button id="unlockAllRecipes" class="btn btn-success">Unlock All Recipes</button>
            <button id="removeAllRocks" class="btn btn-success">Remove All Rocks</button>
          </div>
        </div>
      </div>

      <!-- Backup/Restore -->
      <div class="pip-panel">
        <div class="pip-panel-title">
          <h3 class="text-lg font-semibold">Backup & Export</h3>
        </div>
        <div class="pip-panel-body p-4">
          <div class="flex flex-wrap gap-3 justify-center">
            <button id="createBackup" class="btn btn-success">Create Backup</button>
            <button id="exportJson" class="btn btn-success">Export as JSON</button>
            <button id="exportSav" class="btn btn-success">Export as .sav</button>
          </div>
          <div class="mt-4 text-base text-green-500/80 text-center">
            <p>Always create a backup before making major changes!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
