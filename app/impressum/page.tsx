import Link from "next/link";
import { getSiteSettings } from "@/lib/siteSettingsStore";

function withBreaks(value:string){
  return value.split("\n").map((line,index)=><span key={`${line}-${index}`}>{line}{index<value.split("\n").length-1&&<br/>}</span>);
}

export const dynamic = "force-dynamic";

export default async function ImpressumPage() {
  const settings = await getSiteSettings();
  return (
    <main className="legal">
      <Link href="/">← Zurück zur Startseite</Link>
      <h1>Impressum</h1>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>{settings.imprintProvider}<br />{withBreaks(settings.imprintAddress)}</p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a href={`mailto:${settings.imprintEmail}`}>{settings.imprintEmail}</a></p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>{withBreaks(settings.imprintResponsible)}</p>
      <p><small>Hinweis: Diese Seite stellt keine Rechtsberatung dar. Pflichtangaben sollten bei Änderungen des Angebots erneut geprüft werden.</small></p>
    </main>
  );
}
