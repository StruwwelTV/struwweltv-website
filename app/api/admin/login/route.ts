import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminToken, verifyAdminPassword } from "@/lib/adminAuth";

export async function POST(request: Request) {
  let body: { password?: string } = {};
  try { body = await request.json(); } catch {}

  if (!verifyAdminPassword(body.password || "")) {
    return NextResponse.json({ ok: false, error: "Ungültiges Passwort." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
