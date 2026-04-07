# Prathmesh Kunturwar -- AI Engineer Portfolio

Production-grade personal portfolio built with Next.js 16, Tailwind CSS v4, GSAP ScrollTrigger, Framer Motion, and Lenis smooth scroll.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **Animations:** GSAP + ScrollTrigger (scroll-driven) + Framer Motion (component-level)
- **Smooth Scroll:** Lenis
- **Images:** AI-generated via Gemini, served as WebP
- **Deployment:** Vercel-ready

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout: fonts, Lenis, metadata
    page.tsx            # Single page: all sections
    globals.css         # Tailwind + CSS custom properties
  components/
    animations/         # Reveal, TextReveal, CountUp
    sections/           # Hero, About, Skills, Projects, Experience, Contact
    ui/                 # Navbar, Footer, ProjectCard, StatCard
  lib/
    gsap.ts             # GSAP + ScrollTrigger registration
    lenis.tsx           # Lenis smooth scroll provider
    hooks/              # useReducedMotion
  data/
    projects.ts         # Project data
    skills.ts           # Skill clusters
    experience.ts       # Work experience entries
public/
  assets/               # AI-generated images (WebP)
  resume.pdf            # Downloadable resume
```

## Visual Assets

Images were generated using Google Gemini. To regenerate:

```bash
cd .. && python generate_assets.py
```

## Contact Form

Update the form action in `src/components/sections/Contact.tsx` with your Formspree endpoint.

## Deployment

```bash
npx vercel
```

Or connect the GitHub repo to Vercel for automatic deployments.
