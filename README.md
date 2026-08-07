
# StruwwelTV Website

## Schnellstart

1. Entpacke den Ordner.
2. Öffne `config.js`.
3. Trage deine Social-Media-Links und deinen Streamplan ein.
4. Starte lokal einen Webserver, zum Beispiel:
   `python -m http.server 8000`
5. Öffne `http://localhost:8000`.

## Twitch-Einbettung

Twitch verlangt für den eingebetteten Player eine erlaubte Parent-Domain.
Sobald die Website online ist, trägst du in `config.js` deine Domain ein:

`twitchParentDomains: ["struwweltv.de", "www.struwweltv.de"]`

## Veröffentlichung

Der Ordner kann direkt bei Netlify, Vercel, GitHub Pages oder einem normalen Webhoster hochgeladen werden.

## Vor dem Livegang ersetzen

- Discord-, YouTube-, Instagram- und TikTok-Link
- Streamzeiten
- Impressumsangaben
- Datenschutztext
- Beispiel-Clips
- Domain in `twitchParentDomains`

## Enthalten

- Responsive Startseite
- Twitch-Player
- Streamplan aus Konfigurationsdatei
- Social Hub
- Highlight-Bereich
- Mobile Navigation
- Scroll-Animationen
- SEO-Basisdaten
- Impressums- und Datenschutzvorlage


## Bereits eingetragen

- Domain: https://struwweltv.de
- Twitch: https://www.twitch.tv/struwwelTV
- YouTube: https://www.youtube.com/struwwelTV
- Discord: https://discord.gg/YZDB59vdV7
- Impressum: Bastian Struff, Föhrenweg 8, 21339 Lüneburg

Noch offen:
- E-Mail-Adresse im Impressum
- Instagram-/TikTok-Links


## Version 1.2

- Instagram ergänzt
- TikTok vollständig entfernt
- Porträtfoto im Über-mich-Bereich eingebaut
- Slogan „Chaos. Kugeln. Community.“ bestätigt
- Twitch-Clips und Videoübersicht verlinkt
- Erster öffentlich auffindbarer Clip „Kills zusammen“ eingebunden

Hinweis: Für automatisch wechselnde Clip-Vorschaubilder ist später eine Twitch-API-Anbindung mit Client-ID nötig.
