// ── Devpost adapter — hackathon ──
// GET https://devpost.com/api/hackathons?status[]=open&page=N

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "devpost",
  label: "Devpost",
  category: "hackathon" as const,
  homepage: "https://devpost.com",
  tier: "green" as const,
};

interface DevpostHackathon {
  id: number;
  title: string;
  url: string;
  thumbnail_url?: string;
  organization_name?: string;
  submission_period_dates?: string;
  themes?: { name: string }[];
  prize_amount?: string;
  registrations_count?: number;
  displayed_location?: { location?: string };
  open_state?: string;
  time_left_to_submission?: string;
}

async function fetchPage(page: number): Promise<DevpostHackathon[]> {
  const url = `https://devpost.com/api/hackathons?status[]=open&page=${page}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Argus/1.0 (student-opportunity-aggregator)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Devpost API ${res.status}`);
  const data = await res.json();
  return data.hackathons ?? [];
}

function toOpportunity(h: DevpostHackathon): Opportunity {
  const imgUrl = h.thumbnail_url
    ? h.thumbnail_url.startsWith("//")
      ? `https:${h.thumbnail_url}`
      : h.thumbnail_url
    : undefined;

  // Parse deadline from submission_period_dates (e.g. "Oct 01 - Nov 30, 2026")
  let deadline: string | undefined;
  if (h.submission_period_dates) {
    const parts = h.submission_period_dates.split(/\s*[-–]\s*/);
    if (parts.length >= 2) {
      deadline = parseDate(parts[parts.length - 1]);
    }
  }

  // Parse prize
  let prizeAmount: number | undefined;
  if (h.prize_amount) {
    const cleaned = h.prize_amount.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num)) prizeAmount = num;
  }

  const rawTags = (h.themes ?? []).map((t) => t.name);

  return {
    id: `devpost:${h.id}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: h.url,
    category: "hackathon",
    title: h.title,
    organization: h.organization_name,
    imageUrl: imgUrl,
    location: h.displayed_location?.location,
    tags: normalizeTags(rawTags),
    deadline,
    prizeAmount,
    currency: "USD",
    popularity: h.registrations_count,
    lastVerified: new Date().toISOString(),
  };
}

export const devpostAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const results: Opportunity[] = [];
    // Fetch up to 3 pages
    for (let page = 1; page <= 3; page++) {
      try {
        const hackathons = await fetchPage(page);
        if (hackathons.length === 0) break;
        results.push(...hackathons.map(toOpportunity));
      } catch (e) {
        if (page === 1) throw e; // First page failure is fatal
        break; // Later pages can fail silently
      }
    }
    return results;
  },
};
