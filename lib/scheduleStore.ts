import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  addDays,
  createEmptyWeek,
  currentWeekStart,
  isLegacySchedule,
  isValidState,
  migrateLegacySchedule,
  normalizeWeek,
  reconcileScheduleState,
  type ScheduleState,
  type WeeklySchedule,
} from "@/lib/scheduleData";

const KEY = "stream-schedule-v2",
  LEGACY_KEY = "stream-schedule";
type KV = {
  get(key: string, type: "json"): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
};
type RuntimeEnv = { SITE_DATA?: KV; DISCORD_STREAMPLAN_WEBHOOK_URL?: string };
function runtimeEnv(): RuntimeEnv {
  return getCloudflareContext().env as unknown as RuntimeEnv;
}
function initialState(): ScheduleState {
  const start = currentWeekStart();
  return {
    version: 2,
    current: createEmptyWeek(start),
    next: createEmptyWeek(addDays(start, 7)),
  };
}

export async function readScheduleState(): Promise<ScheduleState> {
  const kv = runtimeEnv().SITE_DATA;
  if (!kv) return initialState();
  let value = await kv.get(KEY, "json");
  if (!isValidState(value)) {
    const legacy = await kv.get(LEGACY_KEY, "json");
    const start = currentWeekStart();
    value = {
      version: 2,
      current: isLegacySchedule(legacy)
        ? migrateLegacySchedule(legacy, start)
        : createEmptyWeek(start),
      next: createEmptyWeek(addDays(start, 7)),
    } satisfies ScheduleState;
    await kv.put(KEY, JSON.stringify(value));
  }
  const reconciled = reconcileScheduleState(value as ScheduleState);
  if (reconciled.changed) {
    await syncDiscord(reconciled.state);
    await kv.put(KEY, JSON.stringify(reconciled.state));
  }
  return reconciled.state;
}
function discordContent(week: WeeklySchedule) {
  const lines = week.days.map((day) => {
    const date = day.date.split("-").reverse().slice(0, 2).join(".");
    if (!day.streams.length) return `**${day.label}, ${date}.** — Offline`;
    const streams = day.streams
      .map((stream) =>
        stream.segments
          .map((segment) => `${segment.start} ${segment.title}`)
          .join(" → "),
      )
      .join("\n↳ ");
    return `**${day.label}, ${date}.** — ${streams}`;
  });
  return `📅 **Streamplan · Woche ab ${week.weekStart.split("-").reverse().join(".")}**\n\n${lines.join("\n")}\n\n_Zeiten können sich kurzfristig ändern._`;
}
export async function syncDiscord(
  state: ScheduleState,
  providedEnv = runtimeEnv(),
) {
  const webhook = providedEnv.DISCORD_STREAMPLAN_WEBHOOK_URL;
  if (!webhook) return state;
  if (state.discordMessageId) {
    const deletion = await fetch(
      `${webhook}/messages/${encodeURIComponent(state.discordMessageId)}`,
      { method: "DELETE" },
    );
    if (!deletion.ok && deletion.status !== 404)
      throw new Error(`Discord delete failed: ${deletion.status}`);
  }
  const response = await fetch(`${webhook}?wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: discordContent(state.current),
      allowed_mentions: { parse: [] },
    }),
  });
  if (!response.ok) throw new Error(`Discord post failed: ${response.status}`);
  const message = (await response.json()) as { id?: string };
  if (!message.id) throw new Error("Discord response has no message id");
  state.discordMessageId = message.id;
  return state;
}
export async function writeWeek(
  target: "current" | "next",
  week: WeeklySchedule,
) {
  const kv = runtimeEnv().SITE_DATA;
  if (!kv) throw new Error("Cloudflare KV binding SITE_DATA is not configured");
  const state = await readScheduleState();
  state[target] = normalizeWeek(week);
  if (target === "current") await syncDiscord(state);
  await kv.put(KEY, JSON.stringify(state));
  return state;
}

