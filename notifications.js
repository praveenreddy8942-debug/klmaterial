// ====================================
// Notification & Tooltip System
// ====================================

class NotificationSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create notification container
    this.container = document.createElement('div');
    this.container.id = 'notificationContainer';
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = this.getIcon(type);
    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-message">${message}</div>
      <button class="notification-close">&times;</button>
    `;

    this.container.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove
    const removeNotification = () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    };

    const timer = setTimeout(removeNotification, duration);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(timer);
      removeNotification();
    });
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }
}

// Tooltip System
class TooltipSystem {
  constructor() {
    this.tooltip = null;
    this.init();
  }

  init() {
    // Create tooltip element
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'custom-tooltip';
    document.body.appendChild(this.tooltip);

    // Attach listeners to all elements with data-tooltip
    this.attachListeners();
  }

  attachListeners() {
    const elements = document.querySelectorAll('[data-tooltip]');
    
    elements.forEach(el => {
      el.addEventListener('mouseenter', (e) => this.show(e));
      el.addEventListener('mouseleave', () => this.hide());
      el.addEventListener('mousemove', (e) => this.updatePosition(e));
    });
  }

  show(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;

    this.tooltip.textContent = text;
    this.tooltip.classList.add('show');
    this.updatePosition(e);
  }

  hide() {
    this.tooltip.classList.remove('show');
  }

  updatePosition(e) {
    const offset = 15;
    const tooltipRect = this.tooltip.getBoundingClientRect();
    
    let left = e.clientX + offset;
    let top = e.clientY + offset;

    // Keep tooltip in viewport
    if (left + tooltipRect.width > window.innerWidth) {
      left = e.clientX - tooltipRect.width - offset;
    }
    
    if (top + tooltipRect.height > window.innerHeight) {
      top = e.clientY - tooltipRect.height - offset;
    }

    this.tooltip.style.left = left + 'px';
    this.tooltip.style.top = top + 'px';
  }
}

// Initialize systems
document.addEventListener('DOMContentLoaded', () => {
  window.notifications = new NotificationSystem();
  new TooltipSystem();

  // Welcome notification
  setTimeout(() => {
    window.notifications.show('Welcome to KLMaterial Study Hub! 🎉', 'success');
  }, 1000);
});
