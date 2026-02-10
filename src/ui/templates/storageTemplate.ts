// Storage tab template

export const createStorageSectionTemplate = (): string => `
  <div id="storage-section" class="tab-content hidden">
    <div class="pip-panel">

      <!-- Left title badge -->
      <div class="pip-panel-title">
        <h3 class="text-lg font-semibold whitespace-nowrap">
          Storage <span id="storageCapacityText" class="text-green-300/90 font-semibold">0/0</span>
        </h3>
      </div>

      <!-- Right-side category buttons (aligned with title) -->
      <div class="pip-panel-title storage-title-actions" aria-label="Storage categories">
        <div class="flex items-center gap-2">
          <button id="storageTabWeapons" class="storage-subtab active" data-type="Weapon" type="button">WEAPONS</button>
          <button id="storageTabOutfits" class="storage-subtab" data-type="Outfit" type="button">OUTFITS</button>
          <button id="storageTabJunk" class="storage-subtab" data-type="Junk" type="button">JUNK</button>
          <button id="storageTabPets" class="storage-subtab" data-type="Pet" type="button">PETS</button>
        </div>
      </div>

      <div class="pip-panel-body p-4 pt-[22px]">
        <div id="storageList" class="storage-list"></div>

        <!-- Edit section (also used for adding new items) -->
        <div class="mt-4 border-t border-green-900/60 pt-3">
          <div class="flex flex-wrap items-end gap-2">
            <div class="flex flex-col">
              <label class="form-label" for="storageEditSelect">Item</label>
              <select id="storageEditSelect" class="form-input w-80 text-sm"></select>
            </div>

            <div class="flex flex-col">
              <label class="form-label" for="storageEditQty">Amount</label>
              <input id="storageEditQty" class="form-input w-24 text-sm" type="number" min="0" value="1" />
            </div>

            <button id="storageUpdateBtn" class="btn btn-primary btn-sm" type="button">Update</button>
            <button id="storageNewBtn" class="btn btn-secondary btn-sm" type="button">New</button>

            <div class="text-green-500/80 text-xs ml-auto">
              Set amount to <strong>0</strong> to delete.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
