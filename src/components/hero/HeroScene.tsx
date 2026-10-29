'use client';

import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedMode } = useThemeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let isRunning = false;
    let width = 0;
    let height = 0;
    let cachedRect: DOMRect | null = null;

    // Mouse tracking with inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateRect = () => {
      if (canvas) cachedRect = canvas.getBoundingClientRect();
    };

    // Resize handler with DPI scaling
    const resize = () => {
      if (!canvas) return;
      const container = containerRef.current;
      width = container?.clientWidth || window.innerWidth;
      height = container?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      updateRect();
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });

    // Track mouse movement with zero layout thrashing
    const handleMouseMove = (e: MouseEvent) => {
      const rect = cachedRect;
      const clientX = rect ? e.clientX - rect.left : e.clientX;
      const clientY = rect ? e.clientY - rect.top : e.clientY;

      mouseX = clientX - width / 2;
      mouseY = clientY - height / 2;

      targetRotY = (mouseX / (width || 1)) * 0.8;
      targetRotX = -(mouseY / (height || 1)) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Generate 3D particle constellation
    const particleCount = width < 768 ? 60 : 120;
    const particles: Particle3D[] = [];
    const baseRadius = Math.min(width, height) * 0.42;

    const colorsDark = ['#3b82f6', '#60a5fa', '#06b6d4', '#818cf8', '#a855f7'];
    const colorsLight = ['#2563eb', '#3b82f6', '#0284c7', '#6366f1', '#7c3aed'];
    const activeColors = resolvedMode === 'dark' ? colorsDark : colorsLight;

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const r = baseRadius * (0.75 + Math.random() * 0.5);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1.2,
        color: activeColors[i % activeColors.length] ?? '#3b82f6',
      });
    }

    const startLoop = () => {
      if (!isRunning && isVisible && !prefersReducedMotion) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (isRunning) {
        cancelAnimationFrame(animationFrameId);
        isRunning = false;
      }
    };

    // Visibility observer to save battery when scrolled away
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const containerEl = containerRef.current;
    const handleVisibilityState = (e: Event) => {
      const skipped = (e as unknown as { skipped?: boolean }).skipped;
      if (skipped) {
        isVisible = false;
        stopLoop();
      } else {
        isVisible = true;
        startLoop();
      }
    };
    if (containerEl) {
      containerEl.addEventListener('contentvisibilityautostatechange', handleVisibilityState);
    }

    const focalLength = 400;
    let baseAngle = 0;

    // Render loop
    const render = () => {
      if (!isVisible) {
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth inertia
      rotX += (targetRotX - rotX) * 0.04;
      rotY += (targetRotY - rotY) * 0.04;

      if (!prefersReducedMotion) {
        baseAngle += 0.003;
      }

      const effectiveAngleY = rotY + baseAngle;
      const cosY = Math.cos(effectiveAngleY);
      const sinY = Math.sin(effectiveAngleY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Project particles to 2D
      const projected = particles.map((p) => {
        // Subtle floating movement
        if (!prefersReducedMotion) {
          p.origX += p.vx;
          p.origY += p.vy;
          p.origZ += p.vz;

          // Gentle bounds
          if (Math.abs(p.origX) > baseRadius * 1.2) p.vx *= -1;
          if (Math.abs(p.origY) > baseRadius * 1.2) p.vy *= -1;
          if (Math.abs(p.origZ) > baseRadius * 1.2) p.vz *= -1;
        }

        // 3D rotation Y
        const x1 = p.origX * cosY - p.origZ * sinY;
        const z1 = p.origZ * cosY + p.origX * sinY;

        // 3D rotation X
        const y2 = p.origY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.origY * sinX;

        // Perspective projection
        const scale = focalLength / (focalLength + z2 + baseRadius);
        const screenX = x1 * scale + centerX;
        const screenY = y2 * scale + centerY;
        const alpha = Math.max(0.1, Math.min(1, (z2 + baseRadius) / (baseRadius * 2)));

        return {
          screenX,
          screenY,
          scale,
          alpha,
          radius: p.radius * scale,
          color: p.color,
          z: z2,
        };
      });

      // Sort by depth (painter's algorithm)
      projected.sort((a, b) => a.z - b.z);

      // Draw connecting lines between close points
      const maxDistance = width < 768 ? 85 : 120;
      const isDark = resolvedMode === 'dark';

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (!p1) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (!p2) continue;

          const dx = p1.screenX - p2.screenX;
          const dy = p1.screenY - p2.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.22 * ((p1.alpha + p2.alpha) / 2);
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);

            ctx.strokeStyle = isDark
              ? `rgba(96, 165, 250, ${lineAlpha})`
              : `rgba(37, 99, 235, ${lineAlpha * 0.9})`;
            ctx.lineWidth = 0.8 * ((p1.scale + p2.scale) / 2);
            ctx.stroke();
          }
        }
      }

      // Draw glowing particle nodes
      projected.forEach((p) => {
        if (
          p.screenX < -50 ||
          p.screenX > width + 50 ||
          p.screenY < -50 ||
          p.screenY > height + 50
        ) {
          return;
        }

        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, Math.max(1, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Subtle glow halo for prominent front particles
        if (p.alpha > 0.6) {
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(37, 99, 235, 0.12)';
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;

      if (!prefersReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    // Defer initialization to after initial paint (optimizes LCP)
    const initTimer = setTimeout(() => {
      resize();
      updateRect();
      startLoop();
    }, 0);

    return () => {
      clearTimeout(initTimer);
      stopLoop();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerEl) {
        containerEl.removeEventListener('contentvisibilityautostatechange', handleVisibilityState);
      }
      observer.disconnect();
    };
  }, [resolvedMode]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-85 transition-opacity duration-700 dark:opacity-90"
      />
      {/* Ambient center vignette to blend into page */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-base)] via-transparent to-transparent opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-blue-glow),_transparent_70%)]" />
    </div>
  );
}

export default HeroScene;
