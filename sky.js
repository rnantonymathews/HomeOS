/**
 * HomeOS - Photorealistic Cinematic Rain, Atmospheric Mist & Flight Simulation
 * Features:
 * - Dynamic wind gusts & oscillating breeze physics
 * - Sunlit refracted raindrops with gradient motion blur
 * - Micro-physics ground splash droplets & hill-slope impact ripples
 * - Drifting valley fog & atmospheric precipitation haze
 * - Realistic camera lens / window water beads with trickle physics
 * - High-altitude airliner with dissolving vapor contrails & aviation strobes
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
  // 1. Dynamic Wind & Atmospheric System
  // ==========================================================================
  let windAngle = 0.22; // ~12.5° initial slant
  let globalWindSpeed = 1.0;
  let time = 0;

  function updateWind() {
    time += 1;
    // Gentle natural wind gust oscillation
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
        // Deep background mist rain (high density, wispy)
        this.baseSpeed = 14 + Math.random() * 4;
        this.length = 12 + Math.random() * 10;
        this.width = 0.75;
        this.alpha = 0.16 + Math.random() * 0.12;
      } else if (this.layer === 1) {
        // Midground steady rain
        this.baseSpeed = 19 + Math.random() * 6;
        this.length = 22 + Math.random() * 14;
        this.width = 1.25;
        this.alpha = 0.32 + Math.random() * 0.18;
      } else {
        // Foreground crisp drops with motion blur
        this.baseSpeed = 26 + Math.random() * 8;
        this.length = 36 + Math.random() * 20;
        this.width = 1.75;
        this.alpha = 0.52 + Math.random() * 0.28;
      }

      // Height of rolling hills slope (spawns splashes when hitting hills)
      this.impactY = height * (0.72 + Math.random() * 0.26);
    }

    update() {
      const speed = this.baseSpeed * globalWindSpeed;
      const vx = Math.sin(windAngle) * speed;
      const vy = Math.cos(windAngle) * speed;

      this.x += vx;
      this.y += vy;

      // Ground impact check
      if (this.y >= this.impactY) {
        // Trigger splash on a fraction of drops
        if (this.layer >= 1 && Math.random() < 0.25) {
          if (splashes.length < 40) {
            splashes.push(new GroundRipple(this.x, this.impactY, this.layer));
          }
          if (this.layer === 2 && splashBeads.length < 50) {
            // Throw 2 tiny micro-droplets into the air
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
      const alpha = (1 - progress) * (this.layer === 2 ? 0.38 : 0.22);
      if (alpha <= 0.01) return;

      ctx.beginPath();
      // Ellipse angled along the slope of the hills
      ctx.ellipse(this.x, this.y, currentRadius * 1.9, currentRadius * 0.55, -0.05, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(230, 242, 255, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.85;
      ctx.stroke();
    }
  }

  // Micro-droplets that bounce upward on ground impact
  class SplashBead {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      // Bounce upward and slightly outward
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.4;
      const speed = 2.2 + Math.random() * 2.6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.28;
      this.alpha = 0.65;
      this.maxLife = 16 + Math.random() * 8;
      this.age = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.age++;
      this.alpha = 0.65 * (1 - this.age / this.maxLife);
      return this.age < this.maxLife;
    }

    draw(ctx) {
      if (this.alpha <= 0.01) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 248, 255, ${this.alpha.toFixed(3)})`;
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

  // Renders a rain layer with sunlit color highlights
  function renderRainLayer(drops, ctx) {
    if (drops.length === 0) return;
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

    // Drops near the left horizon catch warm golden morning sun reflection!
    if (layer === 0) {
      ctx.strokeStyle = 'rgba(215, 230, 250, 0.20)';
    } else if (layer === 1) {
      ctx.strokeStyle = 'rgba(230, 242, 255, 0.38)';
    } else {
      ctx.strokeStyle = 'rgba(250, 252, 255, 0.68)';
    }
    ctx.stroke();
  }

  // ==========================================================================
  // 3. Camera Lens / Glass Water Droplets with Realistic Gravity Trickles
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
      this.trickling = Math.random() < 0.28; // 28% of droplets slide down
      this.trickleSpeed = 0.4 + Math.random() * 0.8;
      this.trail = [];
      this.alpha = 0.65;
    }

    update() {
      this.age++;

      // Trickle physics
      if (this.trickling && this.age > 40 && this.age < 220) {
        this.y += this.trickleSpeed;
        this.x += (Math.random() - 0.5) * 0.25; // slight meandering
        if (this.age % 4 === 0 && this.trail.length < 25) {
          this.trail.push({ x: this.x, y: this.y, r: this.radius * 0.55 });
        }
      }

      // Smooth evaporation
      const remaining = this.maxLife - this.age;
      if (remaining < 90) {
        this.alpha = 0.65 * (remaining / 90);
      }

      return this.age < this.maxLife;
    }

    draw(ctx) {
      if (this.alpha <= 0.01) return;

      // Draw wet trickle trail if sliding
      if (this.trail.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i];
          ctx.moveTo(t.x + t.r, t.y);
          ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${(this.alpha * 0.22).toFixed(3)})`;
        ctx.fill();
      }

      // 1. Water drop shadow / refraction rim
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(30, 45, 65, ${(this.alpha * 0.28).toFixed(3)})`;
      ctx.fill();

      // 2. Glassy translucent water body
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.88, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 248, 255, ${(this.alpha * 0.35).toFixed(3)})`;
      ctx.fill();

      // 3. Crisp specular sun highlight (top-left glint)
      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.38, this.y - this.radius * 0.38, this.radius * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(this.alpha * 0.85).toFixed(3)})`;
      ctx.fill();
    }
  }

  function updateLensDroplets() {
    // Spawn a new lens droplet every 1.5 - 3.5 seconds
    if (time > nextLensDropletTime && lensDroplets.length < 16) {
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
    mistOffset += 0.15;
    const mistY = height * 0.48; // resting in the valley saddle between hills
    const grad = ctx.createLinearGradient(0, mistY - 80, 0, mistY + 120);
    grad.addColorStop(0, 'rgba(210, 225, 240, 0)');
    grad.addColorStop(0.5, 'rgba(215, 230, 245, 0.055)');
    grad.addColorStop(1, 'rgba(210, 225, 240, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, mistY - 80, width, 200);
  }

  // ==========================================================================
  // 5. Contrail Particles & Commercial Airplane
  // ==========================================================================
  const contrails = [];

  class ContrailParticle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx * 0.04 + (Math.random() - 0.5) * 0.04;
      this.vy = vy * 0.04 + (Math.random() - 0.5) * 0.04;
      this.radius = 1.2;
      this.maxRadius = 6.0 + Math.random() * 2.5;
      this.opacity = 0.48;
      this.maxLife = 540 + Math.random() * 100;
      this.age = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      const progress = this.age / this.maxLife;
      this.radius = 1.2 + (this.maxRadius - 1.2) * Math.min(1, progress * 1.5);
      this.opacity = 0.48 * (1 - progress);
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

  class Airplane {
    constructor() {
      this.reset();
    }

    reset() {
      this.direction = Math.random() > 0.3 ? 1 : -1;
      this.speed = 0.72 + Math.random() * 0.30;

      const startY = height * (0.10 + Math.random() * 0.16);
      const angleDeg = (Math.random() - 0.45) * 11;
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
      grad.addColorStop(0.5, 'rgba(240, 245, 252, 0.92)');
      grad.addColorStop(1, 'rgba(175, 188, 205, 0.85)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Cockpit strip
      ctx.fillStyle = 'rgba(65, 80, 105, 0.85)';
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
      wingGrad.addColorStop(0, 'rgba(235, 242, 250, 0.92)');
      wingGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      wingGrad.addColorStop(1, 'rgba(195, 208, 222, 0.88)');
      ctx.fillStyle = wingGrad;
      ctx.fill();

      // Engines
      ctx.fillStyle = 'rgba(190, 202, 218, 0.95)';
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
      ctx.fillStyle = 'rgba(225, 234, 245, 0.92)';
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
        ctx.arc(-14, 0, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-14, 0, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.40)';
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
  // 6. Master Cinematic Render Loop
  // ==========================================================================
  window.addEventListener('resize', resize);
  resize();

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Update dynamic wind breeze
    updateWind();

    // 1. Atmospheric rainy weather tint (soft cool overcast)
    ctx.fillStyle = 'rgba(150, 175, 205, 0.045)';
    ctx.fillRect(0, 0, width, height);

    // 2. Soft valley mist
    renderValleyMist(ctx);

    // 3. Layer 0: Distant background mist rain (high depth)
    renderRainLayer(bgRain, ctx);

    // 4. Airplane & Contrails in the middle atmosphere
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

    // 5. Layer 1: Midground steady rainfall
    renderRainLayer(midRain, ctx);

    // 6. Ground impact splashes (slope ripples)
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      if (s.update()) {
        s.draw(ctx);
      } else {
        splashes.splice(i, 1);
      }
    }

    // 7. Ground impact micro-bead droplets (bouncing in air)
    for (let i = splashBeads.length - 1; i >= 0; i--) {
      const b = splashBeads[i];
      if (b.update()) {
        b.draw(ctx);
      } else {
        splashBeads.splice(i, 1);
      }
    }

    // 8. Layer 2: Foreground crisp raindrops with motion blur
    renderRainLayer(fgRain, ctx);

    // 9. Camera Lens / Glass Water Droplets & Trickles (living foreground)
    updateLensDroplets();

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
