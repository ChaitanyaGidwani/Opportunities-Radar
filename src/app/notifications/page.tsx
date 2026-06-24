"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, Clock, ChevronRight } from "lucide-react";
import { SEED_OPPORTUNITIES } from "@/lib/seed-data";
import { useCollectionsStore } from "@/store/collections";
import { CATEGORY_META } from "@/components/category-meta";
import { getTimeLeft, urgencyStyles } from "@/components/utils";

export default function NotificationsPage() {
  const { saved } = useCollectionsStore();

  // Build nudge timeline from all opps with deadlines
  const timeline = [...SEED_OPPORTUNITIES]
    .filter((o) => o.deadline && new Date(o.deadline).getTime() > Date.now())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 10);

  return (
    <div className="py-6 px-4 md:px-6">
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-1">
        Deadline nudges
      </h1>
      <p className="text-sm text-ink-2 mb-6">
        Upcoming deadlines and notification preferences.
      </p>

      {/* Timeline */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-signal-600" />
          <h2 className="text-base font-bold text-ink">Upcoming deadlines</h2>
        </div>

        <div className="space-y-2">
          {timeline.map((opp) => {
            const tl = getTimeLeft(opp.deadline);
            const us = urgencyStyles(tl.urgency);
            const cat = CATEGORY_META[opp.category];
            const CatIcon = cat.icon;
            const isSaved = saved.includes(opp.id);

            return (
              <div
                key={opp.id}
                className="panel flex items-stretch overflow-hidden"
              >
                <div className="w-1.5 shrink-0" style={{ background: us.color }} />
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: cat.bgHex }}
                  >
                    <CatIcon className="w-4 h-4" style={{ color: cat.hex }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded tabular-nums"
                        style={{ color: us.color, background: us.bg }}
                      >
                        {tl.text}
                      </span>
                      {isSaved && (
                        <span className="text-[10px] font-medium text-signal-600 bg-signal-50 px-1.5 py-0.5 rounded">
                          Saved
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-ink truncate">{opp.title}</h3>
                    <p className="text-[11px] text-ink-3 truncate">
                      {opp.organization ?? opp.sourceLabel}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-3 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Notification preferences */}
      <section>
        <h2 className="text-base font-bold text-ink mb-3">Notify me via</h2>
        <div className="panel divide-y divide-line overflow-hidden">
          <Toggle icon={Bell} label="Push notifications" defaultOn />
          <Toggle icon={Mail} label="Email digests" defaultOn />
          <Toggle icon={Smartphone} label="SMS for 24h deadlines" defaultOn={false} />
        </div>
      </section>
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  defaultOn,
}: {
  icon: typeof Bell;
  label: string;
  defaultOn: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon className="w-4 h-4 text-ink-3" />
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className="w-10 h-6 rounded-full transition-all p-0.5"
        style={{ background: on ? "var(--color-signal-500)" : "var(--c-line)" }}
      >
        <div
          className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
          style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}
