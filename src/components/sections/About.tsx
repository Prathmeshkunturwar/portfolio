"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import CountUp from "@/components/animations/CountUp";

const stats = [
  { end: 2500, suffix: "+", label: "Hours Saved" },
  { end: 5, suffix: "", label: "Production Systems" },
  { end: 82, suffix: "%", label: "Faster" },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Heading
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: headingRef.current, start: "top 85%", end: "top 50%", scrub: 1 } }
    );

    // Image with clip-path reveal
    gsap.fromTo(imageRef.current,
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)", scrollTrigger: { trigger: imageRef.current, start: "top 80%", end: "top 40%", scrub: 1 } }
    );

    // Text
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: textRef.current, start: "top 75%", end: "top 40%", scrub: 1 } }
    );

    // Stats
    gsap.fromTo(statsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: statsRef.current, start: "top 75%", end: "top 45%", scrub: 1 } }
    );
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-40 lg:py-56 bg-black">
      <div className="mx-auto max-w-[1400px] px-8">
        {/* Big serif heading */}
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-instrument-serif)] italic text-4xl lg:text-7xl text-[#E8E8E8] leading-[1.1] max-w-4xl opacity-0"
        >
          Building AI systems that transform how businesses operate
        </h2>

        {/* Content grid */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image */}
          <div ref={imageRef} className="relative aspect-[4/3] rounded-lg overflow-hidden" style={{ clipPath: "inset(100% 0 0 0)" }}>
            <Image
              src="/assets/about-illustration.webp"
              alt="About"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text + Stats */}
          <div className="flex flex-col justify-center">
            <div ref={textRef} className="opacity-0">
              <p className="text-lg text-[#888888] leading-relaxed">
                At Call Center Doctors, I lead development of production systems that
                transformed operations — an AI quality control bot eliminating 100% of
                manual QC, a dashboard managing 16.9M+ records, and a payroll system
                cutting processing from 30 hours to under one.
              </p>
              <p className="text-lg text-[#888888] leading-relaxed mt-6">
                I care about writing clean, production-grade code — the kind that
                handles edge cases at 2 AM without waking anyone up.
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="opacity-0 flex gap-16 mt-16">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl lg:text-5xl font-mono font-light text-[#E8E8E8]">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555] mt-2 font-mono">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
