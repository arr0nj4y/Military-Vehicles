import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <ShieldAlert className="h-12 w-12 text-neutral-300" strokeWidth={1.5} />
      <h1 className="mt-4 text-lg font-bold text-neutral-900">Page not found</h1>
      <p className="mt-1 text-sm text-neutral-500">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-5 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Back to arsenal
      </button>
    </div>
  )
}
