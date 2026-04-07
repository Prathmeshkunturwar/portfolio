"use client";

import { useEffect, useRef } from "react";

export default function SpringMouseProvider() {
  const currentRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const stiffness = 0.04;
    const damping = 0.88;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const animate = () => {
      const c = currentRef.current;
      const t = targetRef.current;

      const ax = (t.x - c.x) * stiffness;
      const ay = (t.y - c.y) * stiffness;
      c.vx = (c.vx + ax) * damping;
      c.vy = (c.vy + ay) * damping;
      c.x += c.vx;
      c.y += c.vy;

      // Set CSS custom properties on document for any element to use
      const nx = (c.x / window.innerWidth) * 2 - 1;
      const ny = (c.y / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty("--mouse-x", `${c.x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${c.y}px`);
      document.documentElement.style.setProperty("--mouse-nx", `${nx}`);
      document.documentElement.style.setProperty("--mouse-ny", `${ny}`);

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return null;
}
