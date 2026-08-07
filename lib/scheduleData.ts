export type ScheduleEntry = {
  key: number;
  day: string;
  label: string;
  time: string;
  title: string;
  active: boolean;
};

export const defaultSchedule: ScheduleEntry[] = [
  { key: 1, day: "MO", label: "Montag", time: "Offline", title: "Regeneration", active: false },
  { key: 2, day: "DI", label: "Dienstag", time: "19:00", title: "Warzone", active: true },
  { key: 3, day: "MI", label: "Mittwoch", time: "Offline", title: "Clips & Pause", active: false },
  { key: 4, day: "DO", label: "Donnerstag", time: "19:00", title: "Warzone", active: true },
  { key: 5, day: "FR", label: "Freitag", time: "19:00", title: "Open End", active: true },
  { key: 6, day: "SA", label: "Samstag", time: "Variabel", title: "Community / Event", active: true },
  { key: 0, day: "SO", label: "Sonntag", time: "Variabel", title: "Special Stream", active: true },
];

export function isValidSchedule(value: unknown): value is ScheduleEntry[] {
  if (!Array.isArray(value) || value.length !== 7) return false;
  const keys = new Set<number>();
  for (const entry of value) {
    if (!entry || typeof entry !== "object") return false;
    const item = entry as Record<string, unknown>;
    if (typeof item.key !== "number" || item.key < 0 || item.key > 6 || keys.has(item.key)) return false;
    if (typeof item.day !== "string" || typeof item.label !== "string" || typeof item.time !== "string" || typeof item.title !== "string" || typeof item.active !== "boolean") return false;
    if (item.time.length > 30 || item.title.length > 80 || item.label.length > 30 || item.day.length > 4) return false;
    keys.add(item.key);
  }
  return keys.size === 7;
}
