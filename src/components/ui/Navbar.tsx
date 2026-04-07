"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");
  const lastScrollY = useRef(0);

  // ---- scroll direction hide/show ----
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---- active link via IntersectionObserver ----
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }

          let best = "";
          let bestRatio = 0;
          visibleSections.forEach((ratio, sectionId) => {
            if (ratio > bestRatio) {
              best = sectionId;
              bestRatio = ratio;
            }
          });
          setActive(best);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ---- smooth scroll helper ----
  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // ---- lock body scroll when mobile menu open ----
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden && !mobileOpen ? -80 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#1A1A1A]"
      >
        <nav className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 h-16">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-[family-name:var(--font-instrument-serif)] italic text-xl text-[#E8E8E8] select-none"
          >
            PK
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = active === href.slice(1);
              return (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className={`text-sm font-mono transition-colors duration-200 ${
                      isActive
                        ? "text-[#E8E8E8]"
                        : "text-[#555555] hover:text-[#E8E8E8]"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Resume + Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center text-sm font-mono text-[#E8E8E8] border border-[#1A1A1A] rounded-full px-4 py-1.5 hover:bg-[#0A0A0A] transition"
            >
              Resume
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="relative z-50 flex md:hidden h-10 w-10 items-center justify-center"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-[5px]">
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: 45, y: 7 }
                      : { rotate: 0, y: 0 }
                  }
                  className="block h-[2px] w-6 bg-[#E8E8E8] origin-center"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-[2px] w-6 bg-[#E8E8E8]"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -7 }
                      : { rotate: 0, y: 0 }
                  }
                  className="block h-[2px] w-6 bg-[#E8E8E8] origin-center"
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile slide-in panel from right */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-black border-l border-[#1A1A1A] flex flex-col items-start justify-center gap-6 px-8 md:hidden"
            >
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = active === href.slice(1);
                return (
                  <motion.button
                    key={href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    onClick={() => scrollTo(href)}
                    className={`text-xl font-mono transition-colors ${
                      isActive
                        ? "text-[#E8E8E8]"
                        : "text-[#555555]"
                    }`}
                  >
                    {label}
                  </motion.button>
                );
              })}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.3 }}
                className="mt-4 text-sm font-mono text-[#E8E8E8] border border-[#1A1A1A] rounded-full px-6 py-2 hover:bg-[#0A0A0A] transition"
              >
                Resume
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
