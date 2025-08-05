// Status message template

export const createStatusTemplate = (): string => `
  <!-- Status Message (for inline notifications) -->
  <div id="statusMessage" class="mt-4 hidden">
    <div class="p-4 rounded-md">
      <p id="statusText"></p>
    </div>
  </div>
  
  <!-- Toast notifications container -->
  <div id="toastContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>
`;
