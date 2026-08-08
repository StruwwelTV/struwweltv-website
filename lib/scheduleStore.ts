import "server-only";
import { getSiteDataStore } from "@/lib/cloudflareStore";
import { defaultSchedule, isValidSchedule, type ScheduleEntry } from "@/lib/scheduleData";

const KEY = "stream-schedule";

export async function readSchedule(): Promise<ScheduleEntry[]> {
  try {
    const saved = await getSiteDataStore().get(KEY, "json");
    return isValidSchedule(saved) ? saved : defaultSchedule;
  } catch {
    return defaultSchedule;
  }
}

export async function writeSchedule(schedule: ScheduleEntry[]) {
  if (!isValidSchedule(schedule)) throw new Error("Invalid schedule");
  await getSiteDataStore().put(KEY, JSON.stringify(schedule));
}
