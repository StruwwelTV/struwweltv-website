"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultSchedule, type ScheduleEntry } from "@/lib/scheduleData";
import { defaultSiteSettings, type SiteSettings } from "@/lib/siteSettings";
import styles from "@/components/AdminControlCenter.module.css";

type Tab = "schedule" | "website" | "setup" | "community" | "legal";

export function AdminControlCenter() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("schedule");
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(defaultSchedule);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" }).then((r) => r.json()).then((d) => setAuthenticated(Boolean(d.authenticated))).catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    Promise.all([
      fetch("/api/admin/schedule", { cache: "no-store" }).then(r => r.json()),
      fetch("/api/admin/site-settings", { cache: "no-store" }).then(r => r.json())
    ]).then(([s,c]) => {
      if (Array.isArray(s.schedule)) setSchedule(s.schedule);
      if (c && c.heroText) setSettings({...defaultSiteSettings,...c,hardware:Array.isArray(c.hardware)?c.hardware:defaultSiteSettings.hardware});
    }).catch(() => {});
  }, [authenticated]);

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
    {id:"schedule",label:"Streamplan"},
    {id:"website",label:"Website"},
    {id:"setup",label:"Setup"},
    {id:"community",label:"Community"},
    {id:"legal",label:"Rechtliches"},
  ];

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.topbar}><div className={styles.brand}><Image src="/logo.png" width={48} height={48} alt="STV" /><div><strong>STRUWWELTV</strong><span>CONTROL CENTER</span></div></div><div className={styles.status}><span className={styles.pill}><b>●</b> Website online</span><span className={styles.pill}>CMS aktiv</span><button className={styles.logout} onClick={logout}>Abmelden</button></div></div>
    <section className={styles.hero}><span className={styles.eyebrow}>STRUWWELTV // CONTROL CENTER</span><h1>Dein Chaos.<br/>Deine Regeln.</h1></section>
    <div className={styles.grid}><nav className={styles.nav}>{tabs.map(item=><button key={item.id} className={`${styles.navButton} ${tab===item.id?styles.navButtonActive:""}`} onClick={()=>{setTab(item.id);setMessage("")}}>{item.label}</button>)}</nav>
    <section className={styles.panel}>
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
