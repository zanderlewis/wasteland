// UI Templates for the Wasteland Save Editor
import { GAME_LIMITS } from '../constants/gameConstants';

export const createMainTemplate = (): string => `
  <div class="container">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-100">Fallout Shelter Save Editor</h1>
    
    <!-- File Upload Section -->
    <div class="card mb-6">
      <div class="card-header">
        <h2 class="text-xl font-semibold">Upload Save File</h2>
      </div>
      <div class="card-body">
        <div id="dropZone" class="drop-zone">
          <p class="text-gray-400 mb-4">Drag and drop your save file here or click to select</p>
          <input type="file" id="fileInput" class="hidden" accept=".sav,.json" />
          <button id="selectFileBtn" class="btn btn-primary mb-4">Select File</button>
          <p class="text-sm text-gray-500">
            Supported formats: .sav (encrypted), .json (decrypted)
          </p>
        </div>
        <div id="fileStatus" class="mt-4 hidden">
          <p class="text-sm text-gray-400">File: <span id="fileName" class="font-medium text-gray-200"></span></p>
        </div>
      </div>
    </div>

    <!-- Save Editor Tabs -->
    <div id="editorSection" class="hidden">
      <div class="tab-container">
        <button class="tab active" data-section="vault">Vault</button>
        <button class="tab" data-section="dwellers">Dwellers</button>
        <button class="tab" data-section="tools">Tools</button>
      </div>

      ${createVaultSectionTemplate()}
      ${createDwellersSectionTemplate()}
      ${createToolsSectionTemplate()}
      ${createStatusTemplate()}
    </div>
  </div>
`;

export const createVaultSectionTemplate = (): string => `
  <!-- Vault Section -->
  <div id="vault-section" class="tab-content">
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold">Vault Management</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label class="form-label">Vault Name</label>
            <input type="text" id="vaultName" class="form-input" placeholder="Enter vault name">
          </div>
          <div class="form-group">
            <label class="form-label">Caps</label>
            <input type="number" id="caps" class="form-input" min="0" max="${GAME_LIMITS.CAPS_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Lunchboxes</label>
            <input type="number" id="lunchboxes" class="form-input" min="0" max="${GAME_LIMITS.LUNCHBOXES_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Mr. Handies</label>
            <input type="number" id="mrHandies" class="form-input" min="0" max="${GAME_LIMITS.MR_HANDIES_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Pet Carriers</label>
            <input type="number" id="petCarriers" class="form-input" min="0" max="${GAME_LIMITS.PET_CARRIERS_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Starter Packs</label>
            <input type="number" id="starterPacks" class="form-input" min="0" max="${GAME_LIMITS.STARTER_PACKS_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Vault Theme</label>
            <select id="vaultTheme" class="form-input">
              <option value="0">Normal</option>
              <option value="1">Christmas</option>
              <option value="2">Halloween</option>
              <option value="3">Thanksgiving</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Vault Mode</label>
            <select id="vaultMode" class="form-input">
              <option value="Normal">Normal</option>
              <option value="Survival">Survival</option>
            </select>
          </div>
        </div>
        
        <h4 class="text-md font-semibold mt-6 mb-4">Resources</h4>
        <div class="resource-grid">
          <div class="form-group">
            <label class="form-label">Food</label>
            <input type="number" id="food" class="form-input" min="0" max="${GAME_LIMITS.FOOD_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Water</label>
            <input type="number" id="water" class="form-input" min="0" max="${GAME_LIMITS.WATER_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Energy</label>
            <input type="number" id="energy" class="form-input" min="0" max="${GAME_LIMITS.ENERGY_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">RadAway</label>
            <input type="number" id="radaway" class="form-input" min="0" max="${GAME_LIMITS.RADAWAY_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Stimpacks</label>
            <input type="number" id="stimpacks" class="form-input" min="0" max="${GAME_LIMITS.STIMPACKS_MAX}">
          </div>
          <div class="form-group">
            <label class="form-label">Nuka Cola</label>
            <input type="number" id="nuka" class="form-input" min="0" max="${GAME_LIMITS.NUKA_COLA_MAX}">
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export const createDwellersSectionTemplate = (): string => `
  <!-- Dwellers Section -->
  <div id="dwellers-section" class="tab-content hidden">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div id="dwellerListContainer" class="card lg:col-span-3">
        <div class="card-header">
          <h3 class="text-lg font-semibold">Dwellers</h3>
        </div>
        <div class="card-body">
          <div id="dwellerList" class="dweller-list">
            <!-- Dwellers will be populated here -->
          </div>
        </div>
      </div>
      
      <div class="lg:col-span-2">
        <div id="dwellerEditor" class="card hidden">
          <div class="card-header">
            <h3 class="text-lg font-semibold">Edit Dweller</h3>
            <button id="closeDwellerEditor" class="btn btn-sm btn-secondary float-right">Close</button>
          </div>
          <div class="card-body">
            <!-- Basic Info -->
            <h4 class="text-md font-semibold mb-4">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" id="dwellerName" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" id="dwellerLastName" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select id="dwellerGender" class="form-input">
                  <option value="1">Female</option>
                  <option value="2">Male</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Level</label>
                <input type="number" id="dwellerLevel" class="form-input" min="${GAME_LIMITS.LEVEL_MIN}" max="${GAME_LIMITS.LEVEL_MAX}">
              </div>
              <div class="form-group">
                <label class="form-label">Experience</label>
                <input type="number" id="dwellerExperience" class="form-input" min="0">
              </div>
              <div class="form-group">
                <label class="form-label">Happiness</label>
                <input type="number" id="dwellerHappiness" class="form-input" min="${GAME_LIMITS.HAPPINESS_MIN}" max="${GAME_LIMITS.HAPPINESS_MAX}">
              </div>
            </div>

            <!-- Health Section -->
            <h4 class="text-md font-semibold mb-4">Health & Status</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="form-group">
                <label class="form-label">Health</label>
                <input type="number" id="dwellerHealth" class="form-input" min="0">
              </div>
              <div class="form-group">
                <label class="form-label">Max Health</label>
                <input type="number" id="dwellerMaxHealth" class="form-input" min="0">
              </div>
              <div class="form-group">
                <label class="form-label">Radiation</label>
                <input type="number" id="dwellerRadiation" class="form-input" min="${GAME_LIMITS.RADIATION_MIN}" max="${GAME_LIMITS.RADIATION_MAX}">
              </div>
            </div>

            <!-- SPECIAL Stats -->
            <h4 class="text-md font-semibold mb-4">SPECIAL Stats</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div class="form-group">
                <label class="form-label">Strength</label>
                <input type="number" id="dwellerStrength" class="form-input special-input" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}">
              </div>
              <div class="form-group">
                <label class="form-label">Perception</label>
                <input type="number" id="dwellerPerception" class="form-input special-input" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}">
              </div>
              <div class="form-group">
                <label class="form-label">Endurance</label>
                <input type="number" id="dwellerEndurance" class="form-input special-input" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}">
              </div>
              <div class="form-group">
                <label class="form-label">Charisma</label>
                <input type="number" id="dwellerCharisma" class="form-input special-input" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}">
              </div>
              <div class="form-group">
                <label class="form-label">Intelligence</label>
                <input type="number" id="dwellerIntelligence" class="form-input special-input" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}">
              </div>
              <div class="form-group">
                <label class="form-label">Agility</label>
                <input type="number" id="dwellerAgility" class="form-input special-input" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}">
              </div>
              <div class="form-group">
                <label class="form-label">Luck</label>
                <input type="number" id="dwellerLuck" class="form-input special-input" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}">
              </div>
            </div>

            <!-- Equipment Section -->
            <h4 class="text-md font-semibold mb-4">Equipment</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="form-group">
                <label class="form-label">Weapon</label>
                <select id="dwellerWeapon" class="form-input">
                  <option value="">No Weapon</option>
                  <!-- Options will be populated dynamically -->
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Outfit</label>
                <select id="dwellerOutfit" class="form-input">
                  <option value="">No Outfit</option>
                  <!-- Options will be populated dynamically -->
                </select>
              </div>
            </div>

            <!-- Pet Section -->
            <h4 class="text-md font-semibold mb-4">Pet</h4>
            <div class="form-group mb-6">
              <label class="form-label">Pet</label>
              <select id="dwellerPet" class="form-input">
                <option value="">No Pet</option>
                <!-- Options will be populated dynamically -->
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4">
              <button id="saveDwellerChanges" class="btn btn-primary">Save Changes</button>
              <button id="resetDwellerForm" class="btn btn-secondary">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

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

export const createStatusTemplate = (): string => `
  <!-- Status Message -->
  <div id="statusMessage" class="mt-4 hidden">
    <div class="p-4 rounded-md">
      <p id="statusText"></p>
    </div>
  </div>
`;
