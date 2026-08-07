import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() });
}
