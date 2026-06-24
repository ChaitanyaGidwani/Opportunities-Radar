"use client";

import { Bookmark, Clock } from "lucide-react";
import type { Opportunity } from "@/lib/types";
import { CATEGORY_META } from "@/components/category-meta";
import { getTimeLeft, urgencyStyles, formatValue } from "@/components/utils";
import { OrgLogo } from "@/components/feed/org-logo";

interface Props {
  opp: Opportunity;
  saved: boolean;
  onSave: (id: string) => void;
  onOpen: (id: string) => void;
}

export function OpportunityCard({ opp, saved, onSave, onOpen }: Props) {
  const cat = CATEGORY_META[opp.category];
  const CatIcon = cat.icon;
  const tl = getTimeLeft(opp.deadline);
  const us = urgencyStyles(tl.urgency);
  const value = formatValue(opp);

  return (
    <div
      id={`card-${opp.id}`}
      onClick={() => onOpen(opp.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(opp.id); }}
      className="panel panel-hover group w-full text-left flex flex-col cursor-pointer"
    >
      {/* Banner area */}
      <div
        className="relative h-[104px] overflow-hidden"
        style={{
          borderRadius: "var(--radius-card) var(--radius-card) 0 0",
          background: `linear-gradient(135deg, ${cat.hex}33, ${cat.hex}11)`,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
        }}
      >
        {/* Category chip */}
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md text-white z-10 backdrop-blur-md"
          style={{ background: `${cat.hex}99`, boxShadow: `0 0 12px ${cat.hex}44` }}
        >
          <CatIcon className="w-3 h-3" />
          {cat.label}
        </span>

        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave(opp.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors backdrop-blur-md"
          style={{
            background: saved ? "var(--color-signal-500)" : "rgba(0, 0, 0, 0.4)",
            border: saved ? "none" : "1px solid rgba(255, 255, 255, 0.15)"
          }}
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Bookmark
            className="w-4 h-4 transition-colors"
            style={{
              color: saved ? "white" : "rgba(255, 255, 255, 0.7)",
              fill: saved ? "white" : "transparent",
            }}
          />
        </button>

        {/* Watermark icon */}
        <CatIcon
          className="absolute -bottom-3 -right-3 w-24 h-24 opacity-[0.15]"
          strokeWidth={1}
        />

        {/* Overlapping org logo */}
        <div className="absolute -bottom-4 left-4 z-10 rounded-lg shadow-lg" style={{ background: '#111', padding: '2px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <OrgLogo
            name={opp.organization}
            logoUrl={opp.logoUrl}
            sourceUrl={opp.sourceUrl}
            size={36}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 pb-4 flex flex-col gap-2 flex-1">
        {/* Org name */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink-2 truncate">
            {opp.organization ?? opp.sourceLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2">
          {opp.title}
        </h3>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md tabular-nums"
            style={{ color: us.color, background: us.bg }}
          >
            <Clock className="w-3 h-3" />
            {tl.text}
          </span>

          {value && (
            <span className="text-xs font-bold" style={{ color: cat.hex }}>
              {value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
