"use client";

import { useEffect, useMemo, useState } from "react";

type Clip = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  viewCount: number;
  duration: number;
};

type TwitchData = {
  live: boolean;
  stream?: {
    title: string;
    gameName: string;
    viewerCount: number;
    startedAt: string;
  } | null;
  clips?: Clip[];
};

function elapsed(startedAt?: string) {
  if (!startedAt) return "–";
  const diff = Date.now() - new Date(startedAt).getTime();
  if (diff <= 0) return "gerade gestartet";
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}

export function TwitchHub() {
  const [data, setData] = useState<TwitchData | null>(null);
  const [error, setError] = useState(false);
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    setHost(window.location.hostname);

    let active = true;
    fetch("/api/twitch", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Twitch API error");
        return res.json();
      })
      .then((json) => active && setData(json))
      .catch(() => active && setError(true));

    return () => {
      active = false;
    };
  }, []);

  const playerSrc = useMemo(() => {
    if (!host) return null;
    const parent = encodeURIComponent(host);
    return `https://player.twitch.tv/?channel=struwweltv&parent=${parent}&muted=true`;
  }, [host]);

  return (
    <>
      <div className="twitch-layout">
        <div className="player-card">
          {playerSrc ? (
            <iframe
              key={playerSrc}
              src={playerSrc}
              title="StruwwelTV Twitch Stream"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          ) : (
            <div className="player-loading">Twitch-Player wird geladen …</div>
          )}
        </div>

        <aside className="stream-info card">
          <p className="kicker">{data?.live ? "JETZT LIVE" : "TWITCH STATUS"}</p>
          <h3>{data?.stream?.title || (error ? "Twitch gerade nicht erreichbar" : "Der nächste Drop kommt bestimmt.")}</h3>
          <p>{data?.live ? "Direkt aus dem Stream – ohne Umweg." : "Wenn Struwwel offline ist, findest du hier trotzdem die neuesten Clips und VODs."}</p>
          <div className="stream-meta">
            <div><span>Game</span><b>{data?.stream?.gameName || "Offline"}</b></div>
            <div><span>Zuschauer</span><b>{data?.stream?.viewerCount?.toLocaleString("de-DE") || "–"}</b></div>
            <div><span>Live seit</span><b>{elapsed(data?.stream?.startedAt)}</b></div>
          </div>
          <a className="btn btn-primary" href="https://www.twitch.tv/struwwelTV" target="_blank" rel="noreferrer">Auf Twitch öffnen</a>
        </aside>
      </div>

      <div className="clip-section" id="clips">
        <div className="clip-title-row">
          <h3>Neueste Clips</h3>
          <a href="https://www.twitch.tv/struwweltv/videos?filter=clips" target="_blank" rel="noreferrer">Alle Clips ↗</a>
        </div>
        <div className="clip-grid">
          {!data && !error && <div className="loading">Twitch-Clips werden geladen …</div>}
          {error && <div className="loading">Die Clips konnten gerade nicht geladen werden.</div>}
          {data?.clips?.map((clip) => (
            <a className="clip-card" href={clip.url} target="_blank" rel="noreferrer" key={clip.id}>
              <div className="clip-thumb">
                <img src={clip.thumbnailUrl} alt="" loading="lazy" />
                <span className="clip-play">▶</span>
              </div>
              <div className="clip-stats"><span>TWITCH CLIP</span><span>{clip.viewCount.toLocaleString("de-DE")} Views</span></div>
              <h4>{clip.title}</h4>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
