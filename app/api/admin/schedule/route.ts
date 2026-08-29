import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isValidWeek } from "@/lib/scheduleData";
import { readScheduleState, writeWeek } from "@/lib/scheduleStore";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const { current, next } = await readScheduleState();
  return NextResponse.json(
    { current, next },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 });
  }
  const { target, schedule } = body as { target?: unknown; schedule?: unknown };
  if ((target !== "current" && target !== "next") || !isValidWeek(schedule))
    return NextResponse.json(
      { error: "Der Streamplan ist ungültig." },
      { status: 400 },
    );
  try {
    const state = await writeWeek(target, schedule);
    return NextResponse.json({
      ok: true,
      current: state.current,
      next: state.next,
    });
  } catch (error) {
    console.error("Schedule save failed", error);
    return NextResponse.json(
      { error: "Speichern oder Discord-Synchronisierung fehlgeschlagen." },
      { status: 500 },
    );
  }
}

