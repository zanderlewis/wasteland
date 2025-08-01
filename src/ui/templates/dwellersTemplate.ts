// Dwellers management template
import { GAME_LIMITS } from '../../constants/gameConstants';

export const createDwellersSectionTemplate = (): string => `
  <!-- Dwellers Section -->
  <div id="dwellers-section" class="tab-content hidden">
    <!-- Batch Operations -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="text-lg font-semibold">Batch Operations</h3>
      </div>
      <div class="card-body">
        <div class="flex flex-wrap gap-2">
          <button id="maxHappinessAll" class="btn btn-success">Max All Happiness</button>
          <button id="healAll" class="btn btn-success">Heal All Dwellers</button>
          <button id="maxSpecialAll" class="btn btn-success">Max All SPECIAL</button>
        </div>
      </div>
    </div>

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

            <!-- Appearance Section -->
            <h4 class="text-md font-semibold mb-4">Appearance</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="form-group">
                <label class="form-label">Skin Color</label>
                <input type="color" id="dwellerSkinColor" class="form-input" value="#FFDBAC" title="Skin Color">
              </div>
              <div class="form-group">
                <label class="form-label">Hair Color</label>
                <input type="color" id="dwellerHairColor" class="form-input" value="#8B4513" title="Hair Color">
              </div>
              <div class="form-group">
                <label class="form-label">Hair Type</label>
                <select id="dwellerHairType" class="form-input" title="Hair style">
                  <option value="1">Short</option>
                  <option value="2">Long</option>
                  <option value="3">Wavy</option>
                  <option value="4">Curly</option>
                  <option value="5">Bald</option>
                  <option value="6">Ponytail</option>
                  <option value="7">Buzz Cut</option>
                  <option value="8">Mohawk</option>
                  <option value="9">Afro</option>
                  <option value="10">Dreadlocks</option>
                  <option value="11">Pigtails</option>
                  <option value="12">Braids</option>
                  <option value="13">Side Part</option>
                  <option value="14">Slicked Back</option>
                  <option value="15">Messy</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Facial Hair</label>
                <select id="dwellerFacialHair" class="form-input" title="Facial hair style">
                  <option value="1">None</option>
                  <option value="2">Mustache</option>
                  <option value="3">Goatee</option>
                  <option value="4">Full Beard</option>
                  <option value="5">Stubble</option>
                  <option value="6">Soul Patch</option>
                  <option value="7">Handlebar</option>
                  <option value="8">Van Dyke</option>
                  <option value="9">Mutton Chops</option>
                  <option value="10">Chin Strap</option>
                </select>
              </div>
            </div>

            <!-- Pregnancy Section -->
            <div class="pregnancy-field">
              <h4 class="text-md font-semibold mb-4">Pregnancy</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="form-group">
                  <label class="form-label">Pregnant</label>
                  <select id="dwellerPregnant" class="form-input">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Baby Ready Time</label>
                  <input type="number" id="dwellerBabyReadyTime" class="form-input" min="0" title="Time until baby is ready (seconds)">
                </div>
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
              <button id="maxSpecial" class="btn btn-success">Max SPECIAL</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
