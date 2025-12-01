import { useEffect, useState } from 'react';
import './SeasonalAnimation.css';

const SeasonalAnimation = () => {
  const [season, setSeason] = useState('winter');

  useEffect(() => {
    // Determine season based on current month
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setSeason('spring');
    else if (month >= 5 && month <= 7) setSeason('summer');
    else if (month >= 8 && month <= 10) setSeason('autumn');
    else setSeason('winter');
  }, []);

  useEffect(() => {
    const container = document.getElementById('season-container');
    if (!container) return;

    // Clear previous animations
    container.innerHTML = '';

    const isMobile = window.innerWidth <= 768;

    switch (season) {
      case 'winter':
        createSnowfall(container, isMobile);
        break;
      case 'spring':
        createPetals(container, isMobile);
        break;
      case 'summer':
        createFireflies(container, isMobile);
        break;
      case 'autumn':
        createLeaves(container, isMobile);
        break;
    }
  }, [season]);

  const createSnowfall = (container: HTMLElement, isMobile: boolean) => {
    const snowflakes = ['❄', '❅', '❆', '•', '∘'];
    const count = isMobile ? 50 : 100; // More snowflakes for realism
    
    // Create depth layers for 3D effect
    const layers = [
      { depth: 'far', count: Math.floor(count * 0.3), speed: [25, 35], size: [0.3, 0.6], opacity: [0.3, 0.5], blur: 2 },
      { depth: 'mid', count: Math.floor(count * 0.4), speed: [15, 25], size: [0.6, 1.0], opacity: [0.5, 0.7], blur: 1 },
      { depth: 'near', count: Math.floor(count * 0.3), speed: [8, 15], size: [1.0, 1.8], opacity: [0.7, 0.9], blur: 0 }
    ];
    
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = `snowflake snowflake-${layer.depth}`;
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        // Random horizontal position
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Varied fall duration based on layer depth
        const duration = Math.random() * (layer.speed[1] - layer.speed[0]) + layer.speed[0];
        
        // Wind sway duration (slower than fall)
        const swayDuration = Math.random() * 2 + 3;
        
        // Rotation duration for tumbling effect
        const rotateDuration = Math.random() * 3 + 2;
        
        snowflake.style.animationDuration = `${duration}s, ${swayDuration}s, ${rotateDuration}s`;
        
        // Stagger start times for natural distribution
        const fallDelay = Math.random() * duration;
        const swayDelay = Math.random() * 2;
        const rotateDelay = Math.random() * 2;
        
        snowflake.style.animationDelay = `${fallDelay}s, ${swayDelay}s, ${rotateDelay}s`;
        
        // Size based on layer depth
        const size = Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0];
        snowflake.style.fontSize = size + 'em';
        
        // Opacity based on layer depth
        const opacity = Math.random() * (layer.opacity[1] - layer.opacity[0]) + layer.opacity[0];
        snowflake.style.opacity = opacity.toString();
        
        // Add blur for depth perception
        if (layer.blur > 0) {
          snowflake.style.filter = `blur(${layer.blur}px)`;
        }
        
        // Different drift patterns for varied movement
        const driftPattern = Math.floor(Math.random() * 5);
        snowflake.setAttribute('data-drift', driftPattern.toString());
        
        // Add shadow for depth
        const shadowIntensity = opacity * 0.8;
        snowflake.style.textShadow = `
          0 0 ${size * 3}px rgba(255, 255, 255, ${shadowIntensity}),
          0 0 ${size * 6}px rgba(200, 230, 255, ${shadowIntensity * 0.5})
        `;
        
        container.appendChild(snowflake);
      }
    });
    
    // Add ambient snow particles in background
    if (!isMobile) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'snow-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 30) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = (Math.random() * 0.2 + 0.1).toString();
        container.appendChild(particle);
      }
    }
  };

  const createPetals = (container: HTMLElement, isMobile: boolean) => {
    const petals = ['🌸', '🌺', '🌼'];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = isMobile ? (Math.random() * 8 + 12) + 's' : (Math.random() * 4 + 8) + 's';
      petal.style.animationDelay = Math.random() * 5 + 's';
      petal.style.fontSize = (Math.random() * 0.8 + 0.6) + 'em';
      container.appendChild(petal);
    }
  };

  const createFireflies = (container: HTMLElement, isMobile: boolean) => {
    const count = isMobile ? 15 : 25;
    
    for (let i = 0; i < count; i++) {
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      firefly.style.left = Math.random() * 100 + '%';
      firefly.style.top = Math.random() * 100 + '%';
      firefly.style.animationDuration = (Math.random() * 3 + 2) + 's';
      firefly.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(firefly);
    }
  };

  const createLeaves = (container: HTMLElement, isMobile: boolean) => {
    const leaves = ['🍁', '🍂'];
    const count = 40;
    
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDuration = isMobile ? (Math.random() * 8 + 10) + 's' : (Math.random() * 4 + 6) + 's';
      leaf.style.animationDelay = Math.random() * 5 + 's';
      leaf.style.fontSize = (Math.random() * 0.8 + 1) + 'em';
      container.appendChild(leaf);
    }
  };

  return <div id="season-container" className="season-container"></div>;
};

export default SeasonalAnimation;
