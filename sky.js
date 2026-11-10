/**
 * HomeOS - Ambient Flight & Sky Animation
 * Renders high-altitude commercial flights cruising over the morning landscape with 
 * realistic expanding vapor contrails and navigation strobe lights.
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
  }

  window.addEventListener('resize', resize);
  resize();

  // Particle pool for contrails
  const contrails = [];

  class ContrailParticle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx * 0.05 + (Math.random() - 0.5) * 0.05;
      this.vy = vy * 0.05 + (Math.random() - 0.5) * 0.05;
      this.radius = 1.2;
      this.maxRadius = 5.5 + Math.random() * 2.5;
      this.opacity = 0.52;
      this.maxLife = 580 + Math.random() * 120; // ~10-12s lifetime
      this.age = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      const progress = this.age / this.maxLife;
      this.radius = 1.2 + (this.maxRadius - 1.2) * Math.min(1, progress * 1.5);
      this.opacity = 0.52 * (1 - progress);
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

  // Active Airplane Flight
  class Airplane {
    constructor() {
      this.reset();
    }

    reset() {
      // Choose direction: 0 = left to right, 1 = right to left
      this.direction = Math.random() > 0.3 ? 1 : -1; // 70% left-to-right (flying across sunrise)
      this.speed = 0.75 + Math.random() * 0.35; // gentle cruising speed

      // Cruise in the upper sky (between 8% and 28% of screen height, above hills)
      const startY = height * (0.10 + Math.random() * 0.16);
      const angleDeg = (Math.random() - 0.45) * 12; // gentle -5° to +7° climb/descent
      this.angle = (angleDeg * Math.PI) / 180;

      if (this.direction === 1) {
        // Left to right
        this.x = -60;
        this.y = startY;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.heading = Math.atan2(this.vy, this.vx);
      } else {
        // Right to left
        this.x = width + 60;
        this.y = startY;
        this.vx = -Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.heading = Math.atan2(this.vy, this.vx);
      }

      this.scale = 0.75 + Math.random() * 0.2; // High-altitude scale
      this.active = true;
      this.frameCounter = 0;
      this.strobeTimer = 0;
    }

    update() {
      if (!this.active) return false;

      this.x += this.vx;
      this.y += this.vy;
      this.frameCounter++;
      this.strobeTimer = (this.strobeTimer + 1) % 90; // 1.5s strobe cycle

      // Emit dual engine contrails every 2 frames
      if (this.frameCounter % 2 === 0) {
        const cosH = Math.cos(this.heading);
        const sinH = Math.sin(this.heading);

        // Engine offsets relative to plane center
        const engineBack = -6 * this.scale;
        const engineSpan = 6.5 * this.scale;

        // Port engine
        const peX = this.x + engineBack * cosH - (-engineSpan) * sinH;
        const peY = this.y + engineBack * sinH + (-engineSpan) * cosH;
        contrails.push(new ContrailParticle(peX, peY, -this.vx, -this.vy));

        // Starboard engine
        const seX = this.x + engineBack * cosH - engineSpan * sinH;
        const seY = this.y + engineBack * sinH + engineSpan * cosH;
        contrails.push(new ContrailParticle(seX, seY, -this.vx, -this.vy));
      }

      // Check bounds
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

      // --- 1. Fuselage ---
      ctx.beginPath();
      // Nose cone
      ctx.moveTo(15, 0);
      // Top fuselage profile
      ctx.bezierCurveTo(10, -2.4, -4, -2.4, -13, -1.2);
      // Tail cone
      ctx.lineTo(-17, 0);
      // Bottom fuselage profile
      ctx.lineTo(-13, 1.2);
      ctx.bezierCurveTo(-4, 2.4, 10, 2.4, 15, 0);
      ctx.closePath();

      // Soft sunlit pearl-white body with subtle shadow
      const grad = ctx.createLinearGradient(0, -3, 0, 3);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      grad.addColorStop(0.5, 'rgba(242, 245, 250, 0.92)');
      grad.addColorStop(1, 'rgba(180, 190, 205, 0.85)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle cockpit window strip
      ctx.fillStyle = 'rgba(70, 85, 110, 0.85)';
      ctx.beginPath();
      ctx.moveTo(11, -0.6);
      ctx.lineTo(8.5, -1.2);
      ctx.lineTo(8.5, 1.2);
      ctx.lineTo(11, 0.6);
      ctx.closePath();
      ctx.fill();

      // --- 2. Main Wings ---
      ctx.beginPath();
      // Port wing (left)
      ctx.moveTo(2, -1.8);
      ctx.lineTo(-4, -19); // wingtip
      ctx.lineTo(-7, -19); // winglet
      ctx.lineTo(-6, -18);
      ctx.lineTo(-3.5, -1.8);
      // Starboard wing (right)
      ctx.moveTo(2, 1.8);
      ctx.lineTo(-4, 19); // wingtip
      ctx.lineTo(-7, 19); // winglet
      ctx.lineTo(-6, 18);
      ctx.lineTo(-3.5, 1.8);
      ctx.closePath();

      const wingGrad = ctx.createLinearGradient(0, -19, 0, 19);
      wingGrad.addColorStop(0, 'rgba(235, 240, 248, 0.92)');
      wingGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      wingGrad.addColorStop(1, 'rgba(200, 210, 225, 0.88)');
      ctx.fillStyle = wingGrad;
      ctx.fill();

      // --- 3. Twin Jet Engines ---
      ctx.fillStyle = 'rgba(195, 205, 220, 0.95)';
      // Port engine pod
      ctx.fillRect(-2, -7.5, 6, 2.2);
      // Starboard engine pod
      ctx.fillRect(-2, 5.3, 6, 2.2);

      // Engine intake shadow
      ctx.fillStyle = 'rgba(60, 70, 85, 0.9)';
      ctx.fillRect(3.5, -7.3, 0.8, 1.8);
      ctx.fillRect(3.5, 5.5, 0.8, 1.8);

      // --- 4. Horizontal Stabilizers (Tail Wings) ---
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

      // --- 5. Strobe & Navigation Lights ---
      // Red port wingtip light
      ctx.beginPath();
      ctx.arc(-4.5, -18.5, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 45, 45, 0.95)';
      ctx.fill();

      // Green starboard wingtip light
      ctx.beginPath();
      ctx.arc(-4.5, 18.5, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(50, 255, 90, 0.95)';
      ctx.fill();

      // Anti-collision white strobe (double-flash pattern: frames 0-4, 12-16)
      const isFlashing = (this.strobeTimer >= 0 && this.strobeTimer <= 4) ||
                         (this.strobeTimer >= 14 && this.strobeTimer <= 18);
      if (isFlashing) {
        // Flash on tail fin
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

  // First flight starts 1.5 seconds after load
  scheduleNextFlight(1500);

  // Animation Loop
  function loop() {
    ctx.clearRect(0, 0, width, height);

    // 1. Update and draw contrails
    for (let i = contrails.length - 1; i >= 0; i--) {
      const p = contrails[i];
      if (p.update()) {
        p.draw(ctx);
      } else {
        contrails.splice(i, 1);
      }
    }

    // 2. Update and draw airplane
    if (activePlane) {
      const stillFlying = activePlane.update();
      if (stillFlying) {
        activePlane.draw(ctx);
      } else {
        activePlane = null;
        // Schedule next peaceful flight in 25-45 seconds
        const nextDelay = 25000 + Math.random() * 20000;
        scheduleNextFlight(nextDelay);
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // Pause when tab is hidden to save 0% battery/CPU
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
