"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "link" | "view";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const spotPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='view']")) {
        setState("view");
      } else if (target.closest("a, button, [role='button'], input, textarea, select")) {
        setState("link");
      } else {
        setState("default");
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    // Lerp animation loop
    const animate = () => {
      const dot = dotRef.current;
      const spotlight = spotlightRef.current;
      if (!dot || !spotlight) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Dot follows faster
      dotPos.current.x += (posRef.current.x - dotPos.current.x) * 0.15;
      dotPos.current.y += (posRef.current.y - dotPos.current.y) * 0.15;

      // Spotlight follows slower (more floaty)
      spotPos.current.x += (posRef.current.x - spotPos.current.x) * 0.08;
      spotPos.current.y += (posRef.current.y - spotPos.current.y) * 0.08;

      dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      spotlight.style.transform = `translate3d(${spotPos.current.x}px, ${spotPos.current.y}px, 0) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [mounted, visible]);

  if (!mounted) return null;

  const dotSize = state === "view" ? 60 : state === "link" ? 24 : 8;

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: state === "view" ? "transparent" : state === "link" ? "transparent" : "#E8E8E8",
          border: state === "link" ? "1.5px solid #E8E8E8" : state === "view" ? "1.5px solid #E8E8E8" : "none",
          mixBlendMode: state === "default" ? "difference" : "normal",
          transition: "width 0.3s ease, height 0.3s ease, background 0.3s ease, border 0.3s ease",
          opacity: visible ? 1 : 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {state === "view" && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8E8E8]">
            View
          </span>
        )}
      </div>

      {/* Spotlight glow */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </>
  );
}
