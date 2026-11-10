/**
 * HomeOS - Ambient Flight, Contrails & Rain Simulation
 * Renders atmospheric multi-layered rainfall over the landscape
 * with high-altitude commercial flights and vapor trails.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;

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
  // 1. Raindrop Particle Simulation
  // ==========================================================================
  const rainWindAngle = 0.22; // ~12.5° wind slant to the right
  const sinW = Math.sin(rainWindAngle);
  const cosW = Math.cos(rainWindAngle);

  const backgroundDrops = [];
  const midgroundDrops = [];
  const foregroundDrops = [];
  const splashes = [];

  class RainDrop {
    constructor(layer) {
      this.layer = layer; // 0 = distant/fine, 1 = mid, 2 = foreground
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (width + 250) - 150;
      this.y = initial ? Math.random() * height : -40 - Math.random() * 80;

      if (this.layer === 0) {
        // Distant mist-like drizzle
        this.speed = 13 + Math.random() * 4;
        this.len = 12 + Math.random() * 8;
        this.width = 0.9;
        this.alpha = 0.22 + Math.random() * 0.12;
      } else if (this.layer === 1) {
        // Midground steady rain
        this.speed = 18 + Math.random() * 5;
        this.len = 20 + Math.random() * 12;
        this.width = 1.3;
        this.alpha = 0.38 + Math.random() * 0.18;
      } else {
        // Foreground crisp drops
        this.speed = 24 + Math.random() * 7;
        this.len = 30 + Math.random() * 16;
        this.width = 1.7;
        this.alpha = 0.55 + Math.random() * 0.25;
      }

      this.vx = sinW * this.speed;
      this.vy = cosW * this.speed;
      this.groundY = height * (0.75 + Math.random() * 0.24);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Create occasional splash on the lower rolling hills
      if (this.y >= this.groundY) {
        if (this.layer >= 1 && Math.random() < 0.28 && splashes.length < 50) {
          splashes.push(new RainSplash(this.x, this.groundY, this.layer));
        }
        this.reset(false);
      } else if (this.y > height + 60 || this.x > width + 150) {
        this.reset(false);
      }
    }
  }

  class RainSplash {
    constructor(x, y, layer) {
      this.x = x;
      this.y = y;
      this.layer = layer;
      this.radius = 1;
      this.maxRadius = layer === 2 ? 5 + Math.random() * 3 : 3 + Math.random() * 2;
      this.alpha = layer === 2 ? 0.45 : 0.28;
      this.maxLife = 12 + Math.random() * 6;
      this.age = 0;
    }

    update() {
      this.age++;
      const p = this.age / this.maxLife;
      this.radius = 1 + (this.maxRadius - 1) * p;
      this.alpha = (this.layer === 2 ? 0.45 : 0.28) * (1 - p);
      return this.age < this.maxLife;
    }

    draw(ctx) {
      if (this.alpha <= 0.01) return;
      ctx.beginPath();
      // Elliptical ripple on landscape slope
      ctx.ellipse(this.x, this.y, this.radius * 1.8, this.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(225, 238, 255, ${this.alpha.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function initRain() {
    backgroundDrops.length = 0;
    midgroundDrops.length = 0;
    foregroundDrops.length = 0;

    // Density scales with screen width
    const densityFactor = Math.min(1.5, Math.max(0.6, width / 1400));
    const bgCount = Math.floor(130 * densityFactor);
    const midCount = Math.floor(85 * densityFactor);
    const fgCount = Math.floor(40 * densityFactor);

    for (let i = 0; i < bgCount; i++) backgroundDrops.push(new RainDrop(0));
    for (let i = 0; i < midCount; i++) midgroundDrops.push(new RainDrop(1));
    for (let i = 0; i < fgCount; i++) foregroundDrops.push(new RainDrop(2));
  }

  function renderRainLayer(drops, ctx) {
    if (drops.length === 0) return;
    const layer = drops[0].layer;
    ctx.lineWidth = drops[0].width;

    ctx.beginPath();
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.update();

      const tailX = d.x - sinW * d.len;
      const tailY = d.y - cosW * d.len;

      ctx.moveTo(tailX, tailY);
      ctx.lineTo(d.x, d.y);
    }

    if (layer === 0) {
      ctx.strokeStyle = 'rgba(215, 232, 255, 0.22)';
    } else if (layer === 1) {
      ctx.strokeStyle = 'rgba(228, 240, 255, 0.42)';
    } else {
      ctx.strokeStyle = 'rgba(245, 250, 255, 0.65)';
    }
    ctx.stroke();
  }

  // ==========================================================================
  // 2. Contrail Particles
  // ==========================================================================
  const contrails = [];

  class ContrailParticle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx * 0.05 + (Math.random() - 0.5) * 0.05;
      this.vy = vy * 0.05 + (Math.random() - 0.5) * 0.05;
      this.radius = 1.2;
      this.maxRadius = 5.5 + Math.random() * 2.5;
      this.opacity = 0.50;
      this.maxLife = 540 + Math.random() * 100;
      this.age = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      const progress = this.age / this.maxLife;
      this.radius = 1.2 + (this.maxRadius - 1.2) * Math.min(1, progress * 1.5);
      this.opacity = 0.50 * (1 - progress);
      return this.age < this.maxLife;
    }

    draw(ctx) {
      if (this.opacity <= 0.01) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 252, 248, ${this.opacity.toFixed(3)})`;
      ctx.fill();
    }
  }

  // ==========================================================================
  // 3. Airplane Flight
  // ==========================================================================
  class Airplane {
    constructor() {
      this.reset();
    }

    reset() {
      this.direction = Math.random() > 0.3 ? 1 : -1;
      this.speed = 0.75 + Math.random() * 0.35;

      const startY = height * (0.10 + Math.random() * 0.16);
      const angleDeg = (Math.random() - 0.45) * 12;
      this.angle = (angleDeg * Math.PI) / 180;

      if (this.direction === 1) {
        this.x = -60;
        this.y = startY;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.heading = Math.atan2(this.vy, this.vx);
      } else {
        this.x = width + 60;
        this.y = startY;
        this.vx = -Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.heading = Math.atan2(this.vy, this.vx);
      }

      this.scale = 0.75 + Math.random() * 0.2;
      this.active = true;
      this.frameCounter = 0;
      this.strobeTimer = 0;
    }

    update() {
      if (!this.active) return false;

      this.x += this.vx;
      this.y += this.vy;
      this.frameCounter++;
      this.strobeTimer = (this.strobeTimer + 1) % 90;

      // Emit contrails every 2 frames
      if (this.frameCounter % 2 === 0) {
        const cosH = Math.cos(this.heading);
        const sinH = Math.sin(this.heading);

        const engineBack = -6 * this.scale;
        const engineSpan = 6.5 * this.scale;

        const peX = this.x + engineBack * cosH - (-engineSpan) * sinH;
        const peY = this.y + engineBack * sinH + (-engineSpan) * cosH;
        contrails.push(new ContrailParticle(peX, peY, -this.vx, -this.vy));

        const seX = this.x + engineBack * cosH - engineSpan * sinH;
        const seY = this.y + engineBack * sinH + engineSpan * cosH;
        contrails.push(new ContrailParticle(seX, seY, -this.vx, -this.vy));
      }

      if (this.direction === 1 && this.x > width + 100) {
        this.active = false;
      } else if (this.direction === -1 && this.x < -100) {
        this.active = false;
      }

      return this.active;
    }

    draw(ctx) {
      if (!this.active) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.heading);
      ctx.scale(this.scale, this.scale);

      // Fuselage
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.bezierCurveTo(10, -2.4, -4, -2.4, -13, -1.2);
      ctx.lineTo(-17, 0);
      ctx.lineTo(-13, 1.2);
      ctx.bezierCurveTo(-4, 2.4, 10, 2.4, 15, 0);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, -3, 0, 3);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      grad.addColorStop(0.5, 'rgba(242, 245, 250, 0.92)');
      grad.addColorStop(1, 'rgba(180, 190, 205, 0.85)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Cockpit strip
      ctx.fillStyle = 'rgba(70, 85, 110, 0.85)';
      ctx.beginPath();
      ctx.moveTo(11, -0.6);
      ctx.lineTo(8.5, -1.2);
      ctx.lineTo(8.5, 1.2);
      ctx.lineTo(11, 0.6);
      ctx.closePath();
      ctx.fill();

      // Wings
      ctx.beginPath();
      ctx.moveTo(2, -1.8);
      ctx.lineTo(-4, -19);
      ctx.lineTo(-7, -19);
      ctx.lineTo(-6, -18);
      ctx.lineTo(-3.5, -1.8);
      ctx.moveTo(2, 1.8);
      ctx.lineTo(-4, 19);
      ctx.lineTo(-7, 19);
      ctx.lineTo(-6, 18);
      ctx.lineTo(-3.5, 1.8);
      ctx.closePath();

      const wingGrad = ctx.createLinearGradient(0, -19, 0, 19);
      wingGrad.addColorStop(0, 'rgba(235, 240, 248, 0.92)');
      wingGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      wingGrad.addColorStop(1, 'rgba(200, 210, 225, 0.88)');
      ctx.fillStyle = wingGrad;
      ctx.fill();

      // Engines
      ctx.fillStyle = 'rgba(195, 205, 220, 0.95)';
      ctx.fillRect(-2, -7.5, 6, 2.2);
      ctx.fillRect(-2, 5.3, 6, 2.2);
      ctx.fillStyle = 'rgba(60, 70, 85, 0.9)';
      ctx.fillRect(3.5, -7.3, 0.8, 1.8);
      ctx.fillRect(3.5, 5.5, 0.8, 1.8);

      // Tail
      ctx.beginPath();
      ctx.moveTo(-11, -1);
      ctx.lineTo(-16, -7.5);
      ctx.lineTo(-17.5, -7.5);
      ctx.lineTo(-14.5, -0.8);
      ctx.moveTo(-11, 1);
      ctx.lineTo(-16, 7.5);
      ctx.lineTo(-17.5, 7.5);
      ctx.lineTo(-14.5, 0.8);
      ctx.closePath();
      ctx.fillStyle = 'rgba(225, 232, 242, 0.92)';
      ctx.fill();

      // Strobes
      ctx.beginPath();
      ctx.arc(-4.5, -18.5, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 45, 45, 0.95)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-4.5, 18.5, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(50, 255, 90, 0.95)';
      ctx.fill();

      const isFlashing = (this.strobeTimer >= 0 && this.strobeTimer <= 4) ||
                         (this.strobeTimer >= 14 && this.strobeTimer <= 18);
      if (isFlashing) {
        ctx.beginPath();
        ctx.arc(-14, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-14, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  let activePlane = null;
  let nextFlightTimeout = null;

  function scheduleNextFlight(delayMs) {
    if (nextFlightTimeout) clearTimeout(nextFlightTimeout);
    nextFlightTimeout = setTimeout(() => {
      activePlane = new Airplane();
    }, delayMs);
  }

  scheduleNextFlight(1500);

  // ==========================================================================
  // 4. Master Animation Loop (Rain + Splashes + Contrails + Flight)
  // ==========================================================================
  window.addEventListener('resize', resize);
  resize();

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Subtle atmospheric rain tint
    ctx.fillStyle = 'rgba(165, 185, 210, 0.04)';
    ctx.fillRect(0, 0, width, height);

    // Layer 0: Distant background mist rain
    renderRainLayer(backgroundDrops, ctx);

    // Contrails & Airplane in mid-air
    for (let i = contrails.length - 1; i >= 0; i--) {
      const p = contrails[i];
      if (p.update()) {
        p.draw(ctx);
      } else {
        contrails.splice(i, 1);
      }
    }

    if (activePlane) {
      const stillFlying = activePlane.update();
      if (stillFlying) {
        activePlane.draw(ctx);
      } else {
        activePlane = null;
        const nextDelay = 25000 + Math.random() * 20000;
        scheduleNextFlight(nextDelay);
      }
    }

    // Layer 1: Midground steady rainfall
    renderRainLayer(midgroundDrops, ctx);

    // Landscape surface splash ripples
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      if (s.update()) {
        s.draw(ctx);
      } else {
        splashes.splice(i, 1);
      }
    }

    // Layer 2: Foreground crisp raindrops
    renderRainLayer(foregroundDrops, ctx);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (nextFlightTimeout) clearTimeout(nextFlightTimeout);
    } else {
      if (!activePlane) {
        scheduleNextFlight(2000);
      }
    }
  });

})();
