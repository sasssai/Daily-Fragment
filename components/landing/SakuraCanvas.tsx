"use client";

import { useEffect, useRef } from "react";

// Flow & Ripple — Sakura & Water 版をReact Component として移植。
// 描画ロジックは portfolio-interactive/themes/sakura/sketch.js から引き継ぎ、
// マウス/クリックイベントは window に張ることでページ上のボタンと共存させる。

type Rock = {
  x: number;
  y: number;
  r: number;
  verts: { x: number; y: number }[];
};

export function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 川の流れ
    const FLOW_ANGLE = Math.PI * 0.75;
    const FLOW_STRENGTH = 0.0032;

    // 岩
    const rocks: Rock[] = [];
    const createRocks = () => {
      const specs = [
        { xr: 0.22, yr: 0.38, rx: 58, ry: 44, tilt: 0.2 },
        { xr: 0.78, yr: 0.28, rx: 50, ry: 42, tilt: 0.5 },
        { xr: 0.35, yr: 0.82, rx: 60, ry: 46, tilt: 0.1 },
        { xr: 0.7, yr: 0.78, rx: 46, ry: 40, tilt: -0.2 },
      ];
      for (const s of specs) {
        const verts: { x: number; y: number }[] = [];
        const vertCount = 36;
        for (let i = 0; i < vertCount; i++) {
          const a = (i / vertCount) * Math.PI * 2;
          const baseX = Math.cos(a) * s.rx;
          const baseY = Math.sin(a) * s.ry;
          const cosT = Math.cos(s.tilt);
          const sinT = Math.sin(s.tilt);
          const x = baseX * cosT - baseY * sinT;
          const y = baseX * sinT + baseY * cosT;
          const noise = 0.97 + Math.random() * 0.06;
          verts.push({ x: x * noise, y: y * noise });
        }
        rocks.push({
          x: W * s.xr,
          y: H * s.yr,
          r: (s.rx + s.ry) / 2,
          verts,
        });
      }
    };
    createRocks();

    // パーティクル（花びら）
    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      baseSize = 0;
      size = 0;
      baseHue = 0;
      hue = 0;
      saturation = 0;
      lightness = 0;
      drag = 0;
      gravity = 0;
      phase = 0;
      swayFreq = 0;
      rotSpeed = 0;
      flowAngleOffset = 0;
      flowSpeedMult = 0;
      pushed = false;

      constructor() {
        this.reset(true);
      }

      reset(initial: boolean) {
        if (initial) {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
        } else {
          if (Math.random() < 0.55) {
            this.x = Math.random() * W;
            this.y = -15;
          } else {
            this.x = W + 15;
            this.y = Math.random() * H * 0.85;
          }
        }
        this.vx = 0;
        this.vy = 0;
        this.baseSize = 3.2 + Math.random() * 3.5;
        this.size = this.baseSize;
        this.baseHue = 335 + Math.random() * 30;
        this.hue = this.baseHue;
        this.saturation = 60 + Math.random() * 30;
        this.lightness = 70 + Math.random() * 15;
        this.drag = 0.992 + Math.random() * 0.006;
        this.gravity = 0.001 + Math.random() * 0.002;
        this.phase = Math.random() * Math.PI * 2;
        this.swayFreq = 0.004 + Math.random() * 0.003;
        this.rotSpeed = (Math.random() - 0.5) * 0.004;
        this.flowAngleOffset = (Math.random() - 0.5) * 0.7;
        this.flowSpeedMult = 0.75 + Math.random() * 0.5;
      }

      update(mx: number, my: number, ripples: Ripple[], time: number) {
        this.pushed = false;

        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 220 && dist > 1) {
          const force = 0.15 / dist;
          const angle = Math.atan2(dy, dx);
          const perpAngle = angle + Math.PI * 0.5;
          this.vx +=
            Math.cos(angle) * force * 0.15 + Math.cos(perpAngle) * force * 0.45;
          this.vy +=
            Math.sin(angle) * force * 0.15 + Math.sin(perpAngle) * force * 0.45;

          const proximity = 1 - dist / 220;
          this.lightness = 70 + proximity * 18;
          this.size = this.baseSize + proximity * 2.2;
          this.pushed = true;
        } else {
          this.lightness += (76 - this.lightness) * 0.02;
          this.size += (this.baseSize - this.size) * 0.05;
        }

        for (const r of ripples) {
          const rdx = this.x - r.x;
          const rdy = this.y - r.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);

          const edgeSoft = 60;
          if (rdist < r.radius + edgeSoft && rdist > 1) {
            let zone;
            if (rdist < r.radius) {
              zone = 1;
            } else {
              zone = 1 - (rdist - r.radius) / edgeSoft;
            }
            const ageFactor = 1 - r.age / r.maxAge;
            const pushForce = r.strength * zone * ageFactor * 0.05;

            this.vx += (rdx / rdist) * pushForce;
            this.vy += (rdy / rdist) * pushForce;

            this.hue =
              this.baseHue * 0.75 + (200 + Math.random() * 20) * 0.25;
            this.pushed = true;
          } else {
            this.hue += (this.baseHue - this.hue) * 0.02;
          }
        }

        const myAngle = FLOW_ANGLE + this.flowAngleOffset;
        const myStrength = FLOW_STRENGTH * this.flowSpeedMult;
        this.vx += Math.cos(myAngle) * myStrength;
        this.vy += Math.sin(myAngle) * myStrength;

        for (const rock of rocks) {
          const rdx = this.x - rock.x;
          const rdy = this.y - rock.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const bufferZone = 12;

          if (rdist < rock.r + bufferZone && rdist > 0.1) {
            const nx = rdx / rdist;
            const ny = rdy / rdist;

            const vDotN = this.vx * nx + this.vy * ny;
            if (vDotN < 0) {
              this.vx -= vDotN * nx;
              this.vy -= vDotN * ny;
            }

            const proximity = Math.max(0, 1 - (rdist - rock.r) / bufferZone);
            const repel = proximity * proximity * 0.05;
            this.vx += nx * repel;
            this.vy += ny * repel;

            if (rdist < rock.r) {
              const overlap = rock.r - rdist;
              this.x += nx * overlap * 0.25;
              this.y += ny * overlap * 0.25;
              this.pushed = true;
            }
          }
        }

        this.vx += Math.sin(time * this.swayFreq + this.phase) * 0.005;
        this.vy += Math.cos(time * this.swayFreq * 0.7 + this.phase) * 0.004;

        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.008;

        this.vx *= this.drag;
        this.vy *= this.drag;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -25 || this.y > H + 15 || this.y < -25) {
          this.reset(false);
        }
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const alpha = Math.min(0.95, 0.55 + speed * 0.15);

        const angle = this.phase + time * this.rotSpeed;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${alpha})`;

        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 1.8);
        ctx.quadraticCurveTo(s * 1.0, -s * 0.4, s * 0.35, s * 0.8);
        ctx.quadraticCurveTo(0, s * 0.5, -s * 0.35, s * 0.8);
        ctx.quadraticCurveTo(-s * 1.0, -s * 0.4, 0, -s * 1.8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    class Ripple {
      x: number;
      y: number;
      radius = 0;
      maxRadius: number;
      speed: number;
      width: number;
      strength: number;
      age = 0;
      maxAge: number;
      hue: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.maxRadius = 320 + Math.random() * 180;
        this.speed = 1.0 + Math.random() * 0.6;
        this.width = 42 + Math.random() * 22;
        this.strength = 0.8 + Math.random() * 0.5;
        this.maxAge = this.maxRadius / this.speed;
        this.hue = 195 + Math.random() * 30;
      }

      update() {
        this.radius += this.speed;
        this.age++;
        return this.age < this.maxAge;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const progress = this.age / this.maxAge;
        const fade = 1 - progress;
        const r = this.radius;

        ctx.strokeStyle = `hsla(${this.hue}, 60%, 72%, ${fade * 0.22})`;
        ctx.lineWidth = Math.max(1, 7 * fade);
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `hsla(${this.hue}, 85%, 92%, ${fade * 0.55})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 1; i <= 3; i++) {
          const echoR = r - i * 16;
          if (echoR > 4) {
            ctx.strokeStyle = `hsla(${this.hue}, 55%, 75%, ${(fade * 0.18) / i})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, echoR, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        if (progress < 0.6) {
          const grad = ctx.createRadialGradient(
            this.x,
            this.y,
            0,
            this.x,
            this.y,
            r
          );
          grad.addColorStop(0, `hsla(${this.hue}, 60%, 75%, ${fade * 0.06})`);
          grad.addColorStop(0.7, `hsla(${this.hue}, 60%, 75%, ${fade * 0.03})`);
          grad.addColorStop(1, `hsla(${this.hue}, 60%, 75%, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const PARTICLE_COUNT = 300;
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    const ripples: Ripple[] = [];

    let mx = W / 2;
    let my = H / 2;
    let mouseInside = false;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      mouseInside = true;
    };
    const onMouseLeave = () => {
      mouseInside = false;
    };
    const onClick = (e: MouseEvent) => {
      ripples.push(new Ripple(e.clientX, e.clientY));
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      mx = t.clientX;
      my = t.clientY;
      mouseInside = true;
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      mx = t.clientX;
      my = t.clientY;
      mouseInside = true;
      ripples.push(new Ripple(t.clientX, t.clientY));
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    const drawRocks = (ctx: CanvasRenderingContext2D) => {
      for (const rock of rocks) {
        ctx.save();
        ctx.translate(rock.x, rock.y);

        const grad = ctx.createRadialGradient(
          -rock.r * 0.25,
          -rock.r * 0.3,
          0,
          0,
          0,
          rock.r
        );
        grad.addColorStop(0, "rgba(118, 125, 138, 0.72)");
        grad.addColorStop(1, "rgba(82, 90, 105, 0.72)");
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(rock.verts[0].x, rock.verts[0].y);
        for (let i = 1; i < rock.verts.length; i++) {
          ctx.lineTo(rock.verts[i].x, rock.verts[i].y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(150, 160, 175, 0.08)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }
    };

    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      const maxDist = 55;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < maxDist * maxDist) {
            const alpha = (1 - Math.sqrt(dist) / maxDist) * 0.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 55%, 75%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    let frameCount = 0;
    let animationFrameId = 0;

    const animate = () => {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "rgba(48, 82, 105, 0.28)");
      bgGrad.addColorStop(0.5, "rgba(32, 58, 82, 0.28)");
      bgGrad.addColorStop(1, "rgba(18, 36, 58, 0.28)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      if (!mouseInside) {
        mx += (W / 2 - mx) * 0.01;
        my += (H / 2 - my) * 0.01;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (!ripples[i].update()) ripples.splice(i, 1);
        else ripples[i].draw(ctx);
      }

      drawRocks(ctx);

      for (const p of particles) {
        p.update(mx, my, ripples, frameCount);
        p.draw(ctx, frameCount);
      }

      if (frameCount % 2 === 0) drawConnections(ctx);

      if (mouseInside) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 130);
        grad.addColorStop(0, "hsla(340, 70%, 80%, 0.06)");
        grad.addColorStop(1, "hsla(340, 70%, 80%, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 130, 0, Math.PI * 2);
        ctx.fill();
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
