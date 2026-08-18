// ─────────────────────────────────────────────────────────────
//  breadcrumb-config.ts
//  THE ONLY FILE YOU NEED TO EDIT AS YOU BUILD YOUR APP
// ─────────────────────────────────────────────────────────────

/**
 * Max breadcrumb items visible before collapsing into an ellipsis dropdown.
 * e.g. 5 → shows: Home > ... (dropdown) > Courses > Learn > Quiz
 */
export const BREADCRUMB_MAX_VISIBLE = 5;

/**
 * Static routes → friendly label mapping.
 * Key: exact pathname (no trailing slash)
 * Value: label shown in breadcrumb
 */
export const staticRoutes: Record<string, string> = {
  "/dashboard/feed": "Home",
  "/dashboard/chat": "Chat",
  "/dashboard/build": "Courses",
  "/dashboard/learn/courses": "Courses",
  "/dashboard/learn/overview": "Learn Overview",
  "/dashboard/learn/overview/create": "Create Course",
  "/dashboard/learn/overview/edit": "Edit Course",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
  // ← add your routes here as you build
};

/**
 * Dynamic route patterns → friendly label mapping.
 *
 * Use `:id` as a placeholder for any dynamic segment (UUID, ObjectId, number, slug, etc.)
 * Patterns are matched in ORDER — put more specific patterns first.
 *
 * Examples:
 *   "/users/:id/posts/:id"  →  matches /users/abc/posts/xyz
 *   "/courses/:id/learn"    →  matches /courses/abc123/learn
 *   "/users/:id"            →  matches /users/abc123
 */
export const dynamicRoutes: Array<{ pattern: string; label: string }> = [
  { pattern: "/users/:id/settings", label: "User Settings" },
  { pattern: "/users/:id/posts/:id", label: "Post" },
  { pattern: "/users/:id", label: "Profile" },
  { pattern: "/courses/:id/learn/:id", label: "Lesson" },
  { pattern: "/courses/:id/learn", label: "Learn" },
  { pattern: "/courses/:id", label: "Course" },
  { pattern: "/products/:id", label: "Product" },
  { pattern: "/orders/:id", label: "Order" },
  // ← add your dynamic routes here
];

/**
 * Fallback: when a dynamic segment is detected but no pattern matched,
 * we'll use the parent segment name + this suffix.
 * e.g. /widgets/abc123 → "Widget Detail"
 */
export const DYNAMIC_FALLBACK_SUFFIX = "Detail";
