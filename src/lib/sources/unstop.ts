// ── Unstop adapter — ALL 4 categories ──
// GET https://unstop.com/api/public/opportunity/search-result?opportunity={type}&page=1&per_page=15&oppstatus=open
// Requires browser UA; nested data.data[]

import type { Opportunity, SourceAdapter, Category } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "unstop",
  label: "Unstop",
  category: "mixed" as const,
  homepage: "https://unstop.com",
  tier: "green" as const,
};

const CATEGORY_MAP: Record<string, Category> = {
  hackathons: "hackathon",
  competitions: "competition",
  internships: "internship",
  scholarships: "scholarship",
};

interface UnstopItem {
  id: number;
  title: string;
  seo_url?: string;
  organisation?: { name?: string; logoUrl2?: string };
  logoUrl2?: string;
  banner?: string;
  start_date?: string;
  end_date?: string;
  regd_count?: number;
  tags?: string[];
  filters?: { label?: string }[];
  isPaid?: boolean;
  stipend?: { min?: number; max?: number };
  type?: string;
}

async function fetchCategory(oppType: string): Promise<UnstopItem[]> {
  const url = `https://unstop.com/api/public/opportunity/search-result?opportunity=${oppType}&page=1&per_page=15&oppstatus=open`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Unstop API ${res.status} for ${oppType}`);
  const json = await res.json();
  return json?.data?.data ?? [];
}

function toOpportunity(item: UnstopItem, category: Category): Opportunity {
  const logo = item.organisation?.logoUrl2 ?? item.logoUrl2;
  const rawTags = [
    ...(item.tags ?? []),
    ...(item.filters ?? []).map((f) => f.label).filter(Boolean) as string[],
  ];

  return {
    id: `unstop:${item.id}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: item.seo_url
      ? `https://unstop.com/${item.seo_url}`
      : `https://unstop.com/o/${item.id}`,
    category,
    title: item.title,
    organization: item.organisation?.name,
    imageUrl: item.banner,
    logoUrl: logo,
    tags: normalizeTags(rawTags),
    deadline: parseDate(item.end_date),
    startDate: parseDate(item.start_date),
    stipendMin: item.stipend?.min,
    stipendMax: item.stipend?.max,
    stipendPeriod: item.stipend ? "month" : undefined,
    currency: "INR",
    popularity: item.regd_count,
    lastVerified: new Date().toISOString(),
  };
}

export const unstopAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const results: Opportunity[] = [];

    const entries = Object.entries(CATEGORY_MAP);
    const settled = await Promise.allSettled(
      entries.map(([oppType]) => fetchCategory(oppType))
    );

    for (let i = 0; i < settled.length; i++) {
      const result = settled[i];
      const [, category] = entries[i];
      if (result.status === "fulfilled") {
        results.push(...result.value.map((item) => toOpportunity(item, category)));
      } else {
        console.warn(`[unstop] Failed to fetch ${entries[i][0]}:`, result.reason);
      }
    }

    return results;
  },
};
