// ── Codeforces adapter — competition ──
// GET https://codeforces.com/api/contest.list?gym=false (phase BEFORE)

import type { Opportunity, SourceAdapter } from "../types";

const META = {
  id: "codeforces",
  label: "Codeforces",
  category: "competition" as const,
  homepage: "https://codeforces.com",
  tier: "green" as const,
};

interface CFContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  startTimeSeconds?: number;
  durationSeconds?: number;
}

export const codeforcesAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const res = await fetch("https://codeforces.com/api/contest.list?gym=false", {
      headers: { "User-Agent": "Argus/1.0 (student-opportunity-aggregator)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Codeforces API ${res.status}`);
    const data = await res.json();

    if (data.status !== "OK") throw new Error("Codeforces API error");

    const upcoming = (data.result as CFContest[]).filter(
      (c) => c.phase === "BEFORE"
    );

    return upcoming.map(toOpportunity);
  },
};

function toOpportunity(c: CFContest): Opportunity {
  const startDate = c.startTimeSeconds
    ? new Date(c.startTimeSeconds * 1000).toISOString()
    : undefined;

  return {
    id: `codeforces:${c.id}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: `https://codeforces.com/contest/${c.id}`,
    category: "competition",
    title: c.name,
    organization: "Codeforces",
    logoUrl: "https://icons.duckduckgo.com/ip3/codeforces.com.ico",
    location: "Online",
    isRemote: true,
    tags: ["competitive-programming", "problem-solving", "cpp"],
    // Start time IS the act-by deadline for CP contests
    deadline: startDate,
    startDate,
    lastVerified: new Date().toISOString(),
  };
}
