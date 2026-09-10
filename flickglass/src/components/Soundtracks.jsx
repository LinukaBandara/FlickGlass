import PosterArt from "./PosterArt";

export default function Soundtracks({ movies, onSelect }) {
  const list = (movies || []).slice(0, 8);
  return (
    <section id="soundtracks" className="relative px-4 sm:px-6 pb-32 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400/90 mb-2">Scores</p>
          <h2 className="text-2xl sm:text-3xl font-bold">Soundtracks on the reel</h2>
          <p className="mt-2 text-white/55 max-w-xl text-sm sm:text-base">
            Jump to a title from its score line — opens on the carousel.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {list.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect?.(m)}
              className="glass glass-grain rounded-xl p-3 flex items-center gap-3 text-left hover:bg-white/5 transition focus-visible:ring-2 focus-visible:ring-amber-400/80 relative"
            >
              <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 relative z-10">
                <PosterArt movie={m} className="h-full w-full" />
              </div>
              <div className="min-w-0 relative z-10">
                <p className="text-sm font-medium truncate">{m.soundtrack || m.title}</p>
                <p className="text-xs text-white/50 truncate">
                  {m.title} · {m.year}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
