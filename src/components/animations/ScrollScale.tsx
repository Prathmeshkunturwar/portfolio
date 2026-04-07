"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollScaleProps {
  children: React.ReactNode;
  className?: string;
  startScale?: number;
  endScale?: number;
  startOpacity?: number;
  endOpacity?: number;
  pin?: boolean;
  pinSpacing?: boolean;
  scrubSpeed?: number;
  start?: string;
  end?: string;
}

export default function ScrollScale({
  children,
  className = "",
  startScale = 1,
  endScale = 1,
  startOpacity = 1,
  endOpacity = 1,
  pin = false,
  pinSpacing = true,
  scrubSpeed = 1,
  start = "top top",
  end = "bottom top",
}: ScrollScaleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { scale: startScale, opacity: startOpacity },
      {
        scale: endScale,
        opacity: endOpacity,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub: scrubSpeed,
          pin,
          pinSpacing,
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div ref={contentRef} style={{ willChange: "transform, opacity" }}>
        {children}
      </div>
    </div>
  );
}
