import { notFound } from "next/navigation";
import type { Category } from "@/lib/types";
import { SEED_OPPORTUNITIES } from "@/lib/seed-data";
import { FeedClient } from "@/components/feed/feed-client";

const VALID_CATEGORIES: Category[] = ["internship", "scholarship", "competition", "hackathon"];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const cat = category as Category;
  const opportunities = SEED_OPPORTUNITIES;

  return <FeedClient category={cat} opportunities={opportunities} />;
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: c }));
}
