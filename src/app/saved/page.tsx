"use client";

import { Bookmark, Star, ArrowRight, Inbox } from "lucide-react";
import Link from "next/link";
import { SEED_OPPORTUNITIES } from "@/lib/seed-data";
import { useCollectionsStore } from "@/store/collections";
import { OpportunityCard } from "@/components/feed/opportunity-card";

export default function SavedPage() {
  const { saved, applied, toggleSave } = useCollectionsStore();

  const savedOpps = SEED_OPPORTUNITIES.filter((o) => saved.includes(o.id));
  const appliedOpps = SEED_OPPORTUNITIES.filter((o) => applied.includes(o.id));

  const handleOpen = (id: string) => {
    window.location.href = `/opportunity/${id}`;
  };

  return (
    <div className="py-6 px-4 md:px-6">
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-1">
        Saved & tracked
      </h1>
      <p className="text-sm text-ink-2 mb-6">
        Opportunities you&apos;ve bookmarked and applied to.
      </p>

      {/* Saved section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-4 h-4 text-signal-600" />
          <h2 className="text-base font-bold text-ink">
            Saved <span className="text-ink-3 font-normal tabular-nums">({savedOpps.length})</span>
          </h2>
        </div>

        {savedOpps.length === 0 ? (
          <EmptySection
            message="No saved opportunities yet"
            sub="Bookmark opportunities from the feed to track them here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOpps.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                saved={true}
                onSave={toggleSave}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </section>

      {/* Applied section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-signal-600" />
          <h2 className="text-base font-bold text-ink">
            Applied <span className="text-ink-3 font-normal tabular-nums">({appliedOpps.length})</span>
          </h2>
        </div>

        {appliedOpps.length === 0 ? (
          <EmptySection
            message="No applications yet"
            sub="Mark opportunities as 'Applied' to track them here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appliedOpps.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                saved={saved.includes(opp.id)}
                onSave={toggleSave}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptySection({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="panel flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-base flex items-center justify-center mb-3">
        <Inbox className="w-7 h-7 text-ink-3" />
      </div>
      <h3 className="text-sm font-bold text-ink mb-1">{message}</h3>
      <p className="text-xs text-ink-3 max-w-xs">{sub}</p>
      <Link
        href="/feed"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-signal-600 hover:underline"
      >
        Browse opportunities <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
