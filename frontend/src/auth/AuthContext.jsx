import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { apiRequest, setAccessToken } from '@/api/client'

const AuthContext = createContext(null)
let sessionRestorePromise

function getResponseData(response, action) {
  if (!response?.data || typeof response.data !== 'object') {
    throw new Error(`The server returned an invalid ${action} response.`)
  }

  return response.data
}

function restoreSessionOnce() {
  if (!sessionRestorePromise) {
    sessionRestorePromise = (async () => {
      try {
        const refreshResponse = await apiRequest('/auth/refresh', {
          method: 'POST',
        })
        const { access_token: token } = getResponseData(
          refreshResponse,
          'session refresh',
        )

        if (typeof token !== 'string' || token.length === 0) {
          throw new Error('The server did not return an access token.')
        }

        setAccessToken(token)
        const meResponse = await apiRequest('/users/me')
        return { accessToken: token, user: getResponseData(meResponse, 'user') }
      } catch (error) {
        setAccessToken(null)
        if (error.status === 401) {
          return { accessToken: null, user: null }
        }
        return { accessToken: null, user: null, error }
      }
    })()
  }

  return sessionRestorePromise
}

export function AuthProvider({ children }) {
  const [accessToken, setTokenState] = useState(null)
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const updateAccessToken = useCallback((token) => {
    setAccessToken(token)
    setTokenState(token)
  }, [])

  useEffect(() => {
    let active = true

    restoreSessionOnce().then((session) => {
      if (!active) {
        return
      }
      setTokenState(session.accessToken)
      setUser(session.user)
      setError(session.error || null)
      setStatus(session.user ? 'authenticated' : 'unauthenticated')
    })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(
    async (credentials) => {
      setError(null)
      const loginResponse = await apiRequest('/auth/login', {
        method: 'POST',
        body: credentials,
      })
      const { access_token: token } = getResponseData(loginResponse, 'login')

      if (typeof token !== 'string' || token.length === 0) {
        throw new Error('The server did not return an access token.')
      }

      updateAccessToken(token)
      try {
        const meResponse = await apiRequest('/users/me')
        const currentUser = getResponseData(meResponse, 'user')
        setUser(currentUser)
        setStatus('authenticated')
        sessionRestorePromise = Promise.resolve({
          accessToken: token,
          user: currentUser,
        })
        return currentUser
      } catch (loginError) {
        updateAccessToken(null)
        setUser(null)
        setStatus('unauthenticated')
        throw loginError
      }
    },
    [updateAccessToken],
  )

  const logout = useCallback(async () => {
    await apiRequest('/auth/logout', { method: 'POST' })
    updateAccessToken(null)
    setUser(null)
    setStatus('unauthenticated')
    setError(null)
    sessionRestorePromise = null
  }, [updateAccessToken])

  const hasPermission = useCallback(
    (key) => Array.isArray(user?.permissions) && user.permissions.includes(key),
    [user],
  )

  const updateUser = useCallback((updates) => {
    setUser((current) => current ? { ...current, ...updates } : current)
  }, [])

  const value = useMemo(
    () => ({
      accessToken,
      user,
      status,
      error,
      login,
      logout,
      updateUser,
      hasPermission,
    }),
    [accessToken, user, status, error, login, logout, updateUser, hasPermission],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }
  return context
}
