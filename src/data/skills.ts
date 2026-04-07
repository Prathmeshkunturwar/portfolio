export interface SkillCluster {
  name: string;
  icon: string;
  skills: string[];
  color: string;
}

export const skillClusters: SkillCluster[] = [
  {
    name: "AI & LLM",
    icon: "\u{1F9E0}",
    skills: [
      "LangChain",
      "LangGraph",
      "OpenAI APIs",
      "Google Gemini",
      "DeepSeek",
      "Whisper",
      "RAG",
      "Vector Search",
      "Prompt Engineering",
    ],
    color: "#6366F1",
  },
  {
    name: "ML Frameworks",
    icon: "\u26A1",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "RoBERTa",
      "OpenCV",
      "MediaPipe",
    ],
    color: "#22D3EE",
  },
  {
    name: "Programming",
    icon: "\u{1F4BB}",
    skills: ["Python", "JavaScript", "TypeScript", "SQL"],
    color: "#34D399",
  },
  {
    name: "Infrastructure",
    icon: "\u{1F3D7}\uFE0F",
    skills: [
      "AWS (EC2, S3)",
      "Docker",
      "Nginx",
      "n8n",
      "FastAPI",
      "Flask",
      "React.js",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "Vector DBs",
    ],
    color: "#F59E0B",
  },
  {
    name: "Integrations",
    icon: "\u{1F517}",
    skills: [
      "BambooHR",
      "ViciDial",
      "GoHighLevel CRM",
      "Google Sheets API",
      "Slack API",
      "Firebase",
    ],
    color: "#818CF8",
  },
];
