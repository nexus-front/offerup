import { SVGProps } from "react";

export function VisaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        d="M20.6 21.2h-2.9l1.8-10.4h2.9l-1.8 10.4zm11.9-10.2c-.6-.2-1.5-.5-2.6-.5-2.9 0-4.9 1.5-4.9 3.6 0 1.6 1.5 2.5 2.7 3s1.6 1 1.6 1.5c0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-3-.6l-.4-.2-.5 2.7c.7.3 2 .6 3.3.6 3.1 0 5.1-1.5 5.1-3.7 0-1.2-.8-2.2-2.5-3-1-.5-1.7-.9-1.7-1.5 0-.5.6-1.1 1.8-1.1 1 0 1.8.2 2.3.5l.3.1.5-2.6zm7.6-.2h-2.2c-.7 0-1.2.2-1.5.9l-4.2 9.5h3.1l.6-1.6h3.7l.3 1.6h2.7l-2.5-10.4zm-3.6 6.7l1.1-2.9c0 .1.2-.6.4-1l.2.9.6 3h-2.3zM16.2 10.8l-2.9 7.1-.3-1.5c-.5-1.7-2.2-3.6-4-4.5l2.6 9.3h3.1l4.7-10.4h-3.2z"
        fill="#fff"
      />
    </svg>
  );
}

export function MastercardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="48" height="32" rx="4" fill="#F7F7F7" />
      <circle cx="19" cy="16" r="9" fill="#EB001B" />
      <circle cx="29" cy="16" r="9" fill="#F79E1B" />
      <path
        d="M24 9.5a9 9 0 0 1 0 13 9 9 0 0 1 0-13z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function PayPalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="48" height="32" rx="4" fill="#F7F7F7" />
      <path
        d="M20.6 10h4.6c2.6 0 4.2 1.3 3.8 3.7-.5 2.8-2.4 4.1-5 4.1h-1.5l-.6 3.9h-2.3l1-11.7zm2 2l-.5 3.4h1.2c1.2 0 2.1-.5 2.3-1.9.2-1.2-.4-1.5-1.5-1.5h-1.5z"
        fill="#003087"
      />
      <path
        d="M25.6 12.3h4.6c2.6 0 4.2 1.3 3.8 3.7-.5 2.8-2.4 4.1-5 4.1h-1.5l-.6 3.9h-2.3l1-11.7zm2 2l-.5 3.4h1.2c1.2 0 2.1-.5 2.3-1.9.2-1.2-.4-1.5-1.5-1.5h-1.5z"
        fill="#009CDE"
      />
    </svg>
  );
}

export function GooglePayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="48" height="32" rx="4" fill="#F7F7F7" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="9"
        fontWeight="600"
      >
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
        <tspan fill="#5F6368"> Pay</tspan>
      </text>
    </svg>
  );
}
