"use client";

// ── Brand mark: teal tile + aim arrow (NO radar/scope icons) ──

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--color-signal-500)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {/* Upward aim/dart arrow SVG */}
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </div>
  );
}

export function Wordmark() {
  return (
    <span
      className="font-bold tracking-tight text-lg"
      style={{ fontFamily: "var(--font-display)", color: "var(--c-ink)" }}
    >
      Argus
    </span>
  );
}
