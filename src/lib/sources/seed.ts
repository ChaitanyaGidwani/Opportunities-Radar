// ── Seed adapter — curated fallbacks so the feed is never empty ──

import type { Opportunity, SourceAdapter } from "../types";

const META = {
  id: "seed",
  label: "Curated",
  category: "mixed" as const,
  homepage: "https://argus.app",
  tier: "seed" as const,
};

const SEED_DATA: Opportunity[] = [
  {
    id: "seed:gsoc-2026",
    source: "seed", sourceLabel: "Google", sourceUrl: "https://summerofcode.withgoogle.com",
    category: "internship", title: "Google Summer of Code 2026", organization: "Google",
    tags: ["open-source", "python", "javascript", "cpp"], location: "Remote", isRemote: true,
    deadline: "2026-04-08T18:00:00Z", startDate: "2026-05-27T00:00:00Z",
    stipendMin: 1500, stipendMax: 6600, stipendPeriod: "one-time", currency: "USD",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:gsoc-2027",
    source: "seed", sourceLabel: "Google", sourceUrl: "https://summerofcode.withgoogle.com",
    category: "internship", title: "Google Summer of Code 2027 (Upcoming)", organization: "Google",
    tags: ["open-source", "python", "javascript", "cpp"], location: "Remote", isRemote: true,
    deadline: "2027-04-08T18:00:00Z",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:razorpay-ftc",
    source: "seed", sourceLabel: "Razorpay", sourceUrl: "https://razorpay.com/jobs/",
    category: "internship", title: "Razorpay FTC (Future Tech Crew) Internship", organization: "Razorpay",
    tags: ["fintech", "javascript", "react", "nodejs"], location: "Bangalore, India",
    deadline: "2026-08-31T23:59:00Z",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:zerodha-internship",
    source: "seed", sourceLabel: "Zerodha", sourceUrl: "https://zerodha.com/careers",
    category: "internship", title: "Zerodha Technology Internship", organization: "Zerodha",
    tags: ["fintech", "go", "python", "react"], location: "Bangalore, India",
    deadline: "2026-09-30T23:59:00Z",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:sih-2026",
    source: "seed", sourceLabel: "MoE India", sourceUrl: "https://www.sih.gov.in",
    category: "hackathon", title: "Smart India Hackathon 2026", organization: "Ministry of Education",
    tags: ["problem-solving", "iot", "machine-learning"], location: "India",
    deadline: "2026-09-15T23:59:00Z", popularity: 50000,
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:flipkart-grid",
    source: "seed", sourceLabel: "Flipkart", sourceUrl: "https://unstop.com/hackathons/flipkart-grid",
    category: "hackathon", title: "Flipkart GRiD 7.0", organization: "Flipkart",
    tags: ["machine-learning", "data-analysis", "e-commerce"], location: "India",
    deadline: "2026-07-31T23:59:00Z", prizeAmount: 500000, currency: "INR",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:hackerearth-hiring",
    source: "seed", sourceLabel: "HackerEarth", sourceUrl: "https://www.hackerearth.com/challenges/",
    category: "competition", title: "HackerEarth Hiring Challenges", organization: "HackerEarth",
    tags: ["competitive-programming", "problem-solving", "python"], location: "Online", isRemote: true,
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:microsoft-imagine-cup",
    source: "seed", sourceLabel: "Microsoft", sourceUrl: "https://imaginecup.microsoft.com",
    category: "hackathon", title: "Microsoft Imagine Cup 2026", organization: "Microsoft",
    tags: ["azure", "artificial-intelligence", "machine-learning"], location: "Remote", isRemote: true,
    deadline: "2026-03-31T23:59:00Z", prizeAmount: 100000, currency: "USD",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:mlh-fellowship",
    source: "seed", sourceLabel: "MLH", sourceUrl: "https://fellowship.mlh.io",
    category: "internship", title: "MLH Fellowship (Open Source)", organization: "Major League Hacking",
    tags: ["open-source", "git", "python", "javascript"], location: "Remote", isRemote: true,
    deadline: "2026-05-31T23:59:00Z", stipendMin: 5000, stipendPeriod: "one-time", currency: "USD",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:leetcode-weekly",
    source: "seed", sourceLabel: "LeetCode", sourceUrl: "https://leetcode.com/contest/",
    category: "competition", title: "LeetCode Weekly Contest", organization: "LeetCode",
    tags: ["competitive-programming", "problem-solving"], location: "Online", isRemote: true,
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:uber-hackathon",
    source: "seed", sourceLabel: "Uber", sourceUrl: "https://www.uber.com/in/en/careers/",
    category: "hackathon", title: "Uber HackTag 2026", organization: "Uber",
    tags: ["machine-learning", "python", "java"], location: "India",
    deadline: "2026-08-15T23:59:00Z", prizeAmount: 300000, currency: "INR",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:amazon-ml-challenge",
    source: "seed", sourceLabel: "Amazon", sourceUrl: "https://www.hackerearth.com/challenges/competitive/amazon-ml-challenge/",
    category: "competition", title: "Amazon ML Challenge", organization: "Amazon",
    tags: ["machine-learning", "data-analysis", "python"], location: "Online", isRemote: true,
    deadline: "2026-09-30T23:59:00Z", prizeAmount: 500000, currency: "INR",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:goldman-sachs-intern",
    source: "seed", sourceLabel: "Goldman Sachs", sourceUrl: "https://www.goldmansachs.com/careers/students/programs/",
    category: "internship", title: "Goldman Sachs Summer Analyst (Engineering)", organization: "Goldman Sachs",
    tags: ["fintech", "java", "python"], location: "Bangalore, India",
    deadline: "2026-07-15T23:59:00Z",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:de-shaw-intern",
    source: "seed", sourceLabel: "D.E. Shaw", sourceUrl: "https://www.deshawindia.com/careers",
    category: "internship", title: "D.E. Shaw Technology Internship", organization: "D.E. Shaw India",
    tags: ["fintech", "cpp", "python", "machine-learning"], location: "Hyderabad, India",
    deadline: "2026-08-31T23:59:00Z",
    lastVerified: new Date().toISOString(),
  },
  {
    id: "seed:google-step-intern",
    source: "seed", sourceLabel: "Google", sourceUrl: "https://careers.google.com",
    category: "internship", title: "Google STEP Internship", organization: "Google",
    tags: ["python", "java", "cpp", "machine-learning"], location: "Bangalore / Hyderabad, India",
    deadline: "2026-09-15T23:59:00Z",
    lastVerified: new Date().toISOString(),
  },
];

export const seedAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    return SEED_DATA.map((s) => ({
      ...s,
      lastVerified: new Date().toISOString(),
    }));
  },
};
