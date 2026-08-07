import Image from "next/image";
import Link from "next/link";
import { LiveBadge } from "@/components/LiveBadge";
import { TwitchHub } from "@/components/TwitchHub";
import { StreamSchedule } from "@/components/StreamSchedule";
import { SetupGrid } from "@/components/SetupGrid";

const portraitSrc = "/bastian-neu.jpg";

export default function Home() {
  return (
    <main>
      <header className="nav-shell">
        <Link href="#top" className="brand" aria-label="StruwwelTV Startseite"><Image src="/logo.png" width={46} height={46} alt="StruwwelTV Logo" priority /><span>STRUWWEL<span>TV</span></span></Link>
        <nav className="desktop-nav" aria-label="Hauptnavigation"><Link href="#live">Live</Link><Link href="#clips">Clips</Link><Link href="#about">Über mich</Link><Link href="#setup">Setup</Link><Link href="#schedule">Streamplan</Link><Link href="#community">Community</Link></nav>
        <a className="nav-cta" href="https://www.twitch.tv/struwwelTV" target="_blank" rel="noreferrer">Twitch ↗</a>
      </header>

      <section className="hero" id="top"><div className="hero-grid" /><div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" /><div className="hero-copy"><LiveBadge /><p className="kicker">WARZONE · ENTERTAINMENT · COMMUNITY</p><h1>CHAOS.<br /><span>KUGELN.</span><br />COMMUNITY.</h1><p className="hero-text">Fragwürdige Entscheidungen, überraschend gute Runden und eine Community, die Treffer genauso feiert wie komplette Totalausfälle.</p><div className="hero-actions"><a className="btn btn-primary" href="https://www.twitch.tv/struwwelTV" target="_blank" rel="noreferrer">Jetzt auf Twitch</a><a className="btn btn-secondary" href="https://discord.gg/YZDB59vdV7" target="_blank" rel="noreferrer">Discord beitreten</a></div><div className="hero-facts"><div><strong>LIVE</strong><span>Warzone & mehr</span></div><div><strong>18+</strong><span>Humor mit Schäden</span></div><div><strong>100%</strong><span>Community</span></div></div></div><div className="hero-portrait" aria-label="StruwwelTV Logo"><div className="portrait-orbit" /><div style={{ position:"relative",width:"min(43vw, 610px)",aspectRatio:"1 / 1",display:"grid",placeItems:"center",borderRadius:"50%",zIndex:2,background:"radial-gradient(circle, rgba(61,214,208,.12) 0%, rgba(61,214,208,.035) 48%, transparent 70%)",filter:"drop-shadow(0 0 46px rgba(61,214,208,.28))" }}><Image src="/logo.png" width={610} height={610} alt="STV – StruwwelTV" priority style={{width:"92%",height:"92%",objectFit:"contain",borderRadius:"50%",filter:"drop-shadow(0 0 24px rgba(61,214,208,.35))"}} /></div><div className="floating-tag tag-top"><span>STATUS</span><b>CONNECTED</b></div><div className="floating-tag tag-bottom"><span>MODE</span><b>CHAOS</b></div></div></section>

      <section className="section" id="live"><div className="section-head"><p className="kicker">LIVE AUS DEM CHAOS</p><h2>Twitch. Direkt hier.</h2><p>Live-Status, aktuelles Game, Zuschauer und die neuesten Clips kommen automatisch aus der Twitch-API.</p></div><TwitchHub /></section>

      <section className="section about-grid" id="about"><div className="about-image card"><img src={portraitSrc} alt="Bastian alias StruwwelTV" className="about-photo" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 35%"}} /></div><article className="about-copy card"><p className="kicker">HINTER DEM LOGO</p><h2>Moin, ich bin Bastian.</h2><p>Auf Twitch bin ich StruwwelTV. Bei mir geht es nicht darum, jede Runde perfekt zu spielen. Es geht um die Momente, die im Kopf bleiben – gute Plays, schlechte Ideen und die Sprüche danach.</p><p>Warzone, spontane Challenges und ehrliche Reaktionen treffen auf schwarzen Humor, ohne den Respekt füreinander zu verlieren.</p><blockquote>„Chaos. Kugeln. Community.“</blockquote></article></section>

      <section className="section" id="setup"><div className="section-head setup-head"><div><p className="kicker">UNTER DER HAUBE</p><h2>Mein Setup.</h2></div><p>Die Technik hinter dem Chaos. Cleaner auf einen Blick – und mit einem Klick direkt zur jeweiligen Komponente bei Geizhals.</p></div><SetupGrid /><div className="setup-strip card"><span>THE BUILD</span><strong>7800X3D</strong><i>×</i><strong>RTX 4070 Ti SUPER</strong><i>×</i><strong>32 GB DDR5</strong></div></section>

      <section className="section" id="schedule"><div className="section-head"><p className="kicker">STREAMPLAN</p><h2>Wann das Chaos beginnt.</h2><p>Der Plan erkennt automatisch den aktuellen Wochentag und zeigt dir, welcher Stream als Nächstes ansteht.</p></div><StreamSchedule /></section>

      <section className="section" id="community"><div className="community-card card"><div><p className="kicker">MEHR ALS NUR ZUSCHAUEN</p><h2>Werde Teil der Community.</h2><p>Mitspielen, Clips teilen, Memes abladen und bei Community-Events dabei sein. Wenn der Stream offline ist, geht es im Discord weiter.</p></div><div className="community-buttons"><a className="btn btn-primary" href="https://discord.gg/YZDB59vdV7" target="_blank" rel="noreferrer">Discord öffnen</a><a className="btn btn-secondary" href="https://instagram.com/struwweltv" target="_blank" rel="noreferrer">Instagram</a><a className="btn btn-secondary" href="https://youtube.com/struwwelTV" target="_blank" rel="noreferrer">YouTube</a></div></div></section>

      <footer className="footer"><div className="footer-brand"><Image src="/logo.png" width={52} height={52} alt="StruwwelTV" /><div><strong>STRUWWELTV</strong><span>Chaos. Kugeln. Community.</span></div></div><div className="footer-links"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><a href="mailto:mail@struwweltv.de">Kontakt</a></div><small>© {new Date().getFullYear()} StruwwelTV</small></footer>
    </main>
  );
}