"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreditCard, Eye, EyeOff } from "lucide-react";
import {
  Visa as VisaIcon,
  Mastercard as MastercardIcon,
  Amex as AmexIcon,
  DinersClub as DinersIcon,
} from "react-svg-credit-card-payment-icons/icons/flat-rounded";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { CheckoutForm1Data } from "@/components/data/checkout-form-1-data";

export function CheckoutForm1PaymentStep() {
  const [showCvv, setShowCvv] = useState(false);
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutForm1Data>();

  const cardNumberField = register("cardNumber");
  const expiryField = register("expiryDate");

  return (
    <div className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend className="text-sm font-medium">
          Where should we send your money?
        </FieldLegend>
        <RadioGroup defaultValue="card" className="flex flex-col gap-3">
          <FieldLabel htmlFor="card-payment-cN9m74K">
            <Field orientation="horizontal" className="rounded-lg border p-4">
              <RadioGroupItem value="card" id="card-payment-cN9m74K" />
              <CreditCard
                className="text-muted-foreground size-5"
                aria-hidden="true"
              />
              <span className="flex-1">Debit or credit card</span>
              <div className="flex items-center gap-1">
                <VisaIcon width={30} className="rounded" />
                <MastercardIcon width={30} className="rounded" />
                <AmexIcon width={30} className="rounded" />
              </div>
            </Field>
          </FieldLabel>

          {/* Visible for future-proofing, not selectable yet */}
          <div
            className="text-muted-foreground flex cursor-not-allowed items-center gap-3 rounded-lg border p-4 opacity-50"
            aria-disabled="true"
          >
            <RadioGroupItem value="bank" id="bank-payment-disabled" disabled />
            <span className="flex-1 text-sm">Bank transfer (ACH)</span>
            <span className="text-xs">Coming soon</span>
          </div>
        </RadioGroup>
      </FieldSet>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="cardNumber-dK5p83L">Card number</FieldLabel>
          <Input
            id="cardNumber-dK5p83L"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="h-9"
            aria-invalid={!!errors.cardNumber}
            name={cardNumberField.name}
            ref={cardNumberField.ref}
            onBlur={cardNumberField.onBlur}
            onChange={(event) => {
              const formatted = event.target.value
                .replace(/\s/g, "")
                .replace(/(.{4})/g, "$1 ")
                .trim();
              setValue("cardNumber", formatted, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
          {errors.cardNumber ? (
            <p className="text-destructive text-xs">
              {errors.cardNumber.message}
            </p>
          ) : null}
        </Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="expiryDate-fJ6r29M">Expiry</FieldLabel>
            <Input
              id="expiryDate-fJ6r29M"
              placeholder="MM/YY"
              maxLength={5}
              className="h-9"
              aria-invalid={!!errors.expiryDate}
              name={expiryField.name}
              ref={expiryField.ref}
              onBlur={expiryField.onBlur}
              onChange={(event) => {
                const formatted = event.target.value
                  .replace(/\D/g, "")
                  .replace(/(\d{2})(\d)/, "$1/$2");
                setValue("expiryDate", formatted, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
            {errors.expiryDate ? (
              <p className="text-destructive text-xs">
                {errors.expiryDate.message}
              </p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="cvv-gH8s34N">CVV</FieldLabel>
            <InputGroup className="h-9">
              <InputGroupInput
                id="cvv-gH8s34N"
                type={showCvv ? "text" : "password"}
                placeholder="123"
                maxLength={4}
                aria-invalid={!!errors.cvv}
                {...register("cvv")}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                  className="cursor-pointer hover:bg-transparent"
                  onClick={() => setShowCvv((current) => !current)}
                >
                  {showCvv ? (
                    <EyeOff className="text-muted-foreground" />
                  ) : (
                    <Eye className="text-muted-foreground" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {errors.cvv ? (
              <p className="text-destructive text-xs">{errors.cvv.message}</p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="cardName-hI9t45O">Name on card</FieldLabel>
            <Input
              id="cardName-hI9t45O"
              placeholder="John Doe"
              className="h-9"
              aria-invalid={!!errors.cardName}
              {...register("cardName")}
            />
            {errors.cardName ? (
              <p className="text-destructive text-xs">
                {errors.cardName.message}
              </p>
            ) : null}
          </Field>
        </div>

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="saveInfo"
            render={({ field }) => (
              <Checkbox
                id="saveInfo-jK0u56P"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldLabel
            htmlFor="saveInfo-jK0u56P"
            className="text-sm font-normal"
          >
            Save this card for future payouts
          </FieldLabel>
        </Field>
      </FieldGroup>
    </div>
  );
}
