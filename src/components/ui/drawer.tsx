export function Drawer({ children }: { children: React.ReactNode }) {
  return <aside className="fixed right-0 top-0 h-full w-80 bg-background">{children}</aside>
}
