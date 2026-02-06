// Reusable message modal template

export const createMessageModalTemplate = (): string => `
  <!-- General Message Modal -->
  <div id="messageModal" class="modal modal-hidden hidden">
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="messageModalTitle" class="text-lg font-semibold text-gray-100">Message</h3>
      </div>
      <div class="modal-body">
        <div id="messageModalIcon" class="text-center mb-4 text-4xl hidden">
          <span id="messageModalIconSymbol"></span>
        </div>
        <div id="messageModalContent" class="text-gray-300">
          <p id="messageModalText">This is a message.</p>
        </div>
      </div>
      <div class="modal-footer">
        <button id="messageModalCancel" class="btn btn-secondary hidden">Cancel</button>
        <button id="messageModalConfirm" class="btn btn-primary">OK</button>
      </div>
    </div>
  </div>
`;

/**
 * Modal types for consistent styling
 */
export const ModalType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  CONFIRM: 'confirm'
} as const;

export type ModalTypeValue = typeof ModalType[keyof typeof ModalType];

/**
 * Configuration for different modal types
 */
export const MODAL_CONFIGS = {
  [ModalType.INFO]: {
    titleClass: 'text-blue-400',
    icon: 'ℹ️',
    iconClass: 'text-blue-400',
    confirmClass: 'btn btn-primary',
    confirmText: 'OK',
    showCancel: false
  },
  [ModalType.SUCCESS]: {
    titleClass: 'text-green-400',
    icon: '✅',
    iconClass: 'text-green-400',
    confirmClass: 'btn btn-success',
    confirmText: 'OK',
    showCancel: false
  },
  [ModalType.WARNING]: {
    titleClass: 'text-yellow-400',
    icon: '⚠️',
    iconClass: 'text-yellow-400',
    confirmClass: 'btn btn-warning',
    confirmText: 'OK',
    showCancel: false
  },
  [ModalType.ERROR]: {
    titleClass: 'text-red-400',
    icon: '❌',
    iconClass: 'text-red-400',
    confirmClass: 'btn btn-danger',
    confirmText: 'OK',
    showCancel: false
  },
  [ModalType.CONFIRM]: {
    titleClass: 'text-yellow-400',
    icon: '⚠️',
    iconClass: 'text-yellow-400',
    confirmClass: 'btn btn-danger',
    confirmText: 'Confirm',
    showCancel: true
  }
};
