"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import { projects } from "@/data/projects";

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current) return;

    // Calculate total scroll distance
    const totalWidth = trackRef.current.scrollWidth - window.innerWidth;

    // Pin the section and scrub the horizontal track
    gsap.to(trackRef.current, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        pinSpacing: true,
        invalidateOnRefresh: true,
      },
    });

    // Progress bar synced to the same scroll range
    gsap.to("#project-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: 1,
      },
    });

    // Fade in the header at start
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative overflow-hidden">
      {/* Fixed header that stays visible during horizontal scroll */}
      <div ref={headerRef} className="absolute top-8 left-8 z-20 opacity-0">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555]">
          04 — Projects
        </p>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="flex h-screen items-center">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="flex-shrink-0 w-screen h-screen flex items-center px-8 lg:px-16"
          >
            <div className="mx-auto max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Image side */}
              <div
                className={`relative aspect-[16/10] rounded-2xl overflow-hidden project-spotlight ${i % 2 !== 0 ? "lg:order-2" : ""}`}
                data-cursor="view"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Project number overlay */}
                <div className="absolute bottom-4 left-4 font-mono text-7xl font-bold text-white/5">
                  0{i + 1}
                </div>
              </div>

              {/* Content side */}
              <div className={`${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#555555]">
                  {project.company}
                </p>
                <h3 className="font-[family-name:var(--font-instrument-serif)] italic text-3xl lg:text-5xl text-[#E8E8E8] mt-4 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-lg text-[#888888] mt-2">{project.tagline}</p>

                {/* Metric */}
                <div className="mt-8">
                  <p className="text-2xl lg:text-3xl font-mono font-light text-[#E8E8E8]">
                    {project.metric}
                  </p>
                  <p className="text-sm text-[#555555] mt-1">{project.metricDetail}</p>
                </div>

                {/* Description */}
                <p className="text-base text-[#888888] mt-6 leading-relaxed max-w-lg">
                  {project.description}
                </p>

                {/* Tech */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono text-[#555555] border border-[#1A1A1A] rounded-full px-3 py-1 hover:text-[#E8E8E8] hover:border-[#333] transition-colors pill-bounce"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator at bottom */}
      <div className="absolute bottom-8 left-8 right-8 z-20">
        <div className="h-px bg-[#1A1A1A]">
          <div
            className="h-px bg-gradient-to-r from-transparent via-[#333] to-transparent origin-left"
            style={{ width: "100%", transform: "scaleX(0)" }}
            id="project-progress"
          />
        </div>
      </div>
    </section>
  );
}
