import { useState } from 'react'
import { User, ShieldCheck, RotateCcw, Info } from 'lucide-react'
import { useAuth } from '../lib/useAuth.jsx'
import { resetVehicles } from '../lib/api.js'

export default function Profile() {
  const { isAdmin, toggleAdmin } = useAuth()
  const [resetting, setResetting] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const handleReset = async () => {
    setResetting(true)
    setResetDone(false)
    await resetVehicles()
    setResetting(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 2000)
  }

  return (
    <div>
      <header className="safe-top bg-neutral-900 px-5 pb-5 pt-6 text-white">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" strokeWidth={2.5} />
          <div>
            <h1 className="text-xl font-extrabold leading-tight">Profile</h1>
            <p className="text-xs text-neutral-400">
              Role: {isAdmin ? 'Administrator' : 'Viewer'}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-3 px-5 py-4">
        {/* Admin mode toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <ShieldCheck className="h-5 w-5 text-neutral-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                Admin Mode
              </p>
              <p className="text-xs text-neutral-500">
                Enable to add, edit, and delete vehicles
              </p>
            </div>
          </div>
          <button
            onClick={toggleAdmin}
            className={`relative h-6 w-11 rounded-full transition ${
              isAdmin ? 'bg-neutral-900' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                isAdmin ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Reset catalog */}
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-neutral-100 disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <RotateCcw className="h-5 w-5 text-neutral-700" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-900">
                Reset Catalog
              </p>
              <p className="text-xs text-neutral-500">
                Restore the original demo vehicles
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-neutral-400">
            {resetting ? 'Resetting…' : resetDone ? 'Done' : ''}
          </span>
        </button>

        {/* About */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-neutral-100">
          <div className="flex items-center gap-2 text-neutral-400">
            <Info className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              About
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            ArmoredHub — Military vehicle catalog. Running on local mock data
            (offline). Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
