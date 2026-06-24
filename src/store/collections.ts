"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CollectionsState {
  saved: string[];
  applied: string[];
}

interface CollectionsActions {
  toggleSave: (id: string) => void;
  markApplied: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useCollectionsStore = create<
  CollectionsState & CollectionsActions
>()(
  persist(
    (set, get) => ({
      saved: [],
      applied: [],
      toggleSave: (id) =>
        set((s) => ({
          saved: s.saved.includes(id)
            ? s.saved.filter((x) => x !== id)
            : [...s.saved, id],
        })),
      markApplied: (id) =>
        set((s) => ({
          applied: s.applied.includes(id) ? s.applied : [...s.applied, id],
        })),
      isSaved: (id) => get().saved.includes(id),
    }),
    { name: "argus-collections" }
  )
);
