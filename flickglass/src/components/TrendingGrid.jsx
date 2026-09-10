import PosterArt from "./PosterArt";

export default function TrendingGrid({ items, savedIds, onToggle }) {
  return (
    <section id="masterpieces" className="relative px-4 sm:px-6 pb-40 pt-8">
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
                  <PosterArt
                    movie={item}
                    className="h-full w-full transition duration-500 group-hover:scale-105"
                    showMeta
                  />
                  <button
                    type="button"
                    onClick={() => onToggle?.(item)}
                    aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
                    className={
                      "absolute top-2 right-2 h-8 w-8 rounded-full glass flex items-center justify-center transition z-10 " +
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
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
