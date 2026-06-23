// ── Canonical types for the Argus opportunity platform ──
// Every source adapter normalises into these shapes.

export type Category = "internship" | "scholarship" | "competition" | "hackathon";

export interface Eligibility {
  /** Missing field = OPEN (eligible). Only set what you're sure of. */
  branches?: string[];
  years?: number[];
  minCGPA?: number;
  states?: string[];
  socialCategories?: ("general" | "obc" | "sc" | "st" | "ews")[];
  gender?: "female" | "male";
  citizenship?: string;
  raw?: string;
}

export interface Opportunity {
  /** `${source}:${hash(canonicalUrl)}` — also the dedupe key */
  id: string;
  source: string;
  sourceLabel: string;
  /** Deep-link to apply at origin */
  sourceUrl: string;
  category: Category;
  title: string;
  organization?: string;
  summary?: string;
  /** Banner/cover when the source provides one */
  imageUrl?: string;
  /** Org/source logo when the source provides one */
  logoUrl?: string;
  location?: string;
  isRemote?: boolean;
  /** Canonical skill slugs from the controlled vocabulary */
  tags: string[];
  /** ISO date — the apply-by/registration-close date (the product's spine) */
  deadline?: string;
  startDate?: string;
  postedAt?: string;
  stipendMin?: number;
  stipendMax?: number;
  stipendPeriod?: "month" | "year" | "one-time" | "week";
  awardAmount?: number;
  prizeAmount?: number;
  currency?: string;
  popularity?: number;
  eligibility?: Eligibility;
  /** ISO timestamp of last verification */
  lastVerified: string;
  stale?: boolean;
}

export type SourceTier = "green" | "amber" | "seed";

export interface SourceMeta {
  id: string;
  label: string;
  category: Category | "mixed";
  homepage: string;
  tier: SourceTier;
}

export interface SourceAdapter {
  meta: SourceMeta;
  fetch(): Promise<Opportunity[]>;
}

export interface SourceRunResult {
  sourceId: string;
  label: string;
  tier: SourceTier;
  count: number;
  durationMs: number;
  ok: boolean;
  error?: string;
}

export interface Corpus {
  opportunities: Opportunity[];
  runs: SourceRunResult[];
  updatedAt: string;
}

// ── Scoring & Feed ──

export interface ScoreBreakdown {
  skill: number;
  interest: number;
  urgency: number;
  recency: number;
  popularity: number;
  location: number;
}

export type MatchLevel = 1 | 2 | 3;

export interface MatchChip {
  label: string;
  type: "skill" | "interest" | "urgency" | "recency" | "popularity" | "location";
}

export interface ScoredOpportunity extends Opportunity {
  score: number;
  breakdown: ScoreBreakdown;
  matchLevel: MatchLevel;
  matchChips: MatchChip[];
  eligible: boolean;
}

export type SortMode = "closing" | "match" | "newest";
export type DeadlineWindow = "all" | "24h" | "3d" | "7d" | "30d";
export type LocationFilter = "all" | "remote" | "onsite";
export type FeedScope = "all" | "eligible";

export interface FilterState {
  categories?: Category[];
  query?: string;
  deadlineWindow?: DeadlineWindow;
  location?: LocationFilter;
  tags?: string[];
  minStipend?: number;
}

export interface FeedFacets {
  categories: Record<Category, number>;
  total: number;
  remote: number;
  closingThisWeek: number;
  topTags: { tag: string; count: number }[];
}

export interface FeedResult {
  items: ScoredOpportunity[];
  facets: FeedFacets;
  broadened: boolean;
  total: number;
  eligibleTotal: number;
  updatedAt: string;
  runs: SourceRunResult[];
}

// ── Profile ──

export interface Profile {
  branch?: string;
  year?: number;
  interests: Category[];
  skills: string[];
  cgpa?: number;
  state?: string;
  socialCategory?: "general" | "obc" | "sc" | "st" | "ews";
  gender?: "female" | "male";
  location?: string;
  willingToRelocate?: boolean;
  remoteOnly?: boolean;
  onboarded: boolean;
}

// ── Nudges ──

export type NudgeWindow = "14d" | "7d" | "3d" | "1d" | "3h";

export interface Nudge {
  id: string;
  opportunityId: string;
  window: NudgeWindow;
  fireAt: string;
  due: boolean;
  title: string;
  body: string;
  url?: string;
  category: Category;
}

// ── Notification preferences ──

export interface NotificationPrefs {
  inApp: boolean;
  push: boolean;
  email: boolean;
  quietHoursStart: number; // hour 0-23
  quietHoursEnd: number;
  frequencyCap: number; // max per day
  weeklyDigest: boolean;
  readIds: string[];
  snoozed: Record<string, string>; // nudgeId → snooze-until ISO
}
