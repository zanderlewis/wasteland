// Message Modal Manager
import { ModalType, MODAL_CONFIGS, type ModalTypeValue } from './templates/messageModalTemplate';

export interface MessageModalOptions {
  title?: string;
  message: string;
  type?: ModalTypeValue;
  confirmText?: string;
  cancelText?: string;
  showIcon?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Manages the global message modal for consistent messaging throughout the app
 */
export class MessageModalManager {
  private modal: HTMLElement | null = null;
  private isInitialized = false;

  /**
   * Initialize the modal manager
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    this.modal = document.getElementById('messageModal');
    if (!this.modal) {
      console.error('Message modal not found in DOM');
      return;
    }

    this.setupEventListeners();
    this.isInitialized = true;
  }

  /**
   * Show a message modal
   */
  show(options: MessageModalOptions): Promise<boolean> {
    if (!this.isInitialized || !this.modal) {
      console.error('MessageModalManager not initialized');
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      const type = options.type || ModalType.INFO;
      const config = MODAL_CONFIGS[type];

      this.setupModal(options, config);
      this.showModal();

      // Set up one-time event listeners for this modal instance
      const confirmHandler = () => {
        this.hideModal();
        if (options.onConfirm) {
          options.onConfirm();
        }
        resolve(true);
        this.cleanupEventListeners(confirmHandler, cancelHandler);
      };

      const cancelHandler = () => {
        this.hideModal();
        if (options.onCancel) {
          options.onCancel();
        }
        resolve(false);
        this.cleanupEventListeners(confirmHandler, cancelHandler);
      };

      const confirmBtn = document.getElementById('messageModalConfirm');
      const cancelBtn = document.getElementById('messageModalCancel');

      if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmHandler);
      }

      if (cancelBtn && config.showCancel) {
        cancelBtn.addEventListener('click', cancelHandler);
      }

      // Close on escape key
      const escapeHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cancelHandler();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    });
  }

  /**
   * Show an info message
   */
  showInfo(message: string, title?: string): Promise<boolean> {
    return this.show({
      message,
      title: title || 'Information',
      type: ModalType.INFO,
      showIcon: true
    });
  }

  /**
   * Show a success message
   */
  showSuccess(message: string, title?: string): Promise<boolean> {
    return this.show({
      message,
      title: title || 'Success',
      type: ModalType.SUCCESS,
      showIcon: true
    });
  }

  /**
   * Show a warning message
   */
  showWarning(message: string, title?: string): Promise<boolean> {
    return this.show({
      message,
      title: title || 'Warning',
      type: ModalType.WARNING,
      showIcon: true
    });
  }

  /**
   * Show an error message
   */
  showError(message: string, title?: string): Promise<boolean> {
    return this.show({
      message,
      title: title || 'Error',
      type: ModalType.ERROR,
      showIcon: true
    });
  }

  /**
   * Show a confirmation dialog
   */
  showConfirm(
    message: string,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ): Promise<boolean> {
    return this.show({
      message,
      title: title || 'Confirm',
      type: ModalType.CONFIRM,
      confirmText: confirmText || 'Confirm',
      cancelText: cancelText || 'Cancel',
      showIcon: true
    });
  }

  /**
   * Hide the modal
   */
  hideModal(): void {
    if (this.modal) {
      this.modal.classList.add('modal-hidden');
    }
  }

  /**
   * Show the modal
   */
  private showModal(): void {
    if (this.modal) {
      this.modal.classList.remove('modal-hidden');
    }
  }

  /**
   * Setup modal content based on options and config
   */
  private setupModal(options: MessageModalOptions, config: any): void {
    const title = document.getElementById('messageModalTitle');
    const icon = document.getElementById('messageModalIcon');
    const iconSymbol = document.getElementById('messageModalIconSymbol');
    const text = document.getElementById('messageModalText');
    const confirmBtn = document.getElementById('messageModalConfirm');
    const cancelBtn = document.getElementById('messageModalCancel');

    // Set title
    if (title) {
      title.textContent = options.title || 'Message';
      title.className = `text-lg font-semibold ${config.titleClass}`;
    }

    // Set icon
    if (icon && iconSymbol && options.showIcon !== false) {
      iconSymbol.textContent = config.icon;
      iconSymbol.className = config.iconClass;
      icon.classList.remove('hidden');
    } else if (icon) {
      icon.classList.add('hidden');
    }

    // Set message
    if (text) {
      text.textContent = options.message;
    }

    // Set confirm button
    if (confirmBtn) {
      confirmBtn.textContent = options.confirmText || config.confirmText;
      confirmBtn.className = config.confirmClass;
    }

    // Set cancel button
    if (cancelBtn) {
      if (config.showCancel) {
        cancelBtn.textContent = options.cancelText || 'Cancel';
        cancelBtn.classList.remove('hidden');
      } else {
        cancelBtn.classList.add('hidden');
      }
    }
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    if (!this.modal) return;

    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });
  }

  /**
   * Clean up event listeners for a specific modal instance
   */
  private cleanupEventListeners(confirmHandler: () => void, cancelHandler: () => void): void {
    const confirmBtn = document.getElementById('messageModalConfirm');
    const cancelBtn = document.getElementById('messageModalCancel');

    if (confirmBtn) {
      confirmBtn.removeEventListener('click', confirmHandler);
    }

    if (cancelBtn) {
      cancelBtn.removeEventListener('click', cancelHandler);
    }
  }
}

// Create and export a singleton instance
export const messageModal = new MessageModalManager();
