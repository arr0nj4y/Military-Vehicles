import { useCallback, useEffect, useState } from 'react'

// Favorites ("Saved" tab), stored per-device in localStorage.
const KEY = 'armoredhub_saved'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function useSaved() {
  const [saved, setSaved] = useState(read)

  // Keep multiple screens in sync when the saved set changes.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setSaved(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const persist = useCallback((next) => {
    setSaved(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const isSaved = useCallback((id) => saved.includes(id), [saved])

  const toggleSaved = useCallback(
    (id) => {
      const next = saved.includes(id)
        ? saved.filter((x) => x !== id)
        : [...saved, id]
      persist(next)
    },
    [saved, persist],
  )

  return { saved, isSaved, toggleSaved }
}
