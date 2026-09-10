import { useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#trailers", label: "Trailers" },
  { href: "#masterpieces", label: "Masterpieces" },
  { href: "#soundtracks", label: "Soundtracks" },
];

export default function Navbar({ onWatchlist, onOpenWatchlist }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-4">
      <nav className="w-full max-w-6xl glass glass-grain rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 relative">
        <a href="#home" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setOpen(false)}>
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-xl bg-amber-400/20 blur-md group-hover:bg-amber-400/35 transition" />
            <img src="/logo.svg" alt="" className="relative h-9 w-9" width="36" height="36" />
          </span>
          <span className="font-extrabold tracking-[0.14em] text-sm sm:text-base">
            FLICK<span className="text-amber-400">GLASS</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onWatchlist || onOpenWatchlist}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-amber-400 text-[#0B0C10] text-sm font-semibold px-4 py-2 hover:bg-amber-300 transition"
          >
            My Watchlist
          </button>
          <button
            type="button"
            onClick={onWatchlist || onOpenWatchlist}
            className="sm:hidden h-9 w-9 rounded-full bg-amber-400 text-[#0B0C10] flex items-center justify-center"
            aria-label="Watchlist"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="md:hidden h-9 w-9 rounded-xl glass flex items-center justify-center"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 glass glass-grain rounded-2xl p-3 flex flex-col gap-1 md:hidden z-50">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm text-white/80 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onWatchlist();
              }}
              className="mt-1 rounded-xl bg-amber-400 text-[#0B0C10] text-sm font-semibold py-2.5"
            >
              My Watchlist
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
