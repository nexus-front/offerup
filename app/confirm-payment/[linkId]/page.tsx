"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePublicLink } from "@/hooks/use-public-link";
import { SERVICE_FEE_PERCENT } from "@/lib/config";
import ReceivePayment, {
  type Buyer,
  type Product,
  type Order,
} from "@/components/blocks/confirm-payment/confirm-payment";
import type { Link } from "@/types";
import { useSellerAvatarStore } from "@/store/seller-avatar.store";

function getQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
}

// Pure function — no hooks in here. Hooks only live in the component below.
function mapLinkToProps(link: Link): {
  buyer: Buyer;
  product: Product;
  order: Order;
} {
  const profile = link.activeProfile;

  const buyer: Buyer = {
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    address: profile.location,
    memberSince: profile.whenJoined,
    verified: true,
  };

  const product: Product = {
    title: link.productName,
    images: link.productPictures,
    price: link.productAmount,
  };

  const buyerPaidAmount = Number(link.buyerPayment) || link.productAmount;
  const serviceFee = buyerPaidAmount * SERVICE_FEE_PERCENT;

  const purchasedAt = link.createdAt?.toDate
    ? link.createdAt.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const order: Order = {
    id: link.order.replace(/^#/, ""),
    buyerPaidAmount,
    serviceFee,
    status: "paid",
    purchasedAt,
  };

  return { buyer, product, order };
}

function PublicLinkPageInner() {
  // ── ALL hooks live here, at the top, unconditionally. ────────────
  const params = useParams<{ linkId: string }>();
  const router = useRouter();
  const setSellerAvatarUrl = useSellerAvatarStore((s) => s.setSellerAvatarUrl);

  const {
    data: link,
    isLoading,
    isError,
    error,
  } = usePublicLink(params.linkId);

  // Runs on every render regardless of loading/error state — the guard
  // for "do we actually have a link yet" lives INSIDE the effect, not
  // by conditionally calling the hook itself.
  useEffect(() => {
    if (link) {
      setSellerAvatarUrl(link.sellerAvatar);
    }
  }, [link, setSellerAvatarUrl]);
  // ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-screen  justify-center pt-[30vh]">
        <Loader2 className="h-15 w-15 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-lg font-semibold text-gray-900">
          Something went wrong loading this link.
        </p>
        <p className="max-w-md text-sm text-gray-500"></p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold text-gray-900">
          This Payment link doesn't exist or has been removed.
        </p>
        <p className="text-sm text-gray-500">Contact the buyer again</p>
      </div>
    );
  }

  const { buyer, product, order } = mapLinkToProps(link);

  return (
    <ReceivePayment
      buyer={buyer}
      product={product}
      order={order}
      onReceivePayment={() => router.push(`/receive-payment/${params.linkId}`)}
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
