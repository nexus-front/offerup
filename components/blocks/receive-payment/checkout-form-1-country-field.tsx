"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  countryOptions,
  type CheckoutForm1Data,
} from "@/components/data/checkout-form-1-data"

type CheckoutForm1CountryFieldProps = {
  id: string
}

export function CheckoutForm1CountryField({ id }: CheckoutForm1CountryFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CheckoutForm1Data>()

  return (
    <Field>
      <FieldLabel htmlFor={id}>Country</FieldLabel>
      <Controller
        control={control}
        name="country"
        render={({ field }) => (
          <Select value={field.value} onValueChange={(next) => next && field.onChange(next)}>
            <SelectTrigger id={id} className="!h-9 w-full" aria-invalid={!!errors.country}>
              {/*
                FIX: SelectValue previously received a function as children:
                  <SelectValue>{(selected) => countryLabels[selected] ?? selected}</SelectValue>
                SelectValue expects a ReactNode, not a render function — Radix
                never called it, so nothing ever displayed after selecting a
                country. Removing the children lets Radix auto-render the
                matched SelectItem's own label text instead.
              */}
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countryOptions.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {errors.country ? (
        <p className="text-destructive text-xs">{errors.country.message}</p>
      ) : null}
    </Field>
  )
}
