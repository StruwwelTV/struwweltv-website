import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettingsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSiteSettings(), { headers: { "Cache-Control": "no-store" } });
}
