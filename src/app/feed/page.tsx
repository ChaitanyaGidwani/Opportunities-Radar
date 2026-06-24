import { SEED_OPPORTUNITIES } from "@/lib/seed-data";
import { DiscoverClient } from "@/components/discover/discover-client";

export default function FeedPage() {
  // In production, this would fetch from the corpus API.
  // For now, use seed data directly.
  const opportunities = SEED_OPPORTUNITIES;

  return <DiscoverClient opportunities={opportunities} />;
}
