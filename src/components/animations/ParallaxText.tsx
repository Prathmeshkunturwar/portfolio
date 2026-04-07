"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ParallaxTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // negative = moves up faster, positive = moves down slower
}

export default function ParallaxText({ children, className = "", speed = -50 }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: speed,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
