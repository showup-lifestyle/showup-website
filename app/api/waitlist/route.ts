import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "node:fs/promises";
import path from "node:path";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || null;
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] || null;

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "waitlist.csv");

    await fs.mkdir(dataDir, { recursive: true });

    let fileExists = true;
    try {
      await fs.access(filePath);
    } catch {
      fileExists = false;
    }

    if (!fileExists) {
      await fs.writeFile(
        filePath,
        "created_at,name,email,ip_address,user_agent\n",
        "utf8"
      );
    }

    const createdAt = new Date().toISOString();
    const csvEscape = (value: string | null) => {
      if (!value) return "";
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const row = [
      createdAt,
      csvEscape(name || null),
      csvEscape(email),
      csvEscape(ipAddress),
      csvEscape(userAgent),
    ].join(",");

    await fs.appendFile(filePath, `${row}\n`, "utf8");

    const transporter = getTransporter();
    if (!transporter) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const from = process.env.WAITLIST_FROM || "Showup <no-reply@showup.com>";
    const replyTo = process.env.WAITLIST_REPLY_TO || undefined;

    await transporter.sendMail({
      from,
      to: email,
      replyTo,
      subject: "You're on the Showup waitlist",
      text: `Hi ${name || "there"},\n\nThanks for joining the Showup waitlist. You're officially in line for early access. We'll keep you posted as we get closer to launch.\n\n- The Showup Team`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return NextResponse.json(
      { error: "Unable to join the waitlist right now." },
      { status: 500 }
    );
  }
}
