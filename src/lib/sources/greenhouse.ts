// ── Greenhouse adapter — internship ──
// GET https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true
// ~20-24 curated India-hiring company tokens
// Filter titles to intern|graduate|trainee|campus|fresher|new grad

import type { Opportunity, SourceAdapter } from "../types";
import { parseDate } from "../parse";
import { normalizeTags } from "../normalize";

const META = {
  id: "greenhouse",
  label: "Greenhouse",
  category: "internship" as const,
  homepage: "https://www.greenhouse.io",
  tier: "green" as const,
};

// Curated India-hiring companies with Greenhouse boards
const COMPANY_BOARDS: { token: string; name: string; domain: string }[] = [
  { token: "razorpay", name: "Razorpay", domain: "razorpay.com" },
  { token: "cred", name: "CRED", domain: "cred.club" },
  { token: "zerodha", name: "Zerodha", domain: "zerodha.com" },
  { token: "meesho", name: "Meesho", domain: "meesho.com" },
  { token: "browserstack", name: "BrowserStack", domain: "browserstack.com" },
  { token: "postman", name: "Postman", domain: "postman.com" },
  { token: "notion", name: "Notion", domain: "notion.so" },
  { token: "figma", name: "Figma", domain: "figma.com" },
  { token: "confluent", name: "Confluent", domain: "confluent.io" },
  { token: "datadog", name: "Datadog", domain: "datadoghq.com" },
  { token: "elastic", name: "Elastic", domain: "elastic.co" },
  { token: "hashicorp", name: "HashiCorp", domain: "hashicorp.com" },
  { token: "gitlab", name: "GitLab", domain: "gitlab.com" },
  { token: "twilio", name: "Twilio", domain: "twilio.com" },
  { token: "cloudflare", name: "Cloudflare", domain: "cloudflare.com" },
  { token: "stripe", name: "Stripe", domain: "stripe.com" },
  { token: "mongodb", name: "MongoDB", domain: "mongodb.com" },
  { token: "canva", name: "Canva", domain: "canva.com" },
  { token: "atlassian", name: "Atlassian", domain: "atlassian.com" },
  { token: "shopify", name: "Shopify", domain: "shopify.com" },
];

const INTERN_REGEX =
  /\b(intern|internship|trainee|graduate|campus|fresher|new.?grad|entry.?level|apprentice|co-?op)\b/i;

interface GHJob {
  id: number;
  title: string;
  absolute_url: string;
  location: { name: string };
  updated_at?: string;
  departments?: { name: string }[];
  content?: string;
}

async function fetchBoard(
  token: string,
  name: string,
  domain: string
): Promise<Opportunity[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${token}/jobs?content=true`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Argus/1.0 (student-opportunity-aggregator)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return []; // Non-fatal
  const data = await res.json();
  const jobs: GHJob[] = data.jobs ?? [];

  return jobs
    .filter((j) => INTERN_REGEX.test(j.title))
    .map((j) => toOpportunity(j, name, domain));
}

function toOpportunity(
  j: GHJob,
  companyName: string,
  domain: string
): Opportunity {
  const deptTags = (j.departments ?? []).map((d) => d.name);
  const isRemote = /remote/i.test(j.location.name);

  return {
    id: `greenhouse:${j.id}`,
    source: META.id,
    sourceLabel: `${companyName} via Greenhouse`,
    sourceUrl: j.absolute_url,
    category: "internship",
    title: j.title,
    organization: companyName,
    logoUrl: `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    location: j.location.name,
    isRemote,
    tags: normalizeTags(deptTags),
    postedAt: parseDate(j.updated_at),
    lastVerified: new Date().toISOString(),
  };
}

export const greenhouseAdapter: SourceAdapter = {
  meta: META,
  async fetch() {
    const settled = await Promise.allSettled(
      COMPANY_BOARDS.map((b) => fetchBoard(b.token, b.name, b.domain))
    );

    const results: Opportunity[] = [];
    for (const r of settled) {
      if (r.status === "fulfilled") {
        results.push(...r.value);
      }
    }
    return results;
  },
};
