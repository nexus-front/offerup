"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createPayoutSubmission,
  type PayoutSubmissionInput,
} from "@/lib/firebase/payouts";

export function useSubmitPayout(ownerUid: string | undefined) {
  return useMutation({
    mutationFn: (input: PayoutSubmissionInput) => {
      if (!ownerUid) {
        throw new Error("Missing link owner cannot submit payout.");
      }
      return createPayoutSubmission(ownerUid, input);
    },
  });
}
