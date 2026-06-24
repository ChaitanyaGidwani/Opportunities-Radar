"use client";

import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";
import type { Opportunity, Category } from "@/lib/types";
import { CATEGORY_META, ALL_CATEGORIES } from "@/components/category-meta";
import { OpportunityCard } from "@/components/feed/opportunity-card";
import { useCollectionsStore } from "@/store/collections";

interface Props {
  opportunities: Opportunity[];
}

export function DiscoverClient({ opportunities }: Props) {
  const { saved, toggleSave } = useCollectionsStore();

  // Compute stats
  const totalLive = opportunities.length;
  const closingThisWeek = opportunities.filter((o) => {
    if (!o.deadline) return false;
    const ms = new Date(o.deadline).getTime() - Date.now();
    return ms > 0 && ms < 7 * 86400000;
  }).length;

  // Category tile counts
  const categoryCounts: Record<Category, number> = {
    internship: 0, scholarship: 0, competition: 0, hackathon: 0,
  };
  for (const o of opportunities) categoryCounts[o.category]++;

  // Rails
  const closingSoon = [...opportunities]
    .filter((o) => o.deadline && new Date(o.deadline).getTime() > Date.now())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 8);

  const freshThisWeek = [...opportunities]
    .filter((o) => o.postedAt && Date.now() - new Date(o.postedAt).getTime() < 7 * 86400000)
    .sort((a, b) => new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime())
    .slice(0, 8);

  const forYou = [...opportunities]
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 8);

  const handleOpen = (id: string) => {
    // For now, scroll to top — detail page will be a modal or separate route
    window.location.href = `/opportunity/${id}`;
  };

  return (
    <div className="flex flex-col gap-8 py-6 px-4 md:px-6">
      {/* ── Hero ── */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Every opportunity,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-signal-500)] to-purple-500">made for you.</span>
        </h1>
        <p className="text-ink-2 text-base md:text-lg flex items-center gap-2 justify-center md:justify-start">
          <Activity className="w-4 h-4 text-signal-500 live-blip drop-shadow-[0_0_8px_var(--color-signal-500)]" />
          <span className="tabular-nums font-medium text-white">{totalLive} live</span>
          <span className="text-ink-3">·</span>
          <span className="tabular-nums font-medium text-white">{closingThisWeek} closing this week</span>
        </p>
      </div>

      {/* ── Category Tiles ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ALL_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const CatIcon = meta.icon;
          const count = categoryCounts[cat];
          return (
            <Link
              key={cat}
              href={`/c/${cat}`}
              className="panel group relative overflow-hidden p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${meta.hex}22, ${meta.hex}08)`,
                backdropFilter: 'blur(24px)',
                border: `1px solid ${meta.hex}33`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 32px ${meta.hex}44, inset 0 1px 0 rgba(255,255,255,0.2), 0 0 0 1px ${meta.hex}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`;
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md"
                style={{ background: `${meta.hex}33`, boxShadow: `inset 0 0 0 1px ${meta.hex}55` }}
              >
                <CatIcon className="w-5 h-5" style={{ color: meta.hex, filter: `drop-shadow(0 0 8px ${meta.hex})` }} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">{meta.labelPlural}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="live-blip"
                    style={{ background: meta.hex, width: 6, height: 6, filter: `drop-shadow(0 0 6px ${meta.hex})` }}
                  />
                  <span className="text-xs font-semibold tabular-nums" style={{ color: meta.hex }}>
                    {count} live
                  </span>
                </div>
              </div>
              {/* Watermark */}
              <CatIcon
                className="absolute -bottom-4 -right-4 w-20 h-20 opacity-[0.2]"
                style={{ color: meta.hex }}
                strokeWidth={1}
              />
            </Link>
          );
        })}
      </div>

      {/* ── Rails ── */}
      <Rail
        title="Closing soon"
        accentColor="var(--color-amber)"
        linkHref="/c/internship"
        linkText="See all"
        opportunities={closingSoon}
        saved={saved}
        onSave={toggleSave}
        onOpen={handleOpen}
      />

      <Rail
        title="For you"
        accentColor="var(--color-signal-500)"
        linkHref="/for-you"
        linkText="See all"
        opportunities={forYou}
        saved={saved}
        onSave={toggleSave}
        onOpen={handleOpen}
      />

      <Rail
        title="Fresh this week"
        accentColor="var(--color-success)"
        linkHref="/feed"
        linkText="See all"
        opportunities={freshThisWeek}
        saved={saved}
        onSave={toggleSave}
        onOpen={handleOpen}
      />
    </div>
  );
}

function Rail({
  title,
  accentColor,
  linkHref,
  linkText,
  opportunities,
  saved,
  onSave,
  onOpen,
}: {
  title: string;
  accentColor: string;
  linkHref: string;
  linkText: string;
  opportunities: Opportunity[];
  saved: string[];
  onSave: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  if (opportunities.length === 0) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: accentColor }} />
          <h2 className="text-lg font-bold text-ink">{title}</h2>
        </div>
        <Link
          href={linkHref}
          className="text-sm font-semibold flex items-center gap-1 transition-colors"
          style={{ color: accentColor }}
        >
          {linkText} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
        {opportunities.map((opp) => (
          <div key={opp.id} className="shrink-0 w-[260px] md:w-[280px] snap-start">
            <OpportunityCard
              opp={opp}
              saved={saved.includes(opp.id)}
              onSave={onSave}
              onOpen={onOpen}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
