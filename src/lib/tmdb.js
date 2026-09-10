const API = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

export function hasTmdbKey() {
  return Boolean(import.meta.env.VITE_TMDB_API_KEY);
}

function key() {
  return import.meta.env.VITE_TMDB_API_KEY;
}

async function tmdb(path, params = {}) {
  const url = new URL(`${API}${path}`);
  url.searchParams.set("api_key", key());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

let genreMapCache = null;

async function genreMap() {
  if (genreMapCache) return genreMapCache;
  try {
    const data = await tmdb("/genre/movie/list", { language: "en-US" });
    const map = {};
    (data.genres || []).forEach((g) => {
      map[g.id] = g.name;
    });
    genreMapCache = map;
    return map;
  } catch {
    return {};
  }
}

function genresFromIds(ids, map) {
  if (!ids?.length) return ["Film"];
  const names = ids.map((id) => map[id]).filter(Boolean);
  return names.length ? names.slice(0, 3) : ["Film"];
}

async function trailerFor(movieId) {
  try {
    const data = await tmdb(`/movie/${movieId}/videos`);
    const yt = (data.results || []).find(
      (v) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.type === "Teaser") &&
        v.key
    );
    return yt?.key || "";
  } catch {
    return "";
  }
}

function mapMovie(m, trailerId, gMap) {
  const year = (m.release_date || "").slice(0, 4) || "—";
  const genres = genresFromIds(m.genre_ids, gMap);
  return {
    id: m.id,
    title: m.title,
    year: Number(year) || year,
    genres,
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : "—",
    poster: m.poster_path ? `${IMG}${m.poster_path}` : "",
    trailerId: trailerId || "",
    soundtrack: `${m.title} — Original Score`,
    overview: m.overview || "",
  };
}

export async function fetchNowPlaying(limit = 8) {
  const gMap = await genreMap();
  const data = await tmdb("/movie/now_playing", { language: "en-US", page: "1" });
  const results = (data.results || []).slice(0, limit);
  const mapped = await Promise.all(
    results.map(async (m) => mapMovie(m, await trailerFor(m.id), gMap))
  );
  return mapped.filter((m) => m.poster);
}

export async function fetchPopular(limit = 6) {
  const gMap = await genreMap();
  const data = await tmdb("/movie/popular", { language: "en-US", page: "1" });
  const results = (data.results || []).slice(0, limit);
  return results
    .filter((m) => m.poster_path)
    .map((m) => {
      const year = (m.release_date || "").slice(0, 4) || "—";
      return {
        id: m.id,
        title: m.title,
        year: Number(year) || year,
        genres: genresFromIds(m.genre_ids, gMap),
        rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : "—",
        poster: `${IMG}${m.poster_path}`,
        trailerId: "",
        soundtrack: `${m.title} — Original Score`,
      };
    });
}
