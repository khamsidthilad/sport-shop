import Link from 'next/link';
import { lo } from '@/lib/lao';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-xl rounded-sm border border-border bg-card p-10 text-center shadow-bold">
        <p className="font-display text-7xl text-accent-brand">{lo.notFound.title}</p>
        <h1 className="mt-4 font-display text-3xl">{lo.notFound.heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lo.notFound.body}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand"
        >
          {lo.common.goHome}
        </Link>
      </div>
    </main>
  );
}
