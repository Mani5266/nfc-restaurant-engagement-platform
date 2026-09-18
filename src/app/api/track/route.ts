import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_EVENTS = [
  "page_view",
  "google_review",
  "instagram",
  "whatsapp",
  "menu",
  "website",
  "directions",
  "offer",
  "call",
] as const;

const VALID_SOURCES = ["nfc", "qr", "direct", "unknown"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { restaurantId, eventType, source } = body;

    // Validate required fields
    if (!restaurantId || !eventType) {
      return NextResponse.json(
        { error: "Missing restaurantId or eventType" },
        { status: 400 }
      );
    }

    // Validate event type
    if (!VALID_EVENTS.includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    // Validate source
    const validSource = VALID_SOURCES.includes(source) ? source : "unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "";

    // Insert event
    const supabase = await createClient();
    const { error } = await supabase.from("events").insert({
      restaurant_id: restaurantId,
      event_type: eventType,
      source: validSource,
      user_agent: userAgent,
    });

    if (error) {
      console.error("Track event error:", error);
      return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
