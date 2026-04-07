"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({
  text,
  className,
  delay = 0,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const innerSpans = containerRef.current.querySelectorAll(
        ".text-reveal-inner"
      );

      gsap.timeline({ delay }).from(innerSpans, {
        yPercent: 100,
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.06,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: "0.3em" }}
        >
          <span className="text-reveal-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}
