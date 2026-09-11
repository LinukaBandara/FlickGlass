# FlickGlass

Cinematic trailer hub — glassmorphism + TMDB live slate.

## Features

- 3D coverflow with live drag + autoplay
- Trailer modal (YouTube)
- Search + genre filter
- Server-side TMDB proxy (API key never shipped to the browser)
- Persistent watchlist (`localStorage`)
- Deep links `?movie=<id>`
- Privacy policy + terms
- Cookie consent with opt-in analytics
- SEO metadata, social preview, sitemap and robots.txt
- Mobile navigation, skeleton loaders, reduced-motion support and keyboard focus rings

## Run

```bash
npm install
npm run dev
```

### TMDB configuration

Create a local `.env` from `.env.example`:

```bash
TMDB_API_KEY=your_key
```

Do **not** use `VITE_TMDB_API_KEY`. Vite exposes `VITE_*` variables to browser code. The TMDB key is consumed only by the Vercel server function at `/api/tmdb`.

For Vercel, add `TMDB_API_KEY` as a server-side Environment Variable and redeploy.

## Security notes

- `.env` files are ignored and the previously committed `.env` was removed from the working branch.
- The TMDB proxy allowlists endpoints, validates same-origin requests, applies a basic IP rate limit, and never returns the API key.
- Vercel security headers include HSTS, CSP, frame protection, MIME sniffing protection, Referrer-Policy and Permissions-Policy.

Built by [ARK II](https://ark-ii.studio).
