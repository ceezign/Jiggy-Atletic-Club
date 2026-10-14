import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <h1 className="font-display text-6xl text-volt">404</h1>
      <p className="mt-4 text-lg text-muted">This page doesn&apos;t exist.</p>
      <Link href="/" className="mt-8 inline-flex px-6 py-3 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
