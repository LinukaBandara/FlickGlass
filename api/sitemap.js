export default function handler(req, res) {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] === "http" ? "https" : "https";
  const base = `https://${host}`;
  const urls = ["/", "/privacy", "/terms"];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${base}${path}</loc></url>`).join("")}</urlset>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(xml);
}
