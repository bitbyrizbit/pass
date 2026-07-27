import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 selection:bg-rust selection:text-paper">
      <div className="text-center">
        <p className="font-mono text-[10px] text-paper/30 tracking-[0.4em] mb-6">
          pass / error 404
        </p>
        <h1 className="font-heading italic text-8xl md:text-[10rem] text-paper leading-none mb-2">
          86'd.
        </h1>
        <p className="font-body text-paper/40 text-lg mb-10">
          This page got bumped off the line.
        </p>
        <Link
          href="/"
          className="font-mono text-sm text-paper/60 border border-paper/20 px-6 py-3 hover:border-rust hover:text-rust transition-all duration-300"
        >
          Back to the pass
        </Link>
      </div>
    </main>
  );
}
