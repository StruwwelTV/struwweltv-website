"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, type SiteSettings } from "@/lib/siteSettings";

export function ManagedCommunity(){
  const [s,setS]=useState<SiteSettings>(defaultSiteSettings);
  useEffect(()=>{fetch("/api/site-settings",{cache:"no-store"}).then(r=>r.json()).then(d=>d&&setS(d)).catch(()=>{});},[]);
  return <div className="community-card card"><div><p className="kicker">MEHR ALS NUR ZUSCHAUEN</p><h2>Werde Teil der Community.</h2><p>{s.communityText}</p></div><div className="community-buttons"><a className="btn btn-primary" href={s.discordUrl} target="_blank" rel="noreferrer">Discord öffnen</a><a className="btn btn-secondary" href={s.instagramUrl} target="_blank" rel="noreferrer">Instagram</a><a className="btn btn-secondary" href={s.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a></div></div>;
}
