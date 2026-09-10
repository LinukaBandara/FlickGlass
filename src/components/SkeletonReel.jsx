export default function SkeletonReel() {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-[420px] sm:h-[480px] flex items-center justify-center gap-4" aria-busy="true" aria-label="Loading titles">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl glass-strong overflow-hidden animate-pulse"
          style={{
            width: i === 1 ? 240 : 180,
            height: i === 1 ? 360 : 280,
            opacity: i === 1 ? 1 : 0.45,
            transform: i === 0 ? "scale(0.85)" : i === 2 ? "scale(0.85)" : "none",
          }}
        >
          <div className="h-full w-full bg-white/5" />
        </div>
      ))}
    </div>
  );
}
