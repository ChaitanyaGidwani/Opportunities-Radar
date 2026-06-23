# Build Brief — Student Opportunity Platform (for an implementing AI agent)

You are building a **student-opportunity platform**: it aggregates **internships, scholarships, competitions and hackathons** from *live* public sources into one place, ranks them for the student, and **reminds them before every deadline**. You always **deep-link out** to the original site to apply — you are never the application endpoint. (The product name and exact wordmark are a placeholder — fill in your own.)

This brief is prescriptive. Follow the architecture, flows, endpoints, tokens and gotchas exactly; they are the result of real iteration. Where you must choose, prefer the documented option.

---

## 0. Golden rules (read first)

1. **Open straight into the product.** No marketing landing/gate. `/` → `/feed` (the Discover home).
2. **Personalisation is optional, never a gate.** The whole app works without a profile; personalisation only improves ranking. Prompt for it softly.
3. **Aggregate server-side, read on the client.** The browser NEVER scrapes. A server cache holds the corpus; the UI reads it.
4. **Always deep-link out to apply.** Store facts, not verbatim republication. Honour robots/ToS. Collect zero recruiter/personal data.
5. **One blur layer only.** Glass/backdrop-blur is reserved for the sticky top app bar. Everything else is solid.
6. **No "AI-slop" tells.** No generic Tailwind-blue, no `Sparkles`/`Crosshair`/radar/scope iconography, no gradient-on-everything. Authored oklch palette + a real display font.
7. **Light theme only.** White surfaces, cool-cast neutrals.

---

## 1. Tech stack & environment

- **Next.js 16** (App Router, React Server Components), **React 19**, **TypeScript** (strict), **Tailwind CSS v4**.
- **zustand** (+ `persist` middleware) for client state. **lucide-react** icons. **motion** (Framer Motion) for tasteful animation. **date-fns** + **chrono-node** for messy date parsing. **zod** for adapter validation. **web-push** for browser push.
- Runs with **zero API keys / no database** by default (file cache + auto-generated VAPID keypair in `.cache/`).

### Next.js 16 / Tailwind v4 gotchas (these WILL bite you)
- **Route handlers** live at `app/api/**/route.ts` (`export async function GET/POST`). Not cached by default. For typed dynamic params use either `RouteContext<'/api/x/[id]'>` **or** the explicit `ctx: { params: Promise<{ id: string }> }` and `await ctx.params`. Prefer the explicit form (works without generated route types). Mark data/network routes `export const dynamic = "force-dynamic"`.
- **Tailwind v4 has no `tailwind.config`.** Design tokens go in `globals.css` via `@theme { --color-x: ...; }` (emits a real CSS var + utilities) and `@theme inline { --color-x: var(--c-x); }` (for theme-switchable values). Use **oklch** color values — that alone reads as "authored, not default".
- **Server-only modules**: anything importing `node:fs`/`web-push`/the aggregator must `import "server-only"` and only be reached from route handlers. Add `serverExternalPackages: ["web-push"]` in `next.config.ts`.
- **Hydration with computed SVG**: if you render SVG geometry with `Math.cos/sin` (or any float math), **round to 2 decimals** — Node and the browser serialise trig differently in the last digit and you'll get hydration mismatch errors. Better: avoid decorative trig SVG entirely.
- **Adapter/registry changes sometimes don't hot-reload** in dev. If freshly-edited server modules seem ignored, delete `.next/` and restart `next dev`.
- **`Date.now()`/`Math.random()` during render** trip the React Compiler purity rule. Read them in a `useState(() => Date.now())` initializer instead. Reading browser APIs (`Notification.permission`) on mount: defer with `requestAnimationFrame` or use `useSyncExternalStore` to avoid the `set-state-in-effect` lint error.

---

## 2. Design system (authored, non-generic)

**Identity:** clean, light, "signal instrument". Brand = an **electric cyan-teal** ramp authored in oklch (deliberately NOT Tailwind blue-600). **Amber** is the warm counter-accent, reserved for deadlines/urgency. Logo = a **solid teal rounded tile with an upward "aim" arrow/dart** (signifying reaching a goal/target). **No concentric rings, no radar, no scope/crosshair icons.**

Put these in `globals.css`:

```css
@theme {
  /* brand — electric cyan-teal (oklch) */
  --color-signal-50:  oklch(0.972 0.02 195);
  --color-signal-300: oklch(0.84 0.108 193);
  --color-signal-400: oklch(0.785 0.138 192);
  --color-signal-500: oklch(0.715 0.146 192);   /* primary */
  --color-signal-600: oklch(0.585 0.122 193);   /* text on white */
  --color-signal-700: oklch(0.5 0.1 194);
  /* semantic — info distinct from brand; amber = warm urgency accent */
  --color-success: oklch(0.66 0.16 150);
  --color-amber:   oklch(0.79 0.162 74);
  --color-danger:  oklch(0.62 0.21 18);
  --color-info:    oklch(0.62 0.15 252);
  /* category accents (one oklch family; ALWAYS paired with an icon+label) */
  --color-cat-internship:  oklch(0.62 0.15 252);  /* blue   */
  --color-cat-scholarship: oklch(0.585 0.18 300); /* violet */
  --color-cat-competition: oklch(0.74 0.16 62);   /* amber  */
  --color-cat-hackathon:   oklch(0.7 0.135 192);  /* teal   */
  /* type */
  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --font-display: var(--font-bricolage), var(--font-geist), sans-serif; /* headings */
  /* one radius scale, applied by role */
  --radius-control: 9px; --radius-card: 15px; --radius-shell: 20px;
}
@theme inline { --color-base: var(--c-base); --color-surface: var(--c-surface); --color-ink: var(--c-ink); /* …+ ink-2, ink-3, line, line-strong, elevated, signal */ }
:root {
  --c-base:#f3f6f6; --c-surface:#fff; --c-line:#e4e9e9; --c-line-strong:#d0d7d7;
  --c-ink:#101719; --c-ink-2:#4f585a; --c-ink-3:#818b8c;   /* cool-cast neutrals */
  --c-signal: oklch(0.555 0.118 193);
  --shadow-card: 0 1px 2px rgba(8,22,24,.05), 0 1px 3px rgba(8,22,24,.06);  /* brand-tinted */
  color-scheme: light;
}
```

**Fonts** (`next/font/google` in `layout.tsx`): **Geist** (`--font-geist`, body), **Geist Mono** (`--font-geist-mono`, all quantitative readouts with `font-variant-numeric: tabular-nums`), **Bricolage Grotesque** (`--font-bricolage`, headings — gives real type contrast). Apply display font to `h1,h2,h3` in the base layer with tight tracking and a weight bump.

**Rules:**
- Brand accent is **rationed** — used only for active nav, match chips, primary CTA, focus rings. Most surfaces are calm white/cool-neutral.
- Category hue is **never the only signal** — always icon + label (WCAG).
- Primary `Button`: `bg-signal-500` + **dark teal text** (`#042522`), not white (better contrast on the bright teal).
- `.panel` = white + 1px line + soft brand-tinted shadow. `.panel-hover` lifts `-3px` AND ignites a brand hairline at the card's top edge (`::after`). Banner image zooms subtly on hover.
- Loading = **skeletons** (card-shaped: banner block + content lines). No spinner-radar widgets.
- Icons: lucide. For "For You/matches" use `Star`; for "matched/verified" use `BadgeCheck`; for "live sources" use `Activity`. **Never** `Sparkles`, `Crosshair`, `Target`, `SatelliteDish` (AI/radar tells).

---

## 3. Information architecture & routes

| Route | Screen | Notes |
|---|---|---|
| `/` | redirect → `/feed` | open straight into the app |
| `/feed` | **Discover home** | hero + category tiles + horizontal rails |
| `/c/[category]` | **Category listing** | locked to one of `internship\|scholarship\|competition\|hackathon`; 404 otherwise |
| `/for-you` | **For You** | personalised rails (top matches, by category) |
| `/saved` | **Saved & tracked** | tabs: Saved / Applied |
| `/notifications` | **Deadline nudges** | timeline + channel prefs + real web push |
| `/profile` | **Profile** | the personalisation hub; edits live-re-rank the feed |
| `/onboarding` | **Get started** | 3 quick steps + a live match preview |

---

## 4. User flow (the "best" flow — implement exactly)

```
Open app
  └─► /feed  DISCOVER HOME
        • Hero: "Every opportunity, made for you." + live stat (N live · M closing this week)
        • CATEGORY TILES (the Unstop move): Internships · Scholarships · Competitions · Hackathons
            each tile = category-colour gradient + icon + live blip + "{count} live"  → tap → /c/{category}
        • RAILS (horizontal carousels, section header with a coloured accent bar + "See all →"):
            "Closing soon" (urgent) · "For you" (best match) · "Fresh this week" (newest)
  │
  ├─► tap a category tile ─► /c/internship  CATEGORY LISTING
  │       • header: "← All categories" + icon + "Internships" + "{count} live"
  │       • search + Sort (Closing / Best match / Newest) + a "Filters" button (collapsed by default)
  │       • tapping Filters opens a panel: Skills & themes (per-category tag chips) · Deadline · Location
  │       • when collapsed but filters active → show removable active-filter chips + "Clear"
  │       • uniform card grid (1/2/3 cols)
  │
  ├─► tap a card ─► OPPORTUNITY DETAIL (modal/bottom-sheet)
  │       • banner + overlapping org logo + category chip + close
  │       • deadline countdown · value (stipend/prize/award) · location · match %
  │       • "Why this matched you" chips + expandable score breakdown
  │       • eligibility chips · skills/themes · "via {source}, verified {time}"
  │       • sticky actions: [Apply on {source} ↗] (deep-link out) · Save · Mark applied · Add to calendar (.ics / Google)
  │
  └─► Save  ─► powers the nudge timeline (T-7d/T-3d/T-1d/T-3h)

Personalisation (optional, anytime): a dismissible "Personalise your feed" banner → /onboarding (branch, year,
interests, skills) → live preview → returns to feed, now eligibility-filtered + match-ranked. Edit later in /profile.

Global chrome:
  • Top app bar (sticky, the ONE glass layer): logo · search (⌘K command palette) · desktop nav · 🔔 alerts (badge) top-right
  • Bottom: FLOATING PILL tab bar (mobile): Home · For You · Saved · Profile
  • Command palette (⌘K / Ctrl+K): fuzzy-search opportunities + jump anywhere
```

**Discover vs listing distinction is the whole point:** Home = *browse the full catalogue by category + curated rails*; `/for-you` = *eligibility-filtered, match-ranked, personal*. Home requests the feed with `scope:"all"`; For You uses `scope:"eligible"` (default).

---

## 5. Data layer (the heart)

### 5.1 Canonical `Opportunity` (every source normalises into this)
```ts
type Category = "internship" | "scholarship" | "competition" | "hackathon";
interface Eligibility {            // MISSING field = OPEN (eligible). Only ever set what you're sure of.
  branches?: string[]; years?: number[]; minCGPA?: number; states?: string[];
  socialCategories?: ("general"|"obc"|"sc"|"st"|"ews")[]; gender?: "female"|"male"; citizenship?: string; raw?: string;
}
interface Opportunity {
  id: string;                      // `${source}:${hash(canonicalUrl)}`  (also the dedupe key)
  source: string; sourceLabel: string; sourceUrl: string;  // deep-link to apply at origin
  category: Category; title: string; organization?: string; summary?: string;
  imageUrl?: string;               // banner/cover when the source gives one
  logoUrl?: string;                // org/source logo when the source gives one
  location?: string; isRemote?: boolean; tags: string[];   // tags = canonical skill slugs
  deadline?: string;               // ISO — the apply-by/registration-close date (the product's spine)
  startDate?: string; postedAt?: string;
  stipendMin?: number; stipendMax?: number; stipendPeriod?: "month"|"year"|"one-time"|"week";
  awardAmount?: number; prizeAmount?: number; currency?: string;  // INR | USD
  popularity?: number; eligibility?: Eligibility; lastVerified: string; stale?: boolean;
}
interface SourceAdapter { meta: { id; label; category|"mixed"; homepage; tier:"green"|"amber"|"seed" }; fetch(): Promise<Opportunity[]>; }
```

### 5.2 Sources & live endpoints (verified working, zero-auth unless noted)
Each is one adapter file. Use an honest bot UA; for a couple, a browser UA. Wrap calls so one failure never sinks the run.

| Adapter | Category | Endpoint | Image fields |
|---|---|---|---|
| **devpost** | hackathon | `GET https://devpost.com/api/hackathons?status[]=open&page=N` | `thumbnail_url` (prefix `https:` if `//…`) |
| **devfolio** | hackathon | `GET https://api.devfolio.co/api/hackathons?filter=application_open&page=N` (`result[]`) | `cover_img`, `favicon` |
| **unstop** | ALL 4 | `GET https://unstop.com/api/public/opportunity/search-result?opportunity={hackathons\|competitions\|internships\|scholarships}&page=1&per_page=15&oppstatus=open` (browser UA; nested `data.data[]`) | `logoUrl2` |
| **mlh** | hackathon | `GET https://mlh.com/seasons/2026/events` → extract the embedded `"upcomingEvents":[…]` JSON blob (bracket-match, don't DOM-scrape) | `logoUrl`, `backgroundUrl` |
| **codeforces** | competition | `GET https://codeforces.com/api/contest.list?gym=false` (phase `BEFORE`; start time = the act-by deadline) | — (derive logo from domain) |
| **codechef** | competition | `GET https://www.codechef.com/api/list/contests/all` (`present_+future_contests`) | — |
| **greenhouse** | internship | `GET https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true` for ~20–24 curated India-hiring company tokens; filter titles to `intern\|graduate\|trainee\|campus\|fresher\|new grad`; set `logoUrl` from each company's domain | per-company logo |
| **arbeitnow** | internship | `GET https://www.arbeitnow.com/api/job-board-api` (filter to intern/junior/remote) | — |
| **scholarships** | scholarship | **curated** ~30 real Indian awards (NSP/INSPIRE/AICTE Pragati-Saksham/Reliance/Tata/HDFC/DAAD/Chevening…); each deep-links to its official portal. *No Indian scholarship portal exposes an API — curation IS the backbone.* | — |
| **seed** | mixed | **curated** ~20 fallbacks (Razorpay/Zerodha/GSoC/Smart India Hackathon/Flipkart GRiD…) so the feed is never empty offline | — |
| **adzuna** *(env-gated)* | internship | `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=&app_key=&what=intern` (free key) | — |
| **kaggle** *(env-gated)* | competition | `https://www.kaggle.com/api/v1/competitions/list` (HTTP Basic `KAGGLE_USERNAME:KAGGLE_KEY`) | — |

**Env-gating:** include `adzuna`/`kaggle` in the registry *only when* their env vars are present, so they appear automatically once keys are added to `.env.local` (and the source-health panel shows them go live).

**AVOID** scraping LinkedIn / Indeed / Internshala (ToS/legal). Deep-link out only.

### 5.3 Pipeline
`aggregate()` runs all adapters with `Promise.allSettled` → flatten → **dedupe** (by id, then by `category+slug(title)+slug(org)`, keeping the higher-priority source: live > curated) → write `Corpus { opportunities, runs, updatedAt }` to **memory + `.cache/corpus.json`**.
`getCorpus({force?})` = stale-while-revalidate: cold ⇒ blocking aggregate (UI shows skeletons); fresh (<30 min) ⇒ instant; stale ⇒ serve snapshot + revalidate in background; force ⇒ blocking re-aggregate. Never let a transient empty run wipe a good snapshot.

### 5.4 Normalisation helpers
- A shared **controlled vocabulary** of ~150 skill slugs + a synonym map (`ml→machine-learning`, `js→javascript`, `web3→blockchain`…). Both profile skills and opportunity tags normalise into this namespace — this is what makes skill-matching a clean set overlap. (`taxonomy.ts`, `normalize.ts`.)
- `parse.ts`: `chrono-node` for ranges like `"May 19 - Aug 17, 2026"`; money parser for `"Rs 10,000-15,000/month"`, `"₹2 Lakh"`, `"$25,000 prize"` (handles lakh/crore/k).
- **Logos**: `logoCandidates(explicitUrl, sourceUrl)` returns an ordered list → the UI tries each on `<img onError>` and finally falls back to an **initials avatar** (gradient + initials). Chain: `explicit → https://icons.duckduckgo.com/ip3/{domain}.ico → https://www.google.com/s2/favicons?domain={domain}&sz=128 → initials`. **Do NOT use Clearbit — its logo API is dead (DNS gone).**

---

## 6. Ranking engine (`rank.ts`)

Transparent, deterministic, no ML training — a pure function over the cached corpus.

**Stage 1 — hard eligibility filter (boolean; drop only on high-confidence fields; missing on EITHER side = eligible):**
- `deadline > now` (closed items always dropped); branch ∈ eligibility.branches; year ∈ eligibility.years; cgpa ≥ minCGPA (only if profile.cgpa known); state/socialCategory/gender restrictions (only if the profile field is known); `remoteOnly` preference.
- If 0 survive → relax to deadline-only and flag `broadened`.
- A `skipEligibility` mode scores the **full** non-closed catalogue (used by Discover/Home with `scope:"all"`).

**Stage 2 — weighted soft score (semantic OFF by default), each sub-score 0..1:**
```
BASE_WEIGHTS = { skill:0.40, interest:0.25, urgency:0.15, recency:0.10, popularity:0.05, location:0.05 }
```
- **skill** = saturating overlap of profile skills (∪ branch-affinity skills) with `o.tags`: `1 - exp(-weightedMatches/1.5)` (explicit match=1.0, branch-affinity=0.5).
- **interest** = 1 if `o.category ∈ profile.interests` else 0.3.
- **recency** = `exp(-ageDays/14)` (unknown → 0.5).
- **urgency** = log-normal peak ~8 days out; `<2 days` → 0.55 penalty; no deadline → 0.35.
- **popularity** = `log1p(pop)/log1p(maxPop)` (unknown → 0.5).
- **location** = remote/same-city 1.0, same-state 0.6, relocate/unknown 0.6, else 0.4.
- **Cold-start**: zero out signals the profile can't produce (e.g. no skills) and renormalise the rest.
- **Explainability is FREE** (no LLM): take the top contributing signals and template chips — *"Matches 2 of your skills: Machine Learning, Python"*, *"Closes in 4 days"*, *"2,300 registered"*. Attach the numeric `score`, per-signal `breakdown`, `rawSignals`, and a `matchLevel` 1–3 (for a 1–3 bar "ping" glyph). Surface the breakdown in the detail's "How this was scored".

---

## 7. Feed query (`feed.ts` — `buildFeed`)

`buildFeed(corpus, profile, filter, sort, now, scope)` → `{ items, facets, broadened, total, eligibleTotal }`.
- `rank(...)` with `skipEligibility = scope==="all"`.
- **FilterState**: `{ categories?: Category[] (single-select in UI), query?, deadlineWindow?: "all"|"24h"|"3d"|"7d"|"30d", location?: "all"|"remote"|"onsite", tags?: string[], minStipend? }`.
- **Facets** (over the full ranked pool, so chip counts reflect availability): per-category counts, total, remote, closingThisWeek, and **`topTags`** = the most common `o.tags` *scoped to the selected category* — these become the per-category tag filters (Internships → marketing/backend/fintech…; Hackathons → web-development/blockchain/cybersecurity…).
- `tags` filter matches if the opportunity has **at least one** selected tag.
- **Sort**: `closing` (deadline asc, rolling last — default) · `match` (score desc) · `newest` (postedAt desc).

---

## 8. Deadline nudges (`nudges.ts`, `/api/nudges`, web push)

- Deadline-**relative** schedule (not weekly): **T-14d** (high-effort: scholarships/competitions/hackathons), **T-7d, T-3d, T-1d, T-3h**.
- **Relevance-gated**: only saved items + high-relevance matches (score > 0.5 or top-N) **with a real deadline**.
- For each, `fireAt = deadline − window`; `due = fireAt ≤ now`. Loss-aversion copy with social proof: *"Last call — closes in ~3 hours. Don't lose your shot."*
- **Channels**: in-app center (always) + **real Web Push** (VAPID; auto-generate keys to `.cache/` so it works on localhost — call `showNotification` inside `event.waitUntil` in the service worker) + email (Resend-ready, env-gated) + one-tap **.ics + Google Calendar** (with `VALARM -P1D / -PT3H`).
- **Anti-fatigue**: per-channel toggles, quiet hours (default 8am–9pm IST), frequency cap, snooze, weekly digest.

---

## 9. API endpoints (Route Handlers; all `dynamic="force-dynamic"`)

| Endpoint | Body / Query | Returns |
|---|---|---|
| `POST /api/feed` | `{ profile, filter?, sort?, scope?: "all"\|"eligible" }` | `{ items: ScoredOpportunity[], facets, broadened, total, eligibleTotal, updatedAt, runs }` |
| `POST /api/score` | `{ profile, ids: string[] }` | `{ items: ScoredOpportunity[] }` — scores specific ids WITHOUT dropping ineligible/closed (for Saved/tracked) |
| `POST /api/nudges` | `{ profile, savedIds: string[], channel? }` | `{ nudges: Nudge[], opportunities }` (due + upcoming) |
| `GET  /api/opportunities` | `?force=1` | `{ count, updatedAt, runs, opportunities }` (raw corpus + per-source health) |
| `GET\|POST /api/ingest` | (Bearer `INGEST_SECRET` in prod; open in dev) | forces re-aggregation; `{ ok, count, runs, updatedAt }` |
| `GET  /api/ics/[id]` | — | `text/calendar` .ics for one opportunity |
| `GET  /api/push/vapid` | — | `{ publicKey }` |
| `POST /api/push/subscribe` | `{ subscription }` | stores the push subscription |
| `POST /api/push/send` | `{ title, body, url? }` | broadcasts a web push (the "send test nudge" action) |

The **frontend never scrapes** — it only calls these. Discover/Home and the command palette call `/api/feed` with `scope:"all"`; `/for-you` uses the default `scope:"eligible"`.

---

## 10. Client state (zustand, localStorage-persisted)

- `profile` — `{ branch, year, interests: Category[], skills: string[], cgpa?, state?, socialCategory?, gender?, location?, willingToRelocate?, remoteOnly?, onboarded }` + a `hydrated` flag (gate persisted reads to avoid SSR mismatch).
- `collections` — `saved: string[]`, `applied: string[]`.
- `prefs` — channel toggles, quiet hours, frequency cap, weekly digest, `readIds`, `snoozed`.
- `nudges` — fetched timeline cache (powers the alerts badge AND the notifications page; dedupe fetches within ~60s).
- `theme` — light-locked (via `useSyncExternalStore`, not a setState-in-effect).
- `command` — `{ open, setOpen }` for ⌘K.

---

## 11. Component map

```
app/  layout.tsx (fonts, metadata, <Toaster/>)  page.tsx (redirect→/feed)
      feed/page.tsx → AppShell + DiscoverClient
      c/[category]/page.tsx → AppShell + FeedClient(initialCategory)  (404 invalid category)
      for-you/ saved/ notifications/ profile/ onboarding/
      api/** (see §9)
components/
  brand/        mark.tsx (BrandMark = teal tile + aim arrow; Wordmark)  ping-bar.tsx (1–3 match bars)
  layout/       app-shell.tsx (top app bar + floating pill bottom nav + ⌘K + alerts bell)
  discover/     discover-client.tsx (hero + tiles + rails)  category-tiles.tsx
  feed/         feed-client.tsx (listing: header, FilterBar, grid, states, SourceHealth)
                filter-bar.tsx (search + sort + collapsible Filters panel + active-chips)
                opportunity-card.tsx  opportunity-detail.tsx  media.tsx (OrgLogo, CardBanner)
                category-icon.tsx (CATEGORY_ICON/COLOR/LABEL)  deadline-countdown.tsx  rail.tsx
  for-you/      for-you-client.tsx (personalise hero + per-category rails)
  onboarding/   onboarding-flow.tsx (3 steps + live preview)
  notifications/ notifications-client.tsx (timeline + prefs + web push)
  profile/      profile-client.tsx (live-editing personalisation hub)
  command/      command-palette.tsx
  ui/           button.tsx primitives.tsx (Chip/Toggle/Segmented/Skeleton/Spinner) modal.tsx toaster.tsx reveal.tsx animated-number.tsx
lib/            types taxonomy normalize parse logo rank eligibility feed corpus store dedupe nudges ics push
                sources/* (one file per adapter + index registry + aggregator/run.ts)
store/          profile collections prefs nudges theme command toast
```

**Card anatomy** (uniform; no oversized hero card): `CardBanner` (cover image **or** category-tinted gradient + watermark icon, ~104px) → category chip (solid, top-left) + Save (top-right) → overlapping org logo (bottom-left, ring-surface) → org name + match glyph/% → 2-line title → up to 2 "why matched" chips → footer (deadline countdown + value). Card lifts + ignites a brand hairline on hover.

**Category tiles** (Discover): category-colour gradient + icon + a pulsing "live" blip + `{count} live` + a faded watermark icon; whole tile links to `/c/{category}`.

**Filters** (`/c/[category]`): **collapsed by default** behind a "Filters" button (with an active-count badge). Open ⇒ panel with grouped chips (Skills & themes / Deadline / Location). Collapsed-but-active ⇒ inline removable chips + "Clear". Category tabs are hidden on a locked category page.

---

## 12. Build order (phases)

1. **Foundation** — Next 16 + Tailwind v4 scaffold; design tokens + fonts; `types.ts`, `taxonomy.ts` (vocab + synonyms), utils, `store.ts` (file cache).
2. **Data** — `SourceAdapter` contract + helpers; build adapters (start with the zero-auth JSON ones, then curated scholarships/seed); `aggregator/run.ts`, `dedupe.ts`, `corpus.ts`.
3. **Brain** — `eligibility.ts`, `rank.ts`, `feed.ts`, `nudges.ts`, `ics.ts`, `push.ts`.
4. **API** — the route handlers in §9 + the service worker.
5. **State** — the zustand stores.
6. **UI** — `AppShell` (top bar + floating pill nav) → `DiscoverClient` + tiles + rails → `FeedClient` + `FilterBar` + card + detail + media → For You / Saved / Notifications / Profile / Onboarding → command palette + toaster.
7. **Verify** — `tsc --noEmit` clean, `next lint` 0/0, `next build` clean; hit `/api/opportunities` to confirm sources are live; click the whole flow.

---

## 13. Acceptance criteria

- Opens directly to a **Discover home** (hero + 4 category tiles + 3 rails). No landing gate.
- Tapping a tile opens `/c/{category}` with **filters collapsed by default** and **per-category tag filters** when expanded.
- Cards show **real banners/logos** (with graceful fallback), a deadline countdown, a match %, and "why matched" chips.
- Detail deep-links out to the source; Save feeds the nudge timeline; .ics/Google calendar work; web-push "test nudge" fires a real OS notification on localhost.
- `/for-you` shows eligibility-filtered, match-ranked rails; personalisation is optional and editable in `/profile` (live re-rank).
- Distinctive, **light** design: authored cyan-teal oklch brand, Bricolage display headings, blur on one layer only, **no radar/scope/Sparkles iconography**, target/aim logo, floating pill bottom nav.
- `tsc`/`lint`/`build` all clean; the app runs with **no keys and no DB**.

---

## 14. Hard-won gotchas (don't relearn these)
- Clearbit logos are **dead** → use DuckDuckGo → favicon → initials.
- Round computed SVG geometry, or avoid it → otherwise **hydration mismatch**.
- Delete `.next/` if edited **adapter/registry** modules seem stale in dev.
- Don't call `Date.now()` in render; use lazy `useState` init. Use `useSyncExternalStore` / deferred reads for browser-API-on-mount.
- Keep **blur to one layer**; keep the **brand off default Tailwind blue** (use oklch); give headings a **real display font** — these three are the difference between "authored" and "AI-template".
- Env-gate optional key sources so they self-activate when keys appear.
- Aggregate with `Promise.allSettled` and always keep the last good snapshot — live sources fail intermittently.

---

*End of brief. Build it in this order and hold the golden rules.*
