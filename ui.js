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
