"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, type SiteSettings } from "@/lib/siteSettings";

type Key = "heroText"|"aboutText1"|"aboutText2"|"setupIntro"|"communityText";
export function ManagedText({field,className}:{field:Key;className?:string}){
  const [text,setText]=useState(defaultSiteSettings[field]);
  useEffect(()=>{fetch("/api/site-settings",{cache:"no-store"}).then(r=>r.json()).then((d:SiteSettings)=>d?.[field]&&setText(d[field])).catch(()=>{});},[field]);
  return <p className={className}>{text}</p>;
}
