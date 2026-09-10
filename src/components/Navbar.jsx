import { useEffect, useState } from "react";

const LINKS = [
  ["Home", "#home"],
  ["Trailers", "#trailers"],
  ["Masterpieces", "#masterpieces"],
  ["Soundtracks", "#soundtracks"],
];

export default function Navbar({ watchlistCount = 0, onOpenWatchlist }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4">
      <nav className="glass glass-grain mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-2xl px-4 sm:px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative z-50">
        <a href="#home" className="flex items-center gap-2 group shrink-0 relative z-10">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15 border border-amber-400/30">
            <span className="absolute inset-0 rounded-lg bg-amber-400/20 blur-md group-hover:bg-amber-400/35 transition" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5C518" className="relative">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="font-bold tracking-[0.12em] text-sm sm:text-base relative">
            FLICK<span className="text-amber-400">GLASS</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1 text-sm text-white/70 relative z-10">
          {LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={onOpenWatchlist}
            className="shrink-0 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0B0C10] bg-amber-400 hover:bg-amber-300 transition shadow-[0_0_24px_rgba(245,197,24,0.25)] inline-flex items-center gap-1.5"
          >
            My Watchlist
            {watchlistCount > 0 ? (
              <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-[#0B0C10]/15 text-[11px] flex items-center justify-center">
                {watchlistCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="md:hidden h-9 w-9 rounded-xl glass flex items-center justify-center"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-20 inset-x-4 glass-strong glass-grain rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-fade-in">
            <div className="flex flex-col gap-1 relative z-10">
              {LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/90 hover:bg-white/5 transition font-medium"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
