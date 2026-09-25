import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import VehicleCard from '../components/VehicleCard.jsx'
import { listVehicles } from '../lib/api.js'
import { useSaved } from '../lib/useSaved.js'

export default function Saved() {
  const { saved } = useSaved()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listVehicles()
      .then(setVehicles)
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false))
  }, [])

  const savedVehicles = vehicles.filter((v) => saved.includes(v.id))

  return (
    <div>
      <header className="safe-top bg-[#18201d] px-5 pb-6 pt-6 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <Bookmark className="h-5 w-5 text-[#d5dfcf]" strokeWidth={2.2} />
          </div>
          <div>
            <p className="military-label text-[9px] font-bold uppercase text-[#9eac9f]">Personal shortlist</p>
            <h1 className="mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.03em]">Saved</h1>
            <p className="mt-1 text-xs text-[#aab5ac]">
              {savedVehicles.length} saved vehicles
            </p>
          </div>
        </div>
      </header>

      <div className="px-5 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-neutral-200"
              />
            ))}
          </div>
        ) : savedVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="h-10 w-10 text-neutral-300" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-neutral-500">
              No saved vehicles yet.
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Tap the bookmark on any vehicle to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {savedVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
