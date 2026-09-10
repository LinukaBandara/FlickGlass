import PosterArt from "./PosterArt";

export default function MediaDock({ movie, playing, onToggle, onPrev, onNext }) {
  if (!movie) return null;
  return (
    <div
      id="dock"
      className="fixed bottom-0 inset-x-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none"
    >
      <div className="pointer-events-auto mb-2 flex items-center gap-1.5 sm:gap-3 rounded-full pl-1.5 pr-2.5 sm:pl-2 sm:pr-4 py-1.5 sm:py-2 border border-white/15 bg-black/70 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.55)] max-w-[calc(100vw-1.5rem)]">
        <div className="flex items-center shrink-0">
          <button type="button" onClick={onPrev} aria-label="Previous" className="h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center transition text-white/80">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={playing ? "Pause autoplay" : "Play autoplay"}
            className="h-10 w-10 rounded-full bg-white text-[#0B0C10] flex items-center justify-center hover:bg-white/90 transition mx-0.5"
          >
            {playing ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button type="button" onClick={onNext} aria-label="Next" className="h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center transition text-white/80">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zm-3.5 6-8.5 6V6z" /></svg>
          </button>
        </div>

        <div className="flex items-center gap-2 min-w-0 border-l border-white/10 pl-2 sm:pl-3">
          <div className="h-8 w-8 rounded-md overflow-hidden shrink-0 bg-white/5">
            <PosterArt movie={movie} className="h-full w-full" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="text-xs font-semibold truncate max-w-[14rem]">{movie.title}</p>
            <p className="text-[10px] text-white/45 truncate">
              {(movie.genres || []).slice(0, 2).join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
