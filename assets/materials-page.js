/**
 * materials-page.js
 * JavaScript for the Materials page - handles subject filtering
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
  });

  /**
   * Initialize subject filter buttons
   */
  function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const subjectSections = document.querySelectorAll('.subject-section');

    filterButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const subject = this.dataset.subject;

        // Update active button
        filterButtons.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter sections
        subjectSections.forEach(function(section) {
          if (subject === 'all' || section.dataset.subject === subject) {
            section.classList.remove('hidden');
            section.style.display = '';
          } else {
            section.classList.add('hidden');
            section.style.display = 'none';
          }
        });

        // Log for debugging
        console.log('[Materials] Filtered by:', subject);
      });
    });

    console.log('[Materials] Filter buttons initialized');
  }

  /**
   * Initialize search functionality (optional enhancement)
   */
  function initializeSearch() {
    // Can be expanded to add a search bar
    console.log('[Materials] Page initialized');
  }

  /**
   * Track material downloads (optional analytics)
   */
  function trackDownload(materialName, subject) {
    console.log('[Materials] Download:', materialName, 'from', subject);
    // Can be expanded to send analytics
  }

  // Expose for potential external use
  window.MaterialsPage = {
    trackDownload: trackDownload
  };

})();
