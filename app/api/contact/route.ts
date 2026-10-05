import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/data/site";
import { contactSchema } from "@/lib/contact-schema";
import { escapeHtml } from "@/lib/utils";

// Basic in-memory rate limit: 5 messages per IP per 10 minutes.
// (Per server instance; good enough to stop casual spam on a portfolio.)
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, services, budget, message, company } = parsed.data;

  // Honeypot filled in: pretend it worked, send nothing.
  if (company) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set. See .env.example.");
    return NextResponse.json(
      { error: "The contact form isn't connected yet. Please reach out by email or WhatsApp instead." },
      { status: 503 },
    );
  }

  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Services: ${services.join(", ")}`,
    `Budget: ${budget}`,
    "",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#0B0D12">
      <h2 style="margin:0 0 16px">New enquiry from ${escapeHtml(name)}</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}<br/>
      <strong>Services:</strong> ${escapeHtml(services.join(", "))}<br/>
      <strong>Budget:</strong> ${escapeHtml(budget)}</p>
      <p style="white-space:pre-wrap;border-left:3px solid #C6FF3D;padding-left:12px">${escapeHtml(message)}</p>
    </div>`;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `New enquiry from ${name} via ${site.name}'s portfolio`,
    text,
    html,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Your message couldn't be sent. Please try again or email me directly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
