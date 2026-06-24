"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Clock,
  MapPin,
  Banknote,
  Users,
  CalendarCheck,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { SEED_OPPORTUNITIES } from "@/lib/seed-data";
import { CATEGORY_META } from "@/components/category-meta";
import { getTimeLeft, urgencyStyles, formatValue } from "@/components/utils";
import { OrgLogo } from "@/components/feed/org-logo";
import { useCollectionsStore } from "@/store/collections";

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = params.id;
  const id = decodeURIComponent(rawId);

  const { saved, toggleSave, applied, markApplied } = useCollectionsStore();
  const isSaved = saved.includes(id);
  const isApplied = applied.includes(id);

  const opp = useMemo(
    () => SEED_OPPORTUNITIES.find((o) => o.id === id),
    [id]
  );

  if (!opp) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-ink mb-2">Opportunity not found</h1>
        <p className="text-sm text-ink-2 mb-6 max-w-xs">
          This opportunity may have expired or the link may be broken.
        </p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-control)] font-semibold text-sm"
          style={{ background: "var(--color-signal-500)", color: "#042522" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>
      </div>
    );
  }

  const cat = CATEGORY_META[opp.category];
  const CatIcon = cat.icon;
  const tl = getTimeLeft(opp.deadline);
  const us = urgencyStyles(tl.urgency);
  const value = formatValue(opp);

  // Format deadline date
  const deadlineDate = opp.deadline
    ? new Date(opp.deadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="py-4 px-4 md:px-6 max-w-3xl mx-auto">
      {/* Nav */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/feed"
          className="w-9 h-9 rounded-full flex items-center justify-center border border-line hover:bg-base transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-ink-2" />
        </Link>
        <span className="flex-1" />
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: opp.title, url: opp.sourceUrl ?? window.location.href });
            } else {
              navigator.clipboard.writeText(opp.sourceUrl ?? window.location.href);
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-line hover:bg-base transition-colors"
        >
          <Share2 className="w-4 h-4 text-ink-2" />
        </button>
        <button
          onClick={() => toggleSave(id)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isSaved ? "var(--color-signal-500)" : "transparent",
            border: isSaved ? "none" : "1px solid var(--c-line)",
          }}
        >
          <Bookmark
            className="w-4 h-4"
            style={{
              color: isSaved ? "white" : "var(--c-ink-3)",
              fill: isSaved ? "white" : "transparent",
            }}
          />
        </button>
      </div>

      {/* Header banner */}
      <div
        className="relative rounded-[var(--radius-card)] overflow-hidden p-6 md:p-8 mb-6"
        style={{
          background: `linear-gradient(135deg, ${cat.hex}18, ${cat.hex}06)`,
        }}
      >
        <div className="flex items-start gap-4">
          <div className="ring-2 ring-white rounded-xl shadow-sm">
            <OrgLogo
              name={opp.organization}
              logoUrl={opp.logoUrl}
              sourceUrl={opp.sourceUrl}
              size={56}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md text-white mb-2"
              style={{ background: cat.hex }}
            >
              <CatIcon className="w-3 h-3" />
              {cat.label}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-ink leading-tight mb-1">
              {opp.title}
            </h1>
            <p className="text-sm text-ink-2 font-medium">
              {opp.organization ?? opp.sourceLabel}
            </p>
          </div>
        </div>

        {/* Watermark */}
        <CatIcon
          className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.04]"
          strokeWidth={1}
        />
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatBox
          icon={Clock}
          label="Deadline"
          value={tl.text}
          sub={deadlineDate}
          valueStyle={{ color: us.color }}
        />
        {value && (
          <StatBox
            icon={Banknote}
            label="Value"
            value={value}
            valueStyle={{ color: cat.hex }}
          />
        )}
        {opp.location && (
          <StatBox
            icon={MapPin}
            label="Location"
            value={opp.location}
            sub={opp.isRemote ? "Remote allowed" : undefined}
          />
        )}
        {opp.popularity && (
          <StatBox
            icon={Users}
            label="Interest"
            value={`${(opp.popularity / 1000).toFixed(1)}K`}
            sub="applicants"
          />
        )}
      </div>

      {/* Description */}
      <section className="panel p-5 md:p-6 mb-4">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">
          About
        </h2>
        <p className="text-sm text-ink-2 leading-relaxed">
          {opp.summary}
        </p>
      </section>

      {/* Tags / Skills */}
      {opp.tags.length > 0 && (
        <section className="panel p-5 md:p-6 mb-4">
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">
            Skills & themes
          </h2>
          <div className="flex flex-wrap gap-2">
            {opp.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-[var(--radius-control)] bg-base border border-line text-ink-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Eligibility */}
      {opp.eligibility && (
        <section className="panel p-5 md:p-6 mb-4">
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">
            Eligibility
          </h2>
          <div className="space-y-2 text-sm text-ink-2">
            {opp.eligibility.branches && (
              <p>
                <span className="text-ink-3">Branches:</span>{" "}
                {opp.eligibility.branches
                  .map((b) => b.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
                  .join(", ")}
              </p>
            )}
            {opp.eligibility.years && (
              <p>
                <span className="text-ink-3">Graduation years:</span>{" "}
                {opp.eligibility.years.join(", ")}
              </p>
            )}
            {opp.eligibility.citizenship && (
              <p>
                <span className="text-ink-3">Citizenship:</span>{" "}
                {opp.eligibility.citizenship === "IN" ? "India 🇮🇳" : opp.eligibility.citizenship}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-8">
        {opp.sourceUrl && (
          <a
            href={opp.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-control)] font-bold text-sm transition-colors"
            style={{ background: "var(--color-signal-500)", color: "#042522" }}
          >
            <ExternalLink className="w-4 h-4" />
            Apply now
          </a>
        )}
        <button
          onClick={() => markApplied(id)}
          disabled={isApplied}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-control)] font-semibold text-sm border border-line transition-colors disabled:opacity-60"
          style={{
            background: isApplied ? "var(--color-success-bg, rgba(50,160,100,0.08))" : "transparent",
            color: isApplied ? "var(--color-success)" : "var(--c-ink-2)",
          }}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Applied
            </>
          ) : (
            <>
              <CalendarCheck className="w-4 h-4" /> Mark as applied
            </>
          )}
        </button>
      </div>

      {/* Source info */}
      <div className="text-center mb-6">
        <p className="text-[11px] text-ink-3">
          Source: {opp.sourceLabel} · Last verified:{" "}
          {opp.lastVerified
            ? new Date(opp.lastVerified).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </p>
      </div>
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  sub,
  valueStyle,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  sub?: string | null;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="panel p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-ink-3" />
        <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold" style={valueStyle}>
        {value}
      </span>
      {sub && <span className="text-[11px] text-ink-3">{sub}</span>}
    </div>
  );
}
