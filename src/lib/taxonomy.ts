// ── Controlled vocabulary of ~150 skill slugs + synonym map ──
// Both profile skills and opportunity tags normalise into this namespace.
// This is what makes skill-matching a clean set overlap.

/** Canonical skill slugs grouped by domain */
export const SKILL_VOCABULARY: Record<string, string[]> = {
  "programming-languages": [
    "python", "javascript", "typescript", "java", "cpp", "c", "csharp",
    "go", "rust", "ruby", "php", "swift", "kotlin", "dart", "r",
    "scala", "haskell", "lua", "perl", "matlab", "sql",
  ],
  "web-development": [
    "html", "css", "react", "nextjs", "angular", "vue", "svelte",
    "nodejs", "express", "django", "flask", "fastapi", "spring",
    "graphql", "rest-api", "tailwindcss", "sass",
  ],
  "mobile-development": [
    "android", "ios", "react-native", "flutter", "swiftui",
    "jetpack-compose", "xamarin",
  ],
  "data-science": [
    "machine-learning", "deep-learning", "nlp", "computer-vision",
    "data-analysis", "data-engineering", "statistics", "pandas",
    "numpy", "tensorflow", "pytorch", "scikit-learn", "keras",
    "data-visualization", "tableau", "power-bi", "big-data",
    "spark", "hadoop",
  ],
  "ai": [
    "artificial-intelligence", "generative-ai", "llm", "prompt-engineering",
    "rag", "langchain", "reinforcement-learning", "robotics",
  ],
  "cloud-devops": [
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "ci-cd", "devops", "linux", "git", "github-actions", "jenkins",
    "ansible", "monitoring", "nginx",
  ],
  "blockchain": [
    "blockchain", "solidity", "ethereum", "web3", "smart-contracts",
    "defi", "nft", "cryptocurrency",
  ],
  "cybersecurity": [
    "cybersecurity", "penetration-testing", "network-security",
    "cryptography", "soc", "ethical-hacking", "osint", "malware-analysis",
  ],
  "design": [
    "ui-design", "ux-design", "figma", "adobe-xd", "sketch",
    "graphic-design", "prototyping", "user-research",
    "interaction-design", "design-thinking",
  ],
  "business": [
    "product-management", "business-analysis", "marketing",
    "digital-marketing", "seo", "content-writing", "copywriting",
    "sales", "strategy", "consulting", "finance", "accounting",
    "operations", "supply-chain", "hr", "entrepreneurship",
  ],
  "domains": [
    "fintech", "healthtech", "edtech", "agritech", "iot",
    "ar-vr", "gaming", "e-commerce", "social-impact",
    "sustainability", "biotech", "aerospace",
  ],
  "soft-skills": [
    "communication", "leadership", "teamwork", "problem-solving",
    "critical-thinking", "project-management", "agile", "scrum",
  ],
};

/** Flat set of all canonical slugs */
export const ALL_SKILLS: Set<string> = new Set(
  Object.values(SKILL_VOCABULARY).flat()
);

/** Synonym → canonical slug mapping */
export const SYNONYM_MAP: Record<string, string> = {
  // Programming
  "ml": "machine-learning",
  "dl": "deep-learning",
  "ai": "artificial-intelligence",
  "js": "javascript",
  "ts": "typescript",
  "py": "python",
  "c++": "cpp",
  "c#": "csharp",
  "golang": "go",
  "node": "nodejs",
  "node.js": "nodejs",
  "next.js": "nextjs",
  "react.js": "react",
  "vue.js": "vue",
  "angular.js": "angular",
  "express.js": "express",
  // Data
  "data science": "data-analysis",
  "data-science": "data-analysis",
  "natural language processing": "nlp",
  "cv": "computer-vision",
  "tf": "tensorflow",
  "sklearn": "scikit-learn",
  "sk-learn": "scikit-learn",
  // Cloud
  "amazon web services": "aws",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "microsoft azure": "azure",
  "k8s": "kubernetes",
  // Web3
  "web3": "blockchain",
  "crypto": "cryptocurrency",
  "eth": "ethereum",
  "sol": "solidity",
  // Design
  "ui/ux": "ux-design",
  "uiux": "ux-design",
  "ui ux": "ux-design",
  "user experience": "ux-design",
  "user interface": "ui-design",
  // Business
  "pm": "product-management",
  "ba": "business-analysis",
  "seo/sem": "seo",
  // Misc
  "mern": "react",
  "mean": "angular",
  "full stack": "web-development",
  "fullstack": "web-development",
  "full-stack": "web-development",
  "frontend": "web-development",
  "front-end": "web-development",
  "backend": "web-development",
  "back-end": "web-development",
  "competitive programming": "cpp",
  "cp": "cpp",
  "dsa": "problem-solving",
  "data structures": "problem-solving",
  "algorithms": "problem-solving",
  "ci/cd": "ci-cd",
  "gen ai": "generative-ai",
  "genai": "generative-ai",
  "gen-ai": "generative-ai",
  "ar/vr": "ar-vr",
  "augmented reality": "ar-vr",
  "virtual reality": "ar-vr",
  "internet of things": "iot",
};

/** Branch name → affinity skills (weighted 0.5 in ranking) */
export const BRANCH_AFFINITY: Record<string, string[]> = {
  "computer-science": [
    "python", "javascript", "java", "cpp", "react", "nodejs",
    "machine-learning", "data-analysis", "sql", "git",
    "docker", "linux", "web-development",
  ],
  "information-technology": [
    "python", "javascript", "java", "sql", "react", "nodejs",
    "web-development", "networking", "linux", "cybersecurity",
  ],
  "electronics": [
    "cpp", "python", "iot", "embedded", "matlab",
    "robotics", "circuit-design",
  ],
  "electrical": [
    "python", "matlab", "power-systems", "iot", "cpp",
  ],
  "mechanical": [
    "cad", "matlab", "python", "manufacturing", "3d-printing",
  ],
  "civil": [
    "autocad", "revit", "project-management", "sustainability",
  ],
  "chemical": [
    "python", "r", "matlab", "biotech", "data-analysis",
  ],
  "biotechnology": [
    "python", "r", "biotech", "data-analysis", "machine-learning",
  ],
  "mathematics": [
    "python", "r", "statistics", "machine-learning", "data-analysis",
  ],
  "physics": [
    "python", "matlab", "data-analysis", "machine-learning",
  ],
  "commerce": [
    "finance", "accounting", "business-analysis", "excel",
    "data-analysis",
  ],
  "arts": [
    "content-writing", "communication", "graphic-design",
    "digital-marketing",
  ],
  "design": [
    "ui-design", "ux-design", "figma", "graphic-design",
    "prototyping", "design-thinking",
  ],
};

/** Category-specific interest labels */
export const CATEGORY_LABELS: Record<string, string> = {
  internship: "Internships",
  scholarship: "Scholarships",
  competition: "Competitions",
  hackathon: "Hackathons",
};
