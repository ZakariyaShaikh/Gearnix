import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

export function RequireLogin({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <p role="status">Checking your session…</p>
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
