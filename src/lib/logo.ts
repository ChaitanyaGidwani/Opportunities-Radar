// ── Logo fallback chain ──
// Chain: explicit → DuckDuckGo → Google favicon → initials
// Do NOT use Clearbit — its logo API is dead (DNS gone).

/**
 * Returns an ordered list of logo URL candidates for an organization.
 * The UI should try each via <img onError> and fall back to initials.
 */
export function logoCandidates(
  explicitUrl: string | undefined,
  sourceUrl: string | undefined
): string[] {
  const candidates: string[] = [];

  if (explicitUrl) {
    // Ensure protocol prefix
    const url = explicitUrl.startsWith("//")
      ? `https:${explicitUrl}`
      : explicitUrl;
    candidates.push(url);
  }

  const domain = extractDomain(sourceUrl);
  if (domain) {
    candidates.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    candidates.push(
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    );
  }

  return candidates;
}

/** Extract root domain from a URL */
function extractDomain(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return null;
  }
}

/**
 * Generate initials from an organization name.
 * e.g. "Google Summer of Code" → "GS"
 */
export function getInitials(name: string | undefined): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Deterministic hue from a string (for initials avatar gradient) */
export function initialsHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}
