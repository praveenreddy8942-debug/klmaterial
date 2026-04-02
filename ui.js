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
        let _backToTopTicking = false;
        window.addEventListener('scroll', () => {
            if (!_backToTopTicking) {
                _backToTopTicking = true;
                requestAnimationFrame(() => {
                    if (window.scrollY > 300) {
                        backToTopBtn.classList.add('show');
                    } else {
                        backToTopBtn.classList.remove('show');
                    }
                    _backToTopTicking = false;
                });
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
    const hamburger = document.querySelector('.hamburger, .mobile-btn, .mobile-toggle');
    const body = document.body;
    const nav = document.getElementById('mobile-nav') || document.querySelector('.nav-links');
    const navLinks = nav ? Array.from(nav.querySelectorAll('a[data-nav-link], .nav-link')) : [];
    const mobileNavQuery = window.matchMedia('(max-width: 768px)');

    // Track scroll position to prevent jump when body becomes position:fixed
    let _savedScrollY = 0;
    let _previouslyFocused = null;
    let _trapListener = null;

    function isMobileNavViewport() {
        return mobileNavQuery.matches;
    }

    function updateNavAriaCurrent() {
        if (!nav) return;
        const items = Array.from(nav.querySelectorAll('a[data-nav-link], .nav-link'));
        const currentPath = window.location.pathname.replace(/\/+$/, '');
        items.forEach(item => {
            try {
                const url = new URL(item.href, window.location.origin);
                const itemPath = url.pathname.replace(/\/+$/, '');
                if (itemPath === currentPath) {
                    item.setAttribute('aria-current', 'page');
                    item.classList.add('active');
                } else {
                    item.removeAttribute('aria-current');
                    item.classList.remove('active');
                }
            } catch (e) {
                // ignore malformed href
            }
        });
    }

    function ensureNavTextVisible() {
        if (!nav) return;
        const links = Array.from(nav.querySelectorAll('a'));
        let anyHidden = false;

        links.forEach(link => {
            const cs = window.getComputedStyle(link);
            const color = cs.color || '';
            const webkitFill = cs.getPropertyValue('-webkit-text-fill-color') || '';

            const isTransparent = /^(rgba\(0,\s*0,\s*0,\s*0\)|transparent)$/.test(color.trim())
                || webkitFill.trim() === 'transparent' || webkitFill.trim() === '-webkit-text-fill-color';

            if (isTransparent) anyHidden = true;

            link.style.setProperty('color', '#b0e0ff', 'important');
            link.style.setProperty('-webkit-text-fill-color', '#b0e0ff', 'important');
            link.style.setProperty('background-clip', 'border-box', 'important');
            link.style.setProperty('-webkit-background-clip', 'border-box', 'important');
            link.style.setProperty('text-shadow', 'none', 'important');
            link.style.setProperty('opacity', '1', 'important');
            link.style.setProperty('visibility', 'visible', 'important');
        });

        if (anyHidden) {
            console.info('[ui.js] Forced mobile nav link colors because computed styles looked transparent.\n' +
                'If labels are still not visible, please tell me: which page (index/materials/etc.),\n' +
                'the device and browser (e.g. iPhone Safari, Chrome Android), and whether emojis show but text does not.');
        }
    }

    function activateFocusTrap() {
        _previouslyFocused = document.activeElement;
        const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

        function getFocusable() {
            const candidates = Array.from(document.querySelectorAll(focusableSelector));
            return candidates.filter(el => {
                const visible = (el.offsetWidth > 0 || el.offsetHeight > 0) || el.getClientRects().length > 0;
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

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
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

    function syncNavMode() {
        if (!hamburger || !nav) return;

        const isMobile = isMobileNavViewport();
        const isOpen = isMobile && body.classList.contains('nav-active');

        if (!isMobile) {
            const wasOpen = body.classList.contains('nav-active');
            body.classList.remove('nav-active');
            body.style.top = '';
            document.documentElement.style.overflow = '';
            if (wasOpen) window.scrollTo(0, _savedScrollY);
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-hidden', 'true');
            nav.setAttribute('aria-hidden', 'false');
            nav.removeAttribute('role');
            navLinks.forEach(link => {
                link.removeAttribute('tabindex');
                link.removeAttribute('role');
            });
            deactivateFocusTrap();
            updateNavAriaCurrent();
            return;
        }

        hamburger.removeAttribute('aria-hidden');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        nav.setAttribute('role', 'menu');
        navLinks.forEach(link => {
            link.setAttribute('role', 'menuitem');
            link.setAttribute('tabindex', isOpen ? '0' : '-1');
        });
        updateNavAriaCurrent();
    }

    // Use an object so event listeners always call the latest version
    const menuActions = {
        open() {
            if (!isMobileNavViewport()) return;
            // Save scroll position before body becomes position:fixed
            _savedScrollY = window.scrollY;
            body.style.top = `-${_savedScrollY}px`;
            body.classList.add('nav-active');
            if (nav) {
                nav.classList.add('mobile-open');
                nav.classList.add('open');
            }
            hamburger.setAttribute('aria-expanded', 'true');
            if (nav) nav.setAttribute('aria-hidden', 'false');
            navLinks.forEach(link => link.setAttribute('tabindex', '0'));
            if (navLinks.length) navLinks[0].focus();
            // prevent body scroll
            document.documentElement.style.overflow = 'hidden';
        },
        close() {
            const shouldRestoreFocus = isMobileNavViewport();
            body.classList.remove('nav-active');
            if (nav) {
                nav.classList.remove('mobile-open');
                nav.classList.remove('open');
            }
            body.style.top = '';
            // Restore scroll position
            window.scrollTo(0, _savedScrollY);
            hamburger.setAttribute('aria-expanded', 'false');
            if (nav) nav.setAttribute('aria-hidden', 'true');
            navLinks.forEach(link => link.setAttribute('tabindex', '-1'));
            if (shouldRestoreFocus) hamburger.focus();
            document.documentElement.style.overflow = '';
        }
    };

    if (hamburger) {
        syncNavMode();

        hamburger.addEventListener('click', (e) => {
            if (!isMobileNavViewport()) return;
            e.stopPropagation();
            if (body.classList.contains('nav-active')) menuActions.close();
            else menuActions.open();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMobileNavViewport() &&
                body.classList.contains('nav-active') &&
                !e.target.closest('#mobile-nav, .nav-links') &&
                !e.target.closest('.hamburger, .mobile-btn, .mobile-toggle')) {
                menuActions.close();
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobileNavViewport()) menuActions.close();
            });
        });

        // run initially
        updateNavAriaCurrent();
        // update when history changes (back/forward)
        window.addEventListener('popstate', updateNavAriaCurrent);
        mobileNavQuery.addEventListener('change', syncNavMode);

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
            try { syncNavMode(); } catch (e) { /* ignore */ }
        };
    }
});

// Scroll Top Button logic
document.addEventListener("DOMContentLoaded", () => {
    const topBtns = document.querySelectorAll(".scroll-top, #sTop, #scrollTopBtn, #backToTop");
    if (topBtns.length > 0) {
        window.addEventListener("scroll", () => {
            const isVisible = window.scrollY > 300;
            topBtns.forEach(btn => {
                if (isVisible) {
                    btn.classList.add("visible");
                    btn.classList.add("show");
                } else {
                    btn.classList.remove("visible");
                    btn.classList.remove("show");
                }
            });
        });
    }
});
