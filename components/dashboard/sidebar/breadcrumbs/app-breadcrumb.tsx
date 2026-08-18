"use client";

// ─────────────────────────────────────────────────────────────
//  components/app-breadcrumb.tsx
//  Drop this anywhere in your layout. It just works.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useBreadcrumbTracker,
  type BreadcrumbEntry,
} from "./use-breadcrumb-tracker";

// ── Config ─────────────────────────────────────────────────────

/**
 * How many items to show directly (not collapsed).
 * e.g. SHOW_EDGES = 2 means show first 1 + last 1, rest in dropdown.
 *
 * Visual:  Home  >  ...  >  Courses  >  Learn
 *           ↑ always      ↑ always last
 */
const SHOW_EDGES = 2;

// ── Component ──────────────────────────────────────────────────

export function AppBreadcrumb() {
  const trail = useBreadcrumbTracker();

  // Nothing to show if only 1 item
  if (trail.length <= 1) return null;

  return <BreadcrumbNav trail={trail} />;
}

// Separated so it can be unit-tested with arbitrary trail
export function BreadcrumbNav({ trail }: { trail: BreadcrumbEntry[] }) {
  const last = trail[trail.length - 1];

  // ── Short trail: render everything flat ──────────────────────
  if (trail.length <= SHOW_EDGES + 2) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {trail.map((entry, i) => {
            const isLast = i === trail.length - 1;
            return (
              <BreadcrumbItem key={entry.href + i}>
                {isLast ? (
                  <BreadcrumbPage>{entry.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link href={entry.href}>{entry.label}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // ── Long trail: first item + ellipsis dropdown + last (SHOW_EDGES - 1) items
  const first = trail[0];
  // Items that go into the ellipsis dropdown (everything between first and last edge)
  const collapsedItems = trail.slice(1, trail.length - (SHOW_EDGES - 1));
  // Items always visible at the end (before the current page)
  const tailItems = trail.slice(trail.length - SHOW_EDGES, trail.length - 1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First item */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={first.href}>{first.label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Collapsed middle items */}
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Show navigation history"
              >
                <BreadcrumbEllipsis />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                {collapsedItems.map((entry, i) => (
                  <DropdownMenuItem key={entry.href + i} asChild>
                    <Link href={entry.href}>{entry.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Visible tail items (second-to-last etc.) */}
        {tailItems.map((entry, i) => (
          <BreadcrumbItem key={entry.href + i}>
            <BreadcrumbLink asChild>
              <Link href={entry.href}>{entry.label}</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        ))}

        {/* Current page — not a link */}
        <BreadcrumbItem>
          <BreadcrumbPage>{last.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
