export default function TrendingGrid({ items, savedIds, onToggle }) {
  return (
    <section id="masterpieces" className="relative px-4 sm:px-6 pb-36 sm:pb-40 pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400/90 mb-2">Curated</p>
          <h2 className="text-2xl sm:text-3xl font-bold">Trending Masterpieces</h2>
          <p className="mt-2 text-white/55 max-w-xl text-sm sm:text-base">
            Glass cards with quick bookmark — saved titles persist in this browser.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item) => {
            const isSaved = savedIds?.has?.(item.id);
            return (
              <article
                key={item.id}
                className="group glass glass-grain rounded-2xl overflow-hidden transition hover:border-white/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <button
                    type="button"
                    onClick={() => onToggle?.(item)}
                    aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
                    className={
                      "absolute top-2 right-2 h-8 w-8 rounded-full glass flex items-center justify-center transition relative z-10 " +
                      (isSaved ? "text-amber-400" : "text-white/80 hover:text-amber-400")
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={isSaved ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 relative z-10">
                    <p className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-white/60 mt-0.5">
                      {item.year} · <span className="text-amber-400">★ {item.rating}</span>
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
