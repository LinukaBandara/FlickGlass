import { useEffect } from "react";

export default function TrailerModal({ movie, onClose }) {
  useEffect(() => {
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
  const embed = id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
    : null;
  const yt = id ? `https://www.youtube.com/watch?v=${id}` : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-white/15 bg-[#14161c] shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.14em] text-white/70 font-medium">
              Trailer · 4K HDR
            </span>
          </div>
          <div className="flex items-center gap-2">
            {yt ? (
              <a
                href={yt}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/60 hover:text-white underline-offset-2 hover:underline"
              >
                Open on YouTube
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative w-full aspect-video bg-black">
          {embed ? (
            <iframe
              title={movie.title + " trailer"}
              className="absolute inset-0 h-full w-full"
              src={embed}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
              No trailer ID
            </div>
          )}
        </div>

        <div className="px-4 py-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold truncate">{movie.title}</h2>
            {movie.director ? (
              <p className="text-sm text-white/50">Directed by {movie.director}</p>
            ) : null}
          </div>
          <div className="text-right text-sm text-white/60 shrink-0">
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
