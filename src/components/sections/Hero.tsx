"use client";

import { motion } from "framer-motion";
import ParticleField from "@/components/ui/ParticleField";
import TextScramble from "@/components/animations/TextScramble";

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden bg-black">
      {/* Particle background */}
      <ParticleField />

      {/* Content — reacts to mouse via CSS custom properties */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-8">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555] mb-12"
        >
          Creative AI Engineer
        </motion.p>

        {/* Name — SERIF font, reacts to mouse with subtle parallax */}
        <div
          className="will-change-transform"
          style={{
            transform: "translate(calc(var(--mouse-nx, 0) * -8px), calc(var(--mouse-ny, 0) * -5px))",
            transition: "transform 0.1s linear",
          }}
        >
          <h1 className="font-[family-name:var(--font-instrument-serif)] italic leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}>
            <TextScramble
              text="Prathmesh"
              className="block text-[#E8E8E8]"
              scrambleClassName="block font-mono text-[#555555]"
              delay={300}
              duration={1200}
            />
            <TextScramble
              text="Kunturwar"
              className="block text-[#E8E8E8]"
              scrambleClassName="block font-mono text-[#555555]"
              delay={600}
              duration={1400}
            />
          </h1>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-[#888888] max-w-lg mt-12 leading-relaxed"
        >
          A development studio of one, building AI-powered production
          systems that transform how businesses operate.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="mt-16 flex items-center gap-12"
        >
          <a href="#projects" className="link-underline font-mono text-xs uppercase tracking-[0.2em] text-[#555555] hover:text-[#E8E8E8] transition-colors duration-500">
            Selected Work
          </a>
          <a href="#contact" className="link-underline font-mono text-xs uppercase tracking-[0.2em] text-[#555555] hover:text-[#E8E8E8] transition-colors duration-500">
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555555]">
          Scroll to explore
        </p>
      </motion.div>
    </section>
  );
}
