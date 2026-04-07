"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { experience } from "@/data/experience";

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Scrub reveal for the Experience heading
    const heading = document.getElementById("experience-heading");
    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }

    // Each entry scrubs in at a different scroll position
    entriesRef.current.forEach((entry, i) => {
      if (!entry) return;

      gsap.fromTo(
        entry,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: entry,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative py-32 bg-black">
      <div className="mx-auto max-w-[1400px] px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555] mb-6">
          05 — Experience
        </p>
        <h2 className="font-[family-name:var(--font-instrument-serif)] italic text-4xl lg:text-7xl text-[#E8E8E8] mb-16 opacity-0" id="experience-heading">
          Experience
        </h2>

        <div className="space-y-0">
          {experience.map((entry, index) => (
            <div key={`${entry.company}-${entry.role}`}>
              {index > 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent my-1" />
              )}
              <div
                ref={(el) => { entriesRef.current[index] = el; }}
                className="py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 opacity-0"
              >
                {/* Left column */}
                <div className="lg:col-span-4">
                  <p className="text-lg font-semibold text-[#E8E8E8]">{entry.company}</p>
                  <p className="text-sm font-mono text-[#555555] mt-1">{entry.period}</p>
                  <p className="text-sm text-[#555555]">{entry.location}</p>
                </div>

                {/* Right column */}
                <div className="lg:col-span-8">
                  {entry.type === "work" ? (
                    <>
                      <h3 className="font-[family-name:var(--font-instrument-serif)] italic text-xl lg:text-2xl text-[#E8E8E8]">{entry.role}</h3>
                      {entry.bullets.length > 0 && (
                        <ul className="mt-4 space-y-3">
                          {entry.bullets.map((bullet, bi) => (
                            <li key={bi} className="flex items-start gap-3 text-base text-[#888888] leading-relaxed">
                              <span className="text-[#333333] mt-1 shrink-0">—</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="font-[family-name:var(--font-instrument-serif)] italic text-xl lg:text-2xl text-[#E8E8E8]">
                        {entry.degree || entry.role}
                      </h3>
                      {entry.coursework && (
                        <p className="mt-3 text-sm text-[#888888]">
                          <span className="text-[#E8E8E8] font-medium">Coursework: </span>
                          {entry.coursework}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Also section */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent my-1" />
          <div className="pt-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555] mb-6">Also</p>
            <div className="space-y-4">
              <p className="flex items-center gap-3 text-base text-[#888888]">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B] shrink-0" />
                <span><span className="text-[#E8E8E8] font-medium">AWS Certified Cloud Practitioner</span> — In Progress</span>
              </p>
              <p className="flex items-center gap-3 text-base text-[#888888]">
                <span className="h-2 w-2 rounded-full bg-[#E8E8E8] shrink-0" />
                <span><span className="text-[#E8E8E8] font-medium">TEDx MGMU — Logistics Head</span> · 500+ attendees</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
