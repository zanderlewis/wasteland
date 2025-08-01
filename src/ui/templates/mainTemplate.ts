// Main application template
import { createVaultSectionTemplate } from './vaultTemplate';
import { createDwellersSectionTemplate } from './dwellersTemplate';
import { createToolsSectionTemplate } from './toolsTemplate';
import { createStatusTemplate } from './statusTemplate';

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
