/**
 * debug-force-visible.js
 * 
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  ⚠️  WARNING: TEMPORARY DEBUG SCRIPT - DO NOT MERGE TO PRODUCTION! ⚠️     ║
 * ║                                                                           ║
 * ║  This file should be removed or disabled before merging to main branch.  ║
 * ║  It is intended only for debugging blank/black page issues.              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * TODO: Remove this script before merging to main branch.
 * 
 * This script runs on DOMContentLoaded and resize events to:
 * 1. Force #root to be visible
 * 2. Hide common overlay elements that might block content
 * 3. Log diagnostic information to console
 * 
 * Use this to debug black/blank page issues on large screens.
 */

(function() {
  'use strict';

  const DEBUG_PREFIX = '[DEBUG-FORCE-VISIBLE]';

  function forceVisibility() {
    const root = document.getElementById('root');
    
    if (root) {
      const computedStyle = window.getComputedStyle(root);
      const isHidden = computedStyle.display === 'none' ||
                       computedStyle.visibility === 'hidden' ||
                       computedStyle.opacity === '0';
      
      if (isHidden) {
        console.warn(DEBUG_PREFIX, 'Root element was hidden. Current styles:', {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex
        });
        
        // Force visibility
        root.style.display = 'block';
        root.style.visibility = 'visible';
        root.style.opacity = '1';
        
        console.info(DEBUG_PREFIX, 'Forced #root to be visible');
      }
    } else {
      console.warn(DEBUG_PREFIX, '#root element not found');
    }

    // Hide potential blocking overlays
    const overlaySelectors = [
      '.modal-backdrop',
      '.overlay',
      '.loading-overlay',
      '.backdrop',
      '[data-overlay]'
    ];

    overlaySelectors.forEach(function(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(function(el) {
        if (window.getComputedStyle(el).display !== 'none') {
          console.info(DEBUG_PREFIX, 'Hiding overlay element:', selector);
          el.style.display = 'none';
        }
      });
    });
  }

  function logScreenInfo() {
    console.info(DEBUG_PREFIX, 'Screen info:', {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    });
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      logScreenInfo();
      forceVisibility();
    });
  } else {
    logScreenInfo();
    forceVisibility();
  }

  // Run on resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      logScreenInfo();
      forceVisibility();
    }, 100);
  });

  console.info(DEBUG_PREFIX, 'Debug helper loaded. This script should be removed before production.');
})();
