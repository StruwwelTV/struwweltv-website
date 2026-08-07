"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/components/StreamSchedule.module.css";
import { defaultSchedule, type ScheduleEntry } from "@/lib/scheduleData";

function nextStreamIndex(schedule: ScheduleEntry[], today: number) {
  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = (today + offset) % 7;
    const index = schedule.findIndex((entry) => entry.key === candidate && entry.active);
    if (index !== -1) return index;
  }
  return -1;
}

export function StreamSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(defaultSchedule);
  const today = new Date().getDay();

  useEffect(() => {
    fetch("/api/schedule", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => Array.isArray(data.schedule) && setSchedule(data.schedule))
      .catch(() => {});
  }, []);

  const nextIndex = useMemo(() => nextStreamIndex(schedule, today), [schedule, today]);
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
