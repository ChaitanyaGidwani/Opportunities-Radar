// ── Source registry ──
// Auto-registers env-gated sources when their env vars are present.

import "server-only";
import type { SourceAdapter } from "../types";
import { devpostAdapter } from "./devpost";
import { devfolioAdapter } from "./devfolio";
import { unstopAdapter } from "./unstop";
import { mlhAdapter } from "./mlh";
import { codeforcesAdapter } from "./codeforces";
import { codechefAdapter } from "./codechef";
import { greenhouseAdapter } from "./greenhouse";
import { arbeitnowAdapter } from "./arbeitnow";
import { scholarshipsAdapter } from "./scholarships";
import { seedAdapter } from "./seed";
import { adzunaAdapter } from "./adzuna";
import { kaggleAdapter } from "./kaggle";

/** All always-on adapters */
const CORE_ADAPTERS: SourceAdapter[] = [
  devpostAdapter,
  devfolioAdapter,
  unstopAdapter,
  mlhAdapter,
  codeforcesAdapter,
  codechefAdapter,
  greenhouseAdapter,
  arbeitnowAdapter,
  scholarshipsAdapter,
  seedAdapter,
];

/** Env-gated adapters — included only when their keys are present */
const ENV_GATED: { adapter: SourceAdapter; envKeys: string[] }[] = [
  { adapter: adzunaAdapter, envKeys: ["ADZUNA_APP_ID", "ADZUNA_APP_KEY"] },
  { adapter: kaggleAdapter, envKeys: ["KAGGLE_USERNAME", "KAGGLE_KEY"] },
];

/** Build the live adapter list */
export function getAdapters(): SourceAdapter[] {
  const adapters = [...CORE_ADAPTERS];

  for (const { adapter, envKeys } of ENV_GATED) {
    const allPresent = envKeys.every((key) => !!process.env[key]);
    if (allPresent) {
      adapters.push(adapter);
    }
  }

  return adapters;
}

/** Get registry metadata for source health display */
export function getRegistryInfo() {
  const adapters = getAdapters();
  return adapters.map((a) => ({
    ...a.meta,
    active: true,
  }));
}
