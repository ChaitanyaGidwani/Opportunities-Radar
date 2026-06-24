"use client";

// ── Deadline countdown + urgency helpers ──

export function getTimeLeft(deadline: string | undefined): {
  text: string;
  urgency: "critical" | "warning" | "normal" | "none";
  hoursLeft: number;
} {
  if (!deadline) return { text: "No deadline", urgency: "none", hoursLeft: Infinity };

  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return { text: "Closed", urgency: "critical", hoursLeft: 0 };

  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(hours / 24);

  const urgency: "critical" | "warning" | "normal" =
    hours < 24 ? "critical" : hours < 7 * 24 ? "warning" : "normal";

  let text: string;
  if (hours < 1) text = "< 1h left";
  else if (hours < 24) text = `${hours}h left`;
  else if (days < 14) text = `${days}d left`;
  else if (days < 60) text = `${Math.floor(days / 7)}w left`;
  else text = `${Math.floor(days / 30)}mo left`;

  return { text, urgency, hoursLeft: hours };
}

export function urgencyStyles(urgency: "critical" | "warning" | "normal" | "none") {
  switch (urgency) {
    case "critical":
      return { color: "var(--color-danger)", bg: "rgba(196, 58, 58, 0.08)" };
    case "warning":
      return { color: "var(--color-amber)", bg: "rgba(200, 150, 30, 0.08)" };
    case "normal":
      return { color: "var(--color-success)", bg: "rgba(50, 160, 100, 0.08)" };
    default:
      return { color: "var(--c-ink-3)", bg: "transparent" };
  }
}

/** Format a monetary value for display */
export function formatValue(opp: {
  stipendMin?: number;
  stipendMax?: number;
  stipendPeriod?: string;
  awardAmount?: number;
  prizeAmount?: number;
  currency?: string;
}): string | null {
  const cur = opp.currency === "USD" ? "$" : opp.currency === "EUR" ? "€" : "₹";

  if (opp.stipendMin) {
    const min = formatNum(opp.stipendMin);
    const max = opp.stipendMax ? formatNum(opp.stipendMax) : null;
    const period = opp.stipendPeriod === "month" ? "/mo" : opp.stipendPeriod === "year" ? "/yr" : opp.stipendPeriod === "week" ? "/wk" : "";
    return max ? `${cur}${min}–${max}${period}` : `${cur}${min}${period}`;
  }
  if (opp.prizeAmount) return `${cur}${formatNum(opp.prizeAmount)} prize`;
  if (opp.awardAmount) return `${cur}${formatNum(opp.awardAmount)}`;
  return null;
}

function formatNum(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}
