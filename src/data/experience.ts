export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  type: "work" | "education";
  degree?: string;
  coursework?: string;
}

export const experience: ExperienceEntry[] = [
  {
    role: "Lead Full-Stack AI Developer",
    company: "Call Center Doctors",
    period: "March 2025 \u2013 Present",
    location: "Texas, United States (Remote)",
    type: "work",
    bullets: [
      "Architected and deployed AI-powered workflow automation systems that reduced manual QC processing from 30 minutes to 3\u20134 minutes per call, eliminating 100% of manual quality control.",
      "Built RAG pipelines and multi-AI consensus voting engines using GPT-4, Gemini, and DeepSeek with Whisper transcription for enterprise call analysis at scale.",
      "Containerized full-stack applications with Docker and Nginx, managing PostgreSQL databases handling 16.9M+ records across 15+ campaigns.",
      "Led cross-functional collaboration with stakeholders to translate business requirements into production-ready AI solutions, delivering measurable ROI within weeks of deployment.",
      "Established model monitoring and evaluation frameworks with automated Slack notifications, PostgreSQL checkpointing, and Google Sheets reporting for continuous performance tracking.",
    ],
  },
  {
    role: "Web Development Intern",
    company: "Swagitup",
    period: "Sep 2024 \u2013 Feb 2025",
    location: "India",
    type: "work",
    bullets: [
      "Developed interactive JavaScript features and integrated Firebase for real-time data management across customer-facing web applications.",
      "Built and customized WooCommerce plugins to extend e-commerce functionality, improving storefront performance and user experience.",
    ],
  },
  {
    role: "B.Tech in Computer Science Engineering",
    company: "MGM JNEC, Sambhajinagar",
    period: "Aug 2021 \u2013 Jun 2025",
    location: "Sambhajinagar, India",
    type: "education",
    degree: "Bachelor of Technology in Computer Science Engineering",
    coursework: "Machine Learning, Data Structures & Algorithms, Database Management Systems, Computer Networks, Natural Language Processing",
    bullets: [],
  },
];
