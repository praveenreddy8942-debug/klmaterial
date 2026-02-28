// ====================================
// Fantasy-Level Visual Effects
// KL Material Study Hub
// ====================================

// 1. Aurora Borealis Effect in Hero
class AuroraEffect {
    constructor() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const aurora = document.createElement('div');
        aurora.className = 'aurora-container';
        aurora.setAttribute('aria-hidden', 'true');
        aurora.innerHTML = `
      <div class="aurora-beam aurora-beam-1"></div>
      <div class="aurora-beam aurora-beam-2"></div>
      <div class="aurora-beam aurora-beam-3"></div>
      <div class="aurora-beam aurora-beam-4"></div>
    `;
        hero.prepend(aurora);
    }
}

// 2. 3D Card Tilt on Mouse Move
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.advanced-card, .category-btn, .stat-item, .contact-card-modern');
        if (window.innerWidth < 768) return; // Skip on mobile
        this.cards.forEach(card => this.attach(card));
    }

    attach(card) {
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '800px';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    }
}

// 3. Animated Stat Counters
class StatCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number[data-target]');
        if (!this.stats.length) return;
        this.observed = new Set();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animate(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => {
            stat.textContent = '0';
            observer.observe(stat);
        });
    }

    animate(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = easeOutQuart(progress);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
}

// 4. Cursor Sparkle Trail (Desktop only)
class SparkleTrail {
    constructor() {
        if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        this.sparkles = [];
        this.maxSparkles = 20;
        this.lastSpawn = 0;

        document.addEventListener('mousemove', (e) => this.spawn(e));
        this.animate();
    }

    spawn(e) {
        const now = Date.now();
        if (now - this.lastSpawn < 50) return; // Throttle to every 50ms
        this.lastSpawn = now;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';

        // Random size and color
        const size = Math.random() * 6 + 3;
        const colors = ['#00d4ff', '#0077ff', '#00ff88', '#ff6b6b', '#e67e22', '#9b59b6'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        sparkle.style.background = color;
        sparkle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

        document.body.appendChild(sparkle);
        this.sparkles.push({ el: sparkle, created: now, life: 800 });

        // Cleanup old sparkles
        if (this.sparkles.length > this.maxSparkles) {
            const old = this.sparkles.shift();
            old.el.remove();
        }
    }

    animate() {
        const now = Date.now();
        this.sparkles = this.sparkles.filter(s => {
            const age = now - s.created;
            if (age > s.life) {
                s.el.remove();
                return false;
            }
            const progress = age / s.life;
            s.el.style.opacity = 1 - progress;
            s.el.style.transform = `translate(-50%, -50%) scale(${1 - progress * 0.5}) translateY(${-progress * 30}px)`;
            return true;
        });
        requestAnimationFrame(() => this.animate());
    }
}

// 5. Magnetic Hover on CTA Buttons
class MagneticButtons {
    constructor() {
        if (window.innerWidth < 768) return;
        this.buttons = document.querySelectorAll('.btn, .pwa-install-btn');
        this.buttons.forEach(btn => this.attach(btn));
    }

    attach(btn) {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    }
}

// 6. Page Transition Effect
class PageTransition {
    constructor() {
        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        document.body.appendChild(this.overlay);

        // Fade in on load
        document.body.classList.add('page-loaded');

        // Intercept internal navigation
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            });
        });
    }
}

// 7. Floating Glowing Orbs
class FloatingOrbs {
    constructor() {
        const sections = document.querySelectorAll('.stats-section, .features, .quick-access');
        sections.forEach((section, i) => {
            const orbCount = 3;
            for (let j = 0; j < orbCount; j++) {
                const orb = document.createElement('div');
                orb.className = 'floating-orb';
                orb.setAttribute('aria-hidden', 'true');

                const size = Math.random() * 100 + 60;
                const hue = [190, 220, 140, 340, 30, 270][Math.floor(Math.random() * 6)];
                const delay = -(Math.random() * 10);
                const duration = 8 + Math.random() * 6;
                const left = Math.random() * 80 + 10;
                const top = Math.random() * 60 + 20;

                orb.style.cssText = `
          width: ${size}px; height: ${size}px;
          left: ${left}%; top: ${top}%;
          background: radial-gradient(circle, hsla(${hue}, 100%, 60%, 0.15) 0%, transparent 70%);
          animation: orbFloat ${duration}s ease-in-out ${delay}s infinite alternate;
        `;
                section.style.position = 'relative';
                section.style.overflow = 'hidden';
                section.appendChild(orb);
            }
        });
    }
}

// 8. Profile Image Glow Pulse
class ProfileGlow {
    constructor() {
        const img = document.querySelector('.profile-img');
        if (!img) return;
        img.classList.add('profile-glow');
    }
}

// 9. Staggered Section Title Reveal
class TextReveal {
    constructor() {
        const headings = document.querySelectorAll('.features h2, .stats-section h2, .quick-access h2, .cta-advanced h2');
        headings.forEach(h => {
            h.classList.add('reveal-heading');
        });
    }
}

// Initialize all fantasy effects
document.addEventListener('DOMContentLoaded', () => {
    // Respect reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    new AuroraEffect();
    new StatCounter();
    new ProfileGlow();
    new TextReveal();
    new FloatingOrbs();
    new PageTransition();

    if (!reducedMotion) {
        new CardTilt();
        new SparkleTrail();
        new MagneticButtons();
    }
});
