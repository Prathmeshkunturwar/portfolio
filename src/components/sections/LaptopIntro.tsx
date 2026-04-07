"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import dynamic from "next/dynamic";

// Dynamic import for Three.js scene (no SSR)
const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

export default function LaptopIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lidAngle, setLidAngle] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [cameraZ, setCameraZ] = useState(5);
  const [phase, setPhase] = useState(0); // 0-4

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Create a scroll-driven progress tracker
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=400%", // Pin for 4x viewport height of scrolling
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress; // 0 to 1

        // Phase 1: Lid opens (0 - 0.25)
        if (p <= 0.25) {
          const lidProgress = p / 0.25; // 0 to 1
          setLidAngle(lidProgress * (Math.PI / 2)); // 0 to 90 degrees
          setRotationY(0);
          setCameraZ(5);
          setPhase(1);
        }
        // Phase 2: Code visible, subtle camera shift (0.25 - 0.5)
        else if (p <= 0.5) {
          setLidAngle(Math.PI / 2);
          setRotationY(0);
          const zoomP = (p - 0.25) / 0.25;
          setCameraZ(5 - zoomP * 0.5); // Subtle zoom 5 -> 4.5
          setPhase(2);
        }
        // Phase 3: 360 rotation (0.5 - 0.75)
        else if (p <= 0.75) {
          const rotP = (p - 0.5) / 0.25;
          setLidAngle(Math.PI / 2);
          setRotationY(rotP * Math.PI * 2); // 0 to 360 degrees
          setCameraZ(4.5);
          setPhase(3);
        }
        // Phase 4: Zoom out + reveal text (0.75 - 1.0)
        else {
          const outP = (p - 0.75) / 0.25;
          setLidAngle(Math.PI / 2);
          setRotationY(Math.PI * 2);
          setCameraZ(4.5 + outP * 2); // Zoom out 4.5 -> 6.5
          setPhase(4);
        }
      },
    });
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-black overflow-hidden">
      {/* 3D Canvas - fills entire viewport */}
      <div className="absolute inset-0 z-0">
        <Scene lidAngle={lidAngle} rotationY={rotationY} cameraZ={cameraZ} />
      </div>

      {/* Phase indicators / text overlays */}

      {/* Phase 1: "Opening..." text */}
      <div
        className={`absolute inset-0 z-10 flex items-end justify-center pb-24 transition-opacity duration-700 ${
          phase === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555]">
          Scroll to explore
        </p>
      </div>

      {/* Phase 2: Code description */}
      <div
        className={`absolute top-8 left-8 z-10 transition-opacity duration-700 ${
          phase === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555]">
          Building production AI systems
        </p>
      </div>

      {/* Phase 3: Rotation label */}
      <div
        className={`absolute bottom-8 right-8 z-10 transition-opacity duration-700 ${
          phase === 3 ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555]">
          Crafted with precision
        </p>
      </div>

      {/* Phase 4: Developer reveal */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-end pb-32 transition-opacity duration-1000 ${
          phase === 4 ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="font-[family-name:var(--font-instrument-serif)] italic text-5xl lg:text-8xl text-[#E8E8E8] text-center leading-[0.9]">
          Prathmesh
          <br />
          Kunturwar
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555] mt-8">
          AI Engineer &middot; Creative Developer
        </p>
      </div>
    </div>
  );
}
