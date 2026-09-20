import { useNavigate } from 'react-router-dom'
import { Bookmark, MapPin } from 'lucide-react'
import VehicleImage from './VehicleImage.jsx'
import { useSaved } from '../lib/useSaved.js'

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate()
  const { isSaved, toggleSaved } = useSaved()
  const saved = isSaved(vehicle.id)

  return (
    <button
      onClick={() => navigate(`/vehicle/${vehicle.id}`)}
      className="group relative w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-neutral-100 transition active:scale-[0.98]"
    >
      <div className="relative">
        <VehicleImage
          src={vehicle.image_url}
          alt={vehicle.name}
          className="h-40 w-full"
        />
        <span
          onClick={(e) => {
            e.stopPropagation()
            toggleSaved(vehicle.id)
          }}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          <Bookmark
            className="h-4 w-4"
            fill={saved ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {vehicle.era}
        </span>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-neutral-900">
          {vehicle.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="truncate">{vehicle.country}</span>
        </div>
      </div>
    </button>
  )
}
