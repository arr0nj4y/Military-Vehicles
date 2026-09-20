import BottomNav from './BottomNav.jsx'

// Phone-shaped frame: centered column, content scrolls, fixed bottom nav.
export default function Layout({ children }) {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-neutral-50">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  )
}
