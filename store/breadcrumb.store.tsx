// store/breadcrumb.store.ts
import { create } from "zustand";

type BreadcrumbStore = {
  overrides: Record<string, string>;
  setOverride: (id: string, label: string) => void;
  clearOverrides: () => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>()((set) => ({
  overrides: {},
  setOverride: (id, label) =>
    set((state) => ({ overrides: { ...state.overrides, [id]: label } })),
  clearOverrides: () => set({ overrides: {} }),
}));
