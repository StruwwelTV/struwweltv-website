"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Twitch?: {
      Player: new (elementId: string, options: Record<string, unknown>) => unknown;
    };
  }
}

export function TwitchPlayer() {
  const loaded = useRef(false);

  useEffect(() => {
    const mount = () => {
      if (loaded.current || !window.Twitch?.Player) return;
      loaded.current = true;
      new window.Twitch.Player("twitch-embed", {
        channel: "struwweltv",
        width: "100%",
        height: "100%",
        autoplay: false,
        muted: true,
        parent: [window.location.hostname],
      });
    };

    if (window.Twitch?.Player) {
      mount();
      return;
    }

    const existing = document.querySelector('script[src="https://player.twitch.tv/js/embed/v1.js"]');
    if (existing) {
      existing.addEventListener("load", mount, { once: true });
      return () => existing.removeEventListener("load", mount);
    }

    const script = document.createElement("script");
    script.src = "https://player.twitch.tv/js/embed/v1.js";
    script.async = true;
    script.onload = mount;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return <div id="twitch-embed" className="twitch-embed" />;
}
