import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-xl rounded-sm border border-border bg-card p-10 text-center shadow-bold">
        <p className="font-display text-7xl text-accent-brand">404</p>
        <h1 className="mt-4 font-display text-3xl">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
