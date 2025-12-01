// ui.js

// Mobile nav chevron scroll
(function () {
    const track = document.querySelector('header nav .nav-track');
    const prevBtn = document.querySelector('header nav .nav-btn.prev');
    const nextBtn = document.querySelector('header nav .nav-btn.next');

    function updateArrowState() {
        if (!track || !prevBtn || !nextBtn) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        prevBtn.disabled = track.scrollLeft <= 2;
        nextBtn.disabled = track.scrollLeft >= maxScroll - 2;
    }

    function scrollAmount(dir) {
        // Scroll by width of ~2 pills or 60% of viewport
        const pill = track.querySelector('a');
        const base = pill ? (pill.offsetWidth + 12) * 2 : track.clientWidth * 0.6;
        track.scrollBy({ left: dir * base, behavior: 'smooth' });
    }

    if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => scrollAmount(-1));
        nextBtn.addEventListener('click', () => scrollAmount(1));
        track.addEventListener('scroll', updateArrowState, { passive: true });
        window.addEventListener('resize', updateArrowState);
        setTimeout(updateArrowState, 150);
    }

    // Center active link on load for better visibility
    function centerActive() {
        if (!track) return;
        const active = track.querySelector('a.active');
        if (!active) return;
        const offset = active.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;
        track.scrollTo({ left: Math.max(offset, 0), behavior: 'instant' });
        updateArrowState();
    }
    setTimeout(centerActive, 200);

    // Keyboard navigation (arrow keys) when track focused
    if (track) {
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollAmount(1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollAmount(-1);
            }
        });
    }

    // Sliding Nav Marker Logic
    if (track) {
        // Create marker
        const marker = document.createElement('div');
        marker.classList.add('nav-marker');
        track.appendChild(marker);

        const links = track.querySelectorAll('a');
        const activeLink = track.querySelector('a.active');

        function moveMarker(element) {
            if (!element) {
                marker.style.opacity = '0';
                return;
            }

            // Use offsetLeft which is relative to the scrollable parent (track)
            const left = element.offsetLeft;
            const width = element.offsetWidth;

            marker.style.width = `${width}px`;
            marker.style.transform = `translateX(${left}px)`;
            marker.style.opacity = '1';
        }

        // Initialize position (after potential centering)
        if (activeLink) setTimeout(() => moveMarker(activeLink), 250);

        // Event listeners
        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveMarker(link));
        });

        track.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveMarker(activeLink);
            } else {
                marker.style.opacity = '0';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const currentActive = track.querySelector('a:hover') || activeLink;
            if (currentActive) moveMarker(currentActive);
        });
    }
})();

// Back to Top functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Hamburger Menu Logic (improved accessibility & behavior)
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const body = document.body;
    const nav = document.getElementById('mobile-nav');
    const navLinks = nav ? Array.from(nav.querySelectorAll('a[role="menuitem"]')) : [];

    function openMenu() {
        body.classList.add('nav-active');
        hamburger.setAttribute('aria-expanded', 'true');
        if (nav) nav.setAttribute('aria-hidden', 'false');
        navLinks.forEach(link => link.setAttribute('tabindex', '0'));
        if (navLinks.length) navLinks[0].focus();
        // prevent body scroll
        document.documentElement.style.overflow = 'hidden';
    }

    function closeMenu() {
        body.classList.remove('nav-active');
        hamburger.setAttribute('aria-expanded', 'false');
        if (nav) nav.setAttribute('aria-hidden', 'true');
        navLinks.forEach(link => link.setAttribute('tabindex', '-1'));
        hamburger.focus();
        document.documentElement.style.overflow = '';
    }

    if (hamburger) {
        // ensure initial state
        hamburger.setAttribute('aria-expanded', 'false');
        if (nav) nav.setAttribute('aria-hidden', 'true');
        navLinks.forEach(link => link.setAttribute('tabindex', '-1'));

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (body.classList.contains('nav-active')) closeMenu();
            else openMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (body.classList.contains('nav-active') &&
                !e.target.closest('#mobile-nav') &&
                !e.target.closest('.hamburger')) {
                closeMenu();
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });

        // Update aria-current based on current URL (helps screen readers)
        function updateAriaCurrent() {
            if (!nav) return;
            const items = Array.from(nav.querySelectorAll('a[role="menuitem"]'));
            const currentPath = window.location.pathname.replace(/\/+$/, ''); // strip trailing slash
            items.forEach(item => {
                try {
                    const url = new URL(item.href, window.location.origin);
                    const itemPath = url.pathname.replace(/\/+$/, '');
                    if (itemPath === currentPath) {
                        item.setAttribute('aria-current', 'page');
                    } else {
                        item.removeAttribute('aria-current');
                    }
                } catch (e) {
                    // ignore malformed href
                }
            });
        }

    // run initially
    updateAriaCurrent();
    // update when history changes (back/forward)
    window.addEventListener('popstate', updateAriaCurrent);

        // Keyboard controls: Escape to close. We'll add a robust focus trap on open.
        let _previouslyFocused = null;
        let _trapListener = null;

        function activateFocusTrap() {
            _previouslyFocused = document.activeElement;
            const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

            // Return visible elements inside the nav plus the hamburger button so Tab stays within the control set
            function getFocusable() {
                const candidates = Array.from(document.querySelectorAll(focusableSelector));
                return candidates.filter(el => {
                    // visible check: element has layout or client rects
                    const visible = (el.offsetWidth > 0 || el.offsetHeight > 0) || el.getClientRects().length > 0;
                    // include if inside nav OR the hamburger itself
                    const insideNav = nav && nav.contains(el);
                    const isHamburger = el === hamburger;
                    return visible && (insideNav || isHamburger);
                });
            }

            _trapListener = function (e) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeMenu();
                    return;
                }

                if (e.key === 'Tab') {
                    const focusable = getFocusable();
                    if (focusable.length === 0) return;
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];

                    // When Shift+Tab on first, go to last
                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else {
                        // When Tab on last, cycle to first
                        if (document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
            };

            document.addEventListener('keydown', _trapListener);
        }

        function deactivateFocusTrap() {
            if (_trapListener) document.removeEventListener('keydown', _trapListener);
            _trapListener = null;
            if (_previouslyFocused && typeof _previouslyFocused.focus === 'function') {
                _previouslyFocused.focus();
            }
            _previouslyFocused = null;
        }

        // enhance open/close to activate/deactivate trap
        const _origOpen = openMenu;
        const _origClose = closeMenu;

        openMenu = function () {
            _origOpen();
            activateFocusTrap();
        };

        closeMenu = function () {
            _origClose();
            deactivateFocusTrap();
            // keep aria-current in sync after closing
            try { updateAriaCurrent(); } catch (e) { /* ignore */ }
        };
    }
});
