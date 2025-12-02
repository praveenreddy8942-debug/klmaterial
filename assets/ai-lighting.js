/**
 * ai-lighting.js
 * AI Lightings Canvas Background Animation
 * 
 * Creates a performant, interactive canvas animation with flowing light particles.
 * Respects prefers-reduced-motion and provides a toggle API.
 * 
 * Usage: Include this script in your page. The effect auto-initializes on load.
 * 
 * API:
 *   window.AILighting.disable() - Disable the effect
 *   window.AILighting.enable()  - Enable the effect
 *   window.AILighting.toggle()  - Toggle the effect
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    particleCount: 50,
    particleSpeed: 0.3,
    connectionDistance: 150,
    colors: ['#00d4ff', '#0099cc', '#b0e0ff', '#003566'],
    particleSize: { min: 1, max: 3 },
    mouseInfluenceRadius: 200,
    mouseInfluenceStrength: 0.5
  };

  let canvas, ctx;
  let particles = [];
  let animationId = null;
  let isEnabled = true;
  let mouseX = -1000;
  let mouseY = -1000;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
      this.y = Math.random() * (canvas ? canvas.height : window.innerHeight);
      this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
      this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
      this.size = CONFIG.particleSize.min + Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min);
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.alpha = 0.3 + Math.random() * 0.5;
    }

    update() {
      // Mouse influence
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < CONFIG.mouseInfluenceRadius && dist > 0) {
        const force = (CONFIG.mouseInfluenceRadius - dist) / CONFIG.mouseInfluenceRadius;
        this.vx += (dx / dist) * force * CONFIG.mouseInfluenceStrength * 0.02;
        this.vy += (dy / dist) * force * CONFIG.mouseInfluenceStrength * 0.02;
      }

      // Apply velocity
      this.x += this.vx;
      this.y += this.vy;

      // Boundary wrapping
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Ensure minimum velocity
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed < CONFIG.particleSpeed * 0.1) {
        this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'ai-lighting-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', debounce(resizeCanvas, 100));
    
    // Add mouse listener
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  function initParticles() {
    particles = [];
    const count = Math.min(CONFIG.particleCount, Math.floor((canvas.width * canvas.height) / 20000));
    
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CONFIG.connectionDistance) {
          const alpha = (1 - dist / CONFIG.connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00d4ff';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    if (!isEnabled || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connections
    drawConnections();
    
    animationId = requestAnimationFrame(animate);
  }

  function enable() {
    if (prefersReducedMotion) {
      console.info('[AILighting] Disabled due to prefers-reduced-motion setting.');
      return;
    }
    
    isEnabled = true;
    if (canvas) {
      canvas.classList.remove('ai-lighting-disabled');
    }
    
    if (!animationId) {
      animate();
    }
    
    updateToggleButton();
    console.info('[AILighting] Enabled');
  }

  function disable() {
    isEnabled = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    if (canvas) {
      canvas.classList.add('ai-lighting-disabled');
    }
    
    updateToggleButton();
    console.info('[AILighting] Disabled');
  }

  function toggle() {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
    return isEnabled;
  }

  function createToggleButton() {
    const btn = document.createElement('button');
    btn.className = 'ai-lighting-toggle';
    btn.id = 'ai-lighting-toggle';
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Toggle AI lighting effect');
    btn.setAttribute('title', 'Toggle AI lighting effect');
    btn.innerHTML = '✨';
    
    btn.addEventListener('click', function() {
      toggle();
    });
    
    document.body.appendChild(btn);
  }

  function updateToggleButton() {
    const btn = document.getElementById('ai-lighting-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  function init() {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion) {
      console.info('[AILighting] Skipped initialization due to prefers-reduced-motion setting.');
      return;
    }
    
    initCanvas();
    initParticles();
    createToggleButton();
    animate();
    
    console.info('[AILighting] Initialized with', particles.length, 'particles');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API
  window.AILighting = {
    enable: enable,
    disable: disable,
    toggle: toggle,
    isEnabled: function() { return isEnabled; }
  };

})();
