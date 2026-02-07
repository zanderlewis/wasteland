// Vault management template
import { GAME_LIMITS } from '../../constants/gameConstants';

export const createVaultSectionTemplate = (): string => `
  <!-- Vault Section -->
  <div id="vault-section" class="tab-content">
    <div class="pip-panel">
      <div class="pip-panel-title">
        <h3 class="text-lg font-semibold">Vault Management</h3>
      </div>
      <div class="card-body-tight">
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
