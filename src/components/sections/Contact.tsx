"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Heading scales up as you scroll to it
    gsap.fromTo(
      headingRef.current,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    );

    // Content fades in slightly later
    gsap.fromTo(
      contentRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "top 10%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 lg:py-48 bg-black">
      <div className="mx-auto max-w-[1400px] px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555] mb-12">
          06 — Contact
        </p>

        {/* Big heading - scales up */}
        <div ref={headingRef} className="opacity-0" style={{ transformOrigin: "left center" }}>
          <h2 className="font-[family-name:var(--font-instrument-serif)] italic text-4xl lg:text-7xl tracking-tight">
            <span className="text-[#E8E8E8]">Let&apos;s build something</span>
            <br />
            <span className="text-[#E8E8E8]">
              together.
            </span>
          </h2>
        </div>

        {/* Content - fades in */}
        <div ref={contentRef} className="opacity-0">
          <p className="text-xl text-[#888888] max-w-xl mt-8">
            I&apos;m always open to new opportunities and interesting projects.
          </p>

          {/* Links */}
          <div className="mt-16 flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#555555]">Email</p>
              <a
                href="mailto:kunturwarprathmesh@gmail.com"
                className="link-underline text-lg text-[#E8E8E8] hover:text-[#888888] transition-colors duration-300 mt-1 block"
              >
                kunturwarprathmesh@gmail.com
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#555555]">LinkedIn</p>
              <a
                href="https://linkedin.com/in/prathmeshkunturwar"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-lg text-[#E8E8E8] hover:text-[#888888] transition-colors duration-300 mt-1 block"
              >
                linkedin.com/in/prathmeshkunturwar
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#555555]">GitHub</p>
              <a
                href="https://github.com/prathmeshKunturwar"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-lg text-[#E8E8E8] hover:text-[#888888] transition-colors duration-300 mt-1 block"
              >
                github.com/prathmeshKunturwar
              </a>
            </div>
          </div>

          <p className="text-sm text-[#555555] mt-12">English · Hindi · Marathi</p>
        </div>
      </div>
    </section>
  );
}
