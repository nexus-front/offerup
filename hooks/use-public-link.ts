"use client";

import { useQuery } from "@tanstack/react-query";
import { getLinkPublic } from "@/lib/firebase/public-links";

export function usePublicLink(linkId: string | undefined) {
  return useQuery({
    queryKey: ["public-link", linkId],
    queryFn: () => getLinkPublic(linkId!),
    enabled: !!linkId,
    // Public payment pages get hit once and rarely revisited —
    // no need to refetch aggressively.
    staleTime: 60 * 1000,
  });
}
