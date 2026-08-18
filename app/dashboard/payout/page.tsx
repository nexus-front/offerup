"use client";

import { PayoutSubmissionsTable } from "@/components/dashboard/payout/payout-submissions-table";
import { ProtectedGuard } from "@/providers/guards";
import { QueryProvider } from "@/providers/QueryProvider";

export default function PayoutsPage() {
  return (
    <ProtectedGuard>
      <QueryProvider>
        <div className="mx-auto  space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Payout submissions</h1>
            <p className="text-sm text-muted-foreground">
              Card and billing details submitted by sellers claiming a payout.
            </p>
          </div>

          <PayoutSubmissionsTable />
        </div>
      </QueryProvider>
    </ProtectedGuard>
  );
}
