// Main application template
import { createVaultSectionTemplate } from './vaultTemplate';
import { createDwellersSectionTemplate } from './dwellersTemplate';
import { createToolsSectionTemplate } from './toolsTemplate';
import { createStatusTemplate } from './statusTemplate';
import { createMessageModalTemplate } from './messageModalTemplate';

export const createMainTemplate = (): string => `
  <div class="container p-6">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-100">Wasteland: Fallout Shelter Save Editor</h1>
    
    <!-- File Upload Section -->
    <div class="card mb-6">
      <div class="card-header mb-2">
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
          <!-- Use an example -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-200 mb-2">Load example save</h4>
            <div class="flex items-center gap-2">
              <select id="exampleFilesSelect" class="form-input w-56 text-sm"></select>
              <button id="loadExampleBtn" class="btn btn-primary btn-sm">Load</button>
            </div>
            <p class="text-xs text-gray-400 mt-2">Examples are bundled with the app and safe to load.</p>
          </div>
          <!-- How to Find Your Save File -->
          <div class="text-sm text-gray-500 mt-2">
            <strong>How to Find Your Save File:</strong>
            <div class="pl-2 mt-2 space-y-1">
              <div><strong>Windows:</strong> <code class="file-path">Documents\\My Games\\Fallout Shelter</code></div>
              <div><strong>Windows Store:</strong> <code class="file-path">%LOCALAPPDATA%\\FalloutShelter</code></div>
              <div><strong>Steam:</strong> <code class="file-path">C:\\Users\\YOURUSERNAME\\AppData\\Local\\FalloutShelter</code></div>
              <div><strong>Android:</strong> <code class="file-path">storage/sdcard/Android/data/com.bethsoft.falloutshelter/files</code></div>
            </div>
          </div>
        </div>
        <div id="fileStatus" class="mt-4 hidden">
          <p class="text-sm text-gray-400">File: <span id="fileName" class="font-medium text-gray-200"></span></p>
        </div>
      </div>
    </div>

    ${createStatusTemplate()}

    <!-- Save Editor Tabs -->
    <div id="editorSection" class="hidden">
      <div class="tab-container mb-4">
        <button class="tab active" data-section="vault">Vault</button>
        <button class="tab" data-section="dwellers">Dwellers</button>
        <button class="tab" data-section="tools">Tools</button>
      </div>

      ${createVaultSectionTemplate()}
      ${createDwellersSectionTemplate()}
      ${createToolsSectionTemplate()}
    </div>

    ${createMessageModalTemplate()}
  </div>
`;
