
(() => {
  const c = STRUWWEL_CONFIG;
  document.querySelectorAll("[data-link]").forEach(el => {
    const url = c.socialLinks[el.dataset.link];
    el.href = url || "#";
    if (!url || url === "#") {
      el.addEventListener("click", e => {
        e.preventDefault();
        alert("Diesen Link kannst du in der Datei config.js eintragen.");
      });
    }
  });

  const parents = c.twitchParentDomains.map(d => `parent=${encodeURIComponent(d)}`).join("&");
  const player = document.getElementById("twitch-player");
  player.src = `https://player.twitch.tv/?channel=${encodeURIComponent(c.twitchChannel)}&${parents}&muted=true`;
  const grid = document.getElementById("schedule-grid");
  c.schedule.forEach(item => {
    const active = !/offline/i.test(item.time);
    grid.insertAdjacentHTML("beforeend", `
      <article class="schedule-day ${active ? "active" : ""}">
        <strong>${item.day}</strong>
        <span>${item.time}</span>
        <b>${item.title}</b>
      </article>
    `);
  });


  async function loadTwitchData() {
    const statusText = document.getElementById("stream-status-text");
    const status = document.getElementById("stream-status");
    const clipGrid = document.getElementById("clip-grid");

    try {
      const response = await fetch("/.netlify/functions/twitch");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API-Fehler");

      if (data.live && data.stream) {
        status.classList.add("is-live");
        statusText.textContent =
          `LIVE · ${data.stream.gameName} · ${data.stream.viewerCount.toLocaleString("de-DE")} Zuschauer`;

        const sidebar = document.querySelector(".live-sidebar");
        if (sidebar) {
          sidebar.querySelector("h3").innerHTML =
            `${escapeHtml(data.stream.title)}<br><span class="live-game">${escapeHtml(data.stream.gameName)}</span>`;
        }
      } else {
        status.classList.remove("is-live");
        statusText.textContent = "Aktuell offline · Twitch-Kanal öffnen";
      }

      if (clipGrid) {
        clipGrid.innerHTML = "";
        const clips = data.clips || [];

        if (!clips.length) {
          clipGrid.innerHTML = '<p class="loading-message">Aktuell wurden keine Clips gefunden.</p>';
          return;
        }

        clips.forEach((clip, index) => {
          const article = document.createElement("a");
          article.className = "clip-card reveal clip-link visible";
          article.href = clip.url;
          article.target = "_blank";
          article.rel = "noopener";
          article.innerHTML = `
            <div class="api-clip-thumb">
              <img src="${escapeAttr(clip.thumbnailUrl)}" alt="" loading="lazy">
              <span class="clip-duration">${Math.round(clip.duration)} Sek.</span>
              <span class="clip-play">▶</span>
            </div>
            <div class="clip-meta">
              <span>TWITCH CLIP</span>
              <span>${Number(clip.viewCount).toLocaleString("de-DE")} Aufrufe</span>
            </div>
            <h3>${escapeHtml(clip.title)}</h3>
          `;
          clipGrid.appendChild(article);
        });
      }
    } catch (error) {
      console.error(error);
      if (statusText) statusText.textContent = "Twitch-Daten derzeit nicht verfügbar";
      if (clipGrid) {
        clipGrid.innerHTML = `
          <p class="loading-message">
            Die automatischen Twitch-Clips erscheinen nach dem Eintragen der
            Netlify-Umgebungsvariablen.
          </p>`;
      }
    }
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value = "") {
    return escapeHtml(value);
  }

  loadTwitchData();

  document.getElementById("year").textContent = new Date().getFullYear();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("visible"));
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const header = document.querySelector(".site-header");
  addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 15));

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
})();
