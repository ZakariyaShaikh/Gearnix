// placeholder to be replaced
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { listAllOrders } from '@/api/orders.api'
import { formatMoney, formatDateTime } from '@/utils/media'
import { PERMISSIONS } from '@/constants/permissions'


const pageLimit = 20

function orderStatusLabel(status = '') {
  return {
    pending_payment: 'Pending payment',
    paid: 'Paid',
    failed: 'Payment failed',
    cancelled: 'Cancelled',
  }[status] || status.replaceAll('_', ' ')
}

function statusBadge(status = '') {
  const classes =
    status === 'paid'
      ? 'bg-violet-900/50 text-violet-200'
      : status === 'pending_payment'
      ? 'bg-amber-900/50 text-amber-200'
      : 'bg-red-900/50 text-red-200'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{orderStatusLabel(status)}</span>
}

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadOrders() {
    setLoading(true)
    setError('')
    try {
      const result = await listAllOrders({
        page,
        limit: pageLimit,
        status: status || undefined,
        search: submittedSearch || undefined,
      })
      setOrders(result.items)
      setPagination(result.pagination)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [page, status, submittedSearch])

  function submitSearch(event) {
    event.preventDefault()
    setPage(1)
    setSubmittedSearch(search.trim())
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">
          Super Admin
        </p>
        <h2 className="mt-2 font-primary text-3xl font-bold">Orders</h2>
        <p className="mt-2 text-sm text-brand-text-muted">
          View every customer order, its status, and when it was placed.
        </p>
      </header>

      <form
        className="grid gap-4 rounded-xl border border-brand-border-subtle bg-brand-black p-4 sm:grid-cols-[minmax(14rem,1fr)_minmax(14rem,1fr)_auto]"
        onSubmit={submitSearch}
      >
        <div className="space-y-2">
          <Label htmlFor="order-search">Search customer or order number</Label>
          <Input
            id="order-search"
            value={search}
            maxLength={100}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order-status-filter">Filter by status</Label>
          <select
            id="order-status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 w-full rounded-md border border-brand-border-subtle bg-brand-base px-3 text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
          >
            <option value="">All statuses</option>
            <option value="pending_payment">Pending payment</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </form>

      {error && (
        <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <tr className="bg-brand-base">
          <td className="p-3 text-brand-text-muted" colSpan={6}>
            Loading orders…
          </td>
        </tr>
      ) : orders.length === 0 ? (
        <tr className="bg-brand-base">
          <td className="p-3 text-brand-text-muted" colSpan={6}>
            No orders found.
          </td>
        </tr>
      ) : (
        orders.map((order) => (
          <tr key={order.order_id} className="bg-brand-base">
            <td className="p-3 font-medium">{order.order_number}</td>
            <td className="p-3">
              <div className="space-y-1">
                <p className="font-medium">{order.username}</p>
                <p className="text-brand-text-muted text-xs">{order.email}</p>
              </div>
            </td>
            <td className="p-3">{statusBadge(order.status)}</td>
            <td className="p-3 text-brand-text-muted">{order.item_count}</td>
            <td className="p-3 font-medium">{formatMoney(order.total)}</td>
            <td className="p-3 text-brand-text-muted">{formatDateTime(order.created_at)}</td>
          </tr>
        ))
      )}

      {pagination && (
        <nav className="flex items-center justify-between gap-4" aria-label="Order pages">
          <p className="text-sm text-brand-text-muted">
            Page {pagination.page} of {Math.max(pagination.total_pages, 1)} · {pagination.total} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= pagination.total_pages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </section>
  )
}
