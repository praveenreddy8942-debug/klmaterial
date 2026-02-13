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
    // Reduce particle count based on device
    this.particleCount = window.innerWidth < 768 ? 20 : 50;
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationFrameId = null;
    this.init();
  }

  init() {
    // Only initialize on desktop or high-performance devices
    if (window.innerWidth < 768 && !this.isHighPerformance()) {
      return; // Skip particle system on mobile
    }
    this.createCanvas();
    this.createParticles();
    this.animate();
    this.attachEventListeners();
  }

  isHighPerformance() {
    // Check if device has good performance characteristics
    // Fallback to false if hardwareConcurrency is not supported
    return navigator.hardwareConcurrency ? navigator.hardwareConcurrency > 4 : false;
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
    if (!this.ctx) return; // Safety check
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Mouse interaction (only if mouse is active)
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

      // Connect nearby particles (only check next particles to avoid duplicates)
      for (let j = i + 1; j < this.particles.length; j++) {
        const otherParticle = this.particles[j];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 120)})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
        }
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  attachEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true }); // Add passive for better performance

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
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
    // Add reveal-on-scroll class to elements
    const selectors = ['.card', '.about-section', '.contact-card-modern', 'section', '.stat-card', '.feature-item'];
    
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

// 4. Typing Animation
class TypingEffect {
  constructor(element, texts, speed = 100) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.speed;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// 5. Scroll Progress Indicator
class ScrollProgress {
  constructor() {
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
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  }

  attachEventListeners() {
    window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
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
  }

  attachEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.cursor.style.left = e.clientX + 'px';
      this.cursor.style.top = e.clientY + 'px';
      
      this.cursorDot.style.left = e.clientX + 'px';
      this.cursorDot.style.top = e.clientY + 'px';
    }, { passive: true }); // Add passive for better performance

    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('cursor-hover');
        this.cursorDot.classList.add('cursor-hover');
      });
      
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('cursor-hover');
        this.cursorDot.classList.remove('cursor-hover');
      });
    });
  }
}

// 7. Animated Counter
class AnimatedCounter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = parseInt(target);
    this.duration = duration;
    this.startTime = null;
    this.animate();
  }

  animate() {
    if (!this.startTime) this.startTime = Date.now();
    
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    // Easing function
    const easeOutQuad = progress * (2 - progress);
    const current = Math.floor(easeOutQuad * this.target);
    
    this.element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.element.textContent = this.target;
    }
  }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Theme Manager
  new ThemeManager();

  // Particle System
  new ParticleSystem();

  // Scroll Reveal
  new ScrollReveal();

  // Scroll Progress
  new ScrollProgress();

  // Custom Cursor (desktop only)
  if (window.innerWidth >= 768) {
    new CustomCursor();
  }

  // Typing Effect (if element exists)
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    new TypingEffect(typingElement, [
      'Web Developer',
      'Data Enthusiast',
      'Problem Solver',
      'Tech Explorer'
    ]);
  }

  // Animated Counters (if they exist)
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-target');
          new AnimatedCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }
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
