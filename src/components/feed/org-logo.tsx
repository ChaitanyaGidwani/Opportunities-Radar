"use client";

import { useState } from "react";
import { getInitials, initialsHue, logoCandidates } from "@/lib/logo";

interface OrgLogoProps {
  name?: string;
  logoUrl?: string;
  sourceUrl?: string;
  size?: number;
  className?: string;
}

/** Org logo with graceful fallback chain: explicit → DDG → Google favicon → initials */
export function OrgLogo({ name, logoUrl, sourceUrl, size = 36, className = "" }: OrgLogoProps) {
  const candidates = logoCandidates(logoUrl, sourceUrl);
  const [idx, setIdx] = useState(0);

  const showInitials = idx >= candidates.length;
  const initials = getInitials(name);
  const hue = initialsHue(name ?? "?");

  if (showInitials) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg font-bold text-white shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, oklch(0.6 0.14 ${hue}), oklch(0.5 0.12 ${(hue + 30) % 360}))`,
          fontSize: size * 0.38,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={candidates[idx]}
      alt={name ?? "Logo"}
      width={size}
      height={size}
      className={`rounded-lg object-contain shrink-0 bg-white ${className}`}
      style={{ width: size, height: size }}
      onError={() => setIdx(idx + 1)}
    />
  );
}
