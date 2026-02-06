// src/ui/messageModal.ts
import {
  ModalType,
  type ModalTypeValue,
  MODAL_CONFIGS
} from './templates/messageModalTemplate';

type ResolveFn = (value: boolean) => void;

class MessageModal {
  private initialized = false;
  private isConfirmMode = false;
  private resolveFn: ResolveFn | null = null;

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    const modal = document.getElementById('messageModal');
    const confirmBtn = document.getElementById('messageModalConfirm') as HTMLButtonElement | null;
    const cancelBtn = document.getElementById('messageModalCancel') as HTMLButtonElement | null;

    // If template isn't in DOM yet, don't crash.
    // (But this should be present after createMainTemplate is rendered.)
    if (!modal || !confirmBtn || !cancelBtn) {
      // Fail silently to avoid hard-locking the app.
      // You can console.warn here if you want.
      return;
    }

    // Confirm / OK
    confirmBtn.addEventListener('click', () => {
      this.close(true);
    });

    // Cancel
    cancelBtn.addEventListener('click', () => {
      this.close(false);
    });

    // Backdrop click (only closes for non-confirm dialogs)
    modal.addEventListener('click', (e) => {
      if (e.target === modal && !this.isConfirmMode) {
        this.close(false);
      }
    });

    // ESC (only closes for non-confirm dialogs)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen() && !this.isConfirmMode) {
        this.close(false);
      }
    });
  }

  info(message: string, title = 'Message'): void {
    this.open(ModalType.INFO, title, message);
  }

  success(message: string, title = 'Success'): void {
    this.open(ModalType.SUCCESS, title, message);
  }

  warning(message: string, title = 'Warning'): void {
    this.open(ModalType.WARNING, title, message);
  }

  error(message: string, title = 'Error'): void {
    this.open(ModalType.ERROR, title, message);
  }

  confirm(message: string, title = 'Confirm'): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
      this.open(ModalType.CONFIRM, title, message);
    });
  }

  private isOpen(): boolean {
    const modal = document.getElementById('messageModal');
    return !!modal && !modal.classList.contains('modal-hidden');
  }

  private open(type: ModalTypeValue, title: string, message: string): void {
    const modal = document.getElementById('messageModal');
    const titleEl = document.getElementById('messageModalTitle');
    const textEl = document.getElementById('messageModalText');
    const iconWrap = document.getElementById('messageModalIcon');
    const iconSymbol = document.getElementById('messageModalIconSymbol');
    const confirmBtn = document.getElementById('messageModalConfirm') as HTMLButtonElement | null;
    const cancelBtn = document.getElementById('messageModalCancel') as HTMLButtonElement | null;

    if (!modal || !titleEl || !textEl || !confirmBtn || !cancelBtn) return;

    const cfg = MODAL_CONFIGS[type];
    this.isConfirmMode = type === ModalType.CONFIRM;

    // Title + message
    titleEl.textContent = title;
    textEl.textContent = message;

    // Title color class
    // reset then apply
    titleEl.className = `text-lg font-semibold ${cfg.titleClass}`;

    // Icon
    if (iconWrap && iconSymbol) {
      iconSymbol.textContent = cfg.icon;
      iconWrap.classList.remove('hidden');
      iconWrap.className = `text-center mb-4 text-4xl ${cfg.iconClass}`;
    }

    // Buttons
    confirmBtn.className = cfg.confirmClass;
    confirmBtn.textContent = cfg.confirmText;

    if (cfg.showCancel) {
      cancelBtn.classList.remove('hidden');
    } else {
      cancelBtn.classList.add('hidden');
    }

    // Finally show
    modal.classList.remove('modal-hidden');
  }

  private close(result: boolean): void {
    const modal = document.getElementById('messageModal');
    if (modal) modal.classList.add('modal-hidden');

    const resolve = this.resolveFn;
    this.resolveFn = null;

    const wasConfirm = this.isConfirmMode;
    this.isConfirmMode = false;

    // Only resolve promises for confirm mode.
    if (wasConfirm && resolve) resolve(result);
  }
}

export const messageModal = new MessageModal();
