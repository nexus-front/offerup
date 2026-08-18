// store/seller-avatar.store.ts
//
// Holds the seller's avatar URL globally so the navbar (a separate,
// unrelated component, present on every page) can display it without
// prop drilling. Persisted to localStorage via zustand's persist
// middleware — plain in-memory zustand state resets on every full page
// reload, which is why the avatar was disappearing on refresh/navigation.

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SellerAvatarStore = {
  sellerAvatarUrl: string | null;
  setSellerAvatarUrl: (url: string | null) => void;
  clearSellerAvatarUrl: () => void;
};

export const useSellerAvatarStore = create<SellerAvatarStore>()(
  persist(
    (set) => ({
      sellerAvatarUrl: null,
      setSellerAvatarUrl: (url) => set({ sellerAvatarUrl: url }),
      clearSellerAvatarUrl: () => set({ sellerAvatarUrl: null }),
    }),
    {
      name: "seller-avatar-storage", // localStorage key
    },
  ),
);

// Selector — use this in components instead of the whole store.
export const useSellerAvatarUrl = () =>
  useSellerAvatarStore((s) => s.sellerAvatarUrl);
