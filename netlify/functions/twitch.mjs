
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_API = "https://api.twitch.tv/helix";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=120"
    }
  });
}

async function twitchFetch(path, clientId, token) {
  const response = await fetch(`${TWITCH_API}${path}`, {
    headers: {
      "Client-Id": clientId,
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Twitch API ${response.status}: ${text}`);
  }

  return response.json();
}

export default async () => {
  const clientId = Netlify.env.get("TWITCH_CLIENT_ID");
  const clientSecret = Netlify.env.get("TWITCH_CLIENT_SECRET");
  const channel = Netlify.env.get("TWITCH_CHANNEL") || "struwweltv";

  if (!clientId || !clientSecret) {
    return jsonResponse(
      {
        error: "Twitch-Umgebungsvariablen fehlen.",
        required: ["TWITCH_CLIENT_ID", "TWITCH_CLIENT_SECRET"]
      },
      500
    );
  }

  try {
    const tokenResponse = await fetch(
      `${TWITCH_TOKEN_URL}?client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`,
      { method: "POST" }
    );

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text();
      throw new Error(
        `Token-Anfrage fehlgeschlagen (${tokenResponse.status}): ${text}`
      );
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    const userResult = await twitchFetch(
      `/users?login=${encodeURIComponent(channel)}`,
      clientId,
      token
    );

    const user = userResult.data?.[0];

    if (!user) {
      return jsonResponse(
        { error: "Twitch-Kanal wurde nicht gefunden." },
        404
      );
    }

    const [streamResult, clipsResult, videosResult] = await Promise.all([
      twitchFetch(`/streams?user_id=${user.id}`, clientId, token),
      twitchFetch(`/clips?broadcaster_id=${user.id}&first=6`, clientId, token),
      twitchFetch(`/videos?user_id=${user.id}&first=3&type=archive`, clientId, token)
    ]);

    const stream = streamResult.data?.[0] || null;

    return jsonResponse({
      fetchedAt: new Date().toISOString(),
      channel: {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        description: user.description,
        profileImage: user.profile_image_url,
        offlineImage: user.offline_image_url,
        viewCount: user.view_count
      },
      live: Boolean(stream),
      stream: stream
        ? {
            id: stream.id,
            title: stream.title,
            gameName: stream.game_name,
            viewerCount: stream.viewer_count,
            startedAt: stream.started_at,
            thumbnailUrl: stream.thumbnail_url
              .replace("{width}", "1280")
              .replace("{height}", "720")
          }
        : null,
      clips: (clipsResult.data || []).map((clip) => ({
        id: clip.id,
        title: clip.title,
        url: clip.url,
        embedUrl: clip.embed_url,
        thumbnailUrl: clip.thumbnail_url,
        creatorName: clip.creator_name,
        viewCount: clip.view_count,
        createdAt: clip.created_at,
        duration: clip.duration
      })),
      videos: (videosResult.data || []).map((video) => ({
        id: video.id,
        title: video.title,
        url: video.url,
        thumbnailUrl: video.thumbnail_url
          .replace("%{width}", "640")
          .replace("%{height}", "360"),
        duration: video.duration,
        createdAt: video.created_at,
        viewCount: video.view_count
      }))
    });
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error: "Twitch-Daten konnten nicht geladen werden.",
        details: error.message
      },
      502
    );
  }
};
