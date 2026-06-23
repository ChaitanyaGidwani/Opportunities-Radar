// ── Arbeitnow adapter — internship ──
// GET https://www.arbeitnow.com/api/job-board-api

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "arbeitnow",
  label: "Arbeitnow",
  category: "internship" as const,
  homepage: "https://www.arbeitnow.com",
  tier: "amber" as const,
};

interface ArbeitnowJob {
  slug: string;
  title: string;
  company_name: string;
  url: string;
  location: string;
  remote: boolean;
  tags: string[];
  created_at?: number;
  description?: string;
}

const INTERN_REGEX = /\b(intern|junior|entry|trainee|graduate|fresher|apprentice)\b/i;

export const arbeitnowAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      headers: { "User-Agent": "Argus/1.0 (student-opportunity-aggregator)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Arbeitnow API ${res.status}`);
    const data = await res.json();
    const jobs: ArbeitnowJob[] = data.data ?? [];

    return jobs
      .filter(
        (j) =>
          INTERN_REGEX.test(j.title) ||
          j.tags.some((t) => INTERN_REGEX.test(t))
      )
      .slice(0, 30) // Limit
      .map(toOpportunity);
  },
};

function toOpportunity(j: ArbeitnowJob): Opportunity {
  return {
    id: `arbeitnow:${j.slug}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: j.url,
    category: "internship",
    title: j.title,
    organization: j.company_name,
    location: j.location,
    isRemote: j.remote,
    tags: normalizeTags(j.tags),
    postedAt: parseDate(j.created_at),
    lastVerified: new Date().toISOString(),
  };
}
