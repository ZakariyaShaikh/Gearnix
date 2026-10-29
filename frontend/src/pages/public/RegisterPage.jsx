import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register, resendVerificationCode, verifyEmail } from '@/api/auth.api'

function getRegisterErrors(values) {
  const errors = {}
  if (values.username.trim().length < 3) errors.username = 'Username must be at least 3 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  return errors
}

function getFormError(error) {
  if (error?.data?.errors && typeof error.data.errors === 'object') {
    return Object.values(error.data.errors).filter(Boolean).join(' ')
  }
  return error?.message || 'We could not complete that request. Please try again.'
}

export function RegisterPage() {
  const summaryRef = useRef(null)
  const [values, setValues] = useState({ username: '', email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [phase, setPhase] = useState('register')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setMessage('')
  }

  async function handleRegister(event) {
    event.preventDefault()
    const nextErrors = getRegisterErrors(values)
    setErrors(nextErrors)
    setMessage('')
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    setSubmitting(true)
    try {
      await register({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      setPhase('verify')
      setMessage('We sent a verification code to your email address.')
    } catch (error) {
      setMessage(getFormError(error))
      requestAnimationFrame(() => summaryRef.current?.focus())
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerify(event) {
    event.preventDefault()
    setMessage('')
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: 'Enter the 6-digit verification code.' })
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    setSubmitting(true)
    try {
      await verifyEmail({ email: values.email.trim(), otp })
      setPhase('complete')
      setMessage('Email verified. You can now sign in.')
    } catch (error) {
      setMessage(getFormError(error))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    setSubmitting(true)
    setMessage('')
    try {
      await resendVerificationCode(values.email.trim())
      setMessage('A new verification code was sent.')
    } catch (error) {
      setMessage(getFormError(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-xl items-center py-10">
      <div className="w-full rounded-2xl border border-brand-border-subtle bg-brand-black p-6 shadow-xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Gearnix account</p>
        <h1 className="mt-2 font-primary text-3xl font-bold text-brand-text-primary">
          {phase === 'verify' ? 'Verify your email' : phase === 'complete' ? 'You’re all set' : 'Create an account'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-brand-text-muted">
          {phase === 'verify'
            ? `Enter the 6-digit code sent to ${values.email}.`
            : phase === 'complete'
              ? 'Your account is ready to use.'
              : 'Create an account to save your wishlist and complete purchases.'}
        </p>

        {message && (
          <p ref={summaryRef} tabIndex={-1} role={phase === 'complete' ? 'status' : 'alert'} className="mt-5 rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent-pink">
            {message}
          </p>
        )}
        {Object.keys(errors).length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-5 rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200 focus:outline-none focus:ring-2 focus:ring-red-300">
            <p>Please correct the highlighted fields.</p>
            <ul className="mt-2 list-inside list-disc">
              {Object.values(errors).filter(Boolean).map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        )}

        {phase === 'register' && (
          <form className="mt-6 space-y-4" onSubmit={handleRegister} noValidate>
            <div className="space-y-2">
              <Label htmlFor="register-username">Username</Label>
              <Input id="register-username" autoComplete="username" minLength={3} maxLength={50} required value={values.username} onChange={(event) => updateField('username', event.target.value)} aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'register-username-error' : undefined} className="min-h-11 bg-white text-zinc-900" />
              {errors.username && <p id="register-username-error" className="text-sm text-red-300">{errors.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input id="register-email" type="email" autoComplete="email" required value={values.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'register-email-error' : undefined} className="min-h-11 bg-white text-zinc-900" />
              {errors.email && <p id="register-email-error" className="text-sm text-red-300">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input id="register-password" type="password" autoComplete="new-password" minLength={8} required value={values.password} onChange={(event) => updateField('password', event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'register-password-error' : undefined} className="min-h-11 bg-white text-zinc-900" />
              {errors.password && <p id="register-password-error" className="text-sm text-red-300">{errors.password}</p>}
              <p className="text-xs text-brand-text-muted">Use at least 8 characters.</p>
            </div>
            <Button type="submit" disabled={submitting} className="min-h-11 w-full bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        )}

        {phase === 'verify' && (
          <form className="mt-6 space-y-4" onSubmit={handleVerify} noValidate>
            <div className="space-y-2">
              <Label htmlFor="register-otp">Verification code</Label>
              <Input id="register-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}) }} aria-invalid={Boolean(errors.otp)} aria-describedby={errors.otp ? 'register-otp-error' : undefined} className="min-h-12 bg-white text-center text-lg tracking-[0.3em] text-zinc-900" />
              {errors.otp && <p id="register-otp-error" className="text-sm text-red-300">{errors.otp}</p>}
            </div>
            <Button type="submit" disabled={submitting} className="min-h-11 w-full bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">
              {submitting ? 'Verifying…' : 'Verify email'}
            </Button>
            <Button type="button" variant="outline" disabled={submitting} onClick={handleResend} className="min-h-11 w-full border-white/20 text-white hover:bg-white/10">
              Resend code
            </Button>
          </form>
        )}

        {phase === 'complete' && (
          <Link to="/login" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-brand-accent-pink px-4 font-semibold text-white hover:bg-brand-accent-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Continue to sign in
          </Link>
        )}

        {phase !== 'complete' && <p className="mt-6 text-center text-sm text-brand-text-muted">Already have an account? <Link className="font-semibold text-brand-accent-pink underline-offset-4 hover:underline" to="/login">Sign in</Link></p>}
      </div>
    </section>
  )
}
