'use client';

import React, { useEffect, useRef } from 'react';
import type { Skill } from '@/types';
import { useThemeStore } from '@/store';

interface SkillOrbitProps {
  skills: Skill[];
  onSelectSkill: (skill: Skill) => void;
}

interface NodePosition {
  x: number;
  y: number;
  radius: number;
  skill: Skill;
}

export function SkillOrbit({ skills, onSelectSkill }: SkillOrbitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodePositionsRef = useRef<NodePosition[]>([]);
  const { resolvedMode } = useThemeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    let isVisible = true;
    let isRunning = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Rings definition
    const rings = [
      { name: 'Frontend', radiusRatio: 0.3, speed: 0.008, color: '#3b82f6' },
      { name: 'DevOps & Tools', radiusRatio: 0.52, speed: -0.005, color: '#06b6d4' },
      { name: 'Backend & AI', radiusRatio: 0.74, speed: 0.003, color: '#8b5cf6' },
    ];

    // Distribute skills across rings
    const ringSkills = rings.map((ring, rIdx) => {
      let filtered: Skill[] = [];
      if (rIdx === 0) {
        filtered = skills.filter(
          (s) =>
            s.category === 'framework' ||
            s.name.includes('React') ||
            s.name.includes('Script') ||
            s.name.includes('Tailwind')
        );
      } else if (rIdx === 1) {
        filtered = skills.filter(
          (s) =>
            s.name.includes('Docker') ||
            s.name.includes('Git') ||
            s.name.includes('Linux') ||
            s.name.includes('Capacitor')
        );
      } else {
        filtered = skills.filter(
          (s) =>
            s.category === 'concept' ||
            s.name.includes('Python') ||
            s.name.includes('Supabase') ||
            s.name.includes('GenAI')
        );
      }
      if (filtered.length === 0) filtered = [skills[rIdx % skills.length]!];
      return filtered;
    });

    let currentWidth = 0;
    let currentHeight = 0;

    const resize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      currentWidth = container.clientWidth;
      currentHeight = Math.min(container.clientWidth * 0.75, 520);
      canvas.width = currentWidth * dpr;
      canvas.height = currentHeight * dpr;
      canvas.style.width = `${currentWidth}px`;
      canvas.style.height = `${currentHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const startLoop = () => {
      if (!isRunning && isVisible && !prefersReducedMotion) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (isRunning) {
        cancelAnimationFrame(animId);
        isRunning = false;
      }
    };

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

    const render = () => {
      if (!ctx || !isVisible) {
        isRunning = false;
        return;
      }
      ctx.clearRect(0, 0, currentWidth, currentHeight);

      const centerX = currentWidth / 2;
      const centerY = currentHeight / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.95;
      const isDark = resolvedMode === 'dark';

      if (!prefersReducedMotion) {
        angle += 0.005;
      }

      const currentNodes: NodePosition[] = [];

      // Draw Orbit Rings
      rings.forEach((ring, rIdx) => {
        const r = maxRadius * ring.radiusRatio;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ring label
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)';
        ctx.fillText(ring.name, centerX + 8, centerY - r + 12);

        // Place skills along this orbit
        const items = ringSkills[rIdx] || [];
        const count = items.length;

        items.forEach((skill, sIdx) => {
          const itemAngle = angle * (ring.speed / 0.005) + (sIdx / count) * Math.PI * 2;
          const nodeX = centerX + r * Math.cos(itemAngle);
          const nodeY = centerY + r * Math.sin(itemAngle);

          currentNodes.push({
            x: nodeX,
            y: nodeY,
            radius: 18,
            skill,
          });

          // Node Circle
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
          ctx.fillStyle = ring.color;
          ctx.fill();

          // Outer halo
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, 12, 0, Math.PI * 2);
          ctx.fillStyle = `${ring.color}22`;
          ctx.fill();

          // Label text
          ctx.font = '12px Inter, sans-serif';
          ctx.fillStyle = isDark ? '#f8fafc' : '#1e293b';
          ctx.textAlign = 'center';
          ctx.fillText(skill.name, nodeX, nodeY + 22);
        });
      });

      nodePositionsRef.current = currentNodes;

      // Central core node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#3b82f6';
      ctx.textAlign = 'center';
      ctx.fillText('CORE', centerX, centerY + 3);

      if (!prefersReducedMotion && isVisible) {
        animId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    startLoop();

    return () => {
      stopLoop();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (containerEl) {
        containerEl.removeEventListener('contentvisibilityautostatechange', handleVisibilityState);
      }
      observer.disconnect();
    };
  }, [skills, resolvedMode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clicked = nodePositionsRef.current.find((node) => {
      const dx = node.x - clickX;
      const dy = node.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    if (clicked) {
      onSelectSkill(clicked.skill);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 backdrop-blur-xl"
    >
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
        Orbital System Radar
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full cursor-pointer"
        aria-label="Interactive orbital radar showing technologies"
      />
    </div>
  );
}

export default SkillOrbit;
