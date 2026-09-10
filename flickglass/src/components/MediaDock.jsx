import PosterArt from "./PosterArt";

export default function MediaDock({
  movie,
  playing,
  onToggleAutoplay,
  onPlayTrailer,
  onPrev,
  onNext,
}) {
  if (!movie) return null;
  return (
    <div
      id="dock"
      className="fixed bottom-0 inset-x-0 z-40 pointer-events-none"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex justify-center px-3 pb-2">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full pl-1 pr-2 sm:pl-1.5 sm:pr-3 py-1 border border-white/15 bg-black/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-[calc(100vw-1rem)]">
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous title"
              className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onPlayTrailer?.(movie)}
              aria-label="Play trailer"
              disabled={!movie.trailerId}
              className="h-9 w-9 rounded-full bg-white text-[#0B0C10] flex items-center justify-center hover:bg-white/90 disabled:opacity-40"
              title="Play trailer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next title"
              className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6h2v12h-2zm-3.5 6-8.5 6V6z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 min-w-0 border-l border-white/10 pl-2">
            <div className="h-7 w-7 rounded-md overflow-hidden shrink-0 bg-white/5">
              <PosterArt movie={movie} className="h-full w-full" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="text-[11px] font-semibold truncate max-w-[11rem]">{movie.title}</p>
              <p className="text-[10px] text-white/45 truncate">
                {(movie.genres || []).slice(0, 2).join(" · ")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleAutoplay}
            className={
              "ml-1 hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold border transition " +
              (playing
                ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                : "bg-white/5 border-white/15 text-white/50 hover:text-white/80")
            }
            title={playing ? "Autoplay on — click to pause" : "Autoplay off — click to resume"}
          >
            {playing ? "Autoplay" : "Paused"}
          </button>
        </div>
      </div>
    </div>
  );
}
