import "server-only";
import { getSiteDataStore } from "@/lib/cloudflareStore";
import { defaultSiteSettings, type SiteSettings } from "@/lib/siteSettings";

const KEY = "site-settings";

export async function getSiteSettings() {
  try {
    const saved = await getSiteDataStore().get(KEY, "json") as Partial<SiteSettings> | null;
    if (!saved) return defaultSiteSettings;
    return {
      ...defaultSiteSettings,
      ...saved,
      hardware: Array.isArray(saved.hardware) ? saved.hardware : defaultSiteSettings.hardware,
    };
  } catch {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings) {
  await getSiteDataStore().put(KEY, JSON.stringify(settings));
}
