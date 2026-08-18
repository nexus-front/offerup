"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePublicLink } from "@/hooks/use-public-link";
import { SERVICE_FEE_PERCENT } from "@/lib/config";

import type { Link } from "@/types";
import { SaleSummary } from "@/components/blocks/receive-payment/checkout-form-1-data";
import CheckoutForm1 from "@/components/blocks/receive-payment/checkout-form-1";

function getQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
}

/**
 * Maps a raw Firestore Link doc into the SaleSummary shape
 * CheckoutForm1PayoutSummary expects.
 *   - "buyer" here is really the Profile snapshot on the link
 *     (name/avatar), same convention as the earlier ReceivePayment page.
 *   - product.image takes the FIRST picture in productPictures.
 *   - serviceFeeRate reads from the single editable SERVICE_FEE_PERCENT
 *     constant, not a hardcoded number.
 */
function mapLinkToSaleSummary(link: Link): SaleSummary {
  const profile = link.activeProfile;

  const purchasedAt = link.createdAt?.toDate
    ? link.createdAt.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return {
    orderId: link.order.replace(/^#/, ""),
    product: {
      title: link.productName,
      image: link.productPictures[0] ?? "",
      price: link.productAmount,
    },
    buyer: {
      name: profile.name,
      avatar: profile.avatarUrl,
    },
    buyerPaidAmount: Number(link.buyerPayment) || link.productAmount,
    serviceFeeRate: SERVICE_FEE_PERCENT,
    purchasedAt,
  };
}

function PublicLinkPageInner() {
  const params = useParams<{ linkId: string }>();
  const {
    data: link,
    isLoading,
    isError,
    error,
  } = usePublicLink(params.linkId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen  justify-center pt-[30vh]">
        <Loader2 className="h-15 w-15 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    console.error("[PublicLinkPage] Firestore error:", error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-lg font-semibold text-gray-900">
          Something went wrong loading this link.
        </p>
        <p className="max-w-md text-sm text-gray-500">
          Check the browser console for the full error.
        </p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold text-gray-900">
          This link doesn't exist or has been removed.
        </p>
        <p className="text-sm text-gray-500">
          Double-check the URL and try again.
        </p>
      </div>
    );
  }

  const saleSummary = mapLinkToSaleSummary(link);

  return (
    <CheckoutForm1
      saleSummary={saleSummary}
      linkId={link.id}
      ownerUid={link.ownerUid}
    />
  );
}

export default function PublicLinkPage() {
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <PublicLinkPageInner />
    </QueryClientProvider>
  );
}
