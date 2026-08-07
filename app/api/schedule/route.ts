import { NextResponse } from "next/server";
import { readSchedule } from "@/lib/scheduleStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const schedule = await readSchedule();
  return NextResponse.json({ schedule }, { headers: { "Cache-Control": "no-store" } });
}
