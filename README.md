# StruwwelTV Website

Die StruwwelTV-Website läuft als Next.js-Anwendung über Cloudflare Workers und wird aus diesem GitHub-Repository gebaut und deployed.

## Architektur

- Next.js 15
- OpenNext für Cloudflare
- Cloudflare Workers für Hosting und API-Routen
- Cloudflare KV für persistente Control-Center-Daten
- Twitch API für Live-Status, Clips und Streamdaten
- GitHub als Codebasis

## Deployment

Cloudflare baut den `main`-Branch automatisch mit:

```bash
npm run cf:build
```

und deployed anschließend mit Wrangler.

## Cloudflare Bindings

Für das Control Center wird ein KV-Binding mit dem Namen `SITE_DATA` benötigt. Darin werden unter anderem gespeichert:

- `stream-schedule`
- `site-settings`

Secrets und Runtime-Variablen wie Twitch-Zugangsdaten sowie Admin-Zugangsdaten werden direkt in Cloudflare gepflegt und gehören nicht ins Repository.

Für die Discord-Synchronisierung wird zusätzlich das verschlüsselte Worker-Secret `DISCORD_STREAMPLAN_WEBHOOK_URL` benötigt. Die Webhook-URL darf nicht in Wrangler-Konfigurationen oder GitHub gespeichert werden.

## Domains

- https://struwweltv.de
- https://www.struwweltv.de

Beide Domains zeigen direkt auf den Cloudflare Worker.

## Control Center

Der interne Administrationsbereich befindet sich unter `/admin`. Dort können Streamplan, Website-Texte, Setup, Community-Links und rechtliche Inhalte verwaltet werden.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Für Cloudflare-spezifische Funktionen sollten lokale Bindings bzw. eine passende Wrangler-Konfiguration verwendet werden.

