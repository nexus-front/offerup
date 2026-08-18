"use client"

import { useFormContext } from "react-hook-form"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { CheckoutForm1Data } from "@/components/data/checkout-form-1-data"

export function CheckoutForm1ContactStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutForm1Data>()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email-kL9x23P">Email address</FieldLabel>
        <Input
          id="email-kL9x23P"
          type="email"
          placeholder="john@example.com"
          className="h-9"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        ) : null}
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="firstName-mN7z84Q">First name</FieldLabel>
          <Input
            id="firstName-mN7z84Q"
            placeholder="John"
            className="h-9"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-destructive text-xs">{errors.firstName.message}</p>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName-pL8w45T">Last name</FieldLabel>
          <Input
            id="lastName-pL8w45T"
            placeholder="Doe"
            className="h-9"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="text-destructive text-xs">{errors.lastName.message}</p>
          ) : null}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="phone-rM6n82S">Phone number (optional)</FieldLabel>
        <Input
          id="phone-rM6n82S"
          type="tel"
          placeholder="+1 (555) 123-4567"
          className="h-9"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-destructive text-xs">{errors.phone.message}</p>
        ) : null}
      </Field>
    </FieldGroup>
  )
}
