"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "./socialicons";
import { usePathname } from "next/navigation";

const companyLinks = [
  "About Us",
  "Careers",
  "Press Center",
  "Trust & Safety",
  "Insights",
  "Recommerce Report",
  "Leadership",
];

const businessLinks = [
  "Business Portal",
  "Motors",
  "Services",
  "Storefronts",
  "Jobs",
  "Business Help Center",
];

const socialLinks = [
  { label: "Twitter", icon: TwitterIcon, href: "#" },
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "LinkedIn", icon: LinkedInIcon, href: "#" },
];

const legalLinks = [
  "Terms of Service",
  "Privacy Policy",
  "Do Not Sell or Share My Personal Information",
  "Accessibility Statement",
];

function OfferUpMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="19" stroke="white" strokeWidth="6" />
      <path d="M31 10 L38 10 L38 17 Z" fill="white" />
    </svg>
  );
}

export default function OfferUpFooter() {
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const firstPathname = pathParts[1];

  if (
    !(
      firstPathname === "dashboard" ||
      firstPathname === "login" ||
      firstPathname === "onboarding" ||
      firstPathname === "signup"
    )
  ) {
    return (
      <footer className="w-full bg-primary text-white">
        <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
            preserveAspectRatio="none"
            height="64"
            width="64"
            viewBox="0 0 80 80"
            className="jss152"
            aria-label="OfferUp Logo"
          >
            <path
              fill="#ffffff"
              fillRule="evenodd"
              d="M71.68 34.338l-8.79 8.778c-1.523 11.245-11.165 19.915-22.842 19.915C27.313 63.03 16.99 52.719 16.99 40s10.323-23.03 23.058-23.03c11.905 0 21.7 9.01 22.928 20.576l8.704-8.694 8.305 8.296C78.519 16.388 61.205 0 40.048 0 17.93 0 0 17.909 0 40s17.93 40 40.048 40C61.275 80 78.633 63.504 80 42.65l-8.32-8.312z"
            ></path>
          </svg>

          {/* Help center */}
          <a
            href="#"
            className="mt-6 inline-block text-lg text-white hover:underline"
          >
            Visit our Help Center
          </a>

          {/* ============ MOBILE: accordion columns ============ */}
          <div className="mt-4 lg:hidden">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="company" className="border-white/20">
                <AccordionTrigger className="py-3 text-[15px] font-bold text-white hover:no-underline [&>svg]:text-white">
                  Company
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-3 pb-2 pt-1">
                    {companyLinks.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-white/90 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="business" className="border-white/20">
                <AccordionTrigger className="py-3 text-[15px] font-bold text-white hover:no-underline [&>svg]:text-white">
                  For Business
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-3 pb-2 pt-1">
                    {businessLinks.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-white/90 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* ============ DESKTOP: expanded two columns ============ */}
          <div className="mt-8 hidden gap-16 lg:flex">
            <div>
              <h3 className="mb-3 text-[18px] font-bold text-white">Company</h3>
              <ul className="flex flex-col gap-2.5">
                {companyLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-[18px] font-bold text-white">
                OfferUp for Business
              </h3>
              <ul className="flex flex-col gap-2.5">
                {businessLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social icons */}
          <div className="mt-8 flex items-center gap-4">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} social page, opens in a new tab`}
                className="flex h-8 w-8 items-center justify-center text-white  transition-opacity hover:opacity-100"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>

          {/* Get the app */}
          <Button
            variant="outline"
            className="mt-5 h-10 rounded-full border-white bg-transparent px-2 text-lg font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            Get the app
          </Button>

          {/* Legal row */}
          <div className="mt-10 flex flex-col gap-3  pt-6 text-[15px] text-white lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <p className="order-2 lg:order-1">© 2026 OfferUp Inc.</p>
            <ul className="order-1 flex flex-col gap-3 lg:order-2 lg:flex-row lg:items-center lg:gap-6">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}
