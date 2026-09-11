import { useEffect, useState } from "react";

const STORAGE_KEY = "flickglass-cookie-consent";

function loadAnalytics() {
  if (document.querySelector('script[data-flickglass-analytics]')) return;
  const script = document.createElement("script");
  script.src = "/_vercel/insights/script.js";
  script.defer = true;
  script.dataset.flickglassAnalytics = "true";
  document.head.appendChild(script);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY);
    if (consent === "accepted") loadAnalytics();
    else if (!consent) setVisible(true);
  }, []);

  const choose = (value) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    if (value === "accepted") loadAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl glass-strong rounded-2xl p-4 sm:p-5 shadow-2xl"
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-copy"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-white">Privacy choices</h2>
          <p id="cookie-consent-copy" className="mt-1 text-sm text-white/70 leading-relaxed">
            FlickGlass uses essential local storage for your watchlist. With your permission,
            privacy-friendly Vercel Analytics helps us understand site usage. No advertising cookies are used.
          </p>
          <a href="/privacy" className="mt-2 inline-block text-xs text-amber-300 hover:text-amber-200 underline underline-offset-2">
            Read Privacy Policy
          </a>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => choose("essential")} className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
            Essential only
          </button>
          <button type="button" onClick={() => choose("accepted")} className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-[#0B0C10] hover:bg-amber-300">
            Accept analytics
          </button>
        </div>
      </div>
    </aside>
  );
}
