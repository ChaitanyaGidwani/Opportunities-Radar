"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { CATEGORY_META, ALL_CATEGORIES } from "@/components/category-meta";
import { BrandMark } from "@/components/brand/mark";
import { useProfileStore } from "@/store/profile";

const YEARS = [2024, 2025, 2026, 2027, 2028];
const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
  "Biotechnology",
  "Mathematics",
  "Physics",
  "Commerce",
  "Arts",
  "Design",
];

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [year, setYear] = useState(2026);
  const [branch, setBranch] = useState("");
  const [interests, setInterests] = useState<Category[]>([]);
  const [skills, setSkills] = useState("");

  const toggleInterest = (c: Category) =>
    setInterests((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const canNext = [
    branch.length > 0,
    interests.length > 0,
    true,
  ][step];

  const handleComplete = () => {
    completeOnboarding({
      branch: branch.toLowerCase().replace(/\s+/g, "-"),
      year,
      interests,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    router.push("/feed");
  };

  return (
    <div className="min-h-dvh bg-base flex flex-col items-center justify-start px-4 py-12 md:py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <BrandMark size={48} />
          <h1 className="text-2xl font-extrabold text-ink mt-4 tracking-tight">
            Get started
          </h1>
          <p className="text-sm text-ink-2 mt-1 text-center max-w-xs">
            Set up your profile to get personalised recommendations and deadline nudges.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === step ? 32 : 12,
                background: i <= step ? "var(--color-signal-500)" : "var(--c-line)",
              }}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="panel p-6">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-ink">Your basics</h2>

              <div>
                <label className="text-sm font-semibold text-ink block mb-2">
                  Graduation Year
                </label>
                <div className="flex gap-2 flex-wrap">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      onClick={() => setYear(y)}
                      className={`px-4 py-2 rounded-[var(--radius-control)] text-sm font-medium border transition-colors ${
                        year === y
                          ? "bg-signal-500 text-white border-transparent"
                          : "bg-surface border-line text-ink-2 hover:bg-base"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ink block mb-2">
                  Major / Branch
                </label>
                <div className="flex flex-wrap gap-2">
                  {BRANCHES.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBranch(b)}
                      className={`px-3 py-2 rounded-[var(--radius-control)] text-xs font-medium border transition-colors ${
                        branch === b
                          ? "bg-signal-500 text-white border-transparent"
                          : "bg-surface border-line text-ink-2 hover:bg-base"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-ink">What interests you?</h2>
              <p className="text-sm text-ink-2">
                Select the opportunity types you&apos;d like to see.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ALL_CATEGORIES.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  const CatIcon = meta.icon;
                  const isSel = interests.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleInterest(cat)}
                      className={`relative p-5 rounded-[var(--radius-card)] flex flex-col items-center gap-3 border transition-all ${
                        isSel
                          ? "border-signal-500 bg-signal-50"
                          : "border-line bg-surface hover:border-signal-300"
                      }`}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ background: meta.bgHex }}
                      >
                        <CatIcon className="w-5 h-5" style={{ color: meta.hex }} />
                      </div>
                      <span className="text-sm font-semibold text-ink">
                        {meta.labelPlural}
                      </span>
                      {isSel && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-signal-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-ink">Your skills</h2>
              <p className="text-sm text-ink-2">
                Add a few skills to improve matching (comma separated).
              </p>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, React, Machine Learning, UI Design"
                rows={4}
                className="w-full p-3 rounded-[var(--radius-control)] bg-base border border-line text-sm text-ink placeholder:text-ink-3 outline-none focus:border-signal-500 focus:ring-1 focus:ring-signal-500 resize-none"
              />

              {/* Live preview */}
              <div className="rounded-[var(--radius-card)] bg-signal-50 p-4">
                <h4 className="text-xs font-semibold text-signal-600 uppercase tracking-wider mb-2">
                  Your profile
                </h4>
                <div className="text-sm text-ink space-y-1">
                  <p>
                    <span className="text-ink-3">Year:</span>{" "}
                    <span className="font-medium">{year}</span>
                  </p>
                  <p>
                    <span className="text-ink-3">Branch:</span>{" "}
                    <span className="font-medium">{branch || "—"}</span>
                  </p>
                  <p>
                    <span className="text-ink-3">Interests:</span>{" "}
                    <span className="font-medium">
                      {interests.map((i) => CATEGORY_META[i].labelPlural).join(", ") || "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-[var(--radius-control)] font-semibold text-sm border border-line text-ink-2 hover:bg-base transition-colors"
            >
              Back
            </button>
          )}
          <button
            disabled={!canNext}
            onClick={() => (step < 2 ? setStep(step + 1) : handleComplete())}
            className="flex-1 py-3 rounded-[var(--radius-control)] font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-signal-500)",
              color: "#042522",
            }}
          >
            {step < 2 ? "Continue" : "View My Feed"}
          </button>
        </div>
      </div>
    </div>
  );
}
