"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, LogOut, BadgeCheck, Bookmark, Star, Edit3 } from "lucide-react";
import { useProfileStore } from "@/store/profile";
import { useCollectionsStore } from "@/store/collections";
import { CATEGORY_META } from "@/components/category-meta";

export default function ProfilePage() {
  const profile = useProfileStore();
  const { saved, applied } = useCollectionsStore();

  if (!profile.onboarded) {
    return (
      <div className="py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-signal-50 flex items-center justify-center mx-auto mb-4">
          <BadgeCheck className="w-8 h-8 text-signal-500" />
        </div>
        <h1 className="text-xl font-bold text-ink mb-2">Personalise your feed</h1>
        <p className="text-sm text-ink-2 mb-6 max-w-xs mx-auto">
          Set up your profile to get better recommendations, match scores, and deadline nudges.
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

  const branchDisplay = profile.branch
    ? profile.branch.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  return (
    <div className="py-6 px-4 md:px-6">
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-6">Profile</h1>

      {/* Profile card */}
      <div className="panel p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-signal-50 flex items-center justify-center text-xl font-bold text-signal-600 shrink-0">
            {branchDisplay[0] ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-ink">Student</h2>
            <p className="text-sm text-ink-2">
              Class of {profile.year} · {branchDisplay}
            </p>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {profile.interests.map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    background: CATEGORY_META[c].bgHex,
                    color: CATEGORY_META[c].hex,
                  }}
                >
                  {CATEGORY_META[c].labelPlural}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/onboarding"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-line hover:bg-base transition-colors shrink-0"
          >
            <Edit3 className="w-4 h-4 text-ink-2" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          icon={Bookmark}
          label="Saved"
          value={saved.length}
          color="var(--color-signal-500)"
        />
        <StatCard
          icon={Star}
          label="Applied"
          value={applied.length}
          color="var(--color-cat-scholarship)"
        />
        <StatCard
          icon={BadgeCheck}
          label="Skills"
          value={profile.skills.length}
          color="var(--color-success)"
        />
      </div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="panel p-5 mb-6">
          <h3 className="text-sm font-bold text-ink mb-3">Your skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="text-xs font-medium px-2.5 py-1 rounded-[var(--radius-control)] bg-base border border-line text-ink-2"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="panel divide-y divide-line overflow-hidden">
        <ProfileRow icon={Settings} label="Settings" />
        <ProfileRow icon={LogOut} label="Sign out" danger />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Bookmark;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="panel flex flex-col items-center justify-center py-5">
      <Icon className="w-5 h-5 mb-2" style={{ color }} />
      <div className="text-xl font-bold text-ink tabular-nums">{value}</div>
      <div className="text-[11px] font-medium text-ink-3">{label}</div>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  danger,
}: {
  icon: typeof Settings;
  label: string;
  danger?: boolean;
}) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-base transition-colors">
      <Icon
        className="w-4 h-4"
        style={{ color: danger ? "var(--color-danger)" : "var(--c-ink-3)" }}
      />
      <span
        className="flex-1 text-sm font-medium"
        style={{ color: danger ? "var(--color-danger)" : undefined }}
      >
        {label}
      </span>
    </button>
  );
}
