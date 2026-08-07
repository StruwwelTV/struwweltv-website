"use client";

import { useEffect, useState } from "react";
import { TwitchPlayer } from "@/components/TwitchPlayer";
import styles from "@/components/TwitchHub.module.css";

type Clip = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  viewCount: number;
  duration: number;
  createdAt?: string;
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

function clipDate(value?: string) {
  if (!value) return "TWITCH CLIP";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(value));
}

export function TwitchHub() {
  const [data, setData] = useState<TwitchData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/twitch", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Twitch API error");
        return res.json();
      })
      .then((json) => active && setData(json))
      .catch(() => active && setError(true));
    return () => { active = false; };
  }, []);

  const clips = data?.clips?.slice(0, 3) ?? [];

  return (
    <>
      <div className="twitch-layout">
        <div className="player-card">
          {!data && !error && <div className="player-loading">Twitch-Status wird geladen …</div>}
          {data?.live && <TwitchPlayer />}
          {data && !data.live && (
            <div className={styles.offlineCard}>
              <div className={styles.offlineInner}>
                <span className={styles.offlineEyebrow}>GERADE OFFLINE</span>
                <h3 className={styles.offlineTitle}>Das Chaos macht kurz Pause.</h3>
                <p className={styles.offlineText}>Kein kaputter Twitch-Frame mehr: Sobald Struwwel live geht, erscheint hier automatisch der Stream. Bis dahin warten Clips und der Kanal auf dich.</p>
                <a className={styles.offlineButton} href="https://www.twitch.tv/struwwelTV" target="_blank" rel="noreferrer">Zum Twitch-Kanal ↗</a>
              </div>
            </div>
          )}
          {error && (
            <div className={styles.offlineCard}>
              <div className={styles.offlineInner}>
                <span className={styles.offlineEyebrow}>TWITCH API</span>
                <h3 className={styles.offlineTitle}>Kurz nicht erreichbar.</h3>
                <p className={styles.offlineText}>Der Twitch-Status konnte gerade nicht geladen werden. Der Kanal selbst ist natürlich weiterhin erreichbar.</p>
                <a className={styles.offlineButton} href="https://www.twitch.tv/struwwelTV" target="_blank" rel="noreferrer">Twitch öffnen ↗</a>
              </div>
            </div>
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
        <div className={styles.clipGrid}>
          {!data && !error && <div className={styles.empty}>Twitch-Clips werden geladen …</div>}
          {error && <div className={styles.empty}>Die Clips konnten gerade nicht geladen werden.</div>}
          {data && clips.length === 0 && <div className={styles.empty}>Noch keine Clips gefunden. Auf Twitch gibt es trotzdem genug Chaos zu entdecken.</div>}
          {clips.map((clip) => (
            <a className={styles.clipCard} href={clip.url} target="_blank" rel="noreferrer" key={clip.id}>
              <div className={styles.thumb}>
                <img src={clip.thumbnailUrl} alt={`Twitch Clip: ${clip.title}`} loading="lazy" />
                <span className={styles.play}>▶</span>
              </div>
              <div className={styles.meta}><span>{clipDate(clip.createdAt)}</span><span>{clip.viewCount.toLocaleString("de-DE")} Views</span></div>
              <h4 className={styles.title}>{clip.title}</h4>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
