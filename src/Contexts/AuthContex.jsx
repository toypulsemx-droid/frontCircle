import { createContext, useContext, useState } from 'react'
import { sendCode, verifyCode } from '../Services/authService'

const AuthContext = createContext()

// ── Helpers localStorage ──────────────────────────────────────
const USER_KEY = 'ce_user'

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => getStoredUser())
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const isAuth = !!user

  // ── Solicita el código al backend ─────────────────────────
  const requestCode = async (email) => {
    setLoading(true)
    setError(null)
    try {
      const data = await sendCode(email)
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Verifica el código e inicia sesión ─────────────────────
  const login = async (email, codigo) => {
    setLoading(true)
    setError(null)
    try {
      const data = await verifyCode(email, codigo)

      if (data.message === 'Código verificado correctamente') {
        const userData = {
          email: data.user.email,
          token: data.token,        // ← JWT para rutas protegidas
        }
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        setUser(userData)
      }
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Cierra sesión ──────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, error, requestCode, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}