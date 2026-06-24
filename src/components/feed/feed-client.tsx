"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal, Inbox, X } from "lucide-react";
import type { Opportunity, Category } from "@/lib/types";
import { CATEGORY_META } from "@/components/category-meta";
import { OpportunityCard } from "@/components/feed/opportunity-card";
import { useCollectionsStore } from "@/store/collections";

interface Props {
  category: Category;
  opportunities: Opportunity[];
}

type SortMode = "closing" | "newest" | "popular";
type DeadlineWindow = "all" | "24h" | "3d" | "7d" | "30d";

export function FeedClient({ category, opportunities }: Props) {
  const { saved, toggleSave } = useCollectionsStore();
  const meta = CATEGORY_META[category];
  const CatIcon = meta.icon;

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("closing");
  const [deadlineWindow, setDeadlineWindow] = useState<DeadlineWindow>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Compute top tags from this category's opportunities
  const topTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    for (const o of opportunities) {
      for (const t of o.tags) {
        tagCounts[t] = (tagCounts[t] ?? 0) + 1;
      }
    }
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [opportunities]);

  const filtered = useMemo(() => {
    let result = opportunities.filter(
      (o) => o.category === category && o.deadline && new Date(o.deadline).getTime() > Date.now()
    );

    // Search
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          (o.organization ?? "").toLowerCase().includes(q) ||
          o.tags.some((t) => t.includes(q))
      );
    }

    // Deadline window
    if (deadlineWindow !== "all") {
      const windowMs: Record<string, number> = {
        "24h": 86400000,
        "3d": 3 * 86400000,
        "7d": 7 * 86400000,
        "30d": 30 * 86400000,
      };
      const maxMs = windowMs[deadlineWindow];
      result = result.filter(
        (o) => o.deadline && new Date(o.deadline).getTime() - Date.now() < maxMs
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      result = result.filter((o) =>
        selectedTags.some((t) => o.tags.includes(t))
      );
    }

    // Sort
    if (sort === "closing") {
      result.sort(
        (a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
      );
    } else if (sort === "newest") {
      result.sort(
        (a, b) => new Date(b.postedAt ?? 0).getTime() - new Date(a.postedAt ?? 0).getTime()
      );
    } else {
      result.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    }

    return result;
  }, [opportunities, category, query, sort, deadlineWindow, selectedTags]);

  const handleOpen = (id: string) => {
    window.location.href = `/opportunity/${id}`;
  };

  const activeFilterCount =
    (deadlineWindow !== "all" ? 1 : 0) + selectedTags.length;

  return (
    <div className="py-4 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/feed"
          className="w-9 h-9 rounded-full flex items-center justify-center border border-line hover:bg-base transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-ink-2" />
        </Link>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: meta.bgHex }}
        >
          <CatIcon className="w-5 h-5" style={{ color: meta.hex }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">{meta.labelPlural}</h1>
          <p className="text-xs text-ink-3 tabular-nums">{filtered.length} live</p>
        </div>
      </div>

      {/* Search + Sort + Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-control)] bg-base border border-line">
            <Search className="w-4 h-4 text-ink-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${meta.labelPlural.toLowerCase()}...`}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-3 text-ink"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="px-3 py-2.5 rounded-[var(--radius-control)] bg-base border border-line text-xs font-medium text-ink-2 outline-none cursor-pointer"
          >
            <option value="closing">Closing first</option>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </select>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative px-3 py-2.5 rounded-[var(--radius-control)] bg-base border border-line text-ink-2 hover:bg-surface transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-signal-500 text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips (when collapsed) */}
        {!showFilters && activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {deadlineWindow !== "all" && (
              <FilterChip
                label={`Deadline: ${deadlineWindow}`}
                onRemove={() => setDeadlineWindow("all")}
              />
            )}
            {selectedTags.map((t) => (
              <FilterChip
                key={t}
                label={t}
                onRemove={() => setSelectedTags((tags) => tags.filter((x) => x !== t))}
              />
            ))}
            <button
              onClick={() => { setDeadlineWindow("all"); setSelectedTags([]); }}
              className="text-xs font-medium text-signal-600 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Expanded Filters panel */}
        {showFilters && (
          <div className="panel p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-2">
                Deadline
              </h4>
              <div className="flex flex-wrap gap-2">
                {(["all", "24h", "3d", "7d", "30d"] as DeadlineWindow[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setDeadlineWindow(w)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      deadlineWindow === w
                        ? "bg-signal-500 text-white border-transparent"
                        : "bg-surface border-line text-ink-2 hover:bg-base"
                    }`}
                  >
                    {w === "all" ? "Any" : w}
                  </button>
                ))}
              </div>
            </div>

            {topTags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-2">
                  Skills & themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTags((tags) =>
                          tags.includes(tag)
                            ? tags.filter((t) => t !== tag)
                            : [...tags, tag]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-signal-500 text-white border-transparent"
                          : "bg-surface border-line text-ink-2 hover:bg-base"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-base flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-ink-3" />
          </div>
          <h3 className="text-base font-bold text-ink mb-1">No opportunities found</h3>
          <p className="text-sm text-ink-3 max-w-xs">
            Try adjusting your filters or search for something else.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((opp) => (
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
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-signal-50 text-signal-600">
      {label}
      <button onClick={onRemove} className="hover:text-signal-700">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
