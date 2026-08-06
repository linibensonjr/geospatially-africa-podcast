import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; website?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Please submit a valid email address." },
      { status: 400 }
    );
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({
      ok: true,
      message: "Thanks for subscribing!"
    });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLocaleLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        message: "Subscriptions are not configured yet. Please try again later."
      },
      { status: 503 }
    );
  }

  let { error } = name
    ? await supabase.from("subscribers").insert({ name, email, is_active: true })
    : await supabase.from("subscribers").insert({ email, is_active: true });

  // Existing deployments may predate the optional name column. Keep
  // subscriptions working until the schema migration is applied.
  if (
    name &&
    error &&
    (error.code === "PGRST204" ||
      error.code === "42703" ||
      error.message.toLocaleLowerCase().includes("name"))
  ) {
    const retry = await supabase
      .from("subscribers")
      .insert({ email, is_active: true });
    error = retry.error;
  }

  if (error && error.code !== "23505") {
    return NextResponse.json(
      { ok: false, message: "We could not subscribe you. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "You're subscribed! Check your inbox."
  });
}
