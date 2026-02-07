// Dwellers management template
import { GAME_LIMITS } from '../../constants/gameConstants';

export const createDwellersSectionTemplate = (): string => `
  <!-- Dwellers Section -->
  <div id="dwellers-section" class="tab-content hidden text-green-200">

    <!-- Dwellers Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
      <!-- List LEFT -->
      <div id="dwellerListContainer" class="card pip-panel flex flex-col min-h-0 w-full h-[900px]">
        <div class="pip-panel-title">Dwellers</div>
        <div class="pip-panel-header flex items-center justify-center gap-4 px-4 pt-4 pb-2">
          <div class="flex flex-wrap gap-2 justify-center w-full">
            <button id="healAll" class="btn btn-success btn-sm">Max All Health</button>
            <button id="maxSpecialAll" class="btn btn-success btn-sm">Max All SPECIAL</button>
            <button id="maxHappinessAll" class="btn btn-success btn-sm">Max All Happiness</button>
          </div>
        </div>
        <div id="dwellerList" class="flex-1 min-h-0 bg-gray-900 overflow-hidden">
          <div id="dwellerListScroll" class="h-full overflow-auto">
            <!-- Dwellers will be populated here -->
          </div>
        </div>
      </div>

      <!-- Editor RIGHT -->
      <div id="dwellerEditor" class="card pip-panel flex flex-col min-h-0 w-full h-[900px]">
        <div class="pip-panel-title">Edit Dweller</div>
        <div class="pip-panel-header px-4 pt-4 pb-2"><div class="sr-only">Edit Dweller</div></div>
        <div class="flex-1 min-h-0 p-2 overflow-y-auto">
          <form id="dwellerForm">
            <fieldset id="dwellerFieldset" disabled>
              <!-- Basic Info -->
              <h4 class="text-md font-semibold mb-3">Basic Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" id="dwellerName" class="form-input dweller-field">
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" id="dwellerLastName" class="form-input dweller-field">
                </div>
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <select id="dwellerGender" class="form-input dweller-field">
                    <option value="1">Female</option>
                    <option value="2">Male</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Level</label>
                  <input type="number" id="dwellerLevel" class="form-input dweller-field" min="${GAME_LIMITS.LEVEL_MIN}" max="${GAME_LIMITS.LEVEL_MAX}">
                </div>
                <div class="form-group">
                  <label class="form-label">Experience</label>
                  <input type="number" id="dwellerExperience" class="form-input dweller-field" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Happiness</label>
                  <input type="number" id="dwellerHappiness" class="form-input dweller-field" min="${GAME_LIMITS.HAPPINESS_MIN}" max="${GAME_LIMITS.HAPPINESS_MAX}">
                </div>
              </div>

              <!-- Health Section -->
              <h4 class="text-md font-semibold mt-5 mb-3">Health & Status</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="form-group">
                  <label class="form-label">Health</label>
                  <input type="number" id="dwellerHealth" class="form-input dweller-field" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Max Health</label>
                  <input type="number" id="dwellerMaxHealth" class="form-input dweller-field" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Radiation</label>
                  <input type="number" id="dwellerRadiation" class="form-input dweller-field" min="${GAME_LIMITS.RADIATION_MIN}" max="${GAME_LIMITS.RADIATION_MAX}">
                </div>
              </div>

              <!-- Appearance Section -->
              <h4 class="text-md font-semibold mt-6 mb-4">Appearance</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="form-group">
                  <label class="form-label">Skin Color</label>
                  <input type="color" id="dwellerSkinColor" class="form-input dweller-field" value="#FFDBAC" title="Skin Color">
                </div>
                <div class="form-group">
                  <label class="form-label">Hair Color</label>
                  <input type="color" id="dwellerHairColor" class="form-input dweller-field" value="#8B4513" title="Hair Color">
                </div>
              </div>

              <!-- Pregnancy Section -->
              <div id="pregnancySection" class="pregnancy-field">
                <h4 class="text-md font-semibold mt-6 mb-4">Pregnancy</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div class="form-group">
                    <label class="form-label">Pregnant</label>
                    <select id="dwellerPregnant" class="form-input dweller-field">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Baby Ready</label>
                    <select id="dwellerBabyReadyTime" class="form-input dweller-field" title="Whether baby is ready to be born">
                      <option value="false">Not Ready</option>
                      <option value="true">Ready</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SPECIAL Stats -->
              <div class="flex items-center justify-start gap-3 mt-4 mb-3">
                <h4 class="text-md font-semibold">SPECIAL Stats</h4>
                <button id="maxSpecial" class="btn btn-success btn-sm">Max SPECIAL</button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-5">
                <div class="form-group flex flex-col items-center">
                  <label class="form-label text-center">Strength</label>
                  <input type="range" id="dwellerStrength" class="special-slider dweller-field" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}" step="1">
                </div>
                <div class="form-group flex flex-col items-center">
                  <label class="form-label text-center">Perception</label>
                  <input type="range" id="dwellerPerception" class="special-slider dweller-field" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}" step="1">
                </div>
                <div class="form-group flex flex-col items-center">
                  <label class="form-label text-center">Endurance</label>
                  <input type="range" id="dwellerEndurance" class="special-slider dweller-field" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}" step="1">
                </div>
                <div class="form-group flex flex-col items-center">
                  <label class="form-label text-center">Charisma</label>
                  <input type="range" id="dwellerCharisma" class="special-slider dweller-field" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}" step="1">
                </div>
                <div class="form-group flex flex-col items-center">
                  <label class="form-label text-center">Intelligence</label>
                  <input type="range" id="dwellerIntelligence" class="special-slider dweller-field" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}" step="1">
                </div>
                <div class="form-group flex flex-col items-center">
                  <label class="form-label text-center">Agility</label>
                  <input type="range" id="dwellerAgility" class="special-slider dweller-field" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}" step="1">
                </div>
                <div class="form-group flex flex-col items-center">
                  <label class="form-label text-center">Luck</label>
                  <input type="range" id="dwellerLuck" class="special-slider dweller-field" min="${GAME_LIMITS.SPECIAL_MIN}" max="${GAME_LIMITS.SPECIAL_MAX}" step="1">
                </div>
              </div>

              <!-- Equipment Section -->
              <h4 class="text-md font-semibold mt-6 mb-4">Equipment</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="form-group">
                  <label class="form-label">Weapon</label>
                  <select id="dwellerWeapon" class="form-input dweller-field">
                    <option value="">No Weapon</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Outfit</label>
                  <select id="dwellerOutfit" class="form-input dweller-field">
                    <option value="">No Outfit</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                </div>
              </div>

              <!-- Pet Section -->
              <div>
                <h4 class="text-md font-semibold mb-4">Pet</h4>
                <div class="form-group">
                  <label class="form-label">Pet</label>
                  <select id="dwellerPet" class="form-input dweller-field">
                    <option value="">No Pet</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4 border-t border-gray-700">
                <button type="submit" id="saveDwellerChanges" class="btn btn-primary">Save Changes</button>
                <button type="button" id="resetDwellerForm" class="btn btn-secondary">Reset</button>
<button type="button" id="evictDweller" class="btn btn-danger">Evict Dweller</button>
              </div>
                        </fieldset>
          </form>
        </div>
      </div>
    </div>

<!-- Eviction Confirmation Modal -->
    <div id="evictionModal" class="modal modal-hidden" style="display:none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-red-400">⚠️ Confirm Dweller Eviction</h3>
        </div>
        <div class="modal-body">
          <p class="text-gray-300 mb-4">
            <strong class="text-red-400">WARNING:</strong> You are about to evict this dweller from your vault.
          </p>
          <p class="text-gray-300 mb-4">
            Dweller: <span id="evictionDwellerName" class="font-semibold text-white"></span>
          </p>
          <p class="text-gray-300 mb-4">
            This action will:
          </p>
          <ul class="list-disc pl-6 text-gray-300 mb-4 space-y-1">
            <li>Remove the dweller from all room assignments</li>
            <li>Mark them for eviction from the vault</li>
            <li>This action cannot be easily undone</li>
          </ul>
          <p class="text-red-400 font-medium">
            Are you sure you want to proceed?
          </p>
        </div>
        <div class="modal-footer">
          <button id="cancelEviction" class="btn btn-secondary">Cancel</button>
          <button id="confirmEviction" class="btn btn-danger">Yes, Evict Dweller</button>
        </div>
      </div>
    </div>
  </div>
`;
