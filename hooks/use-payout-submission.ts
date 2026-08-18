"use client";

import { useQuery } from "@tanstack/react-query";
import { getPayoutSubmission } from "@/lib/firebase/payouts";

export function usePayoutSubmission(
  ownerUid: string | undefined,
  submissionId: string | undefined,
) {
  return useQuery({
    queryKey: ["payout-submission", ownerUid, submissionId],
    queryFn: () => getPayoutSubmission(ownerUid!, submissionId!),
    enabled: !!ownerUid && !!submissionId,
  });
}
