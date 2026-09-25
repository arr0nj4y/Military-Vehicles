import { User, ShieldCheck, Info } from 'lucide-react'
import { useAuth } from '../lib/useAuth.jsx'

export default function Profile() {
  const { isAdmin, toggleAdmin } = useAuth()

  return (
    <div>
      <header className="safe-top bg-[#18201d] px-5 pb-6 pt-6 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <User className="h-5 w-5 text-[#d5dfcf]" strokeWidth={2.2} />
          </div>
          <div>
            <p className="military-label text-[9px] font-bold uppercase text-[#9eac9f]">Operator settings</p>
            <h1 className="mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.03em]">Profile</h1>
            <p className="mt-1 text-xs text-[#aab5ac]">
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

        {/* About */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-neutral-100">
          <div className="flex items-center gap-2 text-neutral-400">
            <Info className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              About
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            ArmoredHub — Military vehicle catalog. Connected to the live
            ArmoredHub database. Version 1.1.0
          </p>
        </div>
      </div>
    </div>
  )
}
