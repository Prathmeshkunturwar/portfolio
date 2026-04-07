export interface Project {
  id: string;
  title: string;
  tagline: string;
  company: string;
  description: string;
  metric: string;
  metricDetail: string;
  tech: string[];
  image: string;
  gradient: string;
}

export const projects: Project[] = [
  {
    id: "qc-automation-bot",
    title: "QC Automation Bot",
    tagline: "AI-Powered Call Quality Control",
    company: "Call Center Doctors",
    description:
      "Multi-AI Consensus Voting system combining Gemini, GPT-4, and DeepSeek for call quality analysis. Features Whisper transcription, an Action Registry Pattern for extensible evaluation logic, and PostgreSQL checkpointing for fault-tolerant processing.",
    metric: "30 min → 3-4 min",
    metricDetail: "100% manual QC eliminated",
    tech: [
      "Python",
      "FastAPI",
      "GPT-4",
      "Gemini",
      "DeepSeek",
      "Whisper",
      "PostgreSQL",
      "Slack API",
      "GoHighLevel",
    ],
    image: "/assets/project-qc-bot.webp",
    gradient:
      "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0c4a6e 100%)",
  },
  {
    id: "enterprise-data-dashboard",
    title: "Enterprise Data Dashboard",
    tagline: "Lead Management & Dialer Platform",
    company: "Call Center Doctors",
    description:
      "Full-stack lead management and dialer platform built with FastAPI and React/TypeScript. Handles 16.9M+ records across 15+ campaigns with dual-ViciDial integration, real-time sync, and Google Sheets API reporting.",
    metric: "60s → 11s (82% faster)",
    metricDetail: "~1,716 hrs saved/year",
    tech: [
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "ViciDial",
      "Google Sheets API",
      "Slack API",
    ],
    image: "/assets/project-dashboard.webp",
    gradient:
      "linear-gradient(160deg, #0f172a 0%, #172554 50%, #0e7490 100%)",
  },
  {
    id: "payroll-automation",
    title: "Payroll Automation System",
    tagline: "Full-Stack Payroll Pipeline",
    company: "Call Center Doctors",
    description:
      "End-to-end payroll pipeline integrating BambooHR, WebWork, and ViciDial data sources. Built with Flask and React.js on MySQL, serving 100+ employees across 15+ campaigns with Docker/Nginx deployment.",
    metric: "2-3 days → under 1 hour",
    metricDetail: "~871 hours saved annually",
    tech: [
      "Flask",
      "React.js",
      "MySQL",
      "Docker",
      "Nginx",
      "BambooHR",
      "WebWork",
      "ViciDial",
    ],
    image: "/assets/project-payroll.webp",
    gradient:
      "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
  },
  {
    id: "at-risk-client-dossier",
    title: "At-Risk Client Dossier",
    tagline: "Automated Client Health Monitoring",
    company: "Call Center Doctors",
    description:
      "Automated client health monitoring system using Whisper for call transcription, GPT-4 for analysis, and RoBERTa for sentiment scoring. Generates comprehensive PDF/HTML dossiers for proactive retention interventions.",
    metric: "Several hours → under 5 min",
    metricDetail: "Proactive retention interventions",
    tech: [
      "Python",
      "GPT-4",
      "Whisper",
      "RoBERTa",
      "Sentiment Analysis",
      "PDF Generation",
    ],
    image: "/assets/project-dossier.webp",
    gradient:
      "linear-gradient(160deg, #0f172a 0%, #1c1917 40%, #7c2d12 100%)",
  },
];
