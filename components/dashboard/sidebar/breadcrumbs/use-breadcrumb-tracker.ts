"use client";

// ─────────────────────────────────────────────────────────────
//  hooks/use-breadcrumb-tracker.ts
//  Tracks navigation history in sessionStorage.
//  Resets automatically when the browser session ends.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { resolveLabel } from "./breadcrumb-utils";
import { BREADCRUMB_MAX_VISIBLE } from "./breadcrumb-config";

export type BreadcrumbEntry = {
  href: string;
  label: string;
};

const STORAGE_KEY = "app:breadcrumb_trail";
const HOME_ENTRY: BreadcrumbEntry = { href: "/", label: "Home" };

// ── Helpers ────────────────────────────────────────────────────

function readTrail(): BreadcrumbEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BreadcrumbEntry[]) : [];
  } catch {
    return [];
  }
}

function writeTrail(trail: BreadcrumbEntry[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trail));
  } catch {
    // sessionStorage full or unavailable — silently ignore
  }
}

/**
 * Ensures "/" (Home) is always the first entry.
 * Removes any duplicate "/" entries that may have crept in elsewhere.
 */
function withHomePinned(trail: BreadcrumbEntry[]): BreadcrumbEntry[] {
  if (trail.length === 0) return [HOME_ENTRY];
  if (trail[0].href === "/") return trail;
  return [HOME_ENTRY, ...trail.filter((e) => e.href !== "/")];
}

/**
 * Core update logic:
 *  - Home "/" is always pinned at position 0 and never duplicated.
 *  - Navigating to "/" resets the trail to just Home.
 *  - If the page already exists in the trail → remove it from its old position
 *    and move it to the end (treat every visit as a fresh visit).
 *  - If it's a new page → just append.
 *  - Trail is capped at `maxItems`; oldest non-home entries are dropped first.
 */
function buildNextTrail(
  prev: BreadcrumbEntry[],
  pathname: string,
  maxItems: number,
): BreadcrumbEntry[] {
  if (pathname === "/") {
    // Navigating home resets to just Home
    return [HOME_ENTRY];
  }

  const entry: BreadcrumbEntry = {
    href: pathname,
    label: resolveLabel(pathname),
  };

  // Always start from a home-pinned base
  const base = withHomePinned(prev);

  // Remove any existing occurrence of this page so we can move it to the end
  const withoutCurrent = base.filter((e) => e.href !== pathname);

  // Append current page at the end
  const next = [...withoutCurrent, entry];

  // Cap: always keep Home (index 0) + the most recent (maxItems - 1) entries
  if (next.length > maxItems) {
    return [next[0], ...next.slice(next.length - (maxItems - 1))];
  }

  return next;
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Tracks navigation history and returns the current breadcrumb trail.
 *
 * Behaviour:
 * - "/" (Home) is always pinned as the first breadcrumb.
 * - Every navigation appends the visited page to the end of the trail.
 * - Revisiting a page that's already in the trail moves it to the end
 *   (reflects actual visit order, not URL hierarchy).
 * - Trail is capped at `maxItems`; oldest middle entries are dropped first.
 * - Persisted in sessionStorage — survives soft refreshes but resets
 *   when the browser tab/session closes.
 */
export function useBreadcrumbTracker(
  maxItems: number = BREADCRUMB_MAX_VISIBLE,
): BreadcrumbEntry[] {
  const pathname = usePathname();
  const initialised = useRef(false);

  // Hydrate from sessionStorage immediately (avoids flash on refresh)
  const [trail, setTrail] = useState<BreadcrumbEntry[]>(() =>
    withHomePinned(readTrail()),
  );

  useEffect(() => {
    if (!initialised.current) {
      // First mount after hydration — make sure the current page is reflected
      initialised.current = true;
      const stored = readTrail();
      const next = buildNextTrail(stored, pathname, maxItems);
      writeTrail(next);
      setTrail(next);
      return;
    }

    // Every subsequent pathname change (navigation)
    setTrail((prev) => {
      const next = buildNextTrail(prev, pathname, maxItems);
      writeTrail(next);
      return next;
    });
  }, [pathname, maxItems]);

  return trail;
}
