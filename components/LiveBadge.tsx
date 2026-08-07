"use client";

import { useEffect, useState } from "react";

type TwitchSummary = {
  live: boolean;
  stream?: { gameName?: string; viewerCount?: number } | null;
};

export function LiveBadge() {
  const [data, setData] = useState<TwitchSummary | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/twitch", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => active && setData(json))
      .catch(() => active && setData({ live: false }));
    return () => { active = false; };
  }, []);

  const live = Boolean(data?.live);
  const text = live && data?.stream
    ? `LIVE · ${data.stream.gameName ?? "Twitch"} · ${(data.stream.viewerCount ?? 0).toLocaleString("de-DE")} Zuschauer`
    : data ? "Aktuell offline · Twitch wartet" : "Twitch-Status wird geladen …";

  return (
    <div className={`live-badge ${live ? "is-live" : ""}`}>
      <span className="dot" />
      <span>{text}</span>
    </div>
  );
}
