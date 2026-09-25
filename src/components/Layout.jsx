import BottomNav from './BottomNav.jsx'

// Phone-shaped frame: centered column, content scrolls, fixed bottom nav.
export default function Layout({ children }) {
  return (
    <div className="app-background min-h-full px-0 sm:px-4">
      <div className="app-shell mx-auto flex min-h-full max-w-md flex-col overflow-hidden bg-neutral-50 sm:min-h-screen sm:rounded-[28px]">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
      </div>
    </div>
  )
}
