// ── Category metadata: icons, colors, labels ──
// Used across the UI for consistent category representation.

import {
  Briefcase,
  GraduationCap,
  Trophy,
  Code2,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types";

export interface CategoryMeta {
  label: string;
  labelPlural: string;
  icon: LucideIcon;
  /** CSS color value (oklch) */
  colorVar: string;
  /** Hex fallback for inline styles */
  hex: string;
  /** Light bg hex */
  bgHex: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  internship: {
    label: "Internship",
    labelPlural: "Internships",
    icon: Briefcase,
    colorVar: "var(--color-cat-internship)",
    hex: "#4B7BE5",
    bgHex: "rgba(75,123,229,0.10)",
  },
  scholarship: {
    label: "Scholarship",
    labelPlural: "Scholarships",
    icon: GraduationCap,
    colorVar: "var(--color-cat-scholarship)",
    hex: "#9B59D0",
    bgHex: "rgba(155,89,208,0.10)",
  },
  competition: {
    label: "Competition",
    labelPlural: "Competitions",
    icon: Trophy,
    colorVar: "var(--color-cat-competition)",
    hex: "#D4940A",
    bgHex: "rgba(212,148,10,0.10)",
  },
  hackathon: {
    label: "Hackathon",
    labelPlural: "Hackathons",
    icon: Code2,
    colorVar: "var(--color-cat-hackathon)",
    hex: "#2BA8A0",
    bgHex: "rgba(43,168,160,0.10)",
  },
};

export const ALL_CATEGORIES: Category[] = [
  "internship",
  "scholarship",
  "competition",
  "hackathon",
];
