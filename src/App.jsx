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
import CookieConsent from "./components/CookieConsent";
import LegalPage from "./pages/LegalPage";
import NotFoundPage from "./pages/NotFoundPage";

const AUTOPLAY_MS = 4500;

function readMovieParam() {
  try {
    const id = new URLSearchParams(window.location.search).get("movie");
    return id ? String(id) : null;
  } catch {
    return null;
  }
}

function HomePage() {
  const { movies, hero, trending, source, loading, error } = useMovies();
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
    return Array.from(set).sort().slice(0, 6);
  }, [movies]);

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase().slice(0, 100);
    return movies.filter((m) => {
      const matchQ = !q || m.title.toLowerCase().includes(q);
      const matchG = genre === "All" || (m.genres || []).some((g) => g === genre);
      return matchQ && matchG;
    });
  }, [movies, query, genre]);

  const reel = useMemo(() => {
    const q = query.trim().toLowerCase().slice(0, 100);
    if (!q && genre === "All") return hero?.length ? hero : movies.slice(0, 7);
    const fromHero = (hero || []).filter((m) => {
      const matchQ = !q || m.title.toLowerCase().includes(q);
      const matchG = genre === "All" || (m.genres || []).some((g) => g === genre);
      return matchQ && matchG;
    });
    return fromHero.length ? fromHero : filteredCatalog.slice(0, 7);
  }, [hero, movies, query, genre, filteredCatalog]);

  const filteredTrending = useMemo(() => {
    if (query.trim() || genre !== "All") return filteredCatalog;
    return trending?.length ? trending : (hero || []).slice(0, 6);
  }, [query, genre, filteredCatalog, trending, hero]);

  const len = reel.length || 1;

  useEffect(() => setCurrent(0), [source, movies.length, query, genre]);

  useEffect(() => {
    if (deepLinked.current || !hero?.length) return;
    const param = readMovieParam();
    if (!param) return;
    let idx = hero.findIndex((m) => String(m.id) === param);
    if (idx < 0) idx = movies.findIndex((m) => String(m.id) === param);
    if (idx >= 0) {
      deepLinked.current = true;
      setQuery("");
      setGenre("All");
      setCurrent(Math.min(idx, Math.max(hero.length - 1, 0)));
    }
  }, [hero, movies]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!autoplay || modalMovie || pausedRef.current || reel.length < 2) return;
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % reel.length), AUTOPLAY_MS);
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

  const goTo = useCallback((i) => {
    pauseTemporarily();
    const next = ((i % len) + len) % len;
    setCurrent(next);
    const m = reel[next];
    if (m && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set("movie", String(m.id));
      window.history.replaceState({}, "", url);
    }
  }, [len, pauseTemporarily, reel]);

  const openTrailer = useCallback((movie) => {
    if (!movie?.trailerId) return;
    pauseTemporarily();
    setModalMovie(movie);
    setPlaying(false);
  }, [pauseTemporarily]);

  const jumpToMovie = useCallback((movie) => {
    const idx = reel.findIndex((m) => m.id === movie.id);
    if (idx >= 0) goTo(idx);
    document.getElementById("trailers")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [reel, goTo]);

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
        <section id="home" className="relative pt-20 sm:pt-24 pb-20 sm:pb-24 px-4 sm:px-6 min-h-0 sm:min-h-[100dvh] flex flex-col">
          <div className="mx-auto max-w-6xl text-center mb-4 sm:mb-5">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Now <span className="text-amber-400">Playing</span></h1>
            <p className="mt-2 text-white/70 max-w-xl mx-auto text-xs sm:text-sm">Drag the reel, watch official trailers, save to your list. {source === "tmdb" ? "Live theatrical slate via TMDB." : "Curated theatrical slate."}</p>
            {error ? <p className="mt-2 text-sm text-amber-300">{error}</p> : null}
            <a href="#trailers" className="mt-4 inline-flex rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#0B0C10] hover:bg-amber-300">Explore trailers</a>
          </div>

          <SearchBar query={query} onQuery={setQuery} genres={genreOptions} activeGenre={genre} onGenre={setGenre} />

          <div id="trailers">
            {loading && movies.length === 0 ? <SkeletonReel /> : reel.length === 0 ? <p className="text-center text-white/70 py-20 text-sm">No titles match this search.</p> : <Carousel movies={reel} current={Math.min(current, reel.length - 1)} onSelect={goTo} onWatch={openTrailer} onInteract={pauseTemporarily} />}
          </div>
        </section>

        <TrendingGrid items={filteredTrending} savedIds={savedIds} onToggle={watchlist.toggle} />
        <Soundtracks movies={movies} onSelect={jumpToMovie} />
      </main>

      {active ? <MediaDock movie={active} playing={playing} onToggleAutoplay={() => { setAutoplay((a) => !a); setPlaying((p) => !p); }} onPlayTrailer={openTrailer} onPrev={() => goTo(current - 1)} onNext={() => goTo(current + 1)} /> : null}
      {modalMovie ? <TrailerModal movie={modalMovie} onClose={() => { setModalMovie(null); setPlaying(autoplay); }} /> : null}
      <WatchlistPanel open={watchlistOpen} items={watchlist.items} onClose={() => setWatchlistOpen(false)} onRemove={watchlist.remove} onPlay={(m) => { setWatchlistOpen(false); openTrailer(m); }} />

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/65 pb-24">
        <p><span className="font-semibold text-white/85">FlickGlass</span> — cinematic trailer hub.</p>
        <p className="mt-1">Data: {source === "tmdb" ? "TMDB live" : "Curated fallback"} · Built by <a href="https://ark-ii.studio" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200">ARK II</a></p>
        <nav className="mt-4 flex justify-center gap-4 text-xs" aria-label="Legal links">
          <a href="/privacy" className="text-white/70 hover:text-white underline-offset-2 hover:underline">Privacy Policy</a>
          <a href="/terms" className="text-white/70 hover:text-white underline-offset-2 hover:underline">Terms & Conditions</a>
        </nav>
      </footer>
      <CookieConsent />
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/privacy") return <LegalPage type="privacy" />;
  if (path === "/terms") return <LegalPage type="terms" />;
  if (path !== "/") return <NotFoundPage />;
  return <HomePage />;
}
