import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="legal">
      <Link href="/">← Zurück zur Startseite</Link>
      <h1>Impressum</h1>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>Bastian Struff<br />Föhrenweg 8<br />21339 Lüneburg<br />Deutschland</p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a href="mailto:mail@struwweltv.de">mail@struwweltv.de</a></p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>Bastian Struff<br />Anschrift wie oben</p>
      <p><small>Hinweis: Diese Seite stellt keine Rechtsberatung dar. Pflichtangaben sollten bei Änderungen des Angebots erneut geprüft werden.</small></p>
    </main>
  );
}
