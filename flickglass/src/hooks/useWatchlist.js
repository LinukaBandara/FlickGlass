import { useCallback, useEffect, useState } from "react";

const KEY = "flickglass-watchlist";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [items, setItems] = useState(() =>
    typeof window !== "undefined" ? read() : []
  );

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore quota */
    }
  }, [items]);

  const ids = new Set(items.map((i) => i.id));

  const toggle = useCallback((movie) => {
    if (!movie?.id) return;
    setItems((prev) => {
      const exists = prev.some((p) => p.id === movie.id);
      if (exists) return prev.filter((p) => p.id !== movie.id);
      return [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          rating: movie.rating,
          poster: movie.poster,
          trailerId: movie.trailerId || "",
        },
      ];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const has = useCallback((id) => ids.has(id), [items]);

  return { items, toggle, remove, has, count: items.length };
}
