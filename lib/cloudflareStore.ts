import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type KVLike = {
  get(key: string, type: "json"): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
};

export function getSiteDataStore(): KVLike {
  const { env } = getCloudflareContext();
  const kv = (env as unknown as { SITE_DATA?: KVLike }).SITE_DATA;
  if (!kv) {
    throw new Error("Cloudflare KV binding SITE_DATA is not configured");
  }
  return kv;
}
