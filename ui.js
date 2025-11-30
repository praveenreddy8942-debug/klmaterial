// ui.js

// Mobile nav chevron scroll
(function () {
    const track = document.querySelector('header nav .nav-track');
    const next = document.querySelector('header nav .nav-next'); // Note: This element might not exist in all HTMLs yet, but logic is safe
    if (track && next) {
        next.addEventListener('click', () => {
            track.scrollBy({ left: 160, behavior: 'smooth' });
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

            // Calculate relative position within the track
            const trackRect = track.getBoundingClientRect();
            const elemRect = element.getBoundingClientRect();

            // Account for track scroll position if any
            const left = elemRect.left - trackRect.left + track.scrollLeft;

            marker.style.width = `${elemRect.width}px`;
            marker.style.transform = `translateX(${left}px)`;
            marker.style.opacity = '1';
        }

        // Initialize position
        if (activeLink) {
            // Small delay to ensure layout is settled
            setTimeout(() => moveMarker(activeLink), 100);
        }

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
