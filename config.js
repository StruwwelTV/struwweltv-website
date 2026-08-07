
const STRUWWEL_CONFIG = {
  twitchChannel: "struwweltv",

  /*
    Für Twitch-Embeds muss hier später deine echte Domain stehen,
    zum Beispiel: "struwweltv.de".
    Für einen lokalen Test bleibt "localhost" korrekt.
  */
  twitchParentDomains: ["struwweltv.de", "www.struwweltv.de"],

  socialLinks: {
    twitch: "https://www.twitch.tv/struwwelTV",
    discord: "https://discord.gg/YZDB59vdV7",
    youtube: "https://www.youtube.com/struwwelTV",
    instagram: "https://www.instagram.com/struwweltv",
    tiktok: ""
  },

  clips: [
    {
      title: "Kills zusammen",
      category: "TWITCH CLIP",
      url: "https://www.twitch.tv/struwweltv/clip/SavageBitterMangetoutSpicyBoy-YLh5GWWEX1hN8F40"
    },
    {
      title: "Weitere Twitch-Clips",
      category: "STRUWWELTV",
      url: "https://www.twitch.tv/struwweltv/videos?filter=clips"
    },
    {
      title: "Highlights & vergangene Streams",
      category: "TWITCH VIDEOS",
      url: "https://www.twitch.tv/struwweltv/videos"
    }
  ],

  schedule: [
    { day: "Montag", time: "Offline", title: "Regeneration" },
    { day: "Dienstag", time: "19:00 Uhr", title: "Warzone" },
    { day: "Mittwoch", time: "Offline", title: "Clips schneiden" },
    { day: "Donnerstag", time: "19:00 Uhr", title: "Warzone" },
    { day: "Freitag", time: "19:00 Uhr", title: "Open End" },
    { day: "Samstag", time: "Variabel", title: "Community / Event" },
    { day: "Sonntag", time: "Variabel", title: "Special Stream" }
  ]
};
