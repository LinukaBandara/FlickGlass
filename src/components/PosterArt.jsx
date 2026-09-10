import { useState } from "react";

const PALETTES = [
  ["#0d1b2a", "#1b3a4b", "#F5C518"],
  ["#1a1025", "#2d1b4e", "#c4b5fd"],
  ["#0f1f12", "#1a3a24", "#86efac"],
  ["#1a0a0a", "#3b1212", "#f87171"],
  ["#0f172a", "#1e293b", "#94a3b8"],
  ["#1e1035", "#3b0764", "#e9d5ff"],
  ["#0c1929", "#1e3a5f", "#fde68a"],
];

function paletteFor(id) {
  const s = String(id || "x");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

export default function PosterArt({ movie, className = "", showMeta = false }) {
  const [failed, setFailed] = useState(false);
  const useImg = movie?.poster && !failed && !String(movie.poster).includes("placehold.co");
  const [c0, c1, accent] = paletteFor(movie?.id || movie?.title);

  if (useImg) {
    return (
      <img
        src={movie.poster}
        alt={movie.title || ""}
        className={className + " object-cover"}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={className + " relative flex flex-col items-center justify-center p-4 text-center overflow-hidden"}
      style={{
        background: `linear-gradient(160deg, ${c0} 0%, ${c1} 55%, ${c0} 100%)`,
      }}
      aria-hidden={!movie?.title}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${accent}44, transparent 55%)`,
        }}
      />
      <div className="relative z-10 space-y-2 max-w-full">
        <div
          className="mx-auto h-10 w-10 rounded-full border flex items-center justify-center"
          style={{ borderColor: accent + "66", color: accent }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="font-bold text-sm sm:text-base leading-snug text-white px-1">
          {movie?.title || "Untitled"}
        </p>
        {showMeta ? (
          <p className="text-[11px] text-white/55">
            {movie?.year}
            {(movie?.genres || [])[0] ? ` · ${movie.genres[0]}` : ""}
          </p>
        ) : null}
      </div>
      <div
        className="absolute bottom-0 inset-x-0 h-1"
        style={{ background: accent, opacity: 0.7 }}
      />
    </div>
  );
}
