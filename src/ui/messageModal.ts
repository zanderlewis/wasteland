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
    // IMPORTANT: don’t lock initialize() unless we successfully bind.
    if (this.initialized) return;

    const modal = document.getElementById('messageModal') as HTMLDivElement | null;
    const confirmBtn = document.getElementById('messageModalConfirm') as HTMLButtonElement | null;
    const cancelBtn = document.getElementById('messageModalCancel') as HTMLButtonElement | null;

    if (!modal || !confirmBtn || !cancelBtn) {
      return;
    }

    this.initialized = true;

    // Force hidden no matter what CSS does
    modal.classList.add('modal-hidden');
    modal.style.display = 'none';

    // Confirm / OK
    confirmBtn.addEventListener('click', () => this.close(true));

    // Cancel
    cancelBtn.addEventListener('click', () => this.close(false));

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
    const modal = document.getElementById('messageModal') as HTMLDivElement | null;
    return !!modal && modal.style.display !== 'none';
  }

  private open(type: ModalTypeValue, title: string, message: string): void {
    const modal = document.getElementById('messageModal') as HTMLDivElement | null;
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

    // Title class
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

    if (cfg.showCancel) cancelBtn.classList.remove('hidden');
    else cancelBtn.classList.add('hidden');

    // Show (force via inline style)
    modal.classList.remove('modal-hidden');
    modal.style.display = 'flex';
  }

  private close(result: boolean): void {
    const modal = document.getElementById('messageModal') as HTMLDivElement | null;
    if (modal) {
      modal.classList.add('modal-hidden');
      modal.style.display = 'none';
    }

    const resolve = this.resolveFn;
    this.resolveFn = null;

    const wasConfirm = this.isConfirmMode;
    this.isConfirmMode = false;

    if (wasConfirm && resolve) resolve(result);
  }
}

export const messageModal = new MessageModal();
