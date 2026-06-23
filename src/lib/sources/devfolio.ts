// ── Devfolio adapter — hackathon ──
// GET https://api.devfolio.co/api/hackathons?filter=application_open&page=N

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "devfolio",
  label: "Devfolio",
  category: "hackathon" as const,
  homepage: "https://devfolio.co",
  tier: "green" as const,
};

interface DevfolioHackathon {
  name: string;
  slug: string;
  tagline?: string;
  cover_img?: string;
  favicon?: string;
  starts_at?: string;
  ends_at?: string;
  hackathon_setting?: string;
  prize_amount?: number;
  prize_currency?: string;
  registrations_count?: number;
  tags?: string[];
}

async function fetchPage(page: number): Promise<DevfolioHackathon[]> {
  const url = `https://api.devfolio.co/api/hackathons?filter=application_open&page=${page}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Argus/1.0 (student-opportunity-aggregator)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Devfolio API ${res.status}`);
  const data = await res.json();
  return data.result ?? [];
}

function toOpportunity(h: DevfolioHackathon): Opportunity {
  return {
    id: `devfolio:${h.slug}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: `https://devfolio.co/hackathons/${h.slug}`,
    category: "hackathon",
    title: h.name,
    summary: h.tagline,
    imageUrl: h.cover_img,
    logoUrl: h.favicon,
    location: h.hackathon_setting === "online" ? "Online" : undefined,
    isRemote: h.hackathon_setting === "online",
    tags: normalizeTags(h.tags ?? []),
    deadline: parseDate(h.ends_at),
    startDate: parseDate(h.starts_at),
    prizeAmount: h.prize_amount,
    currency: h.prize_currency ?? "USD",
    popularity: h.registrations_count,
    lastVerified: new Date().toISOString(),
  };
}

export const devfolioAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const results: Opportunity[] = [];
    for (let page = 1; page <= 3; page++) {
      try {
        const hackathons = await fetchPage(page);
        if (hackathons.length === 0) break;
        results.push(...hackathons.map(toOpportunity));
      } catch (e) {
        if (page === 1) throw e;
        break;
      }
    }
    return results;
  },
};
