export default function handler(req, res) {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || req.headers.host;
  const base = `https://${host}`;
  const body = `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(body);
}
