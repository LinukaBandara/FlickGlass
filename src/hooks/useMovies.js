import { useEffect, useState } from "react";
import { movies as fallbackMovies, heroMovies as fallbackHero, trending as fallbackTrending } from "../data/movies";
import { fetchNowPlaying } from "../lib/tmdb";

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
      try {
        // Keep the live request small: now-playing data plus a limited trailer lookup set.
        const mapped = await fetchNowPlaying(8);
        if (cancelled) return;
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
    return () => { cancelled = true; };
  }, []);

  return { movies, hero, trending, source, loading, error };
}
