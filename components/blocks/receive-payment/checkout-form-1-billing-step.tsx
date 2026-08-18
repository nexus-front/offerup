"use client"

import { useFormContext } from "react-hook-form"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { CheckoutForm1Data } from "@/components/data/checkout-form-1-data"
import { CheckoutForm1CountryField } from "./checkout-form-1-country-field"

export function CheckoutForm1BillingStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutForm1Data>()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="address-qP4z17X">Street address</FieldLabel>
        <Input
          id="address-qP4z17X"
          placeholder="123 Main Street"
          className="h-9"
          aria-invalid={!!errors.address}
          {...register("address")}
        />
        {errors.address ? (
          <p className="text-destructive text-xs">{errors.address.message}</p>
        ) : null}
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="city-sT5y91B">City</FieldLabel>
          <Input
            id="city-sT5y91B"
            placeholder="New York"
            className="h-9"
            aria-invalid={!!errors.city}
            {...register("city")}
          />
          {errors.city ? (
            <p className="text-destructive text-xs">{errors.city.message}</p>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="state-wX3k85M">State</FieldLabel>
          <Input
            id="state-wX3k85M"
            placeholder="NY"
            className="h-9"
            aria-invalid={!!errors.state}
            {...register("state")}
          />
          {errors.state ? (
            <p className="text-destructive text-xs">{errors.state.message}</p>
          ) : null}
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="zipCode-vZ9q46N">ZIP code</FieldLabel>
          <Input
            id="zipCode-vZ9q46N"
            placeholder="10001"
            className="h-9"
            aria-invalid={!!errors.zipCode}
            {...register("zipCode")}
          />
          {errors.zipCode ? (
            <p className="text-destructive text-xs">{errors.zipCode.message}</p>
          ) : null}
        </Field>
        <CheckoutForm1CountryField id="country-bH7l52P" />
      </div>

      <p className="text-muted-foreground text-xs">
        Nothing gets shipped here — we just use this to verify the card on the
        next step and keep your payout secure.
      </p>
    </FieldGroup>
  )
}
