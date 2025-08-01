// Tools and utilities template

export const createToolsSectionTemplate = (): string => `
  <!-- Tools Section -->
  <div id="tools-section" class="tab-content hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <button id="maxCaps" class="btn btn-primary w-full">Max Caps</button>
            <button id="maxResources" class="btn btn-primary w-full">Max All Resources</button>
            <button id="maxLunchboxes" class="btn btn-primary w-full">Max Lunchboxes</button>
            <button id="maxAll" class="btn btn-primary w-full">Max Everything</button>
            <button id="maxAllDwellers" class="btn btn-primary w-full">Max All Dwellers</button>
            <button id="unlockAllRooms" class="btn btn-primary w-full">Unlock All Rooms</button>
            <button id="unlockAllRecipes" class="btn btn-primary w-full">Unlock All Recipes</button>
          </div>
        </div>
      </div>

      <!-- Backup/Restore -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">Backup & Export</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <button id="createBackup" class="btn btn-secondary w-full">Create Backup</button>
            <button id="exportJson" class="btn btn-secondary w-full">Export as JSON</button>
            <button id="exportSav" class="btn btn-secondary w-full">Export as .sav</button>
          </div>
          <div class="mt-4 text-sm text-gray-400">
            <p>Always create a backup before making major changes!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
