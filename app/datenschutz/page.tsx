import Link from "next/link";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function DatenschutzPage() {
  const settings = await getSiteSettings();
  return (
    <main className="legal">
      <Link href="/">← Zurück zur Startseite</Link>
      <h1>Datenschutz</h1>
      <p>{settings.privacyIntro}</p>
      <h2>Hosting</h2>
      <p>{settings.privacyHosting}</p>
      <h2>Twitch</h2>
      <p>{settings.privacyTwitch}</p>
      <h2>Externe Links</h2>
      <p>{settings.privacyExternalLinks}</p>
      <h2>Kontakt</h2>
      <p>Bei Fragen zum Datenschutz: <a href={`mailto:${settings.privacyContact}`}>{settings.privacyContact}</a></p>
      <p><small>Hinweis: Dieser Text ist eine technische Ausgangsvorlage und keine Rechtsberatung. Bei Änderungen der eingesetzten Dienste sollte die Datenschutzerklärung erneut geprüft werden.</small></p>
    </main>
  );
}
