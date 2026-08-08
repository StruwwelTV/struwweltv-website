"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { defaultSchedule, type ScheduleEntry } from "@/lib/scheduleData";
import { defaultSiteSettings, type SiteSettings } from "@/lib/siteSettings";
import styles from "@/components/AdminControlCenter.module.css";

type Tab = "dashboard" | "schedule" | "website" | "setup" | "community" | "legal";

type TwitchData = {
  live?: boolean;
  stream?: {
    title?: string;
    gameName?: string;
    viewerCount?: number;
    startedAt?: string;
  } | null;
  clips?: Array<{
    id: string;
    title: string;
    createdAt: string;
    viewCount: number;
  }>;
  error?: string;
};

function getNextStream(schedule: ScheduleEntry[]) {
  const now = new Date();
  const active = schedule.filter((entry) => entry.active);
  if (!active.length) return null;

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    const weekday = date.getDay();
    const entry = active.find((item) => item.key === weekday);
    if (!entry) continue;

    const match = entry.time.match(/^(\d{1,2}):(\d{2})$/);
    if (offset === 0 && match) {
      const streamTime = new Date(date);
      streamTime.setHours(Number(match[1]), Number(match[2]), 0, 0);
      if (streamTime <= now) continue;
    }

    return {
      ...entry,
      dateLabel: offset === 0 ? "Heute" : offset === 1 ? "Morgen" : entry.label,
    };
  }

  return active[0] ? { ...active[0], dateLabel: active[0].label } : null;
}

function formatLiveSince(value?: string) {
  if (!value) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} Std.${rest ? ` ${rest} Min.` : ""}`;
}

export function AdminControlCenter() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(defaultSchedule);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [twitch, setTwitch] = useState<TwitchData | null>(null);
  const [twitchLoading, setTwitchLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" }).then((r) => r.json()).then((d) => setAuthenticated(Boolean(d.authenticated))).catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    setTwitchLoading(true);
    Promise.all([
      fetch("/api/admin/schedule", { cache: "no-store" }).then(r => r.json()),
      fetch("/api/admin/site-settings", { cache: "no-store" }).then(r => r.json()),
      fetch("/api/twitch", { cache: "no-store" }).then(r => r.json())
    ]).then(([s,c,t]) => {
      if (Array.isArray(s.schedule)) setSchedule(s.schedule);
      if (c && c.heroText) setSettings({...defaultSiteSettings,...c,hardware:Array.isArray(c.hardware)?c.hardware:defaultSiteSettings.hardware});
      setTwitch(t);
    }).catch(() => setTwitch({error:"Status konnte nicht geladen werden."})).finally(() => setTwitchLoading(false));
  }, [authenticated]);

  const nextStream = useMemo(() => getNextStream(schedule), [schedule]);
  const latestClip = twitch?.clips?.[0];

  async function login(event: React.FormEvent) {
    event.preventDefault(); setLoginError("");
    const res = await fetch("/api/admin/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) });
    if (!res.ok) { const data=await res.json().catch(()=>({})); setLoginError(data.error||"Login fehlgeschlagen."); return; }
    setPassword(""); setAuthenticated(true);
  }
  async function logout(){ await fetch("/api/admin/logout",{method:"POST"}); setAuthenticated(false); }
  function updateEntry(index:number, patch:Partial<ScheduleEntry>){ setSchedule(c=>c.map((x,i)=>i===index?{...x,...patch}:x)); setMessage(""); }
  function patchSettings(patch:Partial<SiteSettings>){ setSettings(s=>({...s,...patch})); setMessage(""); }

  async function saveSchedule(){
    setSaving(true); setMessage("");
    const res=await fetch("/api/admin/schedule",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({schedule})});
    const data=await res.json().catch(()=>({})); setSaving(false); setMessage(res.ok?"Gespeichert – der öffentliche Streamplan ist aktualisiert.":data.error||"Speichern fehlgeschlagen.");
  }
  async function saveSettings(){
    setSaving(true); setMessage("");
    const res=await fetch("/api/admin/site-settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)});
    const data=await res.json().catch(()=>({})); setSaving(false); setMessage(res.ok?"Gespeichert – die Website ist jetzt aktualisiert.":data.error||"Speichern fehlgeschlagen.");
  }

  if (authenticated===null) return <div className={styles.loginWrap}><div className={styles.login}><p>Control Center wird geladen …</p></div></div>;
  if (!authenticated) return <div className={styles.loginWrap}><div className={styles.login}><Image className={styles.loginLogo} src="/logo.png" width={74} height={74} alt="StruwwelTV" priority /><h1>Control Center</h1><p>Interner Bereich für StruwwelTV. Melde dich an, um Inhalte der Website zu verwalten.</p><form onSubmit={login}><input className={styles.input} type="password" placeholder="Admin-Passwort" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required />{loginError&&<p className={styles.error}>{loginError}</p>}<button type="submit">Einloggen</button></form></div></div>;

  const tabs: {id:Tab; label:string}[] = [
    {id:"dashboard",label:"Dashboard"},
    {id:"schedule",label:"Streamplan"},
    {id:"website",label:"Website"},
    {id:"setup",label:"Setup"},
    {id:"community",label:"Community"},
    {id:"legal",label:"Rechtliches"},
  ];

  const quickActions: {tab:Tab; title:string; text:string}[] = [
    {tab:"schedule",title:"Streamplan",text:"Zeiten und Inhalte ändern"},
    {tab:"website",title:"Website",text:"Texte der Startseite bearbeiten"},
    {tab:"setup",title:"Setup",text:"Hardware und Produktlinks pflegen"},
    {tab:"community",title:"Community",text:"Socials und Community-Text ändern"},
    {tab:"legal",title:"Rechtliches",text:"Impressum und Datenschutz pflegen"},
  ];

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.topbar}><div className={styles.brand}><Image src="/logo.png" width={48} height={48} alt="STV" /><div><strong>STRUWWELTV</strong><span>CONTROL CENTER</span></div></div><div className={styles.status}><span className={styles.pill}><b>●</b> Website online</span><span className={styles.pill}>Cloudflare aktiv</span><button className={styles.logout} onClick={logout}>Abmelden</button></div></div>
    <section className={styles.hero}><span className={styles.eyebrow}>STRUWWELTV // CONTROL CENTER</span><h1>Dein Chaos.<br/>Deine Regeln.</h1></section>
    <div className={styles.grid}><nav className={styles.nav}>{tabs.map(item=><button key={item.id} className={`${styles.navButton} ${tab===item.id?styles.navButtonActive:""}`} onClick={()=>{setTab(item.id);setMessage("")}}>{item.label}</button>)}</nav>
    <section className={styles.panel}>
      {tab==="dashboard"&&<><div className={styles.panelHead}><div><h2>Dashboard</h2><p>Alles Wichtige auf einen Blick – Website, Twitch, Clips und der nächste Stream.</p></div><a className={styles.visitSite} href="/" target="_blank" rel="noreferrer">Website öffnen ↗</a></div>
        <div className={styles.dashboardCards}>
          <article className={styles.dashboardCard}><div className={styles.cardTop}><span>WEBSITE</span><i className={styles.statusDot}/></div><strong>Online</strong><p>struwweltv.de läuft über Cloudflare Workers.</p><small>HTTPS · Full (strict)</small></article>
          <article className={styles.dashboardCard}><div className={styles.cardTop}><span>TWITCH</span><i className={`${styles.statusDot} ${twitch?.live?styles.liveDot:styles.offlineDot}`}/></div><strong>{twitchLoading?"Lädt …":twitch?.live?"LIVE":"Offline"}</strong><p>{twitch?.live?`${twitch.stream?.gameName||"Live"} · ${twitch.stream?.viewerCount??0} Zuschauer`:"Der Stream ist aktuell offline."}</p><small>{twitch?.live&&twitch.stream?.startedAt?`Live seit ${formatLiveSince(twitch.stream.startedAt)}`:twitch?.error||"Twitch API verbunden"}</small></article>
          <article className={styles.dashboardCard}><div className={styles.cardTop}><span>CLIPS</span><i className={styles.statusDot}/></div><strong>{twitchLoading?"…":`${twitch?.clips?.length||0} geladen`}</strong><p>{latestClip?latestClip.title:"Noch kein Clip verfügbar."}</p><small>{latestClip?`${latestClip.viewCount} Views · neuester Twitch-Clip`:"Twitch Clips"}</small></article>
          <article className={styles.dashboardCard}><div className={styles.cardTop}><span>NÄCHSTER STREAM</span><i className={styles.statusDot}/></div><strong>{nextStream?`${nextStream.dateLabel} · ${nextStream.time}`:"Nicht geplant"}</strong><p>{nextStream?nextStream.title:"Aktuell ist kein Stream aktiviert."}</p><small>{nextStream?`${nextStream.label} im Streamplan`:"Streamplan öffnen und Termin aktivieren"}</small></article>
        </div>
        <div className={styles.dashboardSection}><div className={styles.dashboardSectionHead}><div><h3>Schnellaktionen</h3><p>Direkt zu den Bereichen, die du am häufigsten brauchst.</p></div></div><div className={styles.quickGrid}>{quickActions.map(action=><button key={action.tab} className={styles.quickAction} onClick={()=>setTab(action.tab)}><strong>{action.title}</strong><span>{action.text}</span><b>→</b></button>)}</div></div>
      </>}
      {tab==="schedule"&&<><div className={styles.panelHead}><div><h2>Streamplan</h2><p>Uhrzeiten, Inhalte und aktive Streamtage bearbeiten.</p></div><button className={styles.save} onClick={saveSchedule} disabled={saving}>{saving?"Speichert …":"Änderungen speichern"}</button></div><div className={styles.schedule}>{schedule.map((entry,index)=><div className={styles.row} key={entry.key}><div className={styles.day}>{entry.day}</div><input className={styles.input} value={entry.time} onChange={e=>updateEntry(index,{time:e.target.value})}/><input className={styles.input} value={entry.title} onChange={e=>updateEntry(index,{title:e.target.value})}/><label className={styles.switch}><input type="checkbox" checked={entry.active} onChange={e=>updateEntry(index,{active:e.target.checked})}/> Stream geplant</label></div>)}</div></>}
      {tab==="website"&&<><div className={styles.panelHead}><div><h2>Website-Texte</h2><p>Die wichtigsten Texte auf der Startseite direkt ändern.</p></div><button className={styles.save} onClick={saveSettings} disabled={saving}>{saving?"Speichert …":"Änderungen speichern"}</button></div><div className={styles.formGrid}><label>Hero-Text<textarea className={styles.textarea} value={settings.heroText} onChange={e=>patchSettings({heroText:e.target.value})}/></label><label>Über mich – Absatz 1<textarea className={styles.textarea} value={settings.aboutText1} onChange={e=>patchSettings({aboutText1:e.target.value})}/></label><label>Über mich – Absatz 2<textarea className={styles.textarea} value={settings.aboutText2} onChange={e=>patchSettings({aboutText2:e.target.value})}/></label><label>Setup-Intro<textarea className={styles.textarea} value={settings.setupIntro} onChange={e=>patchSettings({setupIntro:e.target.value})}/></label></div></>}
      {tab==="setup"&&<><div className={styles.panelHead}><div><h2>Setup</h2><p>Komponenten, technische Details und Geizhals-Links verwalten.</p></div><button className={styles.save} onClick={saveSettings} disabled={saving}>{saving?"Speichert …":"Änderungen speichern"}</button></div><div className={styles.hardwareAdmin}>{settings.hardware.map((item,index)=><div className={styles.hardwareRow} key={`${item.label}-${index}`}><input className={styles.input} value={item.icon} onChange={e=>{const h=[...settings.hardware];h[index]={...h[index],icon:e.target.value};patchSettings({hardware:h})}} placeholder="Icon"/><input className={styles.input} value={item.label} onChange={e=>{const h=[...settings.hardware];h[index]={...h[index],label:e.target.value};patchSettings({hardware:h})}} placeholder="Kategorie"/><input className={styles.input} value={item.name} onChange={e=>{const h=[...settings.hardware];h[index]={...h[index],name:e.target.value};patchSettings({hardware:h})}} placeholder="Produkt"/><input className={styles.input} value={item.detail} onChange={e=>{const h=[...settings.hardware];h[index]={...h[index],detail:e.target.value};patchSettings({hardware:h})}} placeholder="Details"/><input className={styles.input} value={item.href||""} onChange={e=>{const h=[...settings.hardware];h[index]={...h[index],href:e.target.value};patchSettings({hardware:h})}} placeholder="Geizhals-Link"/></div>)}</div></>}
      {tab==="community"&&<><div className={styles.panelHead}><div><h2>Community</h2><p>Community-Text und Social-Links zentral verwalten.</p></div><button className={styles.save} onClick={saveSettings} disabled={saving}>{saving?"Speichert …":"Änderungen speichern"}</button></div><div className={styles.formGrid}><label>Community-Text<textarea className={styles.textarea} value={settings.communityText} onChange={e=>patchSettings({communityText:e.target.value})}/></label><label>Discord<input className={styles.input} value={settings.discordUrl} onChange={e=>patchSettings({discordUrl:e.target.value})}/></label><label>Instagram<input className={styles.input} value={settings.instagramUrl} onChange={e=>patchSettings({instagramUrl:e.target.value})}/></label><label>YouTube<input className={styles.input} value={settings.youtubeUrl} onChange={e=>patchSettings({youtubeUrl:e.target.value})}/></label></div></>}
      {tab==="legal"&&<><div className={styles.panelHead}><div><h2>Rechtliches</h2><p>Impressum und Datenschutzerklärung direkt verwalten. Rechtliche Änderungen sollten im Zweifel fachlich geprüft werden.</p></div><button className={styles.save} onClick={saveSettings} disabled={saving}>{saving?"Speichert …":"Änderungen speichern"}</button></div><div className={styles.formGrid}>
        <label>Impressum – Name / Anbieter<input className={styles.input} value={settings.imprintProvider} onChange={e=>patchSettings({imprintProvider:e.target.value})}/></label>
        <label>Impressum – Anschrift<textarea className={styles.textarea} value={settings.imprintAddress} onChange={e=>patchSettings({imprintAddress:e.target.value})}/></label>
        <label>Impressum – E-Mail<input className={styles.input} type="email" value={settings.imprintEmail} onChange={e=>patchSettings({imprintEmail:e.target.value})}/></label>
        <label>Verantwortlich für den Inhalt<textarea className={styles.textarea} value={settings.imprintResponsible} onChange={e=>patchSettings({imprintResponsible:e.target.value})}/></label>
        <label>Datenschutz – Einleitung<textarea className={styles.textarea} value={settings.privacyIntro} onChange={e=>patchSettings({privacyIntro:e.target.value})}/></label>
        <label>Datenschutz – Hosting<textarea className={styles.textarea} value={settings.privacyHosting} onChange={e=>patchSettings({privacyHosting:e.target.value})}/></label>
        <label>Datenschutz – Twitch<textarea className={styles.textarea} value={settings.privacyTwitch} onChange={e=>patchSettings({privacyTwitch:e.target.value})}/></label>
        <label>Datenschutz – Externe Links<textarea className={styles.textarea} value={settings.privacyExternalLinks} onChange={e=>patchSettings({privacyExternalLinks:e.target.value})}/></label>
        <label>Datenschutz – Kontakt-E-Mail<input className={styles.input} type="email" value={settings.privacyContact} onChange={e=>patchSettings({privacyContact:e.target.value})}/></label>
      </div></>}
      {message&&<div className={styles.message}>{message}</div>}
    </section></div>
  </div></main>;
}
