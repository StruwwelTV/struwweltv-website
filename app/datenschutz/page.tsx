import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main className="legal">
      <Link href="/">← Zurück zur Startseite</Link>
      <h1>Datenschutz</h1>
      <p>Diese Website verarbeitet nur die Daten, die für den technischen Betrieb und die eingebundenen Funktionen erforderlich sind.</p>
      <h2>Hosting</h2>
      <p>Die Website wird über Netlify bereitgestellt. Beim Aufruf können technisch erforderliche Verbindungsdaten verarbeitet werden.</p>
      <h2>Twitch</h2>
      <p>Die Website bindet Inhalte und Daten von Twitch ein. Beim Laden des Twitch-Players oder beim Öffnen von Twitch-Clips kann eine Verbindung zu Twitch Interactive, Inc. hergestellt werden.</p>
      <h2>Externe Links</h2>
      <p>Die Website verlinkt unter anderem auf Twitch, YouTube, Instagram und Discord. Für diese externen Angebote gelten die Datenschutzbestimmungen der jeweiligen Plattform.</p>
      <h2>Kontakt</h2>
      <p>Bei Fragen zum Datenschutz: <a href="mailto:mail@struwweltv.de">mail@struwweltv.de</a></p>
      <p><small>Hinweis: Dieser Text ist eine technische Ausgangsvorlage und keine Rechtsberatung. Vor dem endgültigen öffentlichen Launch sollte die Datenschutzerklärung an alle tatsächlich eingesetzten Dienste angepasst und rechtlich geprüft werden.</small></p>
    </main>
  );
}
