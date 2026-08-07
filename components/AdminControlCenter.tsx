"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultSchedule, type ScheduleEntry } from "@/lib/scheduleData";
import styles from "@/components/AdminControlCenter.module.css";

type Tab = "schedule" | "website" | "setup" | "community";

export function AdminControlCenter() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("schedule");
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(defaultSchedule);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAuthenticated(Boolean(d.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/schedule", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => Array.isArray(d.schedule) && setSchedule(d.schedule))
      .catch(() => {});
  }, [authenticated]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error || "Login fehlgeschlagen.");
      return;
    }
    setPassword("");
    setAuthenticated(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  }

  function updateEntry(index: number, patch: Partial<ScheduleEntry>) {
    setSchedule((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item));
    setMessage("");
  }

  async function saveSchedule() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedule }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    setMessage(res.ok ? "Gespeichert – der öffentliche Streamplan ist jetzt aktualisiert." : (data.error || "Speichern fehlgeschlagen."));
  }

  if (authenticated === null) return <div className={styles.loginWrap}><div className={styles.login}><p>Control Center wird geladen …</p></div></div>;

  if (!authenticated) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.login}>
          <Image className={styles.loginLogo} src="/logo.png" width={74} height={74} alt="StruwwelTV" priority />
          <h1>Control Center</h1>
          <p>Interner Bereich für StruwwelTV. Melde dich an, um Inhalte der Website zu verwalten.</p>
          <form onSubmit={login}>
            <input className={styles.input} type="password" placeholder="Admin-Passwort" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            {loginError && <p className={styles.error}>{loginError}</p>}
            <button type="submit">Einloggen</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.shell}>
      <div className={styles.wrap}>
        <div className={styles.topbar}>
          <div className={styles.brand}><Image src="/logo.png" width={48} height={48} alt="STV" /><div><strong>STRUWWELTV</strong><span>CONTROL CENTER</span></div></div>
          <div className={styles.status}><span className={styles.pill}><b>●</b> Website online</span><span className={styles.pill}>Admin aktiv</span><button className={styles.logout} onClick={logout}>Abmelden</button></div>
        </div>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>STRUWWELTV // CONTROL CENTER</span>
          <h1>Dein Chaos.<br />Deine Regeln.</h1>
          <p>Ändere deinen Streamplan direkt hier. Weitere Bereiche für Website-Texte, Setup und Community bauen wir auf derselben Basis weiter aus.</p>
        </section>

        <div className={styles.grid}>
          <nav className={styles.nav}>
            {(["schedule", "website", "setup", "community"] as Tab[]).map((item) => (
              <button key={item} className={`${styles.navButton} ${tab === item ? styles.navButtonActive : ""}`} onClick={() => setTab(item)}>
                {item === "schedule" ? "Streamplan" : item === "website" ? "Website" : item === "setup" ? "Setup" : "Community"}
              </button>
            ))}
          </nav>

          <section className={styles.panel}>
            {tab === "schedule" ? (
              <>
                <div className={styles.panelHead}><div><h2>Streamplan</h2><p>Änderungen werden ohne neuen Deploy direkt auf der Website angezeigt.</p></div><button className={styles.save} onClick={saveSchedule} disabled={saving}>{saving ? "Speichert …" : "Änderungen speichern"}</button></div>
                <div className={styles.schedule}>
                  {schedule.map((entry, index) => (
                    <div className={styles.row} key={entry.key}>
                      <div className={styles.day}>{entry.day}</div>
                      <input className={styles.input} value={entry.time} onChange={(e) => updateEntry(index, { time: e.target.value })} aria-label={`${entry.label} Uhrzeit`} />
                      <input className={styles.input} value={entry.title} onChange={(e) => updateEntry(index, { title: e.target.value })} aria-label={`${entry.label} Inhalt`} />
                      <label className={styles.switch}><input type="checkbox" checked={entry.active} onChange={(e) => updateEntry(index, { active: e.target.checked })} /> Stream geplant</label>
                    </div>
                  ))}
                </div>
                {message && <div className={styles.message}>{message}</div>}
              </>
            ) : (
              <div className={styles.placeholder}>{tab === "website" ? "Website-Texte und Ankündigungen kommen als Nächstes." : tab === "setup" ? "Hardware-Verwaltung kommt als Nächstes." : "Community- und Social-Einstellungen kommen als Nächstes."}</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
