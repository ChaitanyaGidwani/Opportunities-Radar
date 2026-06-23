// ── Tag normalisation against the controlled vocabulary ──

import { ALL_SKILLS, SYNONYM_MAP } from "./taxonomy";

/** Slugify a raw tag string */
function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s\-\/\+\#\.]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Normalise a single raw tag to a canonical slug (or null if unknown) */
export function normalizeTag(raw: string): string | null {
  const lower = raw.toLowerCase().trim();

  // Direct synonym match first
  if (SYNONYM_MAP[lower]) return SYNONYM_MAP[lower];

  const slug = slugify(raw);

  // Direct slug match
  if (ALL_SKILLS.has(slug)) return slug;

  // Synonym match on the slug
  if (SYNONYM_MAP[slug]) return SYNONYM_MAP[slug];

  // Partial match: see if any canonical slug is contained in the raw text
  for (const canonical of ALL_SKILLS) {
    if (slug.includes(canonical) || canonical.includes(slug)) {
      return canonical;
    }
  }

  return null;
}

/** Normalise an array of raw tags, deduplicating and filtering unknowns */
export function normalizeTags(rawTags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of rawTags) {
    const normalized = normalizeTag(raw);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result;
}

/** Normalise a single skill string (for profile use) */
export function normalizeSkill(raw: string): string {
  return normalizeTag(raw) ?? slugify(raw);
}

/** Normalise an array of profile skills */
export function normalizeSkills(rawSkills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of rawSkills) {
    const normalized = normalizeSkill(raw);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result;
}
