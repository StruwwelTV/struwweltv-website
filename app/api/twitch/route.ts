import { NextResponse } from "next/server";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_API = "https://api.twitch.tv/helix";

type TwitchClip = {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  creator_name: string;
  view_count: number;
  created_at: string;
  duration: number;
};

type TwitchVideo = {
  id: string;
  title: string;
  url: string;
  duration: string;
  created_at: string;
  view_count: number;
};

async function helix(path: string, clientId: string, token: string) {
  const response = await fetch(`${TWITCH_API}${path}`, {
    headers: {
      "Client-Id": clientId,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Twitch API ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export async function GET() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const channel = process.env.TWITCH_CHANNEL || "struwweltv";

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Twitch environment variables are missing." }, { status: 500 });
  }

  try {
    const tokenResponse = await fetch(TWITCH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "client_credentials" }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) throw new Error(`Twitch token ${tokenResponse.status}: ${await tokenResponse.text()}`);

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token as string;
    const userResult = await helix(`/users?login=${encodeURIComponent(channel)}`, clientId, token);
    const user = userResult.data?.[0];

    if (!user) return NextResponse.json({ error: "Twitch channel not found." }, { status: 404 });

    const startedAt = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

    const [streamResult, recentClipsResult, videosResult] = await Promise.all([
      helix(`/streams?user_id=${user.id}`, clientId, token),
      helix(`/clips?broadcaster_id=${user.id}&first=100&started_at=${encodeURIComponent(startedAt)}`, clientId, token),
      helix(`/videos?user_id=${user.id}&first=3&type=archive`, clientId, token),
    ]);

    let rawClips = (recentClipsResult.data || []) as TwitchClip[];

    // Falls in den letzten 12 Monaten nichts vorhanden ist, nutze verfügbare ältere Clips.
    if (rawClips.length === 0) {
      const fallbackClipsResult = await helix(`/clips?broadcaster_id=${user.id}&first=100`, clientId, token);
      rawClips = (fallbackClipsResult.data || []) as TwitchClip[];
    }

    const stream = streamResult.data?.[0] || null;
    const clips = [...rawClips]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)
      .map((clip) => ({
        id: clip.id,
        title: clip.title,
        url: clip.url,
        thumbnailUrl: clip.thumbnail_url,
        creatorName: clip.creator_name,
        viewCount: clip.view_count,
        createdAt: clip.created_at,
        duration: clip.duration,
      }));

    const response = NextResponse.json({
      fetchedAt: new Date().toISOString(),
      channel: {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        description: user.description,
        profileImage: user.profile_image_url,
      },
      live: Boolean(stream),
      stream: stream ? {
        id: stream.id,
        title: stream.title,
        gameName: stream.game_name,
        viewerCount: stream.viewer_count,
        startedAt: stream.started_at,
        thumbnailUrl: stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720"),
      } : null,
      clips,
      videos: ((videosResult.data || []) as TwitchVideo[]).map((video) => ({
        id: video.id,
        title: video.title,
        url: video.url,
        duration: video.duration,
        createdAt: video.created_at,
        viewCount: video.view_count,
      })),
    });

    response.headers.set("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Twitch data could not be loaded." }, { status: 502 });
  }
}
