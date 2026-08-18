// ─────────────────────────────────────────────────────────────
//  lib/breadcrumb-utils.ts
//  Label resolution + dynamic ID detection. Do not need to edit.
// ─────────────────────────────────────────────────────────────

import {
  staticRoutes,
  dynamicRoutes,
  DYNAMIC_FALLBACK_SUFFIX,
} from "./breadcrumb-config";

/**
 * Determines if a URL segment looks like a dynamic ID.
 * Matches: UUIDs, MongoDB ObjectIds, numeric IDs, Clerk-style IDs,
 * and any alphanumeric string > 8 chars that contains a digit.
 */
export function isLikelyId(segment: string): boolean {
  if (!segment) return false;

  // UUID  e.g. 550e8400-e29b-41d4-a716-446655440000
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      segment,
    )
  )
    return true;

  // MongoDB ObjectId  e.g. 507f1f77bcf86cd799439011
  if (/^[0-9a-f]{24}$/i.test(segment)) return true;

  // Pure numeric  e.g. 12345
  if (/^\d+$/.test(segment)) return true;

  // Short alphanumeric with at least one digit and length > 5
  // covers: abc123, user_496yuhu, t99abc, etc.
  if (
    segment.length > 5 &&
    /^[a-zA-Z0-9_-]+$/.test(segment) &&
    /[0-9]/.test(segment) &&
    /[a-zA-Z]/.test(segment)
  )
    return true;

  return false;
}

/**
 * Converts a path pattern like "/users/:id/posts/:id"
 * into a regex, then tests `pathname` against it.
 */
function matchesDynamicPattern(pattern: string, pathname: string): boolean {
  const escaped = pattern
    .split("/")
    .map((seg) =>
      seg === ":id" ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("/");

  const regex = new RegExp(`^${escaped}$`);
  return regex.test(pathname);
}

/**
 * Capitalises a URL segment into a readable label.
 * "my-profile" → "My Profile"
 */
function humanize(segment: string): string {
  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Core resolution: given a pathname, return the friendly breadcrumb label.
 * Resolution order:
 *   1. Exact static match
 *   2. Dynamic pattern match (in config order)
 *   3. Auto fallback — humanize last non-ID segment (+ "Detail" suffix if ID detected)
 */
export function resolveLabel(pathname: string): string {
  const clean = pathname.replace(/\/$/, "") || "/";

  // 1. Static match
  if (staticRoutes[clean]) return staticRoutes[clean];

  // 2. Dynamic pattern match
  for (const { pattern, label } of dynamicRoutes) {
    if (matchesDynamicPattern(pattern, clean)) return label;
  }

  // 3. Auto fallback
  const segments = clean.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";

  const last = segments[segments.length - 1];

  if (isLikelyId(last)) {
    // Use the parent segment name + suffix
    const parent = segments[segments.length - 2];
    const parentLabel = parent
      ? humanize(parent.replace(/s$/, "")) // simple de-plural: "users" → "user"
      : "";
    return parentLabel
      ? `${parentLabel} ${DYNAMIC_FALLBACK_SUFFIX}`
      : DYNAMIC_FALLBACK_SUFFIX;
  }

  return humanize(last);
}
