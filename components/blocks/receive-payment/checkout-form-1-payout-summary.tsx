"use client";

import { CreditCard, ShieldCheck, Zap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SaleSummary } from "./checkout-form-1-data";

interface CheckoutForm1PayoutSummaryProps {
  saleSummary: SaleSummary;
}

export function CheckoutForm1PayoutSummary({
  saleSummary,
}: CheckoutForm1PayoutSummaryProps) {
  const {
    product,
    buyer,
    buyerPaidAmount,
    serviceFeeRate,
    purchasedAt,
    orderId,
  } = saleSummary;
  const serviceFee = buyerPaidAmount * serviceFeeRate;
  const netPayout = buyerPaidAmount - serviceFee;
  const buyerInitials = buyer.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-balance">Sale summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Sold item */}
        <div className="flex gap-4">
          <img
            src={product.image}
            alt={product.title}
            className="size-16 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-medium">{product.title}</h4>
            <p className="text-muted-foreground text-xs">Order #{orderId}</p>
            <p className="mt-1 text-sm font-medium">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Buyer */}
        <div className="flex items-center gap-3">
          <img
            src={
              buyer.avatar ||
              "https://i.postimg.cc/fyJBgBNb/default-avatar-small-v2.png"
            }
            alt="Account"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{buyer.name}</p>
            <p className="text-muted-foreground text-xs">
              Paid on {purchasedAt}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            Paid
          </Badge>
        </div>

        <Separator />

        {/* Fee breakdown */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Buyer paid</span>
            <span>${buyerPaidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Service fee ({Math.round(serviceFeeRate * 100)}%)
            </span>
            <span>-${serviceFee.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>You&apos;ll receive</span>
          <span className="text-green-600">${netPayout.toFixed(2)}</span>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <ShieldCheck className="size-4 text-green-600" aria-hidden="true" />
            <span>SSL encrypted &amp; PCI compliant</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Zap className="size-4 text-blue-600" aria-hidden="true" />
            <span>Funds typically arrive within minutes</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <CreditCard className="size-4 text-purple-600" aria-hidden="true" />
            <span>Covered by Buyer &amp; Seller Protection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
