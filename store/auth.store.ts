// store/auth.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// The shape of the user data we pull from Firestore
// Keep this flat and serialisable — no Firebase objects
export type AuthUser = {
  uid: string;
  name: string;
  avatarUrl: string;
  role: "user" | "admin" | "superadmin";
  createdAt: string;
};

// What auth resolution can look like
export type AuthStatus =
  | "loading" // Initial state — haven't checked Firebase yet
  | "unauthenticated" // No Firebase session
  | "onboarding" // Firebase session but no Firestore doc yet
  | "authenticated"; // Firebase session + Firestore doc exists

type AuthStore = {
  user: AuthUser | null;
  status: AuthStatus;

  // Actions
  setUser: (user: AuthUser) => void;
  setStatus: (status: AuthStatus) => void;
  clearUser: () => void;

  // Partial update — for profile edits without re-fetching everything
  updateUser: (partial: Partial<AuthUser>) => void;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      status: "loading",

      setUser: (user) =>
        set({ user, status: "authenticated" }, false, "auth/setUser"),

      setStatus: (status) => set({ status }, false, "auth/setStatus"),

      clearUser: () =>
        set({ user: null, status: "unauthenticated" }, false, "auth/clearUser"),

      updateUser: (partial) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, ...partial } : null,
          }),
          false,
          "auth/updateUser",
        ),
    }),
    { name: "AuthStore" },
  ),
);

// Selectors — use these in components instead of the whole store
// to prevent unnecessary re-renders
export const useUser = () => useAuthStore((s) => s.user);
export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useIsAuthenticated = () =>
  useAuthStore((s) => s.status === "authenticated");
export const useIsLoading = () => useAuthStore((s) => s.status === "loading");
