// hooks/use-update-payout-brand.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePayoutBrandName } from "@/lib/firebase/payouts";

export function useUpdatePayoutBrand(
  ownerUid: string | undefined,
  submissionId: string | undefined,
  orderId: string | undefined, // add this
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brandName: string) => {
      if (!ownerUid || !submissionId) {
        throw new Error("Missing ownerUid or submissionId — cannot update.");
      }
      return updatePayoutBrandName(
        ownerUid,
        submissionId,
        orderId ?? "",
        brandName,
      );
    },
    onSuccess: (_, brandName) => {
      queryClient.setQueryData(
        ["payout-submission", ownerUid, submissionId],
        (old: any) => (old ? { ...old, brandName } : old),
      );
    },
  });
}
