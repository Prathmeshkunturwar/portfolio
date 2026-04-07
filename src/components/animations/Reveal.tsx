"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  scrub?: boolean; // NEW: tie to scroll position
  direction?: "up" | "left" | "right";
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  scrub = true, // DEFAULT to scrub now
  direction = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const x = direction === "left" ? -60 : direction === "right" ? 60 : 0;
    const y = direction === "up" ? 60 : 0;

    gsap.fromTo(
      ref.current,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: scrub
          ? {
              trigger: ref.current,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            }
          : {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
      }
    );
  }, []);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
