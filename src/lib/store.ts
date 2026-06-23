// ── File-based cache for the server-side corpus ──
// Runs with zero API keys / no database by default.
// Persists to .cache/corpus.json.

import "server-only";
import * as fs from "node:fs";
import * as path from "node:path";
import type { Corpus } from "./types";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CORPUS_PATH = path.join(CACHE_DIR, "corpus.json");
const VAPID_PATH = path.join(CACHE_DIR, "vapid.json");
const SUBS_PATH = path.join(CACHE_DIR, "subscriptions.json");
const STALE_MS = 30 * 60 * 1000; // 30 minutes

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// ── Corpus cache ──

/** In-memory corpus snapshot */
let memoryCorpus: Corpus | null = null;

/** Read corpus from disk */
export function readCorpusFromDisk(): Corpus | null {
  try {
    if (fs.existsSync(CORPUS_PATH)) {
      const raw = fs.readFileSync(CORPUS_PATH, "utf-8");
      return JSON.parse(raw) as Corpus;
    }
  } catch (e) {
    console.warn("[store] Failed to read corpus from disk:", e);
  }
  return null;
}

/** Write corpus to disk + memory */
export function writeCorpus(corpus: Corpus): void {
  ensureCacheDir();
  memoryCorpus = corpus;
  try {
    fs.writeFileSync(CORPUS_PATH, JSON.stringify(corpus), "utf-8");
  } catch (e) {
    console.warn("[store] Failed to write corpus to disk:", e);
  }
}

/** Get the in-memory corpus (or load from disk) */
export function getMemoryCorpus(): Corpus | null {
  if (memoryCorpus) return memoryCorpus;
  memoryCorpus = readCorpusFromDisk();
  return memoryCorpus;
}

/** Check if the corpus is stale (older than 30 min) */
export function isCorpusStale(corpus: Corpus | null): boolean {
  if (!corpus) return true;
  const age = Date.now() - new Date(corpus.updatedAt).getTime();
  return age > STALE_MS;
}

// ── VAPID keys (auto-generated for web push) ──

export interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

export function readVapidKeys(): VapidKeys | null {
  try {
    if (fs.existsSync(VAPID_PATH)) {
      return JSON.parse(fs.readFileSync(VAPID_PATH, "utf-8")) as VapidKeys;
    }
  } catch {
    // ignore
  }
  return null;
}

export function writeVapidKeys(keys: VapidKeys): void {
  ensureCacheDir();
  fs.writeFileSync(VAPID_PATH, JSON.stringify(keys, null, 2), "utf-8");
}

// ── Push subscriptions ──

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export function readSubscriptions(): PushSubscriptionRecord[] {
  try {
    if (fs.existsSync(SUBS_PATH)) {
      return JSON.parse(fs.readFileSync(SUBS_PATH, "utf-8")) as PushSubscriptionRecord[];
    }
  } catch {
    // ignore
  }
  return [];
}

export function writeSubscriptions(subs: PushSubscriptionRecord[]): void {
  ensureCacheDir();
  fs.writeFileSync(SUBS_PATH, JSON.stringify(subs, null, 2), "utf-8");
}

export function addSubscription(sub: PushSubscriptionRecord): void {
  const subs = readSubscriptions();
  // Dedupe by endpoint
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push(sub);
    writeSubscriptions(subs);
  }
}
