import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isValidSchedule } from "@/lib/scheduleData";
import { readSchedule, writeSchedule } from "@/lib/scheduleStore";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  return NextResponse.json({ schedule: await readSchedule() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 }); }
  const schedule = (body as { schedule?: unknown })?.schedule;
  if (!isValidSchedule(schedule)) return NextResponse.json({ error: "Der Streamplan ist ungültig." }, { status: 400 });
  try {
    await writeSchedule(schedule);
    return NextResponse.json({ ok: true, schedule });
  } catch {
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
