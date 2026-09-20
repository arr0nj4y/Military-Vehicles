import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Shield } from 'lucide-react'
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

  const load = async () => {
    setLoading(true)
    const data = await listVehicles()
    setVehicles(data.filter((v) => v.is_active !== false))
    setLoading(false)
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
    <div>
      {/* Header */}
      <header className="safe-top bg-neutral-900 px-5 pb-5 pt-6 text-white">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" strokeWidth={2.5} />
          <div>
            <h1 className="text-xl font-extrabold leading-tight">
              Military Arsenal
            </h1>
            <p className="text-xs text-neutral-400">
              {vehicles.length} vehicles in catalog
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
          <Search className="h-4 w-4 text-neutral-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles..."
            className="w-full bg-transparent text-sm text-white placeholder:text-neutral-400 outline-none"
          />
        </div>
      </header>

      {/* Category filter */}
      <div className="no-scrollbar sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-neutral-100 bg-neutral-50/95 px-5 py-3 backdrop-blur">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeCat === cat
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-600 ring-1 ring-neutral-200'
            }`}
          >
            {cat === 'All' ? 'All Vehicles' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-neutral-200"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Shield className="h-10 w-10 text-neutral-300" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-neutral-500">
              No vehicles in this category.
            </p>
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
