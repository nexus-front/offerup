"use client";

import {
  Visa as VisaIcon,
  Mastercard as MastercardIcon,
  Amex as AmexIcon,
  DinersClub as DinersIcon,
} from "react-svg-credit-card-payment-icons/icons/flat-rounded";
import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PayPalIcon, GooglePayIcon } from "@/components/blocks/PaymentIcons";

// ---------------------------------------------------------------------------
// Types — shape this to match your API / DB response
// (exported so the public link page can map Firestore data into these
// shapes without touching this file's JSX/styling)
// ---------------------------------------------------------------------------
export interface Buyer {
  name: string;
  avatarUrl?: string;
  address: string;
  memberSince: string;
  verified: boolean;
}

export interface Product {
  title: string;
  images: string[];
  price: number;
}

export interface Order {
  id: string;
  buyerPaidAmount: number;
  serviceFee: number;
  status: "paid" | "pending";
  purchasedAt: string;
}

interface ReceivePaymentProps {
  buyer?: Buyer;
  product?: Product;
  order?: Order;
  onReceivePayment?: () => void;
}

// ---------------------------------------------------------------------------
// Demo data — replace with real props from your API call
// ---------------------------------------------------------------------------
const defaultBuyer: Buyer = {
  name: "John Doe",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  address: "123 Elm Street, Suffield, CT 06078",
  memberSince: "Jul 2026",
  verified: true,
};

const defaultProduct: Product = {
  title: "iPhone 16e — 128GB, Unlocked",
  images: [
    "https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&q=80",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
    "https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=800&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
  ],
  price: 150,
};

const defaultOrder: Order = {
  id: "OU-48213907",
  buyerPaidAmount: 150,
  serviceFee: 1.5,
  status: "paid",
  purchasedAt: "Aug 14, 2026",
};

export default function ReceivePayment({
  buyer = defaultBuyer,
  product = defaultProduct,
  order = defaultOrder,
  onReceivePayment,
}: ReceivePaymentProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const initials = buyer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top banner */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            You've got a payment to receive
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{buyer.name}</span>{" "}
            has completed checkout for your listing. Review the details below
            and confirm to receive your funds.
          </p>
        </div>
        <Badge className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
          Order #{order.id}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* ===================== LEFT: product gallery ===================== */}
        <div>
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="hidden flex-col gap-2 sm:flex">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-sm border-2 transition-colors",
                    selectedImage === i
                      ? "border-emerald-500"
                      : "border-transparent hover:border-gray-300",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${product.title} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-sm bg-gray-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />

              {/* Prev/next controls (mobile-friendly) */}
              <button
                onClick={() =>
                  setSelectedImage((i) =>
                    i === 0 ? product.images.length - 1 : i - 1,
                  )
                }
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white sm:hidden"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((i) => (i + 1) % product.images.length)
                }
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white sm:hidden"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile thumbnail strip */}
          <div className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border-2 transition-colors",
                  selectedImage === i
                    ? "border-emerald-500"
                    : "border-transparent",
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${product.title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-900">
            {product.title}
          </h2>
          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
        </div>

        {/* ===================== RIGHT: buyer + payment ===================== */}
        <div className="flex flex-col gap-5">
          {/* Buyer card */}
          <Card className="border-gray-200 rounded-md">
            <CardContent className="p-5 py-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Buyer details
              </p>
              <div className="flex items-start gap-3">
                <img
                  src={
                    buyer.avatarUrl ||
                    "https://i.postimg.cc/fyJBgBNb/default-avatar-small-v2.png"
                  }
                  alt="Account"
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900">{buyer.name}</p>
                    {buyer.verified && (
                      <ShieldCheck
                        className="h-4 w-4 text-emerald-500"
                        aria-label="Verified buyer"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Member since {buyer.memberSince}
                  </p>

                  <div className="mt-2 flex items-start gap-1.5 text-sm text-gray-700">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span>{buyer.address}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-4 h-9 w-full gap-2 rounded-full border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <MessageSquare className="h-4 w-4" />
                Message {buyer.name.split(" ")[0]}
              </Button>
            </CardContent>
          </Card>

          {/* Order summary */}
          <Card className="border-gray-200 rounded-md">
            <CardContent className="p-5 py-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order summary
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Buyer paid</span>
                <span className="font-semibold text-gray-900">
                  ${order.buyerPaidAmount.toFixed(2)} USD
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">OfferUp service fee</span>
                <span className="text-gray-900">
                  −${order.serviceFee.toFixed(2)} USD
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <Badge
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold hover:bg-inherit",
                    order.status === "paid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700",
                  )}
                >
                  {order.status === "paid"
                    ? "Buyer has paid"
                    : "Awaiting payment"}
                </Badge>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Purchased on</span>
                <span className="text-gray-900">{order.purchasedAt}</span>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  You'll receive
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  ${(order.buyerPaidAmount - order.serviceFee).toFixed(2)} USD
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment method */}
          <Card className="border-gray-200 rounded-md">
            <CardContent className="p-5 py-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                How you'll receive funds
              </p>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="gap-3"
              >
                {/* Card — the only functional option */}
                <label
                  htmlFor="pay-card"
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors",
                    paymentMethod === "card"
                      ? "border-emerald-500 bg-emerald-50/40"
                      : "border-gray-200 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" id="pay-card" />
                    <span className="text-sm font-medium text-gray-900">
                      Debit or Credit Card
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <VisaIcon width={30} className="rounded" />
                    <MastercardIcon width={30} className="rounded" />
                    <AmexIcon width={30} className="rounded" />
                  </div>
                </label>

                {/* PayPal — visible, disabled */}
                <div
                  className="flex cursor-not-allowed items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 opacity-60"
                  aria-disabled="true"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="paypal" id="pay-paypal" disabled />
                    <span className="text-sm font-medium text-gray-500">
                      PayPal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PayPalIcon className="h-5 w-8 rounded" />
                    <span className="text-[11px] font-medium text-gray-400">
                      Coming soon
                    </span>
                  </div>
                </div>

                {/* Google Pay — visible, disabled */}
                <div
                  className="flex cursor-not-allowed items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 opacity-60"
                  aria-disabled="true"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="gpay" id="pay-gpay" disabled />
                    <span className="text-sm font-medium text-gray-500">
                      Google Pay
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GooglePayIcon className="h-5 w-8 rounded" />
                    <span className="text-[11px] font-medium text-gray-400">
                      Coming soon
                    </span>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Button
            onClick={onReceivePayment}
            className="h-12 w-full rounded-full bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
          >
            Receive Payment
          </Button>

          <p className="text-center text-xs text-gray-400">
            Funds are released securely once you confirm. OfferUp Buyer &amp;
            Seller Protection applies to this order.
          </p>
        </div>
      </div>
    </div>
  );
}
