/**
 * AI Lighting Visual Effect
 * 
 * Creates animated gradient/lighting effects that react to mouse/touch and time.
 * Uses requestAnimationFrame for performance.
 * Respects prefers-reduced-motion for accessibility.
 * 
 * @author KL Material Team
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    enableCursorFollow: true,
    cursorSmoothness: 0.08,
    timeBasedColorShift: true,
    colorShiftSpeed: 0.0001
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // State
  let cursorX = 0;
  let cursorY = 0;
  let targetCursorX = 0;
  let targetCursorY = 0;
  let isMouseActive = false;
  let animationFrameId = null;
  let startTime = Date.now();
  let lastColorUpdate = 0;
  const COLOR_UPDATE_INTERVAL = 100; // Update color every 100ms instead of every frame

  /**
   * Initialize the AI lighting effect
   */
  function init() {
    const container = document.getElementById('ai-lighting-container');
    if (!container) {
      console.warn('[AI Lighting] Container #ai-lighting-container not found');
      return;
    }

    // Create lighting orbs
    createOrbs(container);

    // Setup event listeners (unless reduced motion is preferred)
    if (!prefersReducedMotion) {
      setupEventListeners(container);
      startAnimation();
    }
  }

  /**
   * Create the lighting orb elements
   */
  function createOrbs(container) {
    // Clear existing orbs
    container.innerHTML = '';

    // Primary orb
    const primary = document.createElement('div');
    primary.className = 'ai-light-orb ai-light-orb--primary';
    container.appendChild(primary);

    // Secondary orb
    const secondary = document.createElement('div');
    secondary.className = 'ai-light-orb ai-light-orb--secondary';
    container.appendChild(secondary);

    // Tertiary orb
    const tertiary = document.createElement('div');
    tertiary.className = 'ai-light-orb ai-light-orb--tertiary';
    container.appendChild(tertiary);

    // Pulse effect
    const pulse = document.createElement('div');
    pulse.className = 'ai-light-pulse';
    container.appendChild(pulse);

    // Cursor follower orb
    if (CONFIG.enableCursorFollow) {
      const cursor = document.createElement('div');
      cursor.className = 'ai-light-orb ai-light-orb--cursor';
      cursor.id = 'ai-cursor-orb';
      container.appendChild(cursor);
    }
  }

  /**
   * Setup mouse and touch event listeners
   */
  function setupEventListeners(container) {
    // Mouse movement
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Touch movement
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Visibility change - pause when tab is not visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  /**
   * Handle mouse movement
   */
  function handleMouseMove(e) {
    targetCursorX = e.clientX;
    targetCursorY = e.clientY;
  }

  /**
   * Handle mouse entering the document
   */
  function handleMouseEnter() {
    isMouseActive = true;
    const cursorOrb = document.getElementById('ai-cursor-orb');
    if (cursorOrb) {
      cursorOrb.classList.add('active');
    }
  }

  /**
   * Handle mouse leaving the document
   */
  function handleMouseLeave() {
    isMouseActive = false;
    const cursorOrb = document.getElementById('ai-cursor-orb');
    if (cursorOrb) {
      cursorOrb.classList.remove('active');
    }
  }

  /**
   * Handle touch start
   */
  function handleTouchStart(e) {
    if (e.touches.length > 0) {
      targetCursorX = e.touches[0].clientX;
      targetCursorY = e.touches[0].clientY;
      cursorX = targetCursorX;
      cursorY = targetCursorY;
      isMouseActive = true;
      const cursorOrb = document.getElementById('ai-cursor-orb');
      if (cursorOrb) {
        cursorOrb.classList.add('active');
      }
    }
  }

  /**
   * Handle touch movement
   */
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      targetCursorX = e.touches[0].clientX;
      targetCursorY = e.touches[0].clientY;
    }
  }

  /**
   * Handle touch end
   */
  function handleTouchEnd() {
    isMouseActive = false;
    const cursorOrb = document.getElementById('ai-cursor-orb');
    if (cursorOrb) {
      cursorOrb.classList.remove('active');
    }
  }

  /**
   * Handle visibility change
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }

  /**
   * Start the animation loop
   */
  function startAnimation() {
    if (animationFrameId) return;
    animate();
  }

  /**
   * Stop the animation loop
   */
  function stopAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  /**
   * Main animation loop
   */
  function animate() {
    const now = Date.now();
    
    // Smooth cursor following
    if (CONFIG.enableCursorFollow && isMouseActive) {
      cursorX += (targetCursorX - cursorX) * CONFIG.cursorSmoothness;
      cursorY += (targetCursorY - cursorY) * CONFIG.cursorSmoothness;

      const cursorOrb = document.getElementById('ai-cursor-orb');
      if (cursorOrb) {
        cursorOrb.style.left = cursorX + 'px';
        cursorOrb.style.top = cursorY + 'px';
      }
    }

    // Time-based color shift (throttled for performance)
    if (CONFIG.timeBasedColorShift && (now - lastColorUpdate) >= COLOR_UPDATE_INTERVAL) {
      lastColorUpdate = now;
      updateTimeBasedColors();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Update colors based on time of day
   */
  function updateTimeBasedColors() {
    const elapsed = Date.now() - startTime;
    const hueShift = (elapsed * CONFIG.colorShiftSpeed) % 360;

    const container = document.getElementById('ai-lighting-container');
    if (container) {
      // Subtle hue rotation over time - using CSS custom property for better performance
      container.style.setProperty('--ai-hue-shift', hueShift + 'deg');
      container.style.filter = 'hue-rotate(var(--ai-hue-shift, 0deg))';
    }
  }

  /**
   * Cleanup function
   */
  function destroy() {
    stopAnimation();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseenter', handleMouseEnter);
    document.removeEventListener('mouseleave', handleMouseLeave);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    const container = document.getElementById('ai-lighting-container');
    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * Toggle the AI lighting effect
   */
  function toggle(enabled) {
    const container = document.getElementById('ai-lighting-container');
    if (container) {
      container.style.display = enabled ? 'block' : 'none';
    }
    if (enabled && !prefersReducedMotion) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }

  // Expose API for external control
  window.AILighting = {
    init: init,
    destroy: destroy,
    toggle: toggle,
    config: CONFIG
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
