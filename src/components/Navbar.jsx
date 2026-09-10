import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#trailers", label: "Trailers" },
  { href: "#masterpieces", label: "Masterpieces" },
  { href: "#soundtracks", label: "Soundtracks" },
];

export default function Navbar({ onWatchlist, onOpenWatchlist }) {
  const [open, setOpen] = useState(false);
  const openList = onWatchlist || onOpenWatchlist;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-4">
        <nav className="w-full max-w-6xl glass glass-grain rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          <a
            href="#home"
            className="flex items-center gap-2 shrink-0 group min-w-0"
            onClick={() => setOpen(false)}
          >
            <span className="relative flex h-9 w-9 items-center justify-center shrink-0">
              <span className="absolute inset-0 rounded-xl bg-amber-400/20 blur-md group-hover:bg-amber-400/35 transition" />
              <img src="/logo.svg" alt="" className="relative h-9 w-9" width="36" height="36" />
            </span>
            <span className="font-extrabold tracking-[0.12em] text-sm sm:text-base truncate">
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

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openList}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-amber-400 text-[#0B0C10] text-sm font-semibold px-4 py-2 hover:bg-amber-300 transition"
            >
              My Watchlist
            </button>
            <button
              type="button"
              onClick={openList}
              className="sm:hidden h-9 w-9 rounded-full bg-amber-400 text-[#0B0C10] flex items-center justify-center"
              aria-label="Watchlist"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button
              type="button"
              className="md:hidden h-9 w-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center"
              aria-label={open ? "Close menu" : "Open menu"}
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
        </nav>
      </header>

      {/* Full-screen mobile drawer — does not sit on the carousel */}
      {open ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-[4.5rem] left-3 right-3 glass glass-grain rounded-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3.5 rounded-xl text-base text-white/85 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openList?.();
              }}
              className="mt-1 w-full rounded-xl bg-amber-400 text-[#0B0C10] text-sm font-semibold py-3"
            >
              My Watchlist
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
