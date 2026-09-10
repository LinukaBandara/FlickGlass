import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMovies } from "./hooks/useMovies";
import { useWatchlist } from "./hooks/useWatchlist";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import TrailerModal from "./components/TrailerModal";
import MediaDock from "./components/MediaDock";
import TrendingGrid from "./components/TrendingGrid";
import WatchlistPanel from "./components/WatchlistPanel";
import SearchBar from "./components/SearchBar";
import SkeletonReel from "./components/SkeletonReel";
import Soundtracks from "./components/Soundtracks";

const AUTOPLAY_MS = 4500;

function readMovieParam() {
  try {
    const id = new URLSearchParams(window.location.search).get("movie");
    return id ? String(id) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const { movies, trending, source, loading, error } = useMovies();
  const watchlist = useWatchlist();
  const [current, setCurrent] = useState(0);
  const [modalMovie, setModalMovie] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const timerRef = useRef(null);
  const pausedRef = useRef(false);
  const deepLinked = useRef(false);

  const genreOptions = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => (m.genres || []).forEach((g) => set.add(g)));
    trending.forEach((m) => (m.genres || []).forEach((g) => set.add(g)));
    return Array.from(set).sort().slice(0, 8);
  }, [movies, trending]);

  const filteredMovies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movies.filter((m) => {
      const matchQ = !q || m.title.toLowerCase().includes(q);
      const matchG =
        genre === "All" || (m.genres || []).some((g) => g === genre);
      return matchQ && matchG;
    });
  }, [movies, query, genre]);

  const filteredTrending = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trending.filter((m) => {
      const matchQ = !q || m.title.toLowerCase().includes(q);
      const matchG =
        genre === "All" || (m.genres || []).some((g) => g === genre);
      return matchQ && matchG;
    });
  }, [trending, query, genre]);

  const reel = filteredMovies.length ? filteredMovies : movies;
  const len = reel.length || 1;

  useEffect(() => {
    setCurrent(0);
  }, [source, movies.length, query, genre]);

  // Deep link ?movie=id
  useEffect(() => {
    if (deepLinked.current || !movies.length) return;
    const param = readMovieParam();
    if (!param) return;
    const idx = movies.findIndex((m) => String(m.id) === param);
    if (idx >= 0) {
      deepLinked.current = true;
      setCurrent(idx);
      setTimeout(() => {
        document.getElementById("trailers")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [movies]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!autoplay || modalMovie || pausedRef.current || reel.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % reel.length);
    }, AUTOPLAY_MS);
  }, [autoplay, modalMovie, reel.length, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const pauseTemporarily = useCallback(() => {
    pausedRef.current = true;
    stopAutoplay();
    window.clearTimeout(pauseTemporarily._t);
    pauseTemporarily._t = window.setTimeout(() => {
      pausedRef.current = false;
      if (autoplay && !modalMovie) startAutoplay();
    }, AUTOPLAY_MS + 600);
  }, [autoplay, modalMovie, startAutoplay, stopAutoplay]);

  const goTo = useCallback(
    (i) => {
      pauseTemporarily();
      const next = ((i % len) + len) % len;
      setCurrent(next);
      const m = reel[next];
      if (m && window.history?.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set("movie", String(m.id));
        window.history.replaceState({}, "", url);
      }
    },
    [len, pauseTemporarily, reel]
  );

  const openTrailer = useCallback(
    (movie) => {
      if (!movie?.trailerId) return;
      pauseTemporarily();
      setModalMovie(movie);
      setPlaying(false);
    },
    [pauseTemporarily]
  );

  const jumpToMovie = useCallback(
    (movie) => {
      const idx = reel.findIndex((m) => m.id === movie.id);
      if (idx >= 0) {
        goTo(idx);
      } else {
        const allIdx = movies.findIndex((m) => m.id === movie.id);
        if (allIdx >= 0) {
          setQuery("");
          setGenre("All");
          setTimeout(() => {
            const i = movies.findIndex((m) => m.id === movie.id);
            if (i >= 0) {
              setCurrent(i);
              const url = new URL(window.location.href);
              url.searchParams.set("movie", String(movie.id));
              window.history.replaceState({}, "", url);
            }
          }, 0);
        }
      }
      document.getElementById("trailers")?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [reel, movies, goTo]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (modalMovie || watchlistOpen) return;
      if (e.target?.tagName === "INPUT") return;
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, modalMovie, watchlistOpen]);

  const active = reel[current] || reel[0] || movies[0];
  const savedIds = new Set(watchlist.items.map((i) => i.id));

  return (
    <div className="relative min-h-dvh text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="orb orb-pulse" style={{ width: 420, height: 420, top: "-8%", left: "10%", background: "radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)" }} />
        <div className="orb orb-pulse" style={{ width: 380, height: 380, top: "20%", right: "-5%", background: "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)", animationDelay: "2s" }} />
        <div className="orb" style={{ width: 300, height: 300, bottom: "15%", left: "30%", background: "radial-gradient(circle, rgba(245,197,24,0.12), transparent 70%)" }} />
      </div>

      <Navbar watchlistCount={watchlist.count} onOpenWatchlist={() => setWatchlistOpen(true)} />

      <main>
        <section id="home" className="relative pt-24 sm:pt-32 pb-24 sm:pb-28 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Glassy <span className="text-orange-400">Carousel</span>
            </h1>
            <p className="mt-3 text-white/55 max-w-xl mx-auto text-sm sm:text-base">
              Now in theaters — drag the reel, watch trailers, save to your list.{" "}
              {source === "tmdb" ? "Live from TMDB." : "Sept 2026 theatrical slate."}
            </p>
            {error ? <p className="mt-2 text-sm text-amber-400/90">{error}</p> : null}
          </div>

          <SearchBar
            query={query}
            onQuery={setQuery}
            genres={genreOptions}
            activeGenre={genre}
            onGenre={setGenre}
          />

          <div id="trailers">
            {loading && movies.length === 0 ? (
              <SkeletonReel />
            ) : reel.length === 0 ? (
              <p className="text-center text-white/50 py-20 text-sm">No titles match this search.</p>
            ) : (
              <Carousel
                movies={reel}
                current={Math.min(current, reel.length - 1)}
                onSelect={goTo}
                onWatch={openTrailer}
                onInteract={pauseTemporarily}
              />
            )}
          </div>
        </section>

        <TrendingGrid items={filteredTrending} savedIds={savedIds} onToggle={watchlist.toggle} />

        <Soundtracks
          movies={movies}
          onSelect={(m) => jumpToMovie(m)}
        />
      </main>

      {active ? (
        <MediaDock
          movie={active}
          playing={playing}
          onToggle={() => {
            setPlaying((p) => !p);
            setAutoplay((a) => !a);
          }}
          onPrev={() => goTo(current - 1)}
          onNext={() => goTo(current + 1)}
        />
      ) : null}

      {modalMovie ? <TrailerModal movie={modalMovie} onClose={() => setModalMovie(null)} /> : null}

      <WatchlistPanel
        open={watchlistOpen}
        items={watchlist.items}
        onClose={() => setWatchlistOpen(false)}
        onRemove={watchlist.remove}
        onPlay={(m) => {
          setWatchlistOpen(false);
          openTrailer(m);
        }}
      />

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/40 pb-24">
        <p>
          <span className="font-semibold text-white/70">FlickGlass</span> — cinematic trailer hub.
        </p>
        <p className="mt-1">
          Data: {source === "tmdb" ? "TMDB live" : "Curated fallback"} · Built by{" "}
          <a href="https://ark-ii.studio" target="_blank" rel="noopener noreferrer" className="text-amber-400/90 hover:text-amber-300">
            ARK II
          </a>
        </p>
      </footer>
    </div>
  );
}
