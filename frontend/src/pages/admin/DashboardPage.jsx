import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { listProducts } from '@/api/catalog.api'
import { listUsers } from '@/api/users.api'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuth } from '@/auth/AuthContext'

export function DashboardPage() {
  const { hasPermission } = useAuth()
  const [counts, setCounts] = useState({ users: null, products: null })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let active = true
    const requests = []

    if (hasPermission(PERMISSIONS.USER_READ)) {
      requests.push(
        listUsers({ page: 1, limit: 1 }).then((result) => {
          if (active) setCounts((current) => ({ ...current, users: result.pagination.total }))
        }).catch((error) => {
          if (active) setErrors((current) => ({ ...current, users: error.message }))
        }),
      )
    }

    if (hasPermission(PERMISSIONS.PRODUCT_READ)) {
      requests.push(
        listProducts({ page: 1, limit: 1 }).then((result) => {
          if (active) setCounts((current) => ({ ...current, products: result.pagination.total }))
        }).catch((error) => {
          if (active) setErrors((current) => ({ ...current, products: error.message }))
        }),
      )
    }

    return () => {
      active = false
    }
  }, [hasPermission])

  const cards = [
    { title: 'Users', value: counts.users, error: errors.users, allowed: hasPermission(PERMISSIONS.USER_READ) },
    { title: 'Products', value: counts.products, error: errors.products, allowed: hasPermission(PERMISSIONS.PRODUCT_READ) },
    { title: 'Orders', value: null, error: 'The backend does not expose an admin-wide order count yet.', allowed: true },
  ]

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">Overview</p>
        <h2 className="mt-2 font-primary text-3xl font-bold">Admin dashboard</h2>
        <p className="mt-2 text-sm text-brand-text-muted">Store totals available to your permissions.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="border-brand-border-subtle bg-brand-black text-brand-text-primary">
            <CardHeader><CardTitle className="font-primary text-base">{card.title}</CardTitle></CardHeader>
            <CardContent>
              {!card.allowed ? (
                <p className="text-sm text-brand-text-muted">You do not have permission to view this total.</p>
              ) : card.error ? (
                <p role="status" className="text-sm text-amber-200">{card.error}</p>
              ) : card.value === null ? (
                <p role="status" className="text-sm text-brand-text-muted">Loading…</p>
              ) : (
                <p className="font-primary text-3xl font-bold">{card.value.toLocaleString('en-IN')}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
