"use client";

import { useMemo } from "react";
import styles from "@/components/StreamSchedule.module.css";

type ScheduleEntry = {
  key: number;
  day: string;
  label: string;
  time: string;
  title: string;
  active: boolean;
};

const schedule: ScheduleEntry[] = [
  { key: 1, day: "MO", label: "Montag", time: "Offline", title: "Regeneration", active: false },
  { key: 2, day: "DI", label: "Dienstag", time: "19:00", title: "Warzone", active: true },
  { key: 3, day: "MI", label: "Mittwoch", time: "Offline", title: "Clips & Pause", active: false },
  { key: 4, day: "DO", label: "Donnerstag", time: "19:00", title: "Warzone", active: true },
  { key: 5, day: "FR", label: "Freitag", time: "19:00", title: "Open End", active: true },
  { key: 6, day: "SA", label: "Samstag", time: "Variabel", title: "Community / Event", active: true },
  { key: 0, day: "SO", label: "Sonntag", time: "Variabel", title: "Special Stream", active: true },
];

function nextStreamIndex(today: number) {
  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = (today + offset) % 7;
    const index = schedule.findIndex((entry) => entry.key === candidate && entry.active);
    if (index !== -1) return index;
  }
  return -1;
}

export function StreamSchedule() {
  const today = new Date().getDay();
  const nextIndex = useMemo(() => nextStreamIndex(today), [today]);
  const next = nextIndex >= 0 ? schedule[nextIndex] : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.summary}>
        <div>
          <span className={styles.eyebrow}>NÄCHSTER STREAM</span>
          <h3>{next ? `${next.label} · ${next.time}` : "Noch offen"}</h3>
          <p>{next ? next.title : "Der nächste Termin wird noch angekündigt."}</p>
        </div>
        <div className={styles.pulse}><span /> PLAN AKTIV</div>
      </div>

      <div className={styles.grid}>
        {schedule.map((entry, index) => {
          const isToday = entry.key === today;
          const isNext = index === nextIndex;
          return (
            <article
              key={entry.day}
              className={`${styles.card} ${entry.active ? styles.active : styles.offline} ${isToday ? styles.today : ""} ${isNext ? styles.next : ""}`}
            >
              <div className={styles.topline}>
                <span className={styles.day}>{entry.day}</span>
                {isToday && <span className={styles.badge}>HEUTE</span>}
                {!isToday && isNext && <span className={`${styles.badge} ${styles.nextBadge}`}>ALS NÄCHSTES</span>}
              </div>
              <div className={styles.body}>
                <strong>{entry.time}</strong>
                <small>{entry.title}</small>
              </div>
              <div className={styles.status}>
                <span className={entry.active ? styles.dotActive : styles.dotOffline} />
                {entry.active ? "Stream geplant" : "Offline"}
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.note}>Zeiten können sich bei Events, Turnieren oder spontanem Chaos verschieben.</div>
    </div>
  );
}
