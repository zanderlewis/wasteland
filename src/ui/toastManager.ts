// Toast Notification Manager
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number; // Duration in milliseconds, default 3000
  showIcon?: boolean;
}

/**
 * Manages toast notifications that appear in the top-right corner
 */
export class ToastManager {
  private container: HTMLElement | null = null;
  private toastCounter = 0;

  /**
   * Initialize the toast manager
   */
  initialize(): void {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      console.error('Toast container not found in DOM');
    }
  }

  /**
   * Show a toast notification
   */
  show(options: ToastOptions): void {
    if (!this.container) {
      console.error('ToastManager not initialized');
      return;
    }

    const toastId = `toast-${++this.toastCounter}`;
    const duration = options.duration || 3000;
    const config = this.getToastConfig(options.type);

    // Create toast element
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast ${config.baseClass} animate-slide-in`;
    
    const iconHtml = options.showIcon !== false 
      ? `<span class="toast-icon">${config.icon}</span>` 
      : '';

    toast.innerHTML = `
      <div class="toast-content">
        ${iconHtml}
        <span class="toast-message">${this.escapeHtml(options.message)}</span>
        <button class="toast-close" aria-label="Close">×</button>
      </div>
    `;

    // Add to container
    this.container.appendChild(toast);

    // Setup close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideToast(toastId));
    }

    // Auto-dismiss after duration
    setTimeout(() => {
      this.hideToast(toastId);
    }, duration);
  }

  /**
   * Show a success toast
   */
  showSuccess(message: string, duration?: number): void {
    this.show({
      message,
      type: 'success',
      duration,
      showIcon: true
    });
  }

  /**
   * Show an error toast
   */
  showError(message: string, duration?: number): void {
    this.show({
      message,
      type: 'error',
      duration: duration || 5000, // Longer duration for errors
      showIcon: true
    });
  }

  /**
   * Show an info toast
   */
  showInfo(message: string, duration?: number): void {
    this.show({
      message,
      type: 'info',
      duration,
      showIcon: true
    });
  }

  /**
   * Show a warning toast
   */
  showWarning(message: string, duration?: number): void {
    this.show({
      message,
      type: 'warning',
      duration: duration || 4000, // Slightly longer for warnings
      showIcon: true
    });
  }

  /**
   * Hide a specific toast
   */
  private hideToast(toastId: string): void {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.classList.add('animate-slide-out');
      
      // Remove after animation completes
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300); // Match CSS animation duration
    }
  }

  /**
   * Get configuration for toast type
   */
  private getToastConfig(type: ToastType) {
    const configs = {
      success: {
        baseClass: 'toast-success bg-green-600 border-green-500 text-green-100',
        icon: '✅'
      },
      error: {
        baseClass: 'toast-error bg-red-600 border-red-500 text-red-100',
        icon: '❌'
      },
      info: {
        baseClass: 'toast-info bg-blue-600 border-blue-500 text-blue-100',
        icon: 'ℹ️'
      },
      warning: {
        baseClass: 'toast-warning bg-yellow-600 border-yellow-500 text-yellow-100',
        icon: '⚠️'
      }
    };

    return configs[type];
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Create and export a singleton instance
export const toastManager = new ToastManager();
