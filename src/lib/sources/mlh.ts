// ── MLH adapter — hackathon ──
// GET https://mlh.com/seasons/2026/events → extract the embedded "upcomingEvents":[…] JSON blob

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "mlh",
  label: "MLH",
  category: "hackathon" as const,
  homepage: "https://mlh.com",
  tier: "green" as const,
};

interface MLHEvent {
  name: string;
  url?: string;
  image_url?: string;
  logo_url?: string;
  background_url?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  is_hybrid?: boolean;
  themes?: string[];
}

export const mlhAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const res = await fetch("https://mlh.com/seasons/2026/events", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`MLH page ${res.status}`);
    const html = await res.text();

    // Extract the embedded JSON blob via bracket-matching (don't DOM-scrape)
    const events = extractEventsFromHTML(html);
    return events.map(toOpportunity);
  },
};

function extractEventsFromHTML(html: string): MLHEvent[] {
  // Look for the upcomingEvents JSON blob in the page source
  const patterns = [
    /"upcomingEvents"\s*:\s*\[/,
    /"events"\s*:\s*\[/,
    /data-events='(\[.*?\])'/,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match) {
      // For data attribute pattern
      if (match[1]) {
        try {
          return JSON.parse(match[1]);
        } catch {
          continue;
        }
      }

      // For embedded JSON — bracket-match to find the closing ]
      const startIdx = match.index + match[0].length - 1; // position of [
      let depth = 0;
      let endIdx = startIdx;
      for (let i = startIdx; i < html.length && i < startIdx + 50000; i++) {
        if (html[i] === "[") depth++;
        else if (html[i] === "]") {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }
      if (endIdx > startIdx) {
        try {
          return JSON.parse(html.slice(startIdx, endIdx + 1));
        } catch {
          continue;
        }
      }
    }
  }

  return [];
}

function toOpportunity(e: MLHEvent): Opportunity {
  const isOnline =
    e.location?.toLowerCase().includes("digital") ||
    e.location?.toLowerCase().includes("online") ||
    e.is_hybrid;

  return {
    id: `mlh:${slugify(e.name)}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: e.url ?? "https://mlh.com/seasons/2026/events",
    category: "hackathon",
    title: e.name,
    organization: "Major League Hacking",
    imageUrl: e.background_url ?? e.image_url,
    logoUrl: e.logo_url,
    location: e.location,
    isRemote: isOnline,
    tags: normalizeTags(e.themes ?? []),
    deadline: parseDate(e.end_date),
    startDate: parseDate(e.start_date),
    lastVerified: new Date().toISOString(),
  };
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
