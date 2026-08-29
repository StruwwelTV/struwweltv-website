import { NextResponse } from "next/server";
import { readScheduleState } from "@/lib/scheduleStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const { current } = await readScheduleState();
  return NextResponse.json(
    { schedule: current },
    { headers: { "Cache-Control": "no-store" } },
  );
}

