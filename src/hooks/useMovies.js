import { useEffect, useState } from "react";
import { movies as fallbackMovies, heroMovies as fallbackHero, trending as fallbackTrending } from "../data/movies";
import { fetchNowPlaying, mapMovie } from "../lib/tmdb";

export function useMovies() {
  const [movies, setMovies] = useState(fallbackMovies);
  const [hero, setHero] = useState(fallbackHero);
  const [trending, setTrending] = useState(fallbackTrending);
  const [source, setSource] = useState("fallback");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const key = import.meta.env.VITE_TMDB_API_KEY;
      if (!key) {
        setMovies(fallbackMovies);
        setHero(fallbackHero);
        setTrending(fallbackTrending);
        setSource("fallback");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchNowPlaying(key);
        if (cancelled) return;
        const mapped = (data.results || []).slice(0, 24).map(mapMovie).filter((m) => m.poster);
        if (mapped.length >= 5) {
          setMovies(mapped);
          setHero(mapped.slice(0, 7));
          setTrending(mapped.slice(0, 6));
          setSource("tmdb");
        } else {
          setMovies(fallbackMovies);
          setHero(fallbackHero);
          setTrending(fallbackTrending);
          setSource("fallback");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "TMDB failed");
          setMovies(fallbackMovies);
          setHero(fallbackHero);
          setTrending(fallbackTrending);
          setSource("fallback");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { movies, hero, trending, source, loading, error };
}
