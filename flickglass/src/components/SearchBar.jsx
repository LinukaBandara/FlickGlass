export default function SearchBar({ query, onQuery, genres, activeGenre, onGenre }) {
  return (
    <div className="mx-auto max-w-6xl mb-3 sm:mb-4">
      <div className="flex flex-col gap-3">
        <label className="relative w-full">
          <span className="sr-only">Search titles</span>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search titles…"
            className="w-full rounded-xl glass glass-grain pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/35 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 relative z-10"
          />
        </label>
        <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
          <button
            type="button"
            onClick={() => onGenre("All")}
            className={
              "px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.12em] border transition " +
              (activeGenre === "All"
                ? "bg-amber-400 text-[#0B0C10] border-amber-400 font-semibold"
                : "glass text-white/70 border-white/15 hover:text-white")
            }
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGenre(g)}
              className={
                "px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.12em] border transition " +
                (activeGenre === g
                  ? "bg-amber-400 text-[#0B0C10] border-amber-400 font-semibold"
                  : "glass text-white/70 border-white/15 hover:text-white")
              }
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
