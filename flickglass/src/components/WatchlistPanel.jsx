import { useEffect } from "react";

export default function WatchlistPanel({ open, items, onClose, onRemove, onPlay }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="watchlist-title"
    >
      <div className="glass-strong glass-grain w-full sm:max-w-lg max-h-[85dvh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-amber-400/90">Saved</p>
            <h2 id="watchlist-title" className="font-semibold">
              My Watchlist ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close watchlist"
            className="h-9 w-9 rounded-xl glass flex items-center justify-center hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-3 space-y-2 relative z-10">
          {items.length === 0 ? (
            <p className="text-sm text-white/50 text-center py-10 px-4">
              No titles yet. Bookmark from Trending or save while browsing the reel.
            </p>
          ) : (
            items.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-xl glass p-2 hover:bg-white/5 transition"
              >
                {m.poster ? (
                  <img src={m.poster} alt="" className="h-14 w-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="h-14 w-10 rounded-lg bg-white/10 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{m.title}</p>
                  <p className="text-xs text-white/50">
                    {m.year} · <span className="text-amber-400">★ {m.rating}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {m.trailerId ? (
                    <button
                      type="button"
                      className="h-8 w-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center hover:bg-amber-400/30"
                      aria-label={"Play " + m.title}
                      onClick={() => onPlay?.(m)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60"
                    aria-label={"Remove " + m.title}
                    onClick={() => onRemove(m.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
