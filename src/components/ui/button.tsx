export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-3 py-1 rounded bg-accent-brand text-accent-foreground">{children}</button>
}
