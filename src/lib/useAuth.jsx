import { createContext, useContext, useEffect, useState } from 'react'

// Local stand-in for the original Base44 role system (user / admin).
// In the real app, Add/Edit/Delete and the Admin Note were admin-only. Here an
// admin-mode toggle on the Profile screen flips this flag, persisted locally.

const AuthContext = createContext(null)
const KEY = 'armoredhub_is_admin'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, String(isAdmin))
    } catch {
      /* ignore blocked storage */
    }
  }, [isAdmin])

  const value = {
    isAdmin,
    role: isAdmin ? 'admin' : 'user',
    toggleAdmin: () => setIsAdmin((v) => !v),
    setIsAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
