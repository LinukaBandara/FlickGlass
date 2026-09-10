export default function Soundtracks({ movies, onSelect }) {
  const list = (movies || []).slice(0, 8);
  return (
    <section id="soundtracks" className="relative px-4 sm:px-6 pb-28 sm:pb-32 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400/90 mb-2">Scores</p>
          <h2 className="text-2xl sm:text-3xl font-bold">Soundtracks on the reel</h2>
          <p className="mt-2 text-white/55 max-w-xl text-sm sm:text-base">
            Jump to a title from its score line — opens on the carousel.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {list.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect?.(m, i)}
              className="glass glass-grain rounded-xl p-3 flex items-center gap-3 text-left hover:bg-white/5 transition focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10] relative"
            >
              {m.poster ? (
                <img src={m.poster} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0 relative z-10" />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-white/10 shrink-0" />
              )}
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
