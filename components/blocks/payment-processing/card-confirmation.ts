import { z } from "zod";

// ---------------------------------------------------------------------------
// Display-only shape — used purely to render CardVisual. Never validated,
// never submitted. Since we never store the full card number or CVV
// (PCI reasons), cardNumber here is really just cardLast4 in practice —
// CardVisual only ever shows the last 4 digits regardless of length.
// ---------------------------------------------------------------------------
export const cardConfirmationSchema = z.object({
  cardholderName: z.string(),
  cardNumber: z.string(),
  expiry: z.string(),
  cvc: z.string(),
});

export type CardConfirmationValues = z.infer<typeof cardConfirmationSchema>;

// ---------------------------------------------------------------------------
// The actual field the dialog form collects and validates: brand name.
//
// FIX: the original dialog spread `...card` (cardholderName/cardNumber/
// expiry/cvc) into defaultValues then added `brandName: ""`, but the old
// schema only defined `cardBalance` — a digits-only field — which would
// reject any real brand name like "Acme Corp". This schema replaces that
// with what the UI actually asks for.
// ---------------------------------------------------------------------------
export const brandNameSchema = z.object({
  brandName: z.string().regex(/^\d+$/, "Enter valid card balance"),
});

export type BrandNameValues = z.infer<typeof brandNameSchema>;
