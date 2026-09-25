import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Bookmark,
  Pencil,
  Trash2,
  Gauge,
  Route as RouteIcon,
  Users,
  Weight,
  Crosshair,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import VehicleImage from '../components/VehicleImage.jsx'
import VehicleForm from '../components/VehicleForm.jsx'
import { getVehicle, updateVehicle, deleteVehicle } from '../lib/api.js'
import { useAuth } from '../lib/useAuth.jsx'
import { useSaved } from '../lib/useSaved.js'

function Spec({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-[#e5e9e5]">
      <div className="flex items-center gap-1.5 text-[#839087]">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-extrabold text-[#18201d]">{value}</p>
    </div>
  )
}

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { isSaved, toggleSaved } = useSaved()

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [loadError, setLoadError] = useState(false)

  const load = async () => {
    setLoading(true)
    setLoadError(false)
    try {
      setVehicle(await getVehicle(id))
    } catch {
      setVehicle(null)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleUpdate = async (data) => {
    await updateVehicle(id, data)
    setEditing(false)
    await load()
  }

  const handleDelete = async () => {
    try {
      await deleteVehicle(id)
      navigate('/')
    } catch {
      setConfirmDelete(false)
      alert("Couldn't delete the vehicle. Check your connection and try again.")
    }
  }

  if (loading) {
    return (
      <div className="p-5">
        <div className="h-64 animate-pulse rounded-3xl bg-neutral-200" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-neutral-200" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-neutral-500">
          {loadError ? "Can't reach the database." : 'Vehicle not found.'}
        </p>
        {loadError && (
          <button
            onClick={load}
            className="mt-4 rounded-xl border border-[#4d6252] px-4 py-2 text-sm font-semibold text-[#4d6252]"
          >
            Retry
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          className="mt-4 rounded-xl bg-[#4d6252] px-4 py-2 text-sm font-semibold text-white"
        >
          Back to arsenal
        </button>
      </div>
    )
  }

  const saved = isSaved(vehicle.id)

  return (
    <div className="pb-8">
      {/* Hero image */}
      <div className="relative">
        <VehicleImage
          src={vehicle.image_url}
          alt={vehicle.name}
          className="h-72 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/35" />

        <button
          onClick={() => navigate('/')}
          className="safe-top absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => toggleSaved(vehicle.id)}
          className="safe-top absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
        >
          <Bookmark
            className="h-5 w-5"
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Title block */}
      <div className="px-5 pt-4">
        <span className="military-label rounded-full bg-[#4d6252] px-2.5 py-1 text-[9px] font-bold uppercase text-white">
          {vehicle.category}
        </span>
        <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-[#18201d]">
          {vehicle.name}
        </h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {vehicle.country}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {vehicle.era}
          </span>
        </div>
      </div>

      {/* Spec grid */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        <Spec icon={Gauge} label="Top Speed" value={vehicle.top_speed} />
        <Spec icon={RouteIcon} label="Range" value={vehicle.range} />
        <Spec icon={Users} label="Crew" value={vehicle.crew} />
        <Spec icon={Weight} label="Weight" value={vehicle.weight} />
      </div>

      {/* Armament */}
      {vehicle.armament && (
        <div className="px-5 pt-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e5e9e5]">
            <div className="flex items-center gap-1.5 text-[#839087]">
              <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Armament
              </span>
            </div>
            <p className="mt-1 text-sm font-medium leading-relaxed text-[#38443c]">
              {vehicle.armament}
            </p>
          </div>
        </div>
      )}

      {/* Overview */}
      {vehicle.description && (
        <div className="px-5 pt-5">
          <h2 className="mb-2 text-base font-bold text-neutral-900">Overview</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            {vehicle.description}
          </p>
        </div>
      )}

      {/* Admin note (admin only) */}
      {isAdmin && vehicle.admin_note && (
        <div className="px-5 pt-5">
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <div className="flex items-center gap-1.5 text-amber-600">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Admin Note
              </span>
            </div>
            <p className="mt-1 text-sm text-amber-900">{vehicle.admin_note}</p>
          </div>
        </div>
      )}

      {/* Admin actions */}
      {isAdmin && (
        <div className="mt-6 flex gap-2 px-5">
          <button
            onClick={() => setEditing(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4d6252] py-3 text-sm font-semibold text-white active:scale-[0.98]"
          >
            <Pencil className="h-4 w-4" /> Edit Vehicle
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-100 active:scale-[0.98]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Edit sheet */}
      <VehicleForm
        open={editing}
        initial={vehicle}
        onSubmit={handleUpdate}
        onClose={() => setEditing(false)}
      />

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="w-full max-w-[300px] rounded-2xl bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="mb-1 text-base font-bold text-neutral-900">
              Delete Vehicle?
            </h3>
            <p className="mb-5 text-sm text-neutral-500">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
