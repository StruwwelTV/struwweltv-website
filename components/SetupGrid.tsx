"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, type HardwareItem } from "@/lib/siteSettings";
import styles from "@/components/SetupGrid.module.css";

export function SetupGrid() {
  const [hardware,setHardware]=useState<HardwareItem[]>(defaultSiteSettings.hardware);
  useEffect(()=>{ fetch("/api/site-settings",{cache:"no-store"}).then(r=>r.json()).then(d=>Array.isArray(d.hardware)&&setHardware(d.hardware)).catch(()=>{}); },[]);
  return <><div className={styles.grid}>{hardware.map((item,index)=>{ const className=`${styles.card} ${index<2?styles.featured:""} ${!item.href?styles.storage:""}`; const content=<><div className={styles.icon}>{item.icon}</div><div className={styles.copy}><span className={styles.label}>{item.label}</span><h3 className={styles.name}>{item.name}</h3>{item.detail&&<span className={styles.detail}>{item.detail}</span>}</div>{item.href&&<span className={styles.link}>GEIZHALS ↗</span>}</>; return item.href?<a key={`${item.label}-${index}`} className={className} href={item.href} target="_blank" rel="noreferrer">{content}</a>:<article key={`${item.label}-${index}`} className={className}>{content}</article>})}</div><p className={styles.note}>Du willst wissen, was im Chaos steckt? Klick auf eine Komponente für weitere Details bei Geizhals.</p></>;
}
