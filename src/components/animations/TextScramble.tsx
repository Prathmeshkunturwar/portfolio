"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleClassName?: string; // class during scramble phase
  delay?: number; // ms before starting
  duration?: number; // total scramble duration in ms
}

export default function TextScramble({
  text,
  className = "",
  scrambleClassName,
  delay = 0,
  duration = 1500,
}: TextScrambleProps) {
  const [display, setDisplay] = useState("");
  const [resolved, setResolved] = useState(false);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      setResolved(true);
      return;
    }

    // Initialize with empty
    setDisplay(text.replace(/[^ ]/g, " "));

    const timeout = setTimeout(() => {
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const chars = text.split("");
        let allResolved = true;

        const newDisplay = chars
          .map((char, i) => {
            if (char === " ") return " ";

            // Each char resolves after a staggered time
            const charResolveTime = (i / chars.length) * duration;
            if (elapsed >= charResolveTime) {
              return char;
            }

            allResolved = false;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplay(newDisplay);

        if (allResolved) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setResolved(true);
        }
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay, duration, reducedMotion]);

  // During scramble, use mono font. After resolved, use the provided className
  const activeClass = resolved ? className : (scrambleClassName || `font-mono text-[#64748B] ${className.includes("text-") ? "" : "text-[#F1F5F9]"}`);

  return (
    <span className={activeClass} aria-label={text}>
      {display.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ minWidth: char === " " ? "0.3em" : "0.6em", textAlign: "center" }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
