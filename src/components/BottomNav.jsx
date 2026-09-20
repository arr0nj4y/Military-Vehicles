import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Bookmark, User } from 'lucide-react'

// Mobile bottom tab bar. Mirrors the original's 4 tabs (Home, Catalog, Saved,
// Profile). In the original, Catalog routed to home; here it does too.
const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/', label: 'Catalog', icon: LayoutGrid, end: true },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {tabs.map((tab, i) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={i}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`
              }
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              {tab.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
