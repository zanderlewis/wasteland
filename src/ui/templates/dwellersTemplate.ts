// Dweller management interface template

export const createDwellersTemplate = (): string => `
  <!--
    Fixed-height two-column layout:
    - Prevent the dweller list panel from growing taller than the editor.
    - The dweller list scrolls inside its panel instead.
  -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-[calc(100vh-260px)] min-h-[560px]">

    <!-- Dweller List + Quick Batch Ops -->
    <div class="pip-panel h-full flex flex-col min-h-0">
      <div class="pip-panel-title">Dwellers</div>
      <div class="pip-panel-body p-3 flex flex-col flex-1 min-h-0">
        <div class="flex items-center justify-center gap-2 mb-3">
          <button id="maxSpecialAll" class="btn btn-success btn-sm">Max All SPECIAL</button>
          <button id="healAll" class="btn btn-success btn-sm">Heal All Dwellers</button>
          <button id="maxHappinessAll" class="btn btn-success btn-sm">Max All Happiness</button>
        </div>

        <div id="dwellerListScroll" class="dweller-list flex-1 min-h-0 overflow-y-auto relative"></div>
      </div>
    </div>

    <!-- Dweller Editor -->
    <div class="pip-panel h-full flex flex-col min-h-0">
      <div class="pip-panel-title">Edit Dweller</div>
      <div class="pip-panel-body p-3 flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div id="dwellerEditorStatus" class="text-green-200/80 mb-2">Select a dweller to edit</div>

        <form id="dwellerForm" class="space-y-2">
          <fieldset id="dwellerFieldset" disabled>

            <div class="grid grid-cols-2 gap-2">
              <div class="form-group mb-2">
                <label class="form-label" for="dwellerName">First Name</label>
                <input id="dwellerName" class="form-input" type="text" />
              </div>
              <div class="form-group mb-2">
                <label class="form-label" for="dwellerLastName">Last Name</label>
                <input id="dwellerLastName" class="form-input" type="text" />
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerGender">Gender</label>
                <select id="dwellerGender" class="form-input"></select>
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerLevel">Level</label>
                <input id="dwellerLevel" class="form-input" type="number" min="1" max="50" />
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerExperience">Experience</label>
                <input id="dwellerExperience" class="form-input" type="number" min="0" />
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerHappiness">Happiness</label>
                <input id="dwellerHappiness" class="form-input" type="number" min="0" max="100" />
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerHealth">Health</label>
                <input id="dwellerHealth" class="form-input" type="number" min="0" />
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerMaxHealth">Max Health</label>
                <input id="dwellerMaxHealth" class="form-input" type="number" min="1" />
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerRadiation">Radiation</label>
                <input id="dwellerRadiation" class="form-input" type="number" min="0" />
              </div>

              <!-- Pregnancy flags (checkboxes) -->
              <div class="form-group mb-2">
                <div class="flex items-center justify-between">
                  <label class="form-label mb-0" for="dwellerPregnant">Pregnant</label>
                  <input id="dwellerPregnant" type="checkbox" class="pip-checkbox" />
                </div>
              </div>

              <div class="form-group mb-2">
                <div class="flex items-center justify-between">
                  <label class="form-label mb-0" for="dwellerBabyReadyTime">Baby Ready</label>
                  <input id="dwellerBabyReadyTime" type="checkbox" class="pip-checkbox" />
                </div>
              </div>
            </div>

            <!-- SPECIAL -->
            <div class="flex items-center justify-between mt-3">
              <h4 class="text-green-200 uppercase tracking-wide">SPECIAL Stats</h4>
              <button id="maxSpecial" type="button" class="btn btn-success btn-sm">Max SPECIAL</button>
            </div>

            <div class="grid grid-cols-7 gap-2 mt-2">
              <div class="text-center">
                <div class="text-green-200/80">S</div>
                <div class="special-slider">
                  <input id="dwellerStrength" type="range" min="1" max="10" value="1" class="special-slider-input" />
                  <div class="special-slider-bubble">1</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-green-200/80">P</div>
                <div class="special-slider">
                  <input id="dwellerPerception" type="range" min="1" max="10" value="1" class="special-slider-input" />
                  <div class="special-slider-bubble">1</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-green-200/80">E</div>
                <div class="special-slider">
                  <input id="dwellerEndurance" type="range" min="1" max="10" value="1" class="special-slider-input" />
                  <div class="special-slider-bubble">1</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-green-200/80">C</div>
                <div class="special-slider">
                  <input id="dwellerCharisma" type="range" min="1" max="10" value="1" class="special-slider-input" />
                  <div class="special-slider-bubble">1</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-green-200/80">I</div>
                <div class="special-slider">
                  <input id="dwellerIntelligence" type="range" min="1" max="10" value="1" class="special-slider-input" />
                  <div class="special-slider-bubble">1</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-green-200/80">A</div>
                <div class="special-slider">
                  <input id="dwellerAgility" type="range" min="1" max="10" value="1" class="special-slider-input" />
                  <div class="special-slider-bubble">1</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-green-200/80">L</div>
                <div class="special-slider">
                  <input id="dwellerLuck" type="range" min="1" max="10" value="1" class="special-slider-input" />
                  <div class="special-slider-bubble">1</div>
                </div>
              </div>
            </div>

            <!-- Equipment -->
            <div class="mt-3">
              <h4 class="text-green-200 uppercase tracking-wide">Equipment</h4>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="form-group mb-2">
                <label class="form-label" for="dwellerWeapon">Weapon</label>
                <select id="dwellerWeapon" class="form-input"></select>
              </div>

              <div class="form-group mb-2">
                <label class="form-label" for="dwellerOutfit">Outfit</label>
                <select id="dwellerOutfit" class="form-input"></select>
              </div>

              <div class="form-group mb-2 col-span-2">
                <label class="form-label" for="dwellerPet">Pet</label>
                <select id="dwellerPet" class="form-input"></select>
              </div>
            </div>

            <!-- Save / Reset -->
            <div class="flex items-center gap-2 pt-2">
              <button id="saveDwellerChanges" type="submit" class="btn btn-success">Save Changes</button>
              <button id="resetDwellerForm" type="button" class="btn btn-secondary">Reset</button>
              <button id="evictDweller" type="button" class="btn btn-danger ml-auto">Evict Dweller</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
`;

/**
 * Tab wrapper so the Dwellers UI is only visible when the DWELLERS tab is active.
 * (EventManager switches visibility by toggling `.hidden` on `.tab-content` sections.)
 */
export const createDwellersSectionTemplate = (): string => `
  <div id="dwellers-section" class="tab-content hidden">
    ${createDwellersTemplate()}
  </div>
`;
