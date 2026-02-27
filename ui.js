// ui.js

// Mobile nav chevron scroll (only runs if .nav-btn elements exist)
(function () {
    const track = document.querySelector('header nav .nav-track');

    // Keyboard navigation (arrow keys) when track focused
    if (track) {
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const pill = track.querySelector('a');
                const base = pill ? (pill.offsetWidth + 12) * 2 : track.clientWidth * 0.6;
                track.scrollBy({ left: base, behavior: 'smooth' });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const pill = track.querySelector('a');
                const base = pill ? (pill.offsetWidth + 12) * 2 : track.clientWidth * 0.6;
                track.scrollBy({ left: -base, behavior: 'smooth' });
            }
        });
    }

    // Center active link on load for better visibility
    if (track) {
        setTimeout(() => {
            const active = track.querySelector('a.active');
            if (!active) return;
            const offset = active.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;
            track.scrollTo({ left: Math.max(offset, 0), behavior: 'instant' });
        }, 200);
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

    // Track scroll position to prevent jump when body becomes position:fixed
    let _savedScrollY = 0;

    // Use an object so event listeners always call the latest version
    const menuActions = {
        open() {
            // Save scroll position before body becomes position:fixed
            _savedScrollY = window.scrollY;
            body.style.top = `-${_savedScrollY}px`;
            body.classList.add('nav-active');
            hamburger.setAttribute('aria-expanded', 'true');
            if (nav) nav.setAttribute('aria-hidden', 'false');
            navLinks.forEach(link => link.setAttribute('tabindex', '0'));
            if (navLinks.length) navLinks[0].focus();
            // prevent body scroll
            document.documentElement.style.overflow = 'hidden';
        },
        close() {
            body.classList.remove('nav-active');
            body.style.top = '';
            // Restore scroll position
            window.scrollTo(0, _savedScrollY);
            hamburger.setAttribute('aria-expanded', 'false');
            if (nav) nav.setAttribute('aria-hidden', 'true');
            navLinks.forEach(link => link.setAttribute('tabindex', '-1'));
            hamburger.focus();
            document.documentElement.style.overflow = '';
        }
    };

    if (hamburger) {
        // ensure initial state
        hamburger.setAttribute('aria-expanded', 'false');
        if (nav) nav.setAttribute('aria-hidden', 'true');
        navLinks.forEach(link => link.setAttribute('tabindex', '-1'));

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (body.classList.contains('nav-active')) menuActions.close();
            else menuActions.open();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (body.classList.contains('nav-active') &&
                !e.target.closest('#mobile-nav') &&
                !e.target.closest('.hamburger')) {
                menuActions.close();
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => menuActions.close());
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

        // Ensure nav link text is visible across browsers (fallback for text-clip/gradient issues)
        function ensureNavTextVisible() {
            if (!nav) return;
            const links = Array.from(nav.querySelectorAll('a'));
            let anyHidden = false;

            links.forEach(link => {
                const cs = window.getComputedStyle(link);
                const color = cs.color || '';
                const webkitFill = cs.getPropertyValue('-webkit-text-fill-color') || '';

                // If color is transparent or text-fill is transparent, force readable styles
                const isTransparent = /^(rgba\(0,\s*0,\s*0,\s*0\)|transparent)$/.test(color.trim())
                    || webkitFill.trim() === 'transparent' || webkitFill.trim() === '-webkit-text-fill-color';

                if (isTransparent) anyHidden = true;

                // Force inline styles that override problematic rules (safe defaults)
                // Use setProperty with 'important' so inline styles beat CSS !important rules
                link.style.setProperty('color', '#b0e0ff', 'important');
                link.style.setProperty('-webkit-text-fill-color', '#b0e0ff', 'important');
                link.style.setProperty('background-clip', 'border-box', 'important');
                link.style.setProperty('-webkit-background-clip', 'border-box', 'important');
                link.style.setProperty('text-shadow', 'none', 'important');
                link.style.setProperty('opacity', '1', 'important');
                link.style.setProperty('visibility', 'visible', 'important');
            });

            if (anyHidden) {
                // Helpful debug message for the developer / QA
                console.info('[ui.js] Forced mobile nav link colors because computed styles looked transparent.\n' +
                    'If labels are still not visible, please tell me: which page (index/materials/etc.),\n' +
                    'the device and browser (e.g. iPhone Safari, Chrome Android), and whether emojis show but text does not.');
            }
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
                    menuActions.close();
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

        // Enhance open/close to include focus trap and nav text fallback
        const _origOpen = menuActions.open.bind(menuActions);
        const _origClose = menuActions.close.bind(menuActions);

        menuActions.open = function () {
            _origOpen();
            // Make sure labels are visible across browsers (fallback)
            try { ensureNavTextVisible(); } catch (e) { /* ignore */ }
            activateFocusTrap();
        };

        menuActions.close = function () {
            _origClose();
            deactivateFocusTrap();
            // keep aria-current in sync after closing
            try { updateAriaCurrent(); } catch (e) { /* ignore */ }
        };
    }
});
