/**
 * AI Lighting Visual Effect
 * Creates a performant canvas-based animated background with glowing orbs.
 * 
 * Features:
 * - Respects prefers-reduced-motion
 * - Runtime API to enable/disable
 * - Performant requestAnimationFrame-based animation
 * - Automatic cleanup and resize handling
 * 
 * Usage:
 *   <script src="./assets/ai-lighting.js" defer></script>
 *   <link rel="stylesheet" href="./assets/ai-lighting.css">
 * 
 * API:
 *   AILighting.enable()  - Start the animation
 *   AILighting.disable() - Stop and hide the animation
 *   AILighting.toggle()  - Toggle animation state
 *   AILighting.isEnabled() - Check if animation is running
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    orbCount: 5,
    minRadius: 80,
    maxRadius: 200,
    minSpeed: 0.2,
    maxSpeed: 0.6,
    colors: [
      'rgba(0, 212, 255, 0.4)',   // Cyan
      'rgba(0, 153, 204, 0.35)',  // Darker cyan
      'rgba(100, 181, 246, 0.3)', // Light blue
      'rgba(0, 188, 212, 0.35)',  // Teal
      'rgba(3, 169, 244, 0.3)'    // Blue
    ],
    fps: 60, // Target frame rate
    pauseWhenHidden: true
  };

  // State
  let container = null;
  let canvas = null;
  let ctx = null;
  let orbs = [];
  let animationId = null;
  let isEnabled = false;
  let lastFrameTime = 0;
  let prefersReducedMotion = false;

  /**
   * Check if user prefers reduced motion
   */
  function checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mediaQuery.matches;

    // Listen for changes - disable animation if user enables reduced motion
    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion && isEnabled) {
        disable();
      }
      // Note: We don't auto-enable when preference changes to no-preference
      // to avoid unexpected behavior. Users must manually call AILighting.enable()
    });
  }

  /**
   * Create an orb object
   */
  function createOrb() {
    const radius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
    return {
      x: Math.random() * (canvas.width + radius * 2) - radius,
      y: Math.random() * (canvas.height + radius * 2) - radius,
      radius: radius,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
      vx: (Math.random() - 0.5) * CONFIG.maxSpeed,
      vy: (Math.random() - 0.5) * CONFIG.maxSpeed,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02
    };
  }

  /**
   * Initialize orbs
   */
  function initOrbs() {
    orbs = [];
    for (let i = 0; i < CONFIG.orbCount; i++) {
      orbs.push(createOrb());
    }
  }

  /**
   * Update orb positions
   * @param {number} deltaTime - Time since last frame in ms
   */
  function updateOrbs(deltaTime) {
    const speedFactor = deltaTime / 16.67; // Normalize to 60fps
    
    for (const orb of orbs) {
      // Update position
      orb.x += orb.vx * speedFactor;
      orb.y += orb.vy * speedFactor;
      orb.phase += orb.pulseSpeed * speedFactor;

      // Wrap around edges
      if (orb.x < -orb.radius * 2) {
        orb.x = canvas.width + orb.radius;
      } else if (orb.x > canvas.width + orb.radius * 2) {
        orb.x = -orb.radius;
      }

      if (orb.y < -orb.radius * 2) {
        orb.y = canvas.height + orb.radius;
      } else if (orb.y > canvas.height + orb.radius * 2) {
        orb.y = -orb.radius;
      }
    }
  }

  /**
   * Draw orbs to canvas
   */
  function drawOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const orb of orbs) {
      // Calculate pulsing radius
      const pulseScale = 0.9 + Math.sin(orb.phase) * 0.1;
      const currentRadius = orb.radius * pulseScale;

      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, currentRadius
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      // Draw orb
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /**
   * Animation loop
   * @param {number} timestamp - Current timestamp
   */
  function animate(timestamp) {
    if (!isEnabled) return;

    // Calculate delta time
    const deltaTime = timestamp - lastFrameTime;
    
    // Frame rate limiting
    if (deltaTime < 1000 / CONFIG.fps) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTime = timestamp;

    updateOrbs(deltaTime);
    drawOrbs();

    animationId = requestAnimationFrame(animate);
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reinitialize orbs for new dimensions
    initOrbs();
  }

  /**
   * Handle visibility change (pause when tab is hidden)
   */
  function handleVisibilityChange() {
    if (!CONFIG.pauseWhenHidden) return;

    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!document.hidden && isEnabled && !animationId) {
      lastFrameTime = performance.now();
      animationId = requestAnimationFrame(animate);
    }
  }

  /**
   * Create the canvas element
   */
  function createCanvas() {
    container = document.createElement('div');
    container.className = 'ai-lighting-container';
    container.setAttribute('aria-hidden', 'true');
    container.setAttribute('role', 'presentation');

    canvas = document.createElement('canvas');
    canvas.className = 'ai-lighting-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    container.appendChild(canvas);
    document.body.insertBefore(container, document.body.firstChild);
    
    // Add static fallback for reduced motion users
    const fallback = document.createElement('div');
    fallback.className = 'ai-lighting-fallback';
    fallback.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(fallback, document.body.firstChild);

    ctx = canvas.getContext('2d');
  }

  /**
   * Enable the animation
   */
  function enable() {
    if (prefersReducedMotion) {
      console.log('AI Lighting: Animation disabled due to prefers-reduced-motion');
      return;
    }

    if (isEnabled) return;

    isEnabled = true;
    container.classList.add('ai-lighting-active');
    container.classList.remove('ai-lighting-disabled');

    initOrbs();
    lastFrameTime = performance.now();
    animationId = requestAnimationFrame(animate);
  }

  /**
   * Disable the animation
   */
  function disable() {
    isEnabled = false;
    
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (container) {
      container.classList.remove('ai-lighting-active');
      container.classList.add('ai-lighting-disabled');
    }

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * Toggle the animation
   */
  function toggle() {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
  }

  /**
   * Initialize the module
   */
  function init() {
    checkReducedMotion();
    createCanvas();

    // Event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Auto-enable if motion is allowed
    if (!prefersReducedMotion) {
      enable();
    }
  }

  /**
   * Cleanup (for SPA navigation or manual cleanup)
   */
  function cleanup() {
    disable();
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    
    container = null;
    canvas = null;
    ctx = null;
  }

  // Public API
  window.AILighting = {
    enable,
    disable,
    toggle,
    isEnabled: () => isEnabled,
    cleanup,
    
    /**
     * Update configuration
     * @param {Object} newConfig - Partial configuration object
     */
    setConfig: (newConfig) => {
      Object.assign(CONFIG, newConfig);
      if (isEnabled) {
        initOrbs();
      }
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
