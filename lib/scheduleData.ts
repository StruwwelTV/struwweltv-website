export type ScheduleSegment = { id: string; start: string; title: string };
export type ScheduleStream = { id: string; segments: ScheduleSegment[] };
export type ScheduleDay = {
  key: number;
  day: string;
  label: string;
  date: string;
  streams: ScheduleStream[];
};
export type WeeklySchedule = { weekStart: string; days: ScheduleDay[] };
export type ScheduleState = {
  version: 2;
  current: WeeklySchedule;
  next: WeeklySchedule;
  discordMessageId?: string;
};
export type LegacyScheduleEntry = {
  key: number;
  day: string;
  label: string;
  time: string;
  title: string;
  active: boolean;
};

const DAY_META = [
  { key: 1, day: "MO", label: "Montag" },
  { key: 2, day: "DI", label: "Dienstag" },
  { key: 3, day: "MI", label: "Mittwoch" },
  { key: 4, day: "DO", label: "Donnerstag" },
  { key: 5, day: "FR", label: "Freitag" },
  { key: 6, day: "SA", label: "Samstag" },
  { key: 0, day: "SO", label: "Sonntag" },
];

export const defaultSchedule: LegacyScheduleEntry[] = [
  {
    key: 1,
    day: "MO",
    label: "Montag",
    time: "Offline",
    title: "Regeneration",
    active: false,
  },
  {
    key: 2,
    day: "DI",
    label: "Dienstag",
    time: "19:00",
    title: "Warzone",
    active: true,
  },
  {
    key: 3,
    day: "MI",
    label: "Mittwoch",
    time: "Offline",
    title: "Clips & Pause",
    active: false,
  },
  {
    key: 4,
    day: "DO",
    label: "Donnerstag",
    time: "19:00",
    title: "Warzone",
    active: true,
  },
  {
    key: 5,
    day: "FR",
    label: "Freitag",
    time: "19:00",
    title: "Open End",
    active: true,
  },
  {
    key: 6,
    day: "SA",
    label: "Samstag",
    time: "19:00",
    title: "Community / Event",
    active: true,
  },
  {
    key: 0,
    day: "SO",
    label: "Sonntag",
    time: "19:00",
    title: "Special Stream",
    active: true,
  },
];

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}
export function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return dateOnly(value);
}
export function berlinParts(now = new Date()) {
  const values = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  return Object.fromEntries(
    values.map(({ type, value }) => [type, value]),
  ) as Record<string, string>;
}
export function currentWeekStart(now = new Date()) {
  const p = berlinParts(now);
  const localDate = `${p.year}-${p.month}-${p.day}`;
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    p.weekday,
  );
  const offset = weekday === 0 ? 6 : weekday - 1;
  return addDays(
    localDate,
    -(weekday === 1 && p.hour === "00" && p.minute === "00" ? 7 : offset),
  );
}
export function createEmptyWeek(weekStart: string): WeeklySchedule {
  return {
    weekStart,
    days: DAY_META.map((meta, index) => ({
      ...meta,
      date: addDays(weekStart, index),
      streams: [],
    })),
  };
}
function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
export function migrateLegacySchedule(
  value: LegacyScheduleEntry[],
  weekStart: string,
): WeeklySchedule {
  const week = createEmptyWeek(weekStart);
  for (const day of week.days) {
    const legacy = value.find((entry) => entry.key === day.key);
    if (legacy?.active)
      day.streams = [
        {
          id: id("stream"),
          segments: [
            {
              id: id("segment"),
              start: /^\d{1,2}:\d{2}$/.test(legacy.time)
                ? legacy.time.padStart(5, "0")
                : "19:00",
              title: legacy.title,
            },
          ],
        },
      ];
  }
  return week;
}
export function isLegacySchedule(
  value: unknown,
): value is LegacyScheduleEntry[] {
  return (
    Array.isArray(value) &&
    value.length === 7 &&
    value.every(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        typeof entry.key === "number" &&
        typeof entry.time === "string" &&
        typeof entry.title === "string" &&
        typeof entry.active === "boolean",
    )
  );
}
export function isValidWeek(value: unknown): value is WeeklySchedule {
  if (!value || typeof value !== "object") return false;
  const week = value as WeeklySchedule;
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(week.weekStart) ||
    !Array.isArray(week.days) ||
    week.days.length !== 7
  )
    return false;
  return week.days.every(
    (day) =>
      day &&
      typeof day.key === "number" &&
      typeof day.day === "string" &&
      typeof day.label === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
      Array.isArray(day.streams) &&
      day.streams.length <= 8 &&
      day.streams.every(
        (stream) =>
          typeof stream.id === "string" &&
          stream.id.length <= 80 &&
          Array.isArray(stream.segments) &&
          stream.segments.length >= 1 &&
          stream.segments.length <= 12 &&
          stream.segments.every(
            (segment) =>
              typeof segment.id === "string" &&
              /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(segment.start) &&
              typeof segment.title === "string" &&
              segment.title.trim().length > 0 &&
              segment.title.length <= 100,
          ),
      ),
  );
}
export function isValidState(value: unknown): value is ScheduleState {
  if (!value || typeof value !== "object") return false;
  const state = value as ScheduleState;
  return (
    state.version === 2 &&
    isValidWeek(state.current) &&
    isValidWeek(state.next) &&
    (state.discordMessageId === undefined ||
      typeof state.discordMessageId === "string")
  );
}
export function normalizeWeek(week: WeeklySchedule): WeeklySchedule {
  return {
    ...week,
    days: week.days.map((day) => ({
      ...day,
      streams: day.streams
        .map((stream) => ({
          ...stream,
          segments: [...stream.segments].sort((a, b) =>
            a.start.localeCompare(b.start),
          ),
        }))
        .sort((a, b) => a.segments[0].start.localeCompare(b.segments[0].start)),
    })),
  };
}
export function reconcileScheduleState(state: ScheduleState, now = new Date()) {
  const wanted = currentWeekStart(now);
  if (state.current.weekStart === wanted) return { state, changed: false };
  const current =
    state.next.weekStart === wanted ? state.next : createEmptyWeek(wanted);
  return {
    state: { ...state, current, next: createEmptyWeek(addDays(wanted, 7)) },
    changed: true,
  };
}
export function weekNumber(weekStart: string) {
  const date = new Date(`${weekStart}T12:00:00Z`);
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + 3);
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4, 12));
  return (
    1 + Math.round((thursday.getTime() - firstThursday.getTime()) / 604800000)
  );
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

