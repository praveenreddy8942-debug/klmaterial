/**
 * AI Lighting Effect
 * Animated gradient/lighting effects layered behind page content.
 * 
 * Features:
 * - Performant (uses requestAnimationFrame)
 * - Respects prefers-reduced-motion preference
 * - Pauses when page is not visible (battery saving)
 * - Easy to disable or configure
 * 
 * Usage:
 * Include ai-lighting.css and ai-lighting.js in your page.
 * The effect auto-initializes on DOMContentLoaded.
 * 
 * Configuration:
 * Set window.AI_LIGHTING_CONFIG before loading this script:
 * window.AI_LIGHTING_CONFIG = { enabled: false }; // to disable
 */

(function() {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    enabled: true,
    containerId: 'ai-lighting',
    orbCount: 3,        // primary, secondary, tertiary
    lineCount: 3,       // number of sweep lines
    useRAF: true,       // use requestAnimationFrame for smoothness
    pauseOnHidden: true // pause when tab is not visible
  };

  // Merge with user config
  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.AI_LIGHTING_CONFIG || {});

  // Check for reduced motion preference
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // AI Lighting Controller
  class AILighting {
    constructor() {
      this.container = null;
      this.isActive = false;
      this.rafId = null;
      this.orbs = [];
    }

    init() {
      // Skip if disabled
      if (!CONFIG.enabled) {
        console.log('AI Lighting: Disabled via configuration');
        return;
      }

      // Create the lighting container
      this.createContainer();
      
      // Create lighting elements
      this.createOrbs();
      this.createLines();
      
      // Setup visibility observer for performance
      if (CONFIG.pauseOnHidden) {
        this.setupVisibilityObserver();
      }

      // Start if not reduced motion
      if (!prefersReducedMotion()) {
        this.start();
      }

      // Listen for motion preference changes
      this.setupMotionListener();

      console.log('AI Lighting: Initialized');
    }

    createContainer() {
      // Check if container already exists
      this.container = document.getElementById(CONFIG.containerId);
      
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = CONFIG.containerId;
        this.container.className = 'ai-lighting';
        this.container.setAttribute('aria-hidden', 'true');
        
        // Insert at the beginning of body
        document.body.insertBefore(this.container, document.body.firstChild);
      }
    }

    createOrbs() {
      const orbTypes = ['primary', 'secondary', 'tertiary'];
      
      for (let i = 0; i < CONFIG.orbCount && i < orbTypes.length; i++) {
        const orb = document.createElement('div');
        orb.className = `ai-lighting-orb ai-lighting-orb--${orbTypes[i]}`;
        this.container.appendChild(orb);
        this.orbs.push(orb);
      }
    }

    createLines() {
      for (let i = 1; i <= CONFIG.lineCount; i++) {
        const line = document.createElement('div');
        line.className = `ai-lighting-line ai-lighting-line--${i}`;
        this.container.appendChild(line);
      }
    }

    setupVisibilityObserver() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause();
        } else if (!prefersReducedMotion()) {
          this.resume();
        }
      });
    }

    setupMotionListener() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      const handler = (e) => {
        if (e.matches) {
          this.pause();
        } else {
          this.resume();
        }
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
      } else {
        // Legacy browsers
        mediaQuery.addListener(handler);
      }
    }

    start() {
      this.isActive = true;
      this.container.setAttribute('data-paused', 'false');
      
      // Note: animateWithRAF() is not called here because all animations
      // are currently CSS-based. Uncomment when JS-based animations are added:
      // if (CONFIG.useRAF) {
      //   this.animateWithRAF();
      // }
    }

    pause() {
      this.isActive = false;
      this.container.setAttribute('data-paused', 'true');
      
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    resume() {
      if (!this.isActive && !prefersReducedMotion()) {
        this.start();
      }
    }

    /**
     * Optional: Additional animation logic using requestAnimationFrame
     * The main animations are CSS-based for performance.
     * This method is a placeholder for future enhancements
     * like mouse-reactive lighting or dynamic color changes.
     * 
     * Currently not called to avoid wasting CPU cycles.
     * Uncomment the call in start() when JS-based animations are added.
     */
    animateWithRAF() {
      if (!this.isActive) return;

      // Add JS-based animation logic here when needed
      // Example: orb position based on mouse, dynamic color shifts, etc.

      this.rafId = requestAnimationFrame(() => this.animateWithRAF());
    }

    /**
     * Manually set lighting intensity
     * @param {number} intensity - Value between 0 and 1
     */
    setIntensity(intensity) {
      const clamped = Math.max(0, Math.min(1, intensity));
      this.container.style.opacity = (0.6 * clamped).toString();
    }

    /**
     * Enable the lighting effect
     */
    enable() {
      this.container.style.display = '';
      this.resume();
    }

    /**
     * Disable the lighting effect
     */
    disable() {
      this.pause();
      this.container.style.display = 'none';
    }

    /**
     * Destroy the lighting effect and clean up
     */
    destroy() {
      this.pause();
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      this.container = null;
      this.orbs = [];
    }
  }

  // Initialize on DOM ready
  function initLighting() {
    const lighting = new AILighting();
    lighting.init();
    
    // Expose for external control (namespaced to avoid conflicts)
    window.KLMaterial = window.KLMaterial || {};
    window.KLMaterial.aiLighting = lighting;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLighting);
  } else {
    initLighting();
  }
})();
