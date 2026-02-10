// Storage tab template

export const createStorageSectionTemplate = (): string => `
  <div id="storage-section" class="tab-content hidden">
    <div class="pip-panel">
      <div class="pip-panel-title">
        <h2 class="text-xl font-semibold whitespace-nowrap">STORAGE</h2>
      </div>

      <div class="pip-panel-body">
        <div class="flex items-center gap-4 mb-4">
          <button id="storageTabWeapons" class="storage-subtab active" data-type="Weapon">WEAPONS</button>
          <button id="storageTabOutfits" class="storage-subtab" data-type="Outfit">OUTFITS</button>
          <button id="storageTabJunk" class="storage-subtab" data-type="Junk">JUNK</button>
          <button id="storageTabPets" class="storage-subtab" data-type="Pet">PETS</button>
        </div>

        <div id="storageList" class="storage-list"></div>

        <div class="mt-4 flex items-center justify-between gap-3">
          <div id="storageAddForm" class="flex items-center gap-2 hidden">
            <select id="storageAddSelect" class="form-input w-72 text-sm"></select>
            <input id="storageAddQty" class="form-input w-20 text-sm" type="number" min="1" value="1" />
            <button id="storageAddConfirm" class="btn btn-primary btn-sm">Add</button>
            <button id="storageAddCancel" class="btn btn-secondary btn-sm">Cancel</button>
          </div>
          <button id="storageAddBtn" class="btn btn-primary">Add Item</button>
        </div>
      </div>
    </div>
  </div>
`;
