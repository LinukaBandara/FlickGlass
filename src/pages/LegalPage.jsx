import { useEffect } from "react";

const sections = {
  privacy: {
    title: "Privacy Policy",
    description: "Learn how FlickGlass handles local storage, analytics consent, movie data and third-party services.",
    intro: "This Privacy Policy explains how FlickGlass handles information when you use this cinematic trailer discovery site.",
    items: [
      ["Information we store", "Your watchlist and cookie-consent choice are stored locally in your browser. FlickGlass does not require an account and does not intentionally collect passwords or payment information."],
      ["Analytics", "If you choose Accept analytics, Vercel Analytics may collect aggregated usage and performance information to help improve the site. Analytics is not loaded until you consent."],
      ["Movie data", "Movie information is requested from The Movie Database (TMDB) through our server-side proxy. Trailer playback may connect you to YouTube when you choose to watch a trailer."],
      ["Cookies and local storage", "FlickGlass does not use advertising cookies. Local storage is used for essential product functionality such as your watchlist and your consent preference."],
      ["Third parties", "TMDB, YouTube, Google Fonts, and Vercel may receive requests when their resources are used. Their own privacy policies govern those services."],
      ["Your choices", "You can clear FlickGlass local storage through your browser settings. You can also choose Essential only in the consent banner to keep analytics disabled."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    description: "Read the terms for using FlickGlass, its movie discovery interface and third-party trailer content.",
    intro: "By using FlickGlass, you agree to these basic terms for this independent movie discovery and trailer interface.",
    items: [
      ["Use of the site", "FlickGlass is provided for personal, lawful movie discovery and trailer browsing. Do not abuse, overload, scrape, or attempt to bypass security controls on the service."],
      ["Third-party content", "Movie metadata and trailers are provided through third-party services. FlickGlass does not claim ownership of third-party movie artwork, trademarks, metadata, or video content."],
      ["Accuracy", "Release information, ratings, posters, trailers, and availability can change. FlickGlass does not guarantee that third-party information is complete, current, or error-free."],
      ["Availability", "The site may change, be temporarily unavailable, or lose access to third-party services without notice."],
      ["Intellectual property", "FlickGlass's original interface and code are protected by applicable rights. Third-party assets remain the property of their respective owners."],
      ["Changes", "These terms may be updated as the service evolves. Continued use after an update means you accept the revised terms."],
    ],
  },
};

export default function LegalPage({ type }) {
  const content = sections[type] || sections.privacy;

  useEffect(() => {
    document.title = `${content.title} — FlickGlass`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = content.description;
    return () => { document.title = "FlickGlass — Cinematic Trailer Hub"; };
  }, [content]);

  return (
    <main className="min-h-dvh bg-[#0B0C10] px-5 py-24 text-white sm:px-8">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="text-sm font-semibold text-amber-300 hover:text-amber-200">← Back to FlickGlass</a>
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">{content.title}</h1>
        <p className="mt-5 text-base leading-8 text-white/75">{content.intro}</p>
        <div className="mt-10 space-y-7">
          {content.items.map(([heading, body]) => (
            <section key={heading}><h2 className="text-lg font-bold text-white">{heading}</h2><p className="mt-2 leading-7 text-white/70">{body}</p></section>
          ))}
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-white/55">Last updated: September 11, 2026</p>
      </article>
    </main>
  );
}
