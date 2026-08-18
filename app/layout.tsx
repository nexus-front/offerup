import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OfferUpNavbar from "@/components/blocks/navbar";
import OfferUpFooter from "@/components/blocks/footer";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buy & Sell Locally-OfferUp-Buy.Sell.Simple.",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <OfferUpNavbar />
            {children}
            <Toaster position="top-center" />
            <OfferUpFooter />{" "}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
