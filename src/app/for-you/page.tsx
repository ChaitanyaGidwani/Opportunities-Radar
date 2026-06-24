"use client";

import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { SEED_OPPORTUNITIES } from "@/lib/seed-data";
import { useCollectionsStore } from "@/store/collections";
import { useProfileStore } from "@/store/profile";
import { OpportunityCard } from "@/components/feed/opportunity-card";
import { CATEGORY_META, ALL_CATEGORIES } from "@/components/category-meta";
import type { Opportunity, Category } from "@/lib/types";

export default function ForYouPage() {
  const { saved, toggleSave } = useCollectionsStore();
  const profile = useProfileStore();

  const handleOpen = (id: string) => {
    window.location.href = `/opportunity/${id}`;
  };

  // If not onboarded, show a personalisation prompt
  if (!profile.onboarded) {
    return (
      <div className="py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-signal-50 flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-signal-500" />
        </div>
        <h1 className="text-xl font-bold text-ink mb-2">Personalise your feed</h1>
        <p className="text-sm text-ink-2 mb-6 max-w-xs mx-auto">
          Complete your profile to get opportunities matched to your interests and skills.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex px-6 py-3 rounded-[var(--radius-control)] font-semibold text-sm"
          style={{ background: "var(--color-signal-500)", color: "#042522" }}
        >
          Get started
        </Link>
      </div>
    );
  }

  // Filter to interested categories and sort by popularity (proxy for match score)
  const interested = profile.interests.length > 0 ? profile.interests : ALL_CATEGORIES;
  const eligible = SEED_OPPORTUNITIES.filter(
    (o) => interested.includes(o.category) && o.deadline && new Date(o.deadline).getTime() > Date.now()
  );

  // Per-category rails
  const rails: { category: Category; items: Opportunity[] }[] = [];
  for (const cat of interested) {
    const items = eligible
      .filter((o) => o.category === cat)
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 8);
    if (items.length > 0) {
      rails.push({ category: cat, items });
    }
  }

  // Top matches overall
  const topMatches = [...eligible]
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 8);

  return (
    <div className="py-6 px-4 md:px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-1">
          For you
        </h1>
        <p className="text-sm text-ink-2">
          Opportunities matched to your profile.
        </p>
      </div>

      {/* Top matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-signal-500" />
            <h2 className="text-lg font-bold text-ink">Top matches</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topMatches.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              saved={saved.includes(opp.id)}
              onSave={toggleSave}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </section>

      {/* Per-category rails */}
      {rails.map(({ category, items }) => {
        const meta = CATEGORY_META[category];
        return (
          <section key={category}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: meta.hex }} />
                <h2 className="text-lg font-bold text-ink">{meta.labelPlural}</h2>
              </div>
              <Link
                href={`/c/${category}`}
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: meta.hex }}
              >
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
              {items.map((opp) => (
                <div key={opp.id} className="shrink-0 w-[260px] md:w-[280px] snap-start">
                  <OpportunityCard
                    opp={opp}
                    saved={saved.includes(opp.id)}
                    onSave={toggleSave}
                    onOpen={handleOpen}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
