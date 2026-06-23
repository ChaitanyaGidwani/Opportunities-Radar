// ── CodeChef adapter — competition ──
// GET https://www.codechef.com/api/list/contests/all (present_ + future_contests)

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";

const META = {
  id: "codechef",
  label: "CodeChef",
  category: "competition" as const,
  homepage: "https://www.codechef.com",
  tier: "green" as const,
};

interface CCContest {
  contest_code: string;
  contest_name: string;
  contest_start_date?: string;
  contest_end_date?: string;
  contest_start_date_iso?: string;
  contest_end_date_iso?: string;
}

export const codechefAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const res = await fetch("https://www.codechef.com/api/list/contests/all", {
      headers: {
        "User-Agent": "Argus/1.0 (student-opportunity-aggregator)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`CodeChef API ${res.status}`);
    const data = await res.json();

    const contests: CCContest[] = [
      ...(data.present_contests ?? []),
      ...(data.future_contests ?? []),
    ];

    return contests.map(toOpportunity);
  },
};

function toOpportunity(c: CCContest): Opportunity {
  return {
    id: `codechef:${c.contest_code}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: `https://www.codechef.com/${c.contest_code}`,
    category: "competition",
    title: c.contest_name,
    organization: "CodeChef",
    logoUrl: "https://icons.duckduckgo.com/ip3/codechef.com.ico",
    location: "Online",
    isRemote: true,
    tags: ["competitive-programming", "problem-solving"],
    deadline: parseDate(c.contest_end_date_iso ?? c.contest_end_date),
    startDate: parseDate(c.contest_start_date_iso ?? c.contest_start_date),
    lastVerified: new Date().toISOString(),
  };
}
