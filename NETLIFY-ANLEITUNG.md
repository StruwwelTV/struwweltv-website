# StruwwelTV auf Netlify einrichten

## 1. Twitch-Secret zuerst erneuern

Da der frühere Secret in einem Chat geteilt wurde, in der Twitch Developer Console
einen neuen Secret erzeugen. Den neuen Wert nicht in Dateien oder Chats einfügen.

## 2. Projekt auf Netlify hochladen

- ZIP entpacken.
- In Netlify: `Add new project` → `Deploy manually`.
- Den entpackten Ordner `struwweltv_netlify` in die Upload-Fläche ziehen.
- Wichtig: Nicht nur die ZIP-Datei und nicht einen übergeordneten leeren Ordner hochladen.

Netlify erkennt `netlify.toml` und veröffentlicht die Seite samt Function.

## 3. Umgebungsvariablen eintragen

Im Netlify-Projekt:

`Project configuration` → `Environment variables` → `Add a variable`

Anlegen:

- `TWITCH_CLIENT_ID` = deine Twitch Client-ID
- `TWITCH_CLIENT_SECRET` = dein frisch erneuerter Secret
- `TWITCH_CHANNEL` = `struwweltv`

Für Client-ID und Secret mindestens die Scopes für `Functions` setzen, falls Netlify
eine Scope-Auswahl anzeigt.

Danach unter `Deploys` einen neuen Deploy auslösen:
`Trigger deploy` → `Deploy site`.

## 4. Funktion testen

Nach dem Deploy folgende Adresse öffnen:

`https://DEIN-NETLIFY-NAME.netlify.app/.netlify/functions/twitch`

Es muss JSON mit `channel`, `live`, `clips` und `videos` erscheinen.
Die Seite lädt danach automatisch den Live-Status und die neuesten Clips.

## 5. Domain hinzufügen

Im Projekt:

`Domain management` → `Add a domain` → `Add a domain you already own`

Domain: `struwweltv.de`

Anschließend zeigt Netlify unter `Pending DNS verification`, welche DNS-Einträge
bei STRATO gesetzt werden müssen. Diese konkreten Werte verwenden, da Netlify sie
projektspezifisch vorgibt.

## 6. E-Mail bei STRATO schützen

Wenn `mail@struwweltv.de` weiterhin über STRATO läuft, die vorhandenen MX- und
E-Mail-DNS-Einträge nicht löschen. Nur die von Netlify geforderten Web-DNS-Einträge
(A/AAAA/CNAME) ändern.

## Dateien

- `netlify/functions/twitch.mjs`: sicherer serverseitiger Twitch-API-Zugriff
- `netlify.toml`: Netlify-Konfiguration
- `config.js`: öffentliche Links und Streamplan
- `app.js`: Live-Status und dynamische Clips


## Fehlerbehebung v1.4

Die Twitch Function wurde auf das aktuelle Netlify-Response-Format umgestellt.
Sie liefert nun ein echtes JavaScript-`Response`-Objekt und liest Variablen über
`Netlify.env.get(...)`.

Zum Aktualisieren den kompletten entpackten Ordner erneut in Netlify Drop hochladen.
