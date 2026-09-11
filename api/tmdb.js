const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const buckets = new Map();

const ALLOWED_PATHS = [
  /^\/genre\/movie\/list$/,
  /^\/movie\/(now_playing|popular|\d+\/videos)$/,
];

function clientIp(req) {
  return (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
}

function rateLimited(ip) {
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return res.status(403).json({ error: "Origin not allowed" });
      }
    } catch {
      return res.status(403).json({ error: "Invalid origin" });
    }
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too many requests" });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "TMDB is not configured" });

  const path = typeof req.query.path === "string" ? req.query.path : "";
  if (!ALLOWED_PATHS.some((pattern) => pattern.test(path))) {
    return res.status(400).json({ error: "Unsupported TMDB endpoint" });
  }

  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== "path" && typeof value === "string") url.searchParams.set(key, value.slice(0, 100));
  }

  try {
    const upstream = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    const body = await upstream.text();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.status(upstream.status).send(body);
  } catch {
    return res.status(502).json({ error: "TMDB request failed" });
  }
}
