"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ParticleFieldProps {
  className?: string;
}

export default function ParticleField({ className = "" }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 15000), 120);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x, y, baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      particlesRef.current = initParticles(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking relative to canvas
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Mobile: autonomous attractor
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    let time = 0;

    if (reducedMotion) {
      // Static render: just draw dots once
      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
        ctx.fill();
      });
      return () => { window.removeEventListener("resize", resize); };
    }

    const interactionRadius = 150;
    const connectionDistance = 120;
    const connectionDistanceMouse = 180;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      time += 0.005;

      // Virtual attractor for mobile
      let mx = mouseRef.current.x;
      let my = mouseRef.current.y;
      if (isTouch) {
        mx = width * 0.5 + Math.sin(time * 0.7) * width * 0.3;
        my = height * 0.5 + Math.cos(time * 0.5) * height * 0.2;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Distance to mouse/attractor
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Push away from cursor
        if (dist < interactionRadius && dist > 0) {
          const force = (interactionRadius - dist) / interactionRadius;
          p.vx -= (dx / dist) * force * 0.8;
          p.vy -= (dy / dist) * force * 0.8;
        }

        // Drift back to base position
        p.vx += (p.baseX - p.x) * 0.01;
        p.vy += (p.baseY - p.y) * 0.01;

        // Damping
        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        const alpha = dist < interactionRadius ? 0.6 + (1 - dist / interactionRadius) * 0.4 : 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + (dist < interactionRadius ? 1 : 0), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          // Use larger connection distance near mouse
          const nearMouse = dist < interactionRadius * 1.5 ||
            Math.sqrt((mx - p2.x) ** 2 + (my - p2.y) ** 2) < interactionRadius * 1.5;
          const maxDist = nearMouse ? connectionDistanceMouse : connectionDistance;

          if (cdist < maxDist) {
            const lineAlpha = nearMouse
              ? (1 - cdist / maxDist) * 0.3
              : (1 - cdist / maxDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = nearMouse ? 0.8 : 0.3;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initParticles, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ willChange: "auto" }}
    />
  );
}
