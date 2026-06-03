import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6">
      <div className="max-w-xl w-full rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">This page can not load</h1>
        <p className="mb-6 text-slate-600">Something went wrong on our end. Please refresh the browser or head back home.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 text-center">
            Go home
          </Link>
          <Link href="." className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 text-center">
            Refresh
          </Link>
        </div>
      </div>
    </main>
  )
}
