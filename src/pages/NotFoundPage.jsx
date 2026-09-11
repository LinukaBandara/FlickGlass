export default function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#0B0C10] px-6 text-center text-white">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">404</p>
        <h1 className="mt-3 text-4xl font-extrabold">Scene not found</h1>
        <p className="mt-3 leading-7 text-white/70">The page you requested does not exist or has moved.</p>
        <a href="/" className="mt-7 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-semibold text-[#0B0C10] hover:bg-amber-300">
          Return to FlickGlass
        </a>
      </div>
    </main>
  );
}
