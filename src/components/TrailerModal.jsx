import { useEffect, useState } from "react";

export default function TrailerModal({ movie, onClose }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, movie?.trailerId]);

  if (!movie) return null;

  const id = movie.trailerId;
  const src = id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-title"
    >
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-white/15 bg-[#14161c]/95 shadow-[0_40px_100px_rgba(0,0,0,0.65)] animate-fade-in backdrop-blur-2xl">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-white/70 font-medium">
              Trailer · 4K HDR
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trailer"
            className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-white/80"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative w-full aspect-video bg-black">
          {src && !failed ? (
            <iframe
              title={movie.title + " trailer"}
              className="absolute inset-0 h-full w-full"
              src={src}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-white/70 text-sm">Trailer embed unavailable in this browser.</p>
              {id ? (
                <a
                  href={`https://www.youtube.com/watch?v=${id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2.5 transition"
                >
                  Watch on YouTube
                </a>
              ) : null}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 py-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 id="trailer-title" className="text-lg sm:text-xl font-bold truncate">
              {movie.title}
            </h2>
            {movie.director ? (
              <p className="text-sm text-white/50 mt-0.5">Directed by {movie.director}</p>
            ) : null}
          </div>
          <div className="text-right shrink-0 text-sm text-white/60">
            <p>
              {movie.year}
              {(movie.genres || [])[0] ? ` · ${movie.genres[0]}` : ""}
            </p>
            <p className="text-amber-400 font-semibold">★ {movie.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
