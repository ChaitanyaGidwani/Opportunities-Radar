"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category } from "@/lib/types";

export interface ProfileState {
  branch: string;
  year: number;
  interests: Category[];
  skills: string[];
  cgpa?: number;
  state?: string;
  location?: string;
  onboarded: boolean;
  hydrated: boolean;
}

interface ProfileActions {
  setProfile: (data: Partial<ProfileState>) => void;
  completeOnboarding: (data: {
    branch: string;
    year: number;
    interests: Category[];
    skills: string[];
  }) => void;
  reset: () => void;
  setHydrated: (v: boolean) => void;
}

const initialState: ProfileState = {
  branch: "",
  year: 2026,
  interests: [],
  skills: [],
  onboarded: false,
  hydrated: false,
};

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set) => ({
      ...initialState,
      setProfile: (data) => set((s) => ({ ...s, ...data })),
      completeOnboarding: (data) =>
        set((s) => ({ ...s, ...data, onboarded: true })),
      reset: () => set(initialState),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "argus-profile",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
