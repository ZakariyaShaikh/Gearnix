import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser } from 'react-icons/fi'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/AuthContext'

function ProfileField({ label, value }) {
  return (
    <div className="min-w-0 border-t border-white/10 py-4 first:border-t-0">
      <dt className="text-sm text-brand-text-muted">{label}</dt>
      <dd className="mt-1 break-words font-medium text-brand-text-primary">
        {typeof value === 'string' && value.trim() ? value : 'Not available'}
      </dd>
    </div>
  )
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleLogout() {
    setErrorMessage('')
    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign out. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">
          Account
        </p>
        <h1 className="mt-2 font-primary text-3xl font-bold text-brand-text-primary">
          My profile
        </h1>
        <p className="mt-2 text-brand-text-muted">
          View the details for your signed-in Gearnix account.
        </p>
      </header>

      <Card className="border-brand-border-subtle bg-brand-black text-brand-text-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-accent-pink">
              <FiUser aria-hidden="true" size={22} />
            </span>
            <div className="min-w-0">
              <CardTitle className="font-primary text-xl">Account details</CardTitle>
              <CardDescription className="mt-1 text-brand-text-muted">
                Your current account information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl>
            <ProfileField label="Username" value={user?.username} />
            <ProfileField label="Email" value={user?.email} />
            <ProfileField label="Account role" value={user?.role_name} />
          </dl>
        </CardContent>
      </Card>

      <Card className="border-brand-border-subtle bg-brand-black text-brand-text-primary">
        <CardHeader>
          <CardTitle className="font-primary text-xl">Sign out</CardTitle>
          <CardDescription className="text-brand-text-muted">
            End this session on this browser. You can sign in again afterward.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <p className="text-sm text-red-400" role="alert">
              {errorMessage}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="min-h-11 border-white/20 text-brand-text-primary hover:bg-white/10"
          >
            <FiLogOut aria-hidden="true" />
            {isLoggingOut ? 'Signing out…' : 'Log out'}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
