"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountUp({
  end,
  suffix = "",
  duration = 2,
  className,
}: CountUpProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const obj = { value: 0 };

      gsap.to(obj, {
        value: end,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          setDisplay(
            new Intl.NumberFormat("en-US").format(Math.round(obj.value))
          );
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <span ref={containerRef} className={`font-mono ${className ?? ""}`}>
      {display}
      {suffix}
    </span>
  );
}
