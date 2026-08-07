import Image from "next/image";
import Link from "next/link";
import { LiveBadge } from "@/components/LiveBadge";
import { TwitchHub } from "@/components/TwitchHub";

const schedule = [
  ["MO", "Offline", "Regeneration"],
  ["DI", "19:00", "Warzone"],
  ["MI", "Offline", "Clips & Pause"],
  ["DO", "19:00", "Warzone"],
  ["FR", "19:00", "Open End"],
  ["SA", "Variabel", "Community / Event"],
  ["SO", "Variabel", "Special Stream"],
];

export default function Home() {
  return (
    <main>
      <header className="nav-shell">
        <Link href="#top" className="brand" aria-label="StruwwelTV Startseite">
          <Image src="/logo.png" width={46} height={46} alt="StruwwelTV Logo" priority />
          <span>STRUWWEL<span>TV</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <Link href="#live">Live</Link>
          <Link href="#clips">Clips</Link>
          <Link href="#about">Über mich</Link>
          <Link href="#schedule">Streamplan</Link>
          <Link href="#community">Community</Link>
        </nav>
        <a className="nav-cta" href="https://www.twitch.tv/struwwelTV" target="_blank" rel="noreferrer">Twitch ↗</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-copy">
          <LiveBadge />
          <p className="kicker">WARZONE · ENTERTAINMENT · COMMUNITY</p>
          <h1>
            CHAOS.<br />
            <span>KUGELN.</span><br />
            COMMUNITY.
          </h1>
          <p className="hero-text">
            Fragwürdige Entscheidungen, überraschend gute Runden und eine Community,
            die Treffer genauso feiert wie komplette Totalausfälle.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="https://www.twitch.tv/struwwelTV" target="_blank" rel="noreferrer">Jetzt auf Twitch</a>
            <a className="btn btn-secondary" href="https://discord.gg/YZDB59vdV7" target="_blank" rel="noreferrer">Discord beitreten</a>
          </div>
          <div className="hero-facts">
            <div><strong>LIVE</strong><span>Warzone & mehr</span></div>
            <div><strong>18+</strong><span>Humor mit Schäden</span></div>
            <div><strong>100%</strong><span>Community</span></div>
          </div>
        </div>

        <div className="hero-portrait" aria-label="Portrait von Bastian alias StruwwelTV">
          <div className="portrait-orbit" />
          <div className="portrait-logo"><Image src="/logo.png" width={112} height={112} alt="STV" priority /></div>
          <div className="portrait-frame">
            <Image src="/creator.jpg" fill sizes="(max-width: 900px) 90vw, 42vw" alt="Bastian alias StruwwelTV" className="portrait-image" priority />
            <div className="portrait-shade" />
          </div>
          <div className="floating-tag tag-top"><span>STATUS</span><b>CONNECTED</b></div>
          <div className="floating-tag tag-bottom"><span>MODE</span><b>CHAOS</b></div>
        </div>
      </section>

      <section className="section" id="live">
        <div className="section-head">
          <p className="kicker">LIVE AUS DEM CHAOS</p>
          <h2>Twitch. Direkt hier.</h2>
          <p>Live-Status, aktuelles Game, Zuschauer und die neuesten Clips kommen automatisch aus der Twitch-API.</p>
        </div>
        <TwitchHub />
      </section>

      <section className="section about-grid" id="about">
        <div className="about-image card">
          <Image src="/creator.jpg" fill sizes="(max-width: 900px) 100vw, 42vw" alt="Bastian alias StruwwelTV" className="about-photo" />
        </div>
        <article className="about-copy card">
          <p className="kicker">HINTER DEM LOGO</p>
          <h2>Moin, ich bin Bastian.</h2>
          <p>Auf Twitch bin ich StruwwelTV. Bei mir geht es nicht darum, jede Runde perfekt zu spielen. Es geht um die Momente, die im Kopf bleiben – gute Plays, schlechte Ideen und die Sprüche danach.</p>
          <p>Warzone, spontane Challenges und ehrliche Reaktionen treffen auf schwarzen Humor, ohne den Respekt füreinander zu verlieren.</p>
          <blockquote>„Chaos. Kugeln. Community.“</blockquote>
        </article>
      </section>

      <section className="section" id="schedule">
        <div className="section-head">
          <p className="kicker">STREAMPLAN</p>
          <h2>Wann das Chaos beginnt.</h2>
        </div>
        <div className="schedule-grid">
          {schedule.map(([day, time, title]) => (
            <article className={`schedule-card ${time !== "Offline" ? "active" : ""}`} key={day}>
              <span>{day}</span>
              <strong>{time}</strong>
              <small>{title}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="community">
        <div className="community-card card">
          <div>
            <p className="kicker">MEHR ALS NUR ZUSCHAUEN</p>
            <h2>Werde Teil der Community.</h2>
            <p>Mitspielen, Clips teilen, Memes abladen und bei Community-Events dabei sein. Wenn der Stream offline ist, geht es im Discord weiter.</p>
          </div>
          <div className="community-buttons">
            <a className="btn btn-primary" href="https://discord.gg/YZDB59vdV7" target="_blank" rel="noreferrer">Discord öffnen</a>
            <a className="btn btn-secondary" href="https://instagram.com/struwweltv" target="_blank" rel="noreferrer">Instagram</a>
            <a className="btn btn-secondary" href="https://youtube.com/struwwelTV" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <Image src="/logo.png" width={52} height={52} alt="StruwwelTV" />
          <div><strong>STRUWWELTV</strong><span>Chaos. Kugeln. Community.</span></div>
        </div>
        <div className="footer-links"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><a href="mailto:mail@struwweltv.de">Kontakt</a></div>
        <small>© {new Date().getFullYear()} StruwwelTV</small>
      </footer>
    </main>
  );
}
