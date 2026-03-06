// ====================================
// Advanced Features for KLMaterial Study Hub
// ====================================

// 1. Theme Switcher with Persistence
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.createToggleButton();
    this.applyTheme(this.theme);
    this.attachEventListeners();
  }

  createToggleButton() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
      <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    themeToggle.title = 'Toggle Theme';
    themeToggle.setAttribute('aria-label', 'Toggle colour theme');
    document.body.appendChild(themeToggle);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// 2. Particle Background System
class ParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this._rafId = null;
    this._paused = false;
    // Reduce particle count on mobile/low-end devices
    const isLowEnd = window.innerWidth < 600 || (navigator.deviceMemory && navigator.deviceMemory < 4);
    this.particleCount = isLowEnd ? 15 : 50;
    this.connectionDistance = 120;
    this.mouse = { x: null, y: null, radius: 150 };
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.animate();
    this.attachEventListeners();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particleCanvas';
    this.canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1
      });
    }
  }

  animate() {
    if (this._paused) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Build spatial grid for efficient neighbor lookup (avoids O(n²))
    const cellSize = this.connectionDistance;
    const grid = {};

    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.x -= (dx / distance) * force * 3;
          particle.y -= (dy / distance) * force * 3;
        }
      }

      // Draw particle
      this.ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Insert into spatial grid
      const cx = Math.floor(particle.x / cellSize);
      const cy = Math.floor(particle.y / cellSize);
      const key = cx + ',' + cy;
      if (!grid[key]) grid[key] = [];
      grid[key].push({ particle, index: i });
    });

    // Draw connections using spatial grid (only check neighboring cells)
    const checked = new Set();
    this.particles.forEach((particle, i) => {
      const cx = Math.floor(particle.x / cellSize);
      const cy = Math.floor(particle.y / cellSize);

      for (let nx = cx - 1; nx <= cx + 1; nx++) {
        for (let ny = cy - 1; ny <= cy + 1; ny++) {
          const neighbors = grid[nx + ',' + ny];
          if (!neighbors) continue;

          for (const neighbor of neighbors) {
            if (neighbor.index <= i) continue; // avoid duplicate pairs
            const pairKey = i + '-' + neighbor.index;
            if (checked.has(pairKey)) continue;
            checked.add(pairKey);

            const dx = particle.x - neighbor.particle.x;
            const dy = particle.y - neighbor.particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.connectionDistance) {
              this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / this.connectionDistance)})`;
              this.ctx.lineWidth = 1;
              this.ctx.beginPath();
              this.ctx.moveTo(particle.x, particle.y);
              this.ctx.lineTo(neighbor.particle.x, neighbor.particle.y);
              this.ctx.stroke();
            }
          }
        }
      }
    });

    this._rafId = requestAnimationFrame(() => this.animate());
  }

  attachEventListeners() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Pause animation when tab is hidden to save CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this._paused = true;
        if (this._rafId) cancelAnimationFrame(this._rafId);
      } else {
        this._paused = false;
        this.animate();
      }
    });
  }
}

// 3. Scroll Reveal Animations
class ScrollReveal {
  constructor() {
    this.elements = [];
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    this.observe();
  }

  observe() {
    // Add reveal-on-scroll class to elements (excluding <section> to avoid hiding entire page sections)
    const selectors = ['.card', '.about-section', '.contact-card-modern', '.stat-card', '.feature-item', '.year-card', '.resource-card', '.repeat-card', '.stat-item', '.category-btn'];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (!el.classList.contains('revealed')) {
          el.classList.add('reveal-on-scroll');
          this.observer.observe(el);
        }
      });
    });
  }
}

// 5. Scroll Progress Indicator
class ScrollProgress {
  constructor() {
    this._ticking = false;
    this.createProgressBar();
    this.updateProgress();
    this.attachEventListeners();
  }

  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
  }

  updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
    this._ticking = false;
  }

  attachEventListeners() {
    window.addEventListener('scroll', () => {
      if (!this._ticking) {
        this._ticking = true;
        requestAnimationFrame(() => this.updateProgress());
      }
    });
  }
}

// 6. Custom Cursor
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.cursorDot = null;
    this.init();
  }

  init() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    this.createCursor();
    this.attachEventListeners();
  }

  createCursor() {
    // Main cursor
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);

    // Cursor dot
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(this.cursorDot);

    // Hide native cursor
    document.body.classList.add('custom-cursor-active');
  }

  attachEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.cursor.style.left = e.clientX + 'px';
      this.cursor.style.top = e.clientY + 'px';

      this.cursorDot.style.left = e.clientX + 'px';
      this.cursorDot.style.top = e.clientY + 'px';
    });

    // Use event delegation for hover — works on dynamically added elements (chatbot, material cards)
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .card, input, textarea, .material-card, .gchat-qr-btn, .selector-pill')) {
        this.cursor.classList.add('cursor-hover');
        this.cursorDot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .card, input, textarea, .material-card, .gchat-qr-btn, .selector-pill')) {
        this.cursor.classList.remove('cursor-hover');
        this.cursorDot.classList.remove('cursor-hover');
      }
    });
  }
}

// 7. Hero Typing Effect
class TypeWriter {
  constructor(el, phrases, opts = {}) {
    this.el = el;
    this.phrases = phrases;
    this.typeSpeed = opts.typeSpeed || 60;
    this.deleteSpeed = opts.deleteSpeed || 35;
    this.pauseAfterType = opts.pauseAfterType || 2000;
    this.pauseAfterDelete = opts.pauseAfterDelete || 400;
    this.index = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    if (this.el) this.tick();
  }

  tick() {
    const current = this.phrases[this.index];
    if (this.isDeleting) {
      this.charIndex--;
      this.el.textContent = current.substring(0, this.charIndex);
      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.index = (this.index + 1) % this.phrases.length;
        setTimeout(() => this.tick(), this.pauseAfterDelete);
        return;
      }
      setTimeout(() => this.tick(), this.deleteSpeed);
    } else {
      this.charIndex++;
      this.el.textContent = current.substring(0, this.charIndex);
      if (this.charIndex === current.length) {
        this.isDeleting = true;
        setTimeout(() => this.tick(), this.pauseAfterType);
        return;
      }
      setTimeout(() => this.tick(), this.typeSpeed);
    }
  }
}

// 8. PWA Install Prompt
class PWAInstallPrompt {
  constructor() {
    this.deferredPrompt = null;
    this.banner = null;
    this.init();
  }

  init() {
    // Track visit count
    const visits = parseInt(localStorage.getItem('klm-visits') || '0', 10) + 1;
    localStorage.setItem('klm-visits', visits.toString());

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      // Show banner on 2nd visit or later
      if (visits >= 2 && !localStorage.getItem('klm-pwa-dismissed')) {
        setTimeout(() => this.showBanner(), 3000);
      }
    });
  }

  showBanner() {
    this.banner = document.createElement('div');
    this.banner.className = 'pwa-install-banner';
    this.banner.innerHTML = `
      <span class="pwa-text"><i class="fa-solid fa-mobile-screen"></i> Install KL Material for offline access</span>
      <button class="pwa-install-btn" id="pwa-install-btn">Install</button>
      <button class="pwa-dismiss-btn" id="pwa-dismiss-btn" aria-label="Dismiss">✕</button>
    `;
    document.body.appendChild(this.banner);

    // Slide in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.banner.classList.add('visible');
      });
    });

    // Install button
    this.banner.querySelector('#pwa-install-btn').addEventListener('click', async () => {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
          localStorage.setItem('klm-pwa-dismissed', 'true');
        }
        this.deferredPrompt = null;
      }
      this.hideBanner();
    });

    // Dismiss button
    this.banner.querySelector('#pwa-dismiss-btn').addEventListener('click', () => {
      localStorage.setItem('klm-pwa-dismissed', 'true');
      this.hideBanner();
    });

    // Auto-hide after 10s
    setTimeout(() => this.hideBanner(), 10000);
  }

  hideBanner() {
    if (this.banner) {
      this.banner.classList.remove('visible');
      setTimeout(() => this.banner.remove(), 500);
    }
  }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Theme Manager
  new ThemeManager();

  // Particle System (desktop only — saves CPU/battery on mobile)
  if (window.innerWidth >= 768) {
    new ParticleSystem();
  }

  // Scroll Reveal
  new ScrollReveal();

  // Scroll Progress
  new ScrollProgress();

  // Custom Cursor (desktop only)
  if (window.innerWidth >= 768) {
    new CustomCursor();
  }

  // Hero Typing Effect (homepage only)
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    new TypeWriter(typedEl, [
      'Study smarter, not harder',
      'Your CSE journey starts here',
      '100+ materials, always free',
      'Built for KL University students'
    ]);
  }

  // PWA Install Prompt
  new PWAInstallPrompt();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
