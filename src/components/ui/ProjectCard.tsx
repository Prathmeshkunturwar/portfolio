"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -6, y: x * 6 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const isOdd = index % 2 !== 0;

  return (
    <div className="w-full">
      <div
        className={`flex flex-col lg:flex-row ${isOdd ? "lg:flex-row-reverse" : ""} gap-8 lg:gap-0`}
      >
        {/* Image side */}
        <div className="lg:w-1/2">
          <div
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden"
            style={{
              perspective: "800px",
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    project.gradient ||
                    "linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)",
                }}
              />
            )}
            {/* Subtle dark overlay gradient at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Content side */}
        <div className="lg:w-1/2 px-4 lg:px-12 flex flex-col justify-center">
          {project.company && (
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#64748B]">
              {project.company}
            </span>
          )}

          <h3 className="text-3xl lg:text-5xl font-bold text-[#F1F5F9] mt-4 leading-tight">
            {project.title}
          </h3>

          <p className="text-lg text-[#94A3B8] mt-2">{project.tagline}</p>

          {project.metric && (
            <div className="mt-8">
              <p className="text-2xl font-mono font-bold text-[#22D3EE]">
                {project.metric}
              </p>
              {project.metricDetail && (
                <p className="text-sm text-[#64748B] mt-1">
                  {project.metricDetail}
                </p>
              )}
            </div>
          )}

          <p className="text-base text-[#94A3B8] mt-6 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs font-mono text-[#64748B] border border-white/[0.06] rounded-full px-3 py-1 transition-colors hover:text-[#F1F5F9] hover:border-white/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
