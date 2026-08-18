interface CardVisualProps {
  cardholderName: string;
  /** Full card number or just the last 4 digits — either works, only last 4 are shown. */
  cardNumber: string;
  expiry: string; // "MM/YY"
  brand?: string; // e.g. "Visa", "Bank Name"
}

function getLast4(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.slice(-4).padStart(4, "•");
}

export function CardVisual({
  cardholderName,
  cardNumber,
  expiry,
  brand = "Bank Name",
}: CardVisualProps) {
  const last4 = getLast4(cardNumber);

  return (
    <div className="relative mx-auto aspect-[1.786/1] w-full max-w-[350px] select-none p-4 sm:p-0">
      {/* Card body */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-4 pb-2 shadow-[0_8px_30px_rgb(0,0,0,0.25)] ring-1 ring-white/10">
        {/* Sheen */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

        {/* Chip */}
        <div className="relative mt-2 flex items-center gap-3">
          <ChipIcon />
        </div>

        {/* Card number */}
        <div className="relative mt-5 flex items-baseline gap-3 font-mono text-white flex items-center justify-center">
          <span className="text-sm md:text-lg tracking-[0.15em] text-white/40">
            ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••
          </span>
          <span className="text-sm md:text-lg tracking-[0.15em]">{last4}</span>
        </div>

        {/* Bottom row */}
        <div className="relative mt-5 flex items-end justify-between ">
          <span className="max-w-[60%] truncate text-sm font-medium tracking-wide text-white/90">
            {cardholderName || "Card Holder"}
          </span>
          <div className="text-right">
            <span className="block text-[9px] uppercase tracking-wider text-white/50">
              Valid thru
            </span>
            <span className="font-mono text-xs text-white/80">{expiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipIcon() {
  return (
    <svg width="38" height="28" viewBox="0 0 38 28" fill="none">
      <rect width="38" height="28" rx="5" fill="url(#chip-gradient)" />
      <g stroke="rgba(0,0,0,0.35)" strokeWidth="1">
        <line x1="12.5" y1="0" x2="12.5" y2="28" />
        <line x1="25.5" y1="0" x2="25.5" y2="28" />
        <line x1="0" y1="9.5" x2="38" y2="9.5" />
        <line x1="0" y1="18.5" x2="38" y2="18.5" />
        <rect x="12.5" y="9.5" width="13" height="9" fill="none" />
      </g>
      <defs>
        <linearGradient id="chip-gradient" x1="0" y1="0" x2="38" y2="28">
          <stop offset="0%" stopColor="#f4d488" />
          <stop offset="45%" stopColor="#d8a94e" />
          <stop offset="100%" stopColor="#a9762f" />
        </linearGradient>
      </defs>
    </svg>
  );
}
