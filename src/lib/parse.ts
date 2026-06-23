// ── Date & money parsers for messy source data ──

import * as chrono from "chrono-node";

/**
 * Parse a messy date string into an ISO string.
 * Handles ranges like "May 19 - Aug 17, 2026" (returns the first/start date),
 * Unix timestamps, and various formats via chrono-node.
 */
export function parseDate(raw: string | number | undefined | null): string | undefined {
  if (raw == null) return undefined;

  // Unix timestamp (seconds)
  if (typeof raw === "number") {
    const ts = raw > 1e12 ? raw : raw * 1000; // ms vs s
    const d = new Date(ts);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  }

  const s = String(raw).trim();
  if (!s) return undefined;

  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  }

  // Try chrono
  const results = chrono.parse(s);
  if (results.length > 0) {
    return results[0].start.date().toISOString();
  }

  return undefined;
}

/**
 * Parse the END date from a range like "May 19 - Aug 17, 2026".
 * Useful for extracting deadlines from date ranges.
 */
export function parseDateEnd(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const s = String(raw).trim();

  const results = chrono.parse(s);
  if (results.length > 0) {
    const r = results[0];
    if (r.end) return r.end.date().toISOString();
    // If only one date in a "- separated" range, try splitting
    if (s.includes(" - ") || s.includes(" – ") || s.includes(" to ")) {
      const parts = s.split(/\s*[-–]\s*|\s+to\s+/i);
      if (parts.length >= 2) {
        const endResults = chrono.parse(parts[parts.length - 1]);
        if (endResults.length > 0) return endResults[0].start.date().toISOString();
      }
    }
    return r.start.date().toISOString();
  }

  return undefined;
}

// ── Money parser ──

interface ParsedMoney {
  amount: number;
  currency: string;
  period?: "month" | "year" | "one-time" | "week";
}

/**
 * Parse messy money strings:
 *   "Rs 10,000-15,000/month" → { amount: 10000, max: 15000, currency: "INR", period: "month" }
 *   "₹2 Lakh" → { amount: 200000, currency: "INR" }
 *   "$25,000 prize" → { amount: 25000, currency: "USD" }
 *   "€500/week" → { amount: 500, currency: "EUR", period: "week" }
 */
export function parseMoney(raw: string | undefined | null): {
  min?: number;
  max?: number;
  currency: string;
  period?: "month" | "year" | "one-time" | "week";
} | undefined {
  if (!raw) return undefined;
  const s = String(raw).trim();
  if (!s) return undefined;

  // Detect currency
  let currency = "INR";
  if (/\$|USD|usd/i.test(s)) currency = "USD";
  else if (/€|EUR|eur/i.test(s)) currency = "EUR";
  else if (/£|GBP|gbp/i.test(s)) currency = "GBP";

  // Detect period
  let period: ParsedMoney["period"];
  if (/\/\s*month|per\s*month|p\.m\.|monthly/i.test(s)) period = "month";
  else if (/\/\s*year|per\s*year|p\.a\.|annual/i.test(s)) period = "year";
  else if (/\/\s*week|per\s*week|weekly/i.test(s)) period = "week";
  else if (/prize|award|scholarship|grant|one[- ]?time/i.test(s)) period = "one-time";

  // Strip currency symbols
  const clean = s.replace(/[₹$€£,]/g, "").replace(/rs\.?|inr|usd|eur|gbp/gi, "").trim();

  // Extract numbers
  const numbers: number[] = [];
  const numRegex = /(\d+(?:\.\d+)?)\s*(?:lakh|lac|l(?:\b))?/gi;
  let match: RegExpExecArray | null;

  while ((match = numRegex.exec(clean)) !== null) {
    let val = parseFloat(match[1]);
    const suffix = clean.slice(match.index + match[1].length).trim().toLowerCase();

    if (/^(?:lakh|lac|l\b)/i.test(suffix)) val *= 100000;
    else if (/^(?:crore|cr\b)/i.test(suffix)) val *= 10000000;
    else if (/^k\b/i.test(suffix)) val *= 1000;
    else if (/^m\b/i.test(suffix) && val < 1000) val *= 1000000;

    numbers.push(val);
  }

  if (numbers.length === 0) return undefined;

  return {
    min: numbers[0],
    max: numbers.length > 1 ? numbers[numbers.length - 1] : undefined,
    currency,
    period,
  };
}

/**
 * Utility: generate a stable slug from a string (for dedupe).
 */
export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
