"use client";

// providers/guards.tsx
//
// Two guard wrappers:
//   <PublicGuard>   — for /, /login, /signup
//                    Redirects authenticated users to /dashboard/feed
//                    Allows onboarding users through (they need /onboarding)
//
//   <ProtectedGuard> — for /dashboard/*
//                    Redirects unauthenticated users to /login
//                    Redirects onboarding users to /onboarding

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

// Full-screen loader — shown while auth state is resolving
// Prevents any flash of wrong content
function AuthLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  );
}

function AuthLoaderDashboard() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// PublicGuard
// Wraps public pages: /, /login, /signup
// If user is fully authenticated → send to dashboard
// If user is mid-onboarding → let them through (they need /onboarding)
// ---------------------------------------------------------------------------

type GuardProps = { children: React.ReactNode };

export function PublicGuard({ children }: GuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "authenticated") {
      // Already has a full account — no reason to be on public pages
      router.replace("/dashboard/feed");
    }
    // "onboarding" status: user signed up but hasn't finished
    // We let them stay on /onboarding or go back to /signup
    // We do NOT redirect to dashboard
  }, [status, router]);

  // Still resolving — show loader to prevent flicker
  if (status === "loading") return <AuthLoader />;

  // Authenticated users see loader briefly while redirect fires
  if (status === "authenticated") return <AuthLoader />;

  // Unauthenticated or onboarding — render the page
  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// ProtectedGuard
// Wraps /dashboard/* layout
// If unauthenticated → send to /login
// If mid-onboarding → send to /onboarding (they haven't finished yet)
// If authenticated → render children
// ---------------------------------------------------------------------------

export function ProtectedGuard({ children }: GuardProps) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "onboarding") {
      // They have a Firebase session but no Firestore doc
      // Send them back to finish what they started
      router.replace("/onboarding");
    }
  }, [status, router]);

  if (status === "loading") return <AuthLoaderDashboard />;
  if (status === "unauthenticated") return <AuthLoaderDashboard />;
  if (status === "onboarding") return <AuthLoaderDashboard />;

  // Fully authenticated — render the dashboard
  return <>{children}</>;
}

//auth guard guard
export function AuthGuard({ children }: GuardProps) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "onboarding") {
      // They have a Firebase session but no Firestore doc
      // Send them back to finish what they started
      router.replace("/onboarding");
    }
  }, [status, router]);

  if (status === "loading") return <AuthLoader />;
  if (status === "onboarding") return <AuthLoader />;

  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// OnboardingGuard
// Wraps /onboarding page specifically
// If unauthenticated → send to /signup (need to create account first)
// If already authenticated (has Firestore doc) → send to dashboard
// Only "onboarding" status gets through
// ---------------------------------------------------------------------------

export function OnboardingGuard({ children }: GuardProps) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
    if (status === "authenticated") {
      // Already completed onboarding — no reason to be here
      router.replace("/dashboard/feed");
    }
  }, [status, router]);

  if (status === "loading") return <AuthLoader />;
  if (status === "unauthenticated") return <AuthLoader />;
  if (status === "authenticated") return <AuthLoader />;

  // Only "onboarding" status reaches here
  return <>{children}</>;
}

export function AdminGuard({ children }: GuardProps) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "onboarding") {
      router.replace("/onboarding");
    }

    if (
      status === "authenticated" &&
      user &&
      user.role !== "admin" &&
      user.role !== "superadmin"
    ) {
      router.back();
    }
  }, [status, user, router]);

  if (status === "loading") return <AuthLoaderDashboard />;
  if (status === "unauthenticated") return <AuthLoaderDashboard />;
  if (status === "onboarding") return <AuthLoaderDashboard />;
  if (
    status === "authenticated" &&
    user &&
    user.role !== "admin" &&
    user.role !== "superadmin"
  ) {
    return <AuthLoaderDashboard />;
  }

  return <>{children}</>;
}
