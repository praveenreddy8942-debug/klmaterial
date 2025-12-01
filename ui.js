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

// Theme Toggle + Hamburger Logic
// (Removed theme toggle & hamburger logic per revert request)
