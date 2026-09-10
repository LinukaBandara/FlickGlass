# FlickGlass

Cinematic trailer hub — glassmorphism + optional TMDB live slate.

## Features

- 3D coverflow with live drag + autoplay
- Trailer modal (YouTube)
- Search + genre filter
- Real TMDB genre chips (with API key)
- Persistent watchlist (`localStorage`)
- Deep link `?movie=<id>`
- Soundtracks section
- Mobile nav drawer
- Skeleton loaders
- Glass specular + grain
- Keyboard focus rings + reduced motion

## Run

```bash
npm install
npm run dev
```

### Optional TMDB

```bash
# .env
VITE_TMDB_API_KEY=your_key
```

## Deploy (Vercel)

```bash
vercel
```

Set `VITE_TMDB_API_KEY` in project env, redeploy.

Built by [ARK II](https://ark-ii.studio).
