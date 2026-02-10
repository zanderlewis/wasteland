// Storage tab template

export const createStorageSectionTemplate = (): string => `
  <div id="storage-section" class="tab-content hidden">
    <div class="pip-panel">
      <div class="pip-panel-title storage-title">
        <div class="storage-title-left">
          <h2 class="text-xl font-semibold whitespace-nowrap">STORAGE</h2>
          <span id="storageCapacityText" class="storage-capacity whitespace-nowrap">0/0</span>
        </div>
        <div class="storage-title-actions" aria-label="Storage category">
          <button id="storageTabWeapons" class="storage-subtab active" data-type="Weapon">WEAPONS</button>
          <button id="storageTabOutfits" class="storage-subtab" data-type="Outfit">OUTFITS</button>
          <button id="storageTabJunk" class="storage-subtab" data-type="Junk">JUNK</button>
          <button id="storageTabPets" class="storage-subtab" data-type="Pet">PETS</button>
        </div>
      </div>

      <div class="pip-panel-body">
        <div id="storageList" class="storage-list"></div>

        <div class="mt-4 flex items-center justify-between gap-3">
          <div id="storageEditForm" class="flex items-center gap-2 w-full">
            <select id="storageEditSelect" class="form-input w-80 text-sm"></select>
            <input id="storageEditQty" class="form-input w-24 text-sm" type="number" min="0" value="1" />
            <button id="storageUpdateBtn" class="btn btn-primary btn-sm whitespace-nowrap">Update</button>
            <button id="storageNewBtn" class="btn btn-secondary btn-sm whitespace-nowrap">New</button>
            <span id="storageEditHint" class="text-green-500/70 text-sm ml-2 whitespace-nowrap hidden">Select an item</span>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
