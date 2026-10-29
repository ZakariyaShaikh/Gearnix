import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ADMIN_PERMISSIONS } from '@/constants/permissions'
import { useAuth } from '@/auth/AuthContext'

function getSafeReturnPath(from) {
  const pathname = from?.pathname
  if (
    typeof pathname !== 'string' ||
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null
  }

  return `${pathname}${from.search || ''}${from.hash || ''}`
}

function getDefaultPath(user) {
  const permissions = Array.isArray(user?.permissions) ? user.permissions : []
  return ADMIN_PERMISSIONS.some((permission) => permissions.includes(permission))
    ? '/admin'
    : '/'
}

function getLoginErrorMessage(error) {
  if (error.status === 401) {
    return 'Email or password is incorrect.'
  }
  if (error.status === 403) {
    return 'This account is inactive or its email address needs verification.'
  }
  return error.message || 'Unable to sign in. Please try again.'
}

export function LoginPage() {
  const { login, logout, status, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false)

  if (status === 'loading') {
    return (
      <p className="py-16 text-center text-brand-text-muted" role="status">
        Checking your session…
      </p>
    )
  }

  if (status === 'authenticated') {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-md items-center py-10">
        <div className="w-full rounded-xl border border-brand-border-subtle bg-brand-black p-6 shadow-xl sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">
            Existing session
          </p>
          <h1 className="font-primary text-3xl font-bold text-brand-text-primary">
            You’re already signed in
          </h1>
          <p className="mt-3 break-words text-sm text-brand-text-muted">
            {user?.email || 'An account'} is currently signed in on this browser. Log out first to sign in with another account.
          </p>
          {errorMessage && (
            <p className="mt-5 text-sm text-red-400" role="alert">
              {errorMessage}
            </p>
          )}
          <Button
            type="button"
            disabled={isSwitchingAccount}
            onClick={async () => {
              setErrorMessage('')
              setIsSwitchingAccount(true)
              try {
                await logout()
              } catch (error) {
                setErrorMessage(error.message || 'Unable to sign out. Please try again.')
              } finally {
                setIsSwitchingAccount(false)
              }
            }}
            className="mt-6 min-h-11 w-full bg-brand-accent-pink text-white hover:bg-brand-accent-magenta focus-visible:ring-brand-accent-pink"
          >
            {isSwitchingAccount ? 'Signing out…' : 'Log out and use another account'}
          </Button>
          <p className="mt-5 text-center text-sm text-brand-text-muted">
            <Link
              to="/profile"
              className="rounded text-brand-accent-pink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
            >
              Go to my profile
            </Link>
          </p>
        </div>
      </section>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const currentUser = await login({ email: email.trim(), password })
      const requestedPath = getSafeReturnPath(location.state?.from)
      navigate(requestedPath || getDefaultPath(currentUser), { replace: true })
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-md items-center py-10">
      <div className="w-full rounded-xl border border-brand-border-subtle bg-brand-black p-6 shadow-xl sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">
          Welcome back
        </p>
        <h1 className="font-primary text-3xl font-bold text-brand-text-primary">
          Sign in to Gearnix
        </h1>
        <p className="mt-3 text-sm text-brand-text-muted">
          Use your account email and password to continue.
        </p>

        {location.state?.notice && (
          <p role="status" className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">
            {location.state.notice}
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 bg-brand-base text-brand-text-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 bg-brand-base text-brand-text-primary"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400" role="alert">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full bg-brand-accent-pink text-white hover:bg-brand-accent-magenta focus-visible:ring-brand-accent-pink"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-text-muted">
          <Link
            to="/"
            className="rounded text-brand-accent-pink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
          >
            Return to the store
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-brand-text-muted">
          New to Gearnix? <Link to="/register" className="font-semibold text-brand-accent-pink underline-offset-4 hover:underline">Create account</Link>
        </p>
      </div>
    </section>
  )
}
