import { useEffect, useState } from "react";
import { movies as fallbackMovies, trending as fallbackTrending } from "../data/movies";
import { fetchNowPlaying, fetchPopular, hasTmdbKey } from "../lib/tmdb";

export function useMovies() {
  const [movies, setMovies] = useState(fallbackMovies);
  const [trending, setTrending] = useState(fallbackTrending);
  const [source, setSource] = useState("fallback");
  const [loading, setLoading] = useState(hasTmdbKey());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasTmdbKey()) {
      setLoading(false);
      setSource("fallback");
      setMovies(fallbackMovies);
      setTrending(fallbackTrending);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [now, popular] = await Promise.all([
          fetchNowPlaying(8),
          fetchPopular(6),
        ]);
        if (cancelled) return;
        if (now.length) {
          setMovies(now);
          setSource("tmdb");
        } else {
          setMovies(fallbackMovies);
          setSource("fallback");
          setError("TMDB returned no titles — using curated slate.");
        }
        if (popular.length) setTrending(popular);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setMovies(fallbackMovies);
        setTrending(fallbackTrending);
        setSource("fallback");
        setError(e.message || "TMDB failed — using curated slate.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { movies, trending, source, loading, error };
}
