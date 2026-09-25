import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Shield, SlidersHorizontal, Activity, WifiOff } from 'lucide-react'
import VehicleCard from '../components/VehicleCard.jsx'
import VehicleForm from '../components/VehicleForm.jsx'
import { listVehicles, createVehicle } from '../lib/api.js'
import { useAuth } from '../lib/useAuth.jsx'

export default function Home() {
  const { isAdmin } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [formOpen, setFormOpen] = useState(false)

  const [error, setError] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await listVehicles()
      setVehicles(data.filter((v) => v.is_active !== false))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [vehicles])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vehicles.filter((v) => {
      const matchesCat = activeCat === 'All' || v.category === activeCat
      const matchesQuery =
        !q ||
        [v.name, v.country, v.armament, v.era]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      return matchesCat && matchesQuery
    })
  }, [vehicles, query, activeCat])

  const handleCreate = async (data) => {
    await createVehicle(data)
    setFormOpen(false)
    await load()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="safe-top bg-[#18201d] px-5 pb-6 pt-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
              <Shield className="h-5 w-5 text-[#d5dfcf]" strokeWidth={2.2} />
            </div>
            <div>
              <p className="military-label text-[9px] font-bold uppercase text-[#9eac9f]">Field archive / 2026</p>
              <h1 className="mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.03em]">
                Military Arsenal
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-100">
            <Activity className="h-3 w-3" /> Live
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <p className="text-xs text-[#aab5ac]">{vehicles.length} vehicles in catalog</p>
          <p className="military-label text-[9px] font-semibold uppercase text-[#718077]">Operational database</p>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.09] px-3.5 py-3">
          <Search className="h-4 w-4 text-[#aab5ac]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles..."
            className="w-full bg-transparent text-sm text-white placeholder:text-[#7f8a82] outline-none"
          />
          <SlidersHorizontal className="h-4 w-4 text-[#7f8a82]" />
        </div>
      </header>

      {/* Category filter */}
      <div className="no-scrollbar sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-[#e5e9e5] bg-[#f5f7f4]/95 px-5 py-3 backdrop-blur">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeCat === cat
                ? 'bg-[#4d6252] text-white shadow-sm'
                : 'bg-white text-[#5e6a62] ring-1 ring-[#e1e6e1]'
            }`}
          >
            {cat === 'All' ? 'All Vehicles' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-5 py-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-neutral-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#d9e0d9] bg-white/60 py-20 text-center">
            <WifiOff className="h-10 w-10 text-[#b7c2b8]" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-semibold text-[#56645a]">
              Can't reach the database.
            </p>
            <p className="mt-1 text-xs text-[#8b978e]">Check your internet connection and try again.</p>
            <button
              onClick={load}
              className="mt-4 rounded-xl bg-[#4d6252] px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#d9e0d9] bg-white/60 py-20 text-center">
            <Shield className="h-10 w-10 text-[#b7c2b8]" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-semibold text-[#56645a]">
              No vehicles in this category.
            </p>
            <p className="mt-1 text-xs text-[#8b978e]">Try another filter or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>

      {/* Admin: Add Vehicle FAB */}
      {isAdmin && (
        <button
          onClick={() => setFormOpen(true)}
          className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Vehicle
        </button>
      )}

      <VehicleForm
        open={formOpen}
        initial={null}
        onSubmit={handleCreate}
        onClose={() => setFormOpen(false)}
      />
    </div>
  )
}
