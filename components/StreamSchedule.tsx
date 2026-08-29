"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "@/components/StreamSchedule.module.css";
import {
  createEmptyWeek,
  currentWeekStart,
  formatDate,
  weekNumber,
  type WeeklySchedule,
} from "@/lib/scheduleData";
export function StreamSchedule() {
  const [schedule, setSchedule] = useState<WeeklySchedule>(() =>
    createEmptyWeek(currentWeekStart()),
  );
  useEffect(() => {
    fetch("/api/schedule", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => data.schedule?.days && setSchedule(data.schedule))
      .catch(() => {});
  }, []);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const next = useMemo(
    () =>
      schedule.days
        .flatMap((day) => day.streams.map((stream) => ({ day, stream })))
        .filter(
          ({ day, stream }) =>
            `${day.date}T${stream.segments[0].start}` >= `${today}T00:00`,
        )
        .sort((a, b) =>
          `${a.day.date}${a.stream.segments[0].start}`.localeCompare(
            `${b.day.date}${b.stream.segments[0].start}`,
          ),
        )[0],
    [schedule, today],
  );
  return (
    <div className={styles.wrapper}>
      <div className={styles.summary}>
        <div>
          <span className={styles.eyebrow}>
            STREAMPLAN · KW {weekNumber(schedule.weekStart)}
          </span>
          <h3>
            {formatDate(schedule.days[0].date)}. –{" "}
            {formatDate(schedule.days[6].date)}.
          </h3>
          <p>
            {next
              ? `Nächster Stream: ${next.day.label}, ${formatDate(next.day.date)}. · ${next.stream.segments[0].start}`
              : "Für diese Woche ist noch kein Stream geplant."}
          </p>
        </div>
        <div className={styles.pulse}>
          <span /> AKTUELLE WOCHE
        </div>
      </div>
      <div className={styles.grid}>
        {schedule.days.map((day) => (
          <article
            key={day.date}
            className={`${styles.card} ${day.streams.length ? styles.active : styles.offline} ${day.date === today ? styles.today : ""}`}
          >
            <div className={styles.topline}>
              <span className={styles.day}>
                {day.day} · {formatDate(day.date)}.
              </span>
              {day.date === today && (
                <span className={styles.badge}>HEUTE</span>
              )}
            </div>
            <div className={styles.body}>
              {day.streams.length ? (
                day.streams.map((stream, streamIndex) => (
                  <div key={stream.id}>
                    <small>
                      {day.streams.length > 1
                        ? `STREAM ${streamIndex + 1}`
                        : "STREAM"}
                    </small>
                    {stream.segments.map((segment) => (
                      <div key={segment.id}>
                        <strong>{segment.start}</strong>
                        <small> {segment.title}</small>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <>
                  <strong>Offline</strong>
                  <small>Kein Stream geplant</small>
                </>
              )}
            </div>
            <div className={styles.status}>
              <span
                className={
                  day.streams.length ? styles.dotActive : styles.dotOffline
                }
              />
              {day.streams.length
                ? `${day.streams.length} Stream${day.streams.length > 1 ? "s" : ""} geplant`
                : "Offline"}
            </div>
          </article>
        ))}
      </div>
      <div className={styles.note}>
        Zeiten können sich bei Events, Turnieren oder spontanem Chaos
        verschieben.
      </div>
    </div>
  );
}

