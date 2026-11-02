import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardAnalytics } from '@/api/dashboard.api'
import { listProducts } from '@/api/catalog.api'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuth } from '@/auth/AuthContext'

function MonthlyAnalyticsChart({ title, metric, months, colorClass }) {
  const chartWidth = 640
  const chartHeight = 250
  const left = 44
  const right = 12
  const top = 12
  const bottom = 40
  const plotWidth = chartWidth - left - right
  const plotHeight = chartHeight - top - bottom
  const max = Math.max(1, ...months.map((month) => month[metric]))
  const slotWidth = plotWidth / Math.max(months.length, 1)

  return (
    <Card className="min-w-0 border-brand-border-subtle bg-brand-black text-brand-text-primary">
      <CardHeader>
        <CardTitle className="font-primary text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label={`${title} over the last 12 months`}
          className="h-auto w-full overflow-visible"
        >
          {[0, 1, 2, 3, 4].map((step) => {
            const value = Math.round((max * (4 - step)) / 4)
            const y = top + (plotHeight * step) / 4
            return (
              <g key={step}>
                <line x1={left} x2={chartWidth - right} y1={y} y2={y} className="stroke-white/10" />
                <text x={left - 8} y={y + 4} textAnchor="end" className="fill-brand-text-muted text-[11px]">
                  {value}
                </text>
              </g>
            )
          })}
          {months.map((month, index) => {
            const barHeight = (month[metric] / max) * plotHeight
            const x = left + index * slotWidth + (slotWidth - 22) / 2
            const y = top + plotHeight - barHeight
            return (
              <g key={month.month}>
                <rect
                  x={x}
                  y={y}
                  width="22"
                  height={barHeight}
                  rx="4"
                  className={colorClass}
                >
                  <title>{`${month.label} ${month.month.slice(0, 4)}: ${month[metric]}`}</title>
                </rect>
                <text
                  x={left + index * slotWidth + slotWidth / 2}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className="fill-brand-text-muted text-[11px]"
                >
                  {month.label}
                </text>
              </g>
            )
          })}
        </svg>
        <details className="mt-2 text-sm text-brand-text-muted">
          <summary className="min-h-11 cursor-pointer py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">
            View monthly values
          </summary>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr><th scope="col" className="py-2 pr-4">Month</th><th scope="col" className="py-2">Count</th></tr></thead>
              <tbody>
                {months.map((month) => (
                  <tr key={month.month}>
                    <th scope="row" className="py-1 pr-4 font-normal">{month.label} {month.month.slice(0, 4)}</th>
                    <td className="py-1">{month[metric].toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { hasPermission } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [productCount, setProductCount] = useState(null)
  const [errors, setErrors] = useState({})
  const [analyticsError, setAnalyticsError] = useState('')
  const canReadUsers = hasPermission(PERMISSIONS.USER_READ)
  const canReadProducts = hasPermission(PERMISSIONS.PRODUCT_READ)

  useEffect(() => {
    let active = true

    if (canReadUsers) {
      getDashboardAnalytics().then((result) => {
        if (active) setAnalytics(result)
      }).catch((error) => {
        if (active) setAnalyticsError(error.message)
      })
    }

    if (canReadProducts) {
      listProducts({ page: 1, limit: 1 }).then((result) => {
        if (active) setProductCount(result.pagination.total)
      }).catch((error) => {
        if (active) setErrors((current) => ({ ...current, products: error.message }))
      })
    }

    return () => {
      active = false
    }
  }, [canReadProducts, canReadUsers])

  const cards = [
    { title: 'Users', value: analytics?.totals.users ?? null, error: analyticsError, allowed: canReadUsers },
    { title: 'Products', value: productCount, error: errors.products, allowed: canReadProducts },
    { title: 'Orders', value: analytics?.totals.orders ?? null, error: analyticsError, allowed: canReadUsers },
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
      {canReadUsers && (
        <section aria-labelledby="analytics-heading" className="space-y-4">
          <div>
            <h3 id="analytics-heading" className="font-primary text-xl font-bold">Analytics</h3>
            <p className="mt-1 text-sm text-brand-text-muted">Monthly order volume and user registrations for the last 12 months.</p>
          </div>
          {analyticsError ? (
            <p role="alert" className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">
              Unable to load dashboard analytics: {analyticsError}
            </p>
          ) : analytics ? (
            <div className="grid min-w-0 gap-4 xl:grid-cols-2">
              <MonthlyAnalyticsChart title="Orders by month" metric="orders" months={analytics.months} colorClass="fill-fuchsia-500" />
              <MonthlyAnalyticsChart title="User registrations by month" metric="users" months={analytics.months} colorClass="fill-sky-400" />
            </div>
          ) : (
            <p role="status" className="text-sm text-brand-text-muted">Loading analytics…</p>
          )}
        </section>
      )}
    </section>
  )
}
