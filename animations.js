// Seasonal Animation System
function getSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  
  // Winter: December (12), January (1), February (2)
  if (month === 12 || month === 1 || month === 2) return 'winter';
  
  // Spring: March (3), April (4), May (5)
  if (month >= 3 && month <= 5) return 'spring';
  
  // Summer: June (6), July (7), August (8)
  if (month >= 6 && month <= 8) return 'summer';
  
  // Autumn: September (9), October (10), November (11)
  return 'autumn';
}

function createSeasonalAnimation() {
  const container = document.getElementById('seasonalAnimation');
  if (!container) return; // Guard clause if element doesn't exist

  const season = getSeason();
  
  // Clear any existing animations
  container.innerHTML = '';
  
  switch(season) {
    case 'winter':
      createSnowfall(container);
      break;
    case 'spring':
      createPetals(container);
      break;
    case 'summer':
      createFireflies(container);
      break;
    case 'autumn':
      createLeaves(container);
      break;
  }
}

function createSnowfall(container) {
  const snowflakes = ['❄', '❅', '❆'];
  const count = 50;
  
  // Check if mobile device
  const isMobile = window.innerWidth <= 768;
  
  for (let i = 0; i < count; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    snowflake.style.left = Math.random() * 100 + '%';
    // Slower winter animation: Mobile 15-25s, PC 8-12s
    snowflake.style.animationDuration = isMobile ? (Math.random() * 10 + 15) + 's' : (Math.random() * 4 + 8) + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';
    snowflake.style.fontSize = (Math.random() * 0.7 + 0.5) + 'em';
    container.appendChild(snowflake);
  }
}

function createPetals(container) {
  const petals = ['🌸', '🌺', '🌼', '🌻'];
  const count = 30;
  
  // Check if mobile device
  const isMobile = window.innerWidth <= 768;
  
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + '%';
    // Faster spring animation: Mobile 10-15s, PC 4-7s
    petal.style.animationDuration = isMobile ? (Math.random() * 5 + 10) + 's' : (Math.random() * 3 + 4) + 's';
    petal.style.animationDelay = Math.random() * 5 + 's';
    petal.style.fontSize = (Math.random() * 0.8 + 0.8) + 'em';
    container.appendChild(petal);
  }
}

function createFireflies(container) {
  const count = 20;
  
  // Check if mobile device
  const isMobile = window.innerWidth <= 768;
  
  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    firefly.style.left = Math.random() * 100 + '%';
    firefly.style.top = (Math.random() * 80 + 10) + '%';
    // Faster summer animation: Mobile 4-7s, PC 1.5-3s
    firefly.style.animationDuration = isMobile ? (Math.random() * 3 + 4) + 's' : (Math.random() * 1.5 + 1.5) + 's';
    firefly.style.animationDelay = Math.random() * 3 + 's';
    container.appendChild(firefly);
  }
}

function createLeaves(container) {
  const leaves = ['🍂', '🍁', '🍃'];
  const count = 35;
  
  // Check if mobile device
  const isMobile = window.innerWidth <= 768;
  
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
    leaf.style.left = Math.random() * 100 + '%';
    // Faster autumn animation: Mobile 8-14s, PC 3-6s
    leaf.style.animationDuration = isMobile ? (Math.random() * 6 + 8) + 's' : (Math.random() * 3 + 3) + 's';
    leaf.style.animationDelay = Math.random() * 5 + 's';
    leaf.style.fontSize = (Math.random() * 0.9 + 0.8) + 'em';
    container.appendChild(leaf);
  }
}

// Initialize seasonal animation on page load
window.addEventListener('load', createSeasonalAnimation);
