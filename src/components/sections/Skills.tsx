"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const SKILLS = [
  "LangChain", "LangGraph", "OpenAI", "Gemini", "DeepSeek", "Whisper",
  "RAG", "Vector Search", "PyTorch", "TensorFlow", "Python", "TypeScript",
  "FastAPI", "Flask", "React", "PostgreSQL", "Docker", "AWS", "n8n"
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: headingRef.current, start: "top 85%", end: "top 55%", scrub: 1 } }
    );
    gsap.fromTo(listRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: listRef.current, start: "top 80%", end: "top 50%", scrub: 1 } }
    );
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-40 lg:py-56 bg-black">
      <div className="mx-auto max-w-[1400px] px-8">
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-instrument-serif)] italic text-4xl lg:text-7xl text-[#E8E8E8] leading-[1.1] opacity-0"
        >
          Tools & Technologies
        </h2>

        <div ref={listRef} className="opacity-0 mt-20">
          <div className="flex flex-wrap gap-x-3 gap-y-3">
            {SKILLS.map((skill, i) => (
              <span key={skill} className="inline-flex items-center">
                <span className="text-lg lg:text-2xl text-[#888888] hover:text-[#E8E8E8] transition-colors duration-500 cursor-default">
                  {skill}
                </span>
                {i < SKILLS.length - 1 && (
                  <span className="text-[#1A1A1A] ml-3 text-lg lg:text-2xl">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
