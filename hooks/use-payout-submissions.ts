"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/store/auth.store";
import {
  getMyPayoutSubmissions,
  getAllPayoutSubmissions,
} from "@/lib/firebase/payouts";

export type PayoutSubmissionsMode = "mine" | "all";

export function usePayoutSubmissions(mode: PayoutSubmissionsMode) {
  const user = useUser();
  const uid = user?.uid;

  return useQuery({
    queryKey: ["payout-submissions", mode, mode === "mine" ? uid : "all"],
    queryFn: () =>
      mode === "mine" ? getMyPayoutSubmissions(uid!) : getAllPayoutSubmissions(),
    enabled: mode === "all" ? true : !!uid,
  });
}
