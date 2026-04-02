// ====================================
// Cookie Consent Banner for GDPR
// Manages Google Analytics opt-in/opt-out
// ====================================

(function () {
    'use strict';

    const CONSENT_KEY = 'klm-cookie-consent'; // 'accepted' | 'declined'

    // If already consented, do nothing
    const stored = localStorage.getItem(CONSENT_KEY);

    // If user previously declined, disable GA
    if (stored === 'declined') {
        disableGA();
        return;
    }

    // If already accepted, nothing to do
    if (stored === 'accepted') return;

    // First visit — show consent banner
    document.addEventListener('DOMContentLoaded', showBanner);

    function showBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML = `
      <div class="consent-content">
        <p>We use cookies (Google Analytics) to understand how you use this site.
           <a href="privacy.html">Privacy Policy</a></p>
        <div class="consent-buttons">
          <button id="consent-accept" class="consent-btn consent-accept">Accept</button>
          <button id="consent-decline" class="consent-btn consent-decline">Decline</button>
        </div>
      </div>
    `;
        document.body.appendChild(banner);

        // Animate in
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                banner.classList.add('visible');
            });
        });

        document.getElementById('consent-accept').addEventListener('click', function () {
            localStorage.setItem(CONSENT_KEY, 'accepted');
            hideBanner(banner);
        });

        document.getElementById('consent-decline').addEventListener('click', function () {
            localStorage.setItem(CONSENT_KEY, 'declined');
            disableGA();
            hideBanner(banner);
        });
    }

    function hideBanner(banner) {
        banner.classList.remove('visible');
        setTimeout(function () { banner.remove(); }, 400);
    }

    function disableGA() {
        // Set GA opt-out flag
        window['ga-disable-G-NZ0SERPS7L'] = true;

        // Remove GA cookies
        document.cookie.split(';').forEach(function (c) {
            var name = c.trim().split('=')[0];
            if (name.startsWith('_ga') || name.startsWith('_gid')) {
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + location.hostname;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            }
        });
    }
})();
