import { getStore } from "@netlify/blobs";

export type HardwareItem = { icon:string; label:string; name:string; detail:string; href?:string };
export type SiteSettings = {
  heroText:string;
  aboutText1:string;
  aboutText2:string;
  setupIntro:string;
  communityText:string;
  discordUrl:string;
  instagramUrl:string;
  youtubeUrl:string;
  hardware:HardwareItem[];
};

export const defaultSiteSettings: SiteSettings = {
  heroText:"Fragwürdige Entscheidungen, überraschend gute Runden und eine Community, die Treffer genauso feiert wie komplette Totalausfälle.",
  aboutText1:"Auf Twitch bin ich StruwwelTV. Bei mir geht es nicht darum, jede Runde perfekt zu spielen. Es geht um die Momente, die im Kopf bleiben – gute Plays, schlechte Ideen und die Sprüche danach.",
  aboutText2:"Warzone, spontane Challenges und ehrliche Reaktionen treffen auf schwarzen Humor, ohne den Respekt füreinander zu verlieren.",
  setupIntro:"Genug Leistung für gute Plays, schlechte Entscheidungen und alles dazwischen. Das steckt im Rechner hinter StruwwelTV.",
  communityText:"Mitspielen, Clips teilen, Memes abladen und bei Community-Events dabei sein. Wenn der Stream offline ist, geht es im Discord weiter.",
  discordUrl:"https://discord.gg/YZDB59vdV7",
  instagramUrl:"https://instagram.com/struwweltv",
  youtubeUrl:"https://youtube.com/struwwelTV",
  hardware:[
    {icon:"CPU",label:"Prozessor",name:"AMD Ryzen 7 7800X3D",detail:"8C / 16T · AM5 · 3D V-Cache",href:"https://geizhals.de/amd-ryzen-7-7800x3d-100-100000910wof-a2872148.html"},
    {icon:"GPU",label:"Grafikkarte",name:"MSI GeForce RTX 4070 Ti SUPER Ventus 3X OC",detail:"16 GB · GeForce RTX 40 SUPER",href:"https://geizhals.de/msi-geforce-rtx-4070-ti-super-16g-ventus-3x-oc-a3781093.html"},
    {icon:"MB",label:"Mainboard",name:"MSI X670E Gaming Plus WiFi",detail:"AMD X670E · AM5 · ATX · WiFi",href:"https://geizhals.de/msi-x670e-gaming-plus-wifi-7e16-001r-7e16-003r-a3086588.html"},
    {icon:"RAM",label:"Arbeitsspeicher",name:"Corsair Vengeance RGB · 32 GB",detail:"2 × 16 GB · DDR5",href:"https://geizhals.de/?fs=Corsair+Vengeance+RGB+32GB+2x16GB+DDR5"},
    {icon:"360",label:"Kühlung",name:"MSI MAG CoreLiquid E360",detail:"360-mm-AiO · 3 × 120 mm",href:"https://geizhals.de/msi-mag-coreliquid-e360-306-7zw6e11-c24-a3021565.html"},
    {icon:"850",label:"Netzteil",name:"be quiet! Pure Power 12 M · 850 W",detail:"80 PLUS Gold · vollmodular",href:"https://geizhals.de/be-quiet-pure-power-12-m-850w-atx-3-0-bn344-a2884020.html"},
    {icon:"CASE",label:"Gehäuse",name:"LC-Power Gaming 809B Dark Storm_X",detail:"Midi-Tower · Glas · ARGB",href:"https://geizhals.de/lc-power-gaming-809b-dark-storm-x-lc-809b-on-a3125683.html"},
    {icon:"SSD",label:"Speicher",name:"500 GB SSD · 1 TB SSD · 1 TB HDD",detail:"2,5 TB Gesamtspeicher"}
  ]
};

const store = () => getStore("struwweltv-cms");
export async function getSiteSettings(){ try { return (await store().get("site-settings",{type:"json"})) as SiteSettings || defaultSiteSettings; } catch { return defaultSiteSettings; } }
export async function saveSiteSettings(settings:SiteSettings){ await store().setJSON("site-settings",settings); }
