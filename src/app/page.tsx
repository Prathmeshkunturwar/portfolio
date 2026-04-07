"use client";

import dynamic from "next/dynamic";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const LaptopIntro = dynamic(() => import("@/components/sections/LaptopIntro"), { ssr: false });

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <LaptopIntro />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
