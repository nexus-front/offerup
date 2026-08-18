import { z } from "zod";

// ---------------------------------------------------------------------------
// Per-step validation schemas
// ---------------------------------------------------------------------------
export const contactSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .refine((val) => !val || /^[+\d][\d\s()-]{6,18}$/.test(val), {
      message: "Enter a valid phone number",
    }),
});

export const billingSchema = z.object({
  address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z
    .string()
    .min(1, "ZIP code is required")
    .regex(/^\d{4,10}$/, "Enter a valid ZIP code"),
  country: z.string().min(1, "Country is required"),
});

function luhnCheck(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export const paymentSchema = z.object({
  paymentMethod: z.literal("card"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .refine((val) => luhnCheck(val), { message: "Enter a valid card number" }),
  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format")
    .refine(
      (val) => {
        const match = val.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;
        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);
        const expiry = new Date(year, month, 0, 23, 59, 59);
        return expiry >= new Date();
      },
      { message: "This card has expired" },
    ),
  cvv: z
    .string()
    .min(3, "CVV must be 3–4 digits")
    .max(4, "CVV must be 3–4 digits")
    .regex(/^\d+$/, "CVV must be numeric"),
  cardName: z.string().min(1, "Name on card is required"),
  saveInfo: z.boolean().optional(),
});

export const checkoutForm1Schema = contactSchema
  .merge(billingSchema)
  .merge(paymentSchema);

export type CheckoutForm1Data = z.infer<typeof checkoutForm1Schema>;

export const initialCheckoutForm1Data: CheckoutForm1Data = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
  paymentMethod: "card",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardName: "",
  saveInfo: false,
};

// ---------------------------------------------------------------------------
// Country options
// ---------------------------------------------------------------------------
export const countryOptions = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
];

export const countryLabels: Record<string, string> = Object.fromEntries(
  countryOptions.map((country) => [country.value, country.label]),
);

// ---------------------------------------------------------------------------
// Sale / payout summary — shape of the data shown in the sidebar.
// This is now populated from Firestore (via the Link doc) rather than
// hardcoded. `defaultSaleSummary` is kept only as a design-time fallback.
// ---------------------------------------------------------------------------
export type SaleSummary = {
  orderId: string;
  product: {
    title: string;
    image: string;
    price: number;
  };
  buyer: {
    name: string;
    avatar: string;
  };
  buyerPaidAmount: number;
  serviceFeeRate: number;
  purchasedAt: string;
};

export const defaultSaleSummary: SaleSummary = {
  orderId: "OU-48213907",
  product: {
    title: "iPhone 16e — 128GB, Unlocked",
    image:
      "https://images.unsplash.com/photo-1592286927505-1def25115558?w=200&q=80",
    price: 150,
  },
  buyer: {
    name: "Sarah Mitchell",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  buyerPaidAmount: 150,
  serviceFeeRate: 0.05,
  purchasedAt: "Aug 14, 2026",
};
