import { useEffect, useRef, useState } from "react";
import PosterArt from "./PosterArt";

const DRAG_THRESHOLD = 48;

export default function Carousel({ movies, current, onSelect, onWatch, onInteract }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, lastX: 0, moved: false });

  useEffect(() => {
    if (!dragging) setDragX(0);
  }, [current, dragging]);

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    if (e.target.closest("button")) return;
    drag.current = { active: true, startX: e.clientX, lastX: e.clientX, moved: false };
    setDragging(true);
    onInteract?.();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    drag.current.lastX = e.clientX;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 8) drag.current.moved = true;
    setDragX(dx);
  };

  const onPointerUp = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
    const dx = drag.current.lastX - drag.current.startX;
    setDragX(0);
    if (Math.abs(dx) >= DRAG_THRESHOLD) onSelect(dx < 0 ? current + 1 : current - 1);
  };

  return (
    <div
      className="carousel-stage relative w-full max-w-5xl mx-auto select-none"
      style={{
        touchAction: "pan-y",
        cursor: dragging ? "grabbing" : "grab",
        height: "min(420px, calc(100dvh - 320px))",
        minHeight: "280px",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={onInteract}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[min(360px,70vw)] h-[min(360px,70vw)] rounded-full opacity-40 blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(99,102,241,0.15) 45%, transparent 70%)",
        }}
      />

      <div className="carousel-track relative w-full h-[calc(100%-36px)] flex items-center justify-center">
        {movies.map((m, i) => {
          const offset = i - current;
          const abs = Math.abs(offset);
          if (abs > 2) return null;

          const dragBoost = dragging ? dragX * 0.5 : 0;
          const rotateY = offset * -32 + (dragging ? dragX * -0.03 : 0);
          const translateX = offset * 150 + dragBoost;
          const translateZ = -abs * 110;
          const scale = Math.max(0.72, 1 - abs * 0.13);
          const opacity = Math.max(0.4, 1 - abs * 0.22);
          const blur = abs === 0 ? 0 : 1 + abs * 0.6;
          const z = 40 - abs;
          const active = i === current;

          return (
            <article
              key={m.id}
              className="carousel-card absolute"
              style={{
                width: active ? "min(200px, 52vw)" : "min(170px, 44vw)",
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: z,
                filter: blur ? `blur(${blur}px)` : "none",
                transition: dragging
                  ? "none"
                  : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, filter 0.4s ease, width 0.4s ease",
              }}
              onClick={() => {
                if (drag.current.moved) {
                  drag.current.moved = false;
                  return;
                }
                if (active) onWatch(m);
                else onSelect(i);
              }}
            >
              <div
                className={
                  "relative rounded-2xl p-[2.5px] " +
                  (active
                    ? "bg-gradient-to-b from-white/35 via-white/10 to-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                    : "bg-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)]")
                }
              >
                <div className="relative rounded-[0.95rem] overflow-hidden bg-[#12141a] aspect-[2/3]">
                  <PosterArt movie={m} className="h-full w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />
                  {active && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onWatch(m);
                        }}
                        disabled={!m.trailerId}
                        className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition disabled:opacity-40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                        aria-label="Watch trailer"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={"mt-2 text-center px-1 " + (active ? "opacity-100" : "opacity-55")}>
                <h2 className={"font-bold leading-tight line-clamp-2 " + (active ? "text-sm sm:text-base" : "text-xs")}>
                  {m.title}
                </h2>
                <p className="mt-0.5 text-[11px] sm:text-xs text-white/60">
                  {m.year}
                  {(m.genres || [])[0] ? ` · ${m.genres[0]}` : ""}
                  <span className="text-amber-400 font-semibold"> · ★ {m.rating}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="absolute bottom-0 inset-x-0 flex justify-center gap-1.5 z-20">
        {movies.map((m, i) => (
          <button
            key={m.id}
            type="button"
            aria-label={"Go to " + m.title}
            onClick={() => {
              onInteract?.();
              onSelect(i);
            }}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === current ? "w-6 bg-white" : "w-1.5 bg-white/25 hover:bg-white/45")
            }
          />
        ))}
      </div>
    </div>
  );
}
