// ── Adzuna adapter — internship (env-gated) ──
// Only active when ADZUNA_APP_ID and ADZUNA_APP_KEY are set

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "adzuna",
  label: "Adzuna",
  category: "internship" as const,
  homepage: "https://www.adzuna.com",
  tier: "amber" as const,
};

interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  redirect_url: string;
  location: { display_name: string; area: string[] };
  created: string;
  salary_min?: number;
  salary_max?: number;
  category?: { label: string };
  description?: string;
}

export const adzunaAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) return [];

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=intern&results_per_page=25`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Argus/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Adzuna API ${res.status}`);
    const data = await res.json();

    return (data.results ?? []).map(toOpportunity);
  },
};

function toOpportunity(j: AdzunaJob): Opportunity {
  return {
    id: `adzuna:${j.id}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: j.redirect_url,
    category: "internship",
    title: j.title,
    organization: j.company.display_name,
    location: j.location.display_name,
    tags: normalizeTags(j.category ? [j.category.label] : []),
    postedAt: parseDate(j.created),
    stipendMin: j.salary_min,
    stipendMax: j.salary_max,
    stipendPeriod: "year",
    currency: "INR",
    lastVerified: new Date().toISOString(),
  };
}
