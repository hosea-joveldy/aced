import { useEffect, useRef } from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  orbitRadius: number;
  baseAngle: number;
  speed: number;
  ringCenterX: number;
  ringCenterY: number;
}

export function InteractiveHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Respect user's motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
      radius: 120, // Interaction radius in CSS pixels
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const createParticles = (w: number, h: number) => {
      const list: Particle[] = [];
      const centerX = w * 0.5;
      const centerY = h * 0.45;

      // Concentric orbital rings with thousands of points as in Reflection reference
      const rings = [
        { r: Math.min(w, h) * 0.18, count: 180, speed: 0.0004, alpha: 0.65 },
        { r: Math.min(w, h) * 0.28, count: 280, speed: -0.0003, alpha: 0.6 },
        { r: Math.min(w, h) * 0.38, count: 360, speed: 0.00025, alpha: 0.55 },
        { r: Math.min(w, h) * 0.48, count: 420, speed: -0.0002, alpha: 0.5 },
        { r: Math.min(w, h) * 0.58, count: 460, speed: 0.00018, alpha: 0.4 },
        { r: Math.min(w, h) * 0.68, count: 480, speed: -0.00015, alpha: 0.3 },
      ];

      rings.forEach((ring) => {
        for (let i = 0; i < ring.count; i++) {
          // Add subtle natural jitter so it looks like an orbital cloud
          const angle = (i / ring.count) * Math.PI * 2;
          const jitterRadius = ring.r + (Math.sin(i * 7) * 8 + (Math.cos(i * 13) * 6));
          const px = centerX + Math.cos(angle) * jitterRadius;
          const py = centerY + Math.sin(angle) * (jitterRadius * 0.72); // slightly elliptical

          list.push({
            baseX: px,
            baseY: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            radius: Math.random() > 0.85 ? 1.8 : Math.random() > 0.5 ? 1.4 : 1.0,
            alpha: ring.alpha * (0.6 + Math.random() * 0.4),
            orbitRadius: jitterRadius,
            baseAngle: angle,
            speed: ring.speed * (0.8 + Math.random() * 0.4),
            ringCenterX: centerX,
            ringCenterY: centerY,
          });
        }
      });

      return list;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = createParticles(width, height);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint background orbital guides
      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const ringRadii = [
        Math.min(width, height) * 0.28,
        Math.min(width, height) * 0.48,
        Math.min(width, height) * 0.68,
      ];

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(120, 113, 108, 0.16)';
      ringRadii.forEach((r) => {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, r, r * 0.72, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Update & render particles
      const count = particles.length;
      for (let i = 0; i < count; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Slow orbital motion
          p.baseAngle += p.speed;
          p.baseX = p.ringCenterX + Math.cos(p.baseAngle) * p.orbitRadius;
          p.baseY = p.ringCenterY + Math.sin(p.baseAngle) * (p.orbitRadius * 0.72);

          // Mouse evasion physics
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0.001) {
            // Push away proportional to proximity
            const force = (1 - dist / mouse.radius) * 4.2;
            const dirX = dx / dist;
            const dirY = dy / dist;
            p.vx += dirX * force;
            p.vy += dirY * force;
          }

          // Spring return force back to orbit home
          const returnForceX = (p.baseX - p.x) * 0.08;
          const returnForceY = (p.baseY - p.y) * 0.08;
          p.vx = (p.vx + returnForceX) * 0.82; // damping friction
          p.vy = (p.vy + returnForceY) * 0.82;

          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = p.baseX;
          p.y = p.baseY;
        }

        // Draw dot
        ctx.fillStyle = `rgba(60, 56, 54, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Attach resize observer for fluid responsive resize
    const ro = new ResizeObserver(() => {
      resize();
      if (prefersReducedMotion) {
        render();
      }
    });

    ro.observe(canvas);
    resize();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render();
    }

    return () => {
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
