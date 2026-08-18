"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  SquarePlus,
  Briefcase,
  Tag,
  UserCircle2,
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Laptop,
  Sofa,
  Shirt,
  Baby,
  Car,
  ToyBrick,
  Dumbbell,
  Palette,
  PawPrint,
  HeartPulse,
  Gem,
  Armchair,
  Ticket,
  ShoppingCart,
  MessageSquare,
  MessagesSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSellerAvatarUrl } from "@/store/seller-avatar.store";

const FALLBACK_AVATAR_URL =
  "https://i.postimg.cc/fyJBgBNb/default-avatar-small-v2.png";

const LOGO_URL =
  "https://i.postimg.cc/PNsVLgrD/696724ff3f48d4a7f4553ccb-Offer-Up-Logo-R-Ball-Primary-p-500.png";
const LOGO_HREF = "https://offerup.com/accounts/settings";

const primaryTabs = [
  { label: "For sale", href: "https://offerup.com/" },
  { label: "Services", href: "https://offerup.com/services" },
  { label: "Jobs", href: "https://offerup.com/jobs" },
];

const categories = [
  { label: "Electronics & Media", icon: Laptop, href: "#" },
  { label: "Home & Garden", icon: Sofa, href: "#" },
  { label: "Clothing, Shoes, & Accessories", icon: Shirt, href: "#" },
  { label: "Baby & Kids", icon: Baby, href: "#" },
  { label: "Vehicles", icon: Car, href: "#" },
  { label: "Toys, Games, & Hobbies", icon: ToyBrick, href: "#" },
  { label: "Sports & Outdoors", icon: Dumbbell, href: "#" },
  { label: "Collectibles & Art", icon: Palette, href: "#" },
  { label: "Pet supplies", icon: PawPrint, href: "#" },
  { label: "Health & Beauty", icon: HeartPulse, href: "#" },
  { label: "Wedding", icon: Gem, href: "#" },
  { label: "Business equipment", icon: Armchair, href: "#" },
  { label: "Tickets", icon: Ticket, href: "#" },
  { label: "General", icon: ShoppingCart, href: "#" },
];

const quickActions = [
  {
    label: "Inbox",
    icon: MessageSquare,

    href: "https://offerup.com/inbox?active=",
  },
  {
    label: "Post",
    icon: SquarePlus,
    href: "https://offerup.com/post/job?step=overview",
  },
  {
    label: "Post a Job",
    icon: SquarePlus,
    href: "https://offerup.com/post/job?step=overview",
  },
  { label: "My Jobs", icon: Briefcase, href: "https://offerup.com/my-jobs" },
  { label: "My Items", icon: Tag, href: "https://offerup.com/selling" },
  {
    label: "Account",
    icon: UserCircle2,
    href: "https://offerup.com/accounts/settings",
  },
];

const footerLinks = [
  { label: "About", href: "https://about.offerup.com/" },
  {
    label: "Help",
    href: "https://offerup.com/support/sso?return_to=/hc/en-us",
  },
  { label: "Terms of Service", href: "https://offerup.com/terms" },
  { label: "Privacy", href: "https://offerup.com/privacy" },
  { label: "Log out", href: "#" },
];

export default function OfferUpNavbar() {
  const [activeTab, setActiveTab] = useState("For sale");
  const [sheetOpen, setSheetOpen] = useState(false);

  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const firstPathname = pathParts[1];

  const sellerAvatarUrl = useSellerAvatarUrl();

  if (
    !(
      firstPathname === "dashboard" ||
      firstPathname === "login" ||
      firstPathname === "onboarding" ||
      firstPathname === "signup"
    )
  ) {
    return (
      <header className="w-full bg-white">
        {/* ===================== DESKTOP (lg and up) ===================== */}
        <div className="hidden lg:block">
          <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-start gap-x-6 px-6 pt-5 ">
            {/* Column 1: logo + location, stacked */}
            <div className="flex flex-col gap-2">
              <a href={LOGO_HREF}>
                <Image
                  src={LOGO_URL}
                  alt="OfferUp"
                  width={130}
                  height={34}
                  className="h-[40px] w-auto shrink-0"
                  priority
                />
              </a>
              <button className="flex shrink-0 items-center gap-1 text-[15px] font-semibold text-gray-900">
                {/*  <MapPin className="h-[18px] w-[18px]" />
          <span>Springfield: 30 miles</span>*/}
              </button>
            </div>

            {/* Column 2: nav tabs + search bar, stacked */}
            <div className="flex flex-col items-center gap-2">
              <nav className="flex items-center gap-10">
                {primaryTabs.map((tab) => (
                  <a
                    key={tab.label}
                    href={tab.href}
                    onClick={() => setActiveTab(tab.label)}
                    className={cn(
                      "border-b-2 border-transparent pb-1 text-[19px] font-semibold text-gray-900 transition-colors",
                      activeTab === tab.label
                        ? "border-emerald-500"
                        : "hover:text-emerald-500",
                    )}
                  >
                    {tab.label}
                  </a>
                ))}
              </nav>

              <div className="w-full max-w-md">
                <div className="relative flex-col justify-center items-center">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5.5 w-5.5 -translate-y-1/2 text-black" />
                  <Input
                    type="text"
                    placeholder="Search for sale"
                    className="h-12 rounded-full border pt-2 border-gray-200 bg-white pl-11 text-[20px] text-gray-700 placeholder:text-gray-400 placeholder:text-[18px] shadow-md focus-visible:ring-1 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Column 3: icons, top row only */}
            <div className="flex shrink-0 items-center gap-4 pt-5">
              <a
                href="https://offerup.com/accounts/saved-lists"
                aria-label="Favorites"
                className="text-gray-800 hover:text-emerald-500 border-r pr-3 h-10 flex items-center justify-center"
              >
                <Heart className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </a>

              <a
                href="https://offerup.com/inbox?active="
                aria-label="Messages"
                className="relative text-gray-800 hover:text-emerald-500 border-r pr-3 h-10 flex items-center justify-center"
              >
                <MessageSquare
                  className="h-[22px] w-[22px]"
                  strokeWidth={1.75}
                />
              </a>

              <a
                href="https://offerup.com/post/job?step=overview"
                aria-label="Post an ad"
                className="text-gray-800 hover:text-emerald-500 border-r pr-3 h-10 flex items-center justify-center"
              >
                <SquarePlus className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </a>

              <a
                href="https://offerup.com/my-jobs"
                aria-label="Jobs"
                className="text-gray-800 hover:text-emerald-500 border-r pr-3 h-10 flex items-center justify-center"
              >
                <Briefcase className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </a>

              <a
                href="https://offerup.com/selling"
                aria-label="My listings"
                className="text-gray-800 hover:text-emerald-500 border-r pr-3 h-10 flex items-center justify-center"
              >
                <Tag className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </a>

              <a
                href="https://offerup.com/accounts/settings"
                aria-label="Account"
                className="text-sky-300 hover:text-sky-400"
              >
                <img
                  src={sellerAvatarUrl || FALLBACK_AVATAR_URL}
                  alt="Account"
                  className="h-[35px] w-[35px] rounded-full object-cover"
                />
              </a>
            </div>
          </div>

          {/* Category row */}
          <div className="mt-3 border-b flex justify-center items-center border-gray-100">
            <div className="mx-auto flex max-w-[1400px] items-center gap-6 overflow-x-auto px-6 py-3 text-[15px] font-medium text-gray-700">
              {categories.slice(0, 8).map((cat) => (
                <a
                  key={cat.label}
                  href={cat.href}
                  className="whitespace-nowrap hover:text-emerald-500"
                >
                  {cat.label}
                </a>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex shrink-0 items-center gap-1 whitespace-nowrap text-gray-900 hover:text-emerald-500">
                    More
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {categories.slice(8).map((cat) => (
                    <DropdownMenuItem key={cat.label} asChild>
                      <a href={cat.href}>{cat.label}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* ===================== MOBILE (below lg) ===================== */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button aria-label="Open menu" className="text-gray-900">
                  <Menu className="h-6 w-6" strokeWidth={2} />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[85vw] max-w-[360px] overflow-y-auto p-0 [&>button]:hidden"
              >
                {/* Sheet header: X + logo */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <button
                    aria-label="Close menu"
                    onClick={() => setSheetOpen(false)}
                    className="text-gray-900"
                  >
                    <X className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <a href={LOGO_HREF}>
                    <Image
                      src={LOGO_URL}
                      alt="OfferUp"
                      width={110}
                      height={28}
                      className="h-[24px] w-auto"
                    />
                  </a>
                </div>

                {/* Quick action icon grid */}
                <div className="grid grid-cols-3 gap-y-4 px-5 pb-4 sm:grid-cols-6">
                  {quickActions.map(({ label, icon: Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex flex-col items-center gap-1.5 text-gray-900"
                    >
                      <span className="relative">
                        <Icon
                          className={cn(
                            "h-6 w-6",
                            label === "Account"
                              ? "text-sky-300"
                              : "text-gray-900",
                          )}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="text-xs font-medium">{label}</span>
                    </a>
                  ))}
                </div>

                <Separator />

                {/* Services / Jobs links */}
                <div>
                  <a
                    href="https://offerup.com/services"
                    className="flex items-center justify-between px-5 py-4 text-lg font-bold text-gray-900"
                  >
                    <span className="flex items-center gap-2">
                      Services
                      <Badge className="rounded-full bg-pink-100 px-2 py-0 text-[11px] font-semibold text-pink-600 hover:bg-pink-100">
                        New
                      </Badge>
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </a>
                  <Separator />
                  <a
                    href="https://offerup.com/jobs"
                    className="flex items-center justify-between px-5 py-4 text-lg font-bold text-gray-900"
                  >
                    Jobs
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </a>
                </div>

                <Separator />

                {/* For Sale category accordion */}
                <div className="px-5 pt-4">
                  <h3 className="pb-2 text-xl font-extrabold text-gray-900">
                    For Sale
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {categories.map(({ label, icon: Icon, href }) => (
                      <AccordionItem
                        key={label}
                        value={label}
                        className="border-gray-100"
                      >
                        <AccordionTrigger className="py-3 text-[15px] font-semibold text-gray-900 hover:no-underline">
                          <span className="flex items-center gap-3">
                            <Icon
                              className="h-5 w-5 text-gray-700"
                              strokeWidth={1.75}
                            />
                            {label}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 text-sm text-gray-600">
                          <a
                            href={href}
                            className="block py-1.5 hover:text-emerald-500"
                          >
                            View all in {label}
                          </a>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <Separator className="mt-2" />

                {/* Sell */}
                <div className="px-5 py-4">
                  <h3 className="pb-2 text-xl font-extrabold text-gray-900">
                    Sell
                  </h3>
                  <a
                    href="#"
                    className="block py-2 text-[15px] text-gray-900 hover:text-emerald-500"
                  >
                    Post an item
                  </a>
                  <a
                    href="offerup.com/autos"
                    className="block py-2 text-[15px] text-gray-900 hover:text-emerald-500"
                  >
                    Auto dealerships
                  </a>
                </div>

                <Separator />

                {/* Footer links */}
                <div className="px-5 py-4">
                  {footerLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block py-2 text-[15px] text-gray-900 hover:text-emerald-500"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <a href={LOGO_HREF}>
              <Image
                src={LOGO_URL}
                alt="OfferUp"
                width={110}
                height={28}
                className="h-[24px] w-auto"
                priority
              />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://offerup.com/inbox"
              aria-label="Messages"
              className="relative text-gray-800"
            >
              <MessageSquare className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </a>
            <a
              href="https://offerup.com/post/job?step=overview"
              aria-label="Post an ad"
              className="text-gray-800"
            >
              <SquarePlus className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </a>
            <a
              href="https://offerup.com/accounts/settings"
              aria-label="Account"
              className="text-sky-300"
            >
              <img
                src={sellerAvatarUrl || FALLBACK_AVATAR_URL}
                alt="Account"
                className="h-[26px] w-[26px] rounded-full object-cover"
              />
            </a>
          </div>
        </div>
      </header>
    );
  }
}
