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
      className="group relative w-full overflow-hidden rounded-[20px] bg-white text-left shadow-[0_6px_18px_rgba(24,32,29,0.06)] ring-1 ring-[#e6ebe6] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(24,32,29,0.1)] active:scale-[0.98]"
    >
      <div className="relative">
        <VehicleImage
          src={vehicle.image_url}
          alt={vehicle.name}
          className="h-36 w-full sm:h-40"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
        <span
          onClick={(e) => {
            e.stopPropagation()
            toggleSaved(vehicle.id)
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          <Bookmark
            className="h-4 w-4"
            fill={saved ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </span>
        <span className="military-label absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[8px] font-bold uppercase text-white backdrop-blur">
          {vehicle.era}
        </span>
      </div>

      <div className="p-3.5">
        <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[#839087]">
          {vehicle.category}
        </p>
        <h3 className="truncate text-[14px] font-extrabold tracking-[-0.01em] text-[#18201d]">
          {vehicle.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-[#78847b]">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="truncate">{vehicle.country}</span>
        </div>
      </div>
    </button>
  )
}
