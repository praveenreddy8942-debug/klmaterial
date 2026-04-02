/**
 * Seasonal Animations System — Spring 2026
 * Beautiful cherry blossom & spring petal effects
 * Optimized for performance across all devices
 */

// Determine current season
function getSeason() {
  const month = new Date().getMonth() + 1;
  if (month === 12 || month === 1 || month === 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'autumn';
}

// Check if device performance is limited
function isLowPerformanceDevice() {
  return window.innerWidth < 600 ||
    (navigator.deviceMemory && navigator.deviceMemory < 4);
}

// Main animation initialization
function createSeasonalAnimation() {
  const container = document.getElementById('seasonalAnimation');
  if (!container) return;

  const season = getSeason();
  container.innerHTML = '';

  // Reduce particle count on low-performance devices
  const particleCanvasActive = !!document.getElementById('particleCanvas');
  const basePerfMultiplier = isLowPerformanceDevice() ? 0.4 : 1;
  const perfMultiplier = particleCanvasActive ? basePerfMultiplier * 0.5 : basePerfMultiplier;

  switch (season) {
    case 'winter':
      createSnowfall(container, Math.floor(50 * perfMultiplier));
      break;
    case 'spring':
      createSpringBlossoms(container, Math.floor(35 * perfMultiplier));
      break;
    case 'summer':
      createFireflies(container, Math.floor(25 * perfMultiplier));
      break;
    case 'autumn':
      createLeaves(container, Math.floor(45 * perfMultiplier));
      break;
  }
}

/**
 * Winter: Snowfall
 */
function createSnowfall(container, count) {
  const snowflakes = ['❄', '❅', '❆', '✻', '✼'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'snowflake';
    el.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (0.8 + Math.random() * 0.6) + 'em';
    el.style.opacity = 0.4 + Math.random() * 0.6;
    el.style.setProperty('animation-duration', (8 + Math.random() * 14) + 's', 'important');
    el.style.setProperty('animation-delay', (Math.random() * 5) + 's', 'important');
    el.style.animationTimingFunction = 'linear';
    container.appendChild(el);
  }
}

/**
 * Spring: Cherry blossoms & petals — gentle drifting with soft glow
 */
function createSpringBlossoms(container, count) {
  const petals = ['🌸', '💮', '🏵️', '✿', '❀'];
  const colors = [
    'rgba(255, 182, 193, 0.7)',  // light pink
    'rgba(255, 105, 180, 0.6)',  // hot pink
    'rgba(255, 192, 203, 0.8)',  // pink
    'rgba(255, 228, 225, 0.7)',  // misty rose
    'rgba(255, 160, 200, 0.6)',  // medium pink
  ];

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'spring-petal';

    // Alternate between emoji petals and CSS-drawn petals
    if (Math.random() > 0.4) {
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.fontSize = (1 + Math.random() * 0.8) + 'em';
    } else {
      // CSS-drawn petal (circle)
      petal.classList.add('spring-petal-dot');
      const size = 6 + Math.random() * 10;
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    }

    const startX = Math.random() * 110 - 5; // -5% to 105%
    const duration = 8 + Math.random() * 12;  // 8–20s
    const delay = Math.random() * 10;
    const drift = -60 + Math.random() * 120;  // horizontal drift range

    petal.style.left = startX + '%';
    petal.style.opacity = 0.5 + Math.random() * 0.5;
    petal.style.setProperty('animation-duration', duration + 's', 'important');
    petal.style.setProperty('animation-delay', delay + 's', 'important');
    petal.style.setProperty('--drift', drift + 'px');
    petal.style.setProperty('--spin', (180 + Math.random() * 360) + 'deg');

    container.appendChild(petal);
  }

  // Add a few floating sparkles
  const sparkleCount = Math.floor(count * 0.3);
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'spring-sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = (20 + Math.random() * 60) + '%';
    sparkle.style.setProperty('animation-duration', (2 + Math.random() * 3) + 's', 'important');
    sparkle.style.setProperty('animation-delay', (Math.random() * 8) + 's', 'important');
    container.appendChild(sparkle);
  }
}

/**
 * Summer: Glowing fireflies
 */
function createFireflies(container, count) {
  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    firefly.style.left = Math.random() * 100 + '%';
    firefly.style.top = (20 + Math.random() * 50) + '%';
    firefly.style.width = (2 + Math.random() * 3) + 'px';
    firefly.style.height = firefly.style.width;
    firefly.style.setProperty('animation-duration', (3 + Math.random() * 6) + 's', 'important');
    firefly.style.setProperty('animation-delay', (Math.random() * 10) + 's', 'important');
    firefly.style.animationTimingFunction = 'ease-in-out';
    const hue = 45 + Math.random() * 15;
    firefly.style.filter = `hue-rotate(${hue}deg)`;
    container.appendChild(firefly);
  }
}

/**
 * Autumn: Falling leaves
 */
function createLeaves(container, count) {
  const leaves = ['🍂', '🍁', '🍃', '🌿', '🌾'];
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.fontSize = (1.2 + Math.random() * 0.5) + 'em';
    leaf.style.opacity = 0.6 + Math.random() * 0.4;
    leaf.style.setProperty('animation-duration', (7 + Math.random() * 13) + 's', 'important');
    leaf.style.setProperty('animation-delay', (Math.random() * 6) + 's', 'important');
    leaf.style.animationTimingFunction = 'ease-in-out';
    container.appendChild(leaf);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createSeasonalAnimation);
} else {
  createSeasonalAnimation();
}

// Reinitialize on significant width change (debounced)
let resizeTimeout;
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newWidth = window.innerWidth;
    if (Math.abs(newWidth - lastWidth) < 100) return;
    lastWidth = newWidth;
    createSeasonalAnimation();
  }, 500);
});
