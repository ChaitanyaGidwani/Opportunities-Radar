// ── Kaggle adapter — competition (env-gated) ──
// Only active when KAGGLE_USERNAME and KAGGLE_KEY are set

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "kaggle",
  label: "Kaggle",
  category: "competition" as const,
  homepage: "https://www.kaggle.com",
  tier: "amber" as const,
};

interface KaggleCompetition {
  ref: string;
  title: string;
  url: string;
  deadline?: string;
  description?: string;
  category?: string;
  reward?: string;
  tags?: { name: string }[];
  totalTeams?: number;
  organizationName?: string;
}

export const kaggleAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const username = process.env.KAGGLE_USERNAME;
    const key = process.env.KAGGLE_KEY;
    if (!username || !key) return [];

    const auth = Buffer.from(`${username}:${key}`).toString("base64");
    const res = await fetch(
      "https://www.kaggle.com/api/v1/competitions/list",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "User-Agent": "Argus/1.0",
        },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) throw new Error(`Kaggle API ${res.status}`);
    const data: KaggleCompetition[] = await res.json();

    return data.map(toOpportunity);
  },
};

function toOpportunity(c: KaggleCompetition): Opportunity {
  let prizeAmount: number | undefined;
  if (c.reward) {
    const cleaned = c.reward.replace(/[^0-9]/g, "");
    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) prizeAmount = num;
  }

  return {
    id: `kaggle:${c.ref}`,
    source: META.id,
    sourceLabel: META.label,
    sourceUrl: c.url?.startsWith("http")
      ? c.url
      : `https://www.kaggle.com/competitions/${c.ref}`,
    category: "competition",
    title: c.title,
    organization: c.organizationName ?? "Kaggle",
    summary: c.description,
    location: "Online",
    isRemote: true,
    tags: normalizeTags([
      ...(c.tags ?? []).map((t) => t.name),
      "data-analysis",
      "machine-learning",
    ]),
    deadline: parseDate(c.deadline),
    prizeAmount,
    currency: "USD",
    popularity: c.totalTeams,
    lastVerified: new Date().toISOString(),
  };
}
