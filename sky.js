/**
 * HomeOS - Photorealistic Cinematic Rain & Atmospheric Mist Simulation
 * Fully integrated with live weather (Ejipura, Bangalore):
 * - Activates only when raining, with smooth transition
 * - Multi-layer sunlit rain with motion blur & wind physics
 * - Ground splash ripples and micro-bead droplets
 * - Window/lens beads with trickling gravity physics
 * - Volumetric valley mist for cloudy/overcast conditions
 */

(function () {
  'use strict';

  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Weather control states
  let targetRainOpacity = 0; // 0 = off, 1 = full rain
  let currentRainOpacity = 0;
  let isCloudy = true;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initRain();
  }

  // ==========================================================================
  // 1. Dynamic Wind & Atmospheric System
  // ==========================================================================
  let windAngle = 0.22; // ~12.5° initial slant
  let globalWindSpeed = 1.0;
  let time = 0;

  function updateWind() {
    time += 1;
    const gust = Math.sin(time * 0.0012) * 0.06 + Math.sin(time * 0.0035) * 0.03;
    windAngle = 0.20 + gust;
    globalWindSpeed = 0.95 + Math.sin(time * 0.002) * 0.15;
  }

  // ==========================================================================
  // 2. Multi-Layer Rain Simulation with Motion Blur & Sunlit Refraction
  // ==========================================================================
  const bgRain = [];
  const midRain = [];
  const fgRain = [];
  const splashes = [];
  const splashBeads = [];

  class RainDrop {
    constructor(layer) {
      this.layer = layer; // 0 = distant mist, 1 = mid rain, 2 = foreground
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (width + 300) - 150;
      this.y = initial ? Math.random() * height : -30 - Math.random() * 80;

      if (this.layer === 0) {
        this.baseSpeed = 14 + Math.random() * 4;
        this.length = 12 + Math.random() * 10;
        this.width = 0.75;
        this.baseAlpha = 0.18 + Math.random() * 0.12;
      } else if (this.layer === 1) {
        this.baseSpeed = 19 + Math.random() * 6;
        this.length = 22 + Math.random() * 14;
        this.width = 1.25;
        this.baseAlpha = 0.34 + Math.random() * 0.18;
      } else {
        this.baseSpeed = 26 + Math.random() * 8;
        this.length = 36 + Math.random() * 20;
        this.width = 1.75;
        this.baseAlpha = 0.54 + Math.random() * 0.26;
      }

      this.impactY = height * (0.72 + Math.random() * 0.26);
    }

    update() {
      const speed = this.baseSpeed * globalWindSpeed;
      const vx = Math.sin(windAngle) * speed;
      const vy = Math.cos(windAngle) * speed;

      this.x += vx;
      this.y += vy;

      if (this.y >= this.impactY) {
        if (currentRainOpacity > 0.25 && this.layer >= 1 && Math.random() < 0.25) {
          if (splashes.length < 40) {
            splashes.push(new GroundRipple(this.x, this.impactY, this.layer));
          }
          if (this.layer === 2 && splashBeads.length < 50) {
            const count = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
              splashBeads.push(new SplashBead(this.x, this.impactY));
            }
          }
        }
        this.reset(false);
      } else if (this.y > height + 50 || this.x > width + 200) {
        this.reset(false);
      }
    }
  }

  // Ground Impact Ripple (Elliptical slope splash)
  class GroundRipple {
    constructor(x, y, layer) {
      this.x = x;
      this.y = y;
      this.layer = layer;
      this.radius = 1;
      this.maxRadius = layer === 2 ? 6 + Math.random() * 4 : 3.5 + Math.random() * 2.5;
      this.maxLife = 14 + Math.random() * 6;
      this.age = 0;
    }

    update() {
      this.age++;
      return this.age < this.maxLife;
    }

    draw(ctx) {
      const progress = this.age / this.maxLife;
      const currentRadius = 1 + (this.maxRadius - 1) * Math.sin(progress * Math.PI * 0.5);
      const alpha = (1 - progress) * (this.layer === 2 ? 0.38 : 0.22) * currentRainOpacity;
      if (alpha <= 0.01) return;

      ctx.beginPath();
      ctx.ellipse(this.x, this.y, currentRadius * 1.9, currentRadius * 0.55, -0.05, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(230, 242, 255, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.85;
      ctx.stroke();
    }
  }

  // Micro-droplets bouncing upward
  class SplashBead {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.4;
      const speed = 2.2 + Math.random() * 2.6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.28;
      this.maxLife = 16 + Math.random() * 8;
      this.age = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.age++;
      return this.age < this.maxLife;
    }

    draw(ctx) {
      const alpha = 0.65 * (1 - this.age / this.maxLife) * currentRainOpacity;
      if (alpha <= 0.01) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 248, 255, ${alpha.toFixed(3)})`;
      ctx.fill();
    }
  }

  function initRain() {
    bgRain.length = 0;
    midRain.length = 0;
    fgRain.length = 0;

    const density = Math.min(1.6, Math.max(0.65, width / 1300));
    const bgCount = Math.floor(160 * density);
    const midCount = Math.floor(100 * density);
    const fgCount = Math.floor(45 * density);

    for (let i = 0; i < bgCount; i++) bgRain.push(new RainDrop(0));
    for (let i = 0; i < midCount; i++) midRain.push(new RainDrop(1));
    for (let i = 0; i < fgCount; i++) fgRain.push(new RainDrop(2));
  }

  function renderRainLayer(drops, ctx) {
    if (drops.length === 0 || currentRainOpacity <= 0.01) return;
    const sinA = Math.sin(windAngle);
    const cosA = Math.cos(windAngle);
    const layer = drops[0].layer;
    ctx.lineWidth = drops[0].width;

    ctx.beginPath();
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.update();

      const tailX = d.x - sinA * d.length;
      const tailY = d.y - cosA * d.length;

      ctx.moveTo(tailX, tailY);
      ctx.lineTo(d.x, d.y);
    }

    if (layer === 0) {
      ctx.strokeStyle = `rgba(215, 230, 250, ${(0.20 * currentRainOpacity).toFixed(3)})`;
    } else if (layer === 1) {
      ctx.strokeStyle = `rgba(230, 242, 255, ${(0.38 * currentRainOpacity).toFixed(3)})`;
    } else {
      ctx.strokeStyle = `rgba(250, 252, 255, ${(0.68 * currentRainOpacity).toFixed(3)})`;
    }
    ctx.stroke();
  }

  // ==========================================================================
  // 3. Camera Lens / Glass Water Droplets
  // ==========================================================================
  const lensDroplets = [];
  let nextLensDropletTime = 0;

  class LensDroplet {
    constructor() {
      this.x = 40 + Math.random() * (width - 80);
      this.y = 30 + Math.random() * (height - 120);
      this.radius = 2.0 + Math.random() * 3.5;
      this.maxLife = 500 + Math.random() * 450;
      this.age = 0;
      this.trickling = Math.random() < 0.28;
      this.trickleSpeed = 0.4 + Math.random() * 0.8;
      this.trail = [];
      this.alpha = 0.65;
    }

    update() {
      this.age++;
      if (this.age < 30) {
        this.alpha = (this.age / 30) * 0.65;
      } else if (this.age > this.maxLife - 60) {
        this.alpha = ((this.maxLife - this.age) / 60) * 0.65;
      } else {
        this.alpha = 0.65;
      }

      if (this.trickling && this.age > 45) {
        this.y += this.trickleSpeed;
        if (this.age % 4 === 0 && this.trail.length < 12) {
          this.trail.push({ x: this.x + (Math.random() - 0.5) * 0.8, y: this.y - this.radius, r: this.radius * 0.25 });
        }
      }

      return this.age < this.maxLife && this.y < height - 20;
    }

    draw(ctx) {
      const renderAlpha = this.alpha * currentRainOpacity;
      if (renderAlpha <= 0.02) return;

      for (let i = 0; i < this.trail.length; i++) {
        const pt = this.trail[i];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 248, 255, ${(renderAlpha * 0.35).toFixed(3)})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(15, 25, 40, ${(renderAlpha * 0.30).toFixed(3)})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      const beadGrad = ctx.createRadialGradient(
        this.x - this.radius * 0.25, this.y - this.radius * 0.25, 0.2,
        this.x, this.y, this.radius
      );
      beadGrad.addColorStop(0, `rgba(255, 255, 255, ${(renderAlpha * 0.75).toFixed(3)})`);
      beadGrad.addColorStop(0.5, `rgba(210, 230, 255, ${(renderAlpha * 0.40).toFixed(3)})`);
      beadGrad.addColorStop(1, `rgba(160, 190, 220, ${(renderAlpha * 0.60).toFixed(3)})`);
      ctx.fillStyle = beadGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.38, this.y - this.radius * 0.38, this.radius * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(renderAlpha * 0.85).toFixed(3)})`;
      ctx.fill();
    }
  }

  function updateLensDroplets() {
    if (currentRainOpacity > 0.4 && time > nextLensDropletTime && lensDroplets.length < 16) {
      lensDroplets.push(new LensDroplet());
      nextLensDropletTime = time + 90 + Math.random() * 140;
    }

    for (let i = lensDroplets.length - 1; i >= 0; i--) {
      const d = lensDroplets[i];
      if (d.update()) {
        d.draw(ctx);
      } else {
        lensDroplets.splice(i, 1);
      }
    }
  }

  // ==========================================================================
  // 4. Volumetric Valley Mist & Precipitation Fog
  // ==========================================================================
  let mistOffset = 0;
  function renderValleyMist(ctx) {
    if (!isCloudy && currentRainOpacity <= 0.01) return;
    mistOffset += 0.15;
    const mistY = height * 0.48;
    const grad = ctx.createLinearGradient(0, mistY - 80, 0, mistY + 120);

    const mistStrength = isCloudy ? 0.055 : (currentRainOpacity * 0.045);
    grad.addColorStop(0, 'rgba(210, 225, 240, 0)');
    grad.addColorStop(0.5, `rgba(215, 230, 245, ${mistStrength.toFixed(3)})`);
    grad.addColorStop(1, 'rgba(210, 225, 240, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, mistY - 80, width, 200);
  }

  // ==========================================================================
  // 5. Master Render Loop & Dynamic Fade Controller
  // ==========================================================================
  window.addEventListener('resize', resize);
  resize();

  function loop() {
    // Smoothly ease rain opacity towards target
    currentRainOpacity += (targetRainOpacity - currentRainOpacity) * 0.035;
    if (Math.abs(targetRainOpacity - currentRainOpacity) < 0.002) {
      currentRainOpacity = targetRainOpacity;
    }

    ctx.clearRect(0, 0, width, height);

    // Update dynamic wind breeze
    updateWind();

    // Soft overcast atmosphere tint when raining or cloudy
    if (currentRainOpacity > 0.01) {
      ctx.fillStyle = `rgba(150, 175, 205, ${(0.045 * currentRainOpacity).toFixed(4)})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Soft valley mist
    renderValleyMist(ctx);

    // Rain layers & micro-physics (only rendered if rain is visible)
    if (currentRainOpacity > 0.01) {
      // Layer 0: Distant background mist rain
      renderRainLayer(bgRain, ctx);

      // Layer 1: Midground steady rainfall
      renderRainLayer(midRain, ctx);

      // Ground impact ripples
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        if (s.update()) {
          s.draw(ctx);
        } else {
          splashes.splice(i, 1);
        }
      }

      // Ground impact micro-bead droplets
      for (let i = splashBeads.length - 1; i >= 0; i--) {
        const b = splashBeads[i];
        if (b.update()) {
          b.draw(ctx);
        } else {
          splashBeads.splice(i, 1);
        }
      }

      // Layer 2: Foreground crisp raindrops with motion blur
      renderRainLayer(fgRain, ctx);

      // Camera lens droplets
      updateLensDroplets();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // ==========================================================================
  // 6. Public Weather Control API
  // ==========================================================================
  window.HomeOS_Sky = {
    setRain: function (enabled) {
      targetRainOpacity = enabled ? 1 : 0;
      if (!enabled) {
        // clear any lingering lens droplets over time
      }
    },
    setCloudy: function (enabled) {
      isCloudy = !!enabled;
    },
    isRaining: function () {
      return targetRainOpacity > 0;
    },
    getRainOpacity: function () {
      return currentRainOpacity;
    }
  };

})();
