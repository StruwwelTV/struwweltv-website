import "server-only";
import { getStore } from "@netlify/blobs";
import { defaultSchedule, isValidSchedule, type ScheduleEntry } from "@/lib/scheduleData";

const STORE = "struwweltv-control-center";
const KEY = "stream-schedule";

export async function readSchedule(): Promise<ScheduleEntry[]> {
  try {
    const store = getStore({ name: STORE, consistency: "strong" });
    const saved = await store.get(KEY, { type: "json" });
    return isValidSchedule(saved) ? saved : defaultSchedule;
  } catch {
    return defaultSchedule;
  }
}

export async function writeSchedule(schedule: ScheduleEntry[]) {
  if (!isValidSchedule(schedule)) throw new Error("Invalid schedule");
  const store = getStore({ name: STORE, consistency: "strong" });
  await store.setJSON(KEY, schedule);
}
