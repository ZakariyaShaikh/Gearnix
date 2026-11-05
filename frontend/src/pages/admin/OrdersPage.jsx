import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { listAllOrders, requestRefundAdmin, retryRefund, cancelOrderAdmin } from '@/api/orders.api'
import { formatMoney, formatDateTime } from '@/utils/media'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { RefundDialog } from '@/components/shared/RefundDialog'

const pageLimit = 20

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refundTarget, setRefundTarget] = useState(null)
  const [refundReason, setRefundReason] = useState('')
  const [refundError, setRefundError] = useState('')
  const [refundBusy, setRefundBusy] = useState(false)
  const [retryError, setRetryError] = useState('')

  useEffect(() => {
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')
    listAllOrders({ page, limit: pageLimit, status: status || undefined, search: submittedSearch || undefined })
      .then((result) => { if (active) { setOrders(result.items); setPagination(result.pagination) } })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page, status, submittedSearch])

  function submitSearch(event) {
    event.preventDefault()
    setPage(1)
    setSubmittedSearch(search.trim())
  }

  async function handleRefund() {
    if (!refundTarget) return
    setRefundBusy(true); setRefundError('')
    try {
      await requestRefundAdmin(refundTarget.order_id, refundReason || null)
      setRefundTarget(null); setRefundReason('')
      setOrders((current) => current.map((o) => o.order_id === refundTarget.order_id ? { ...o, status: 'refund_pending' } : o))
    } catch (e) {
      setRefundError(e.message || 'Unable to refund.')
    } finally { setRefundBusy(false) }
  }

  async function handleRetry(order) {
    setRetryError('')
    try {
      await retryRefund(order.refund_id)
      setOrders((current) => current.map((o) => o.order_id === order.order_id ? { ...o, status: 'refund_pending' } : o))
    } catch (e) {
      setRetryError(e.message || 'Unable to retry.')
      setOrders((current) => current.map((o) => o.order_id === order.order_id ? { ...o } : o))
    }
  }

async function cancelOrder(order) {
    if (!confirm(`Cancel order #${order.order_number}? This will restore stock and set status to cancelled.`)) return
    setError('')
    try {
      await cancelOrderAdmin(order.order_id)
      setOrders((current) => current.map((o) => o.order_id === order.order_id ? { ...o, status: 'cancelled' } : o))
    } catch (e) {
      setError(e.message || 'Unable to cancel order.')
    }
  }
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">Super Admin</p>
        <h2 className="mt-2 font-primary text-3xl font-bold">Orders</h2>
        <p className="mt-2 text-sm text-brand-text-muted">View every customer order, its status, and when it was placed.</p>
      </header>

      <form className="grid gap-4 rounded-xl border border-brand-border-subtle bg-brand-black p-4 sm:grid-cols-[minmax(14rem,1fr)_minmax(14rem,1fr)_auto]" onSubmit={submitSearch}>
        <div className="space-y-2">
          <Label htmlFor="order-search">Search customer or order number</Label>
          <Input id="order-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order-status-filter">Filter by status</Label>
          <select id="order-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 w-full rounded-md border border-brand-border-subtle bg-brand-base px-3 text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">
            <option value="">All statuses</option>
            <option value="pending_payment">Pending payment</option>
            <option value="paid">Paid</option>
            <option value="failed">Payment failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refund_pending">Refund pending</option>
            <option value="refunded">Refunded</option>
            <option value="refund_failed">Refund failed</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="min-h-11">Search</Button>
        </div>
      </form>

      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      {retryError && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{retryError}</p>}

      <div className="overflow-x-auto rounded-xl border border-brand-border-subtle">
        <table className="w-full text-sm">
          <thead className="bg-brand-black text-brand-text-muted">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Placed</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr className="bg-brand-base"><td className="p-3 text-brand-text-muted" colSpan={7}>Loading orders…</td></tr>
            ) : orders.length === 0 ? (
              <tr className="bg-brand-base"><td className="p-3 text-brand-text-muted" colSpan={7}>No orders found.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.order_id} className="bg-brand-base">
                <td className="p-3 font-medium">{order.order_number}</td>
                <td className="p-3"><div className="space-y-1"><p className="font-medium">{order.username}</p><p className="text-brand-text-muted text-xs">{order.email}</p></div></td>
                <td className="p-3"><StatusBadge status={order.status} /></td>
                <td className="p-3 text-brand-text-muted">{order.item_count}</td>
                <td className="p-3 font-medium">{formatMoney(order.total)}</td>
                <td className="p-3 text-brand-text-muted">{formatDateTime(order.created_at)}</td>
                <td className="p-3">
                  {order.status === 'paid' && <Button variant="outline" size="sm" onClick={() => setRefundTarget(order)} className="min-h-9 border-white/20 text-white">Refund</Button>}
                  {order.status === 'refund_failed' && <Button variant="outline" size="sm" onClick={() => handleRetry(order)} className="min-h-9 border-white/20 text-white">Retry refund</Button>}
{order.status !== 'cancelled' && order.status !== 'refund_pending' && <Button variant="outline" size="sm" onClick={() => cancelOrder(order)} className="min-h-9 border-white/20 text-white">Cancel</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <nav className="flex items-center justify-between gap-4" aria-label="Order pages">
          <p className="text-sm text-brand-text-muted">Page {pagination.page} of {Math.max(pagination.total_pages, 1)} · {pagination.total} orders</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>Previous</Button>
            <Button variant="outline" disabled={page >= pagination.total_pages || loading} onClick={() => setPage((current) => current + 1)}>Next</Button>
          </div>
        </nav>
      )}

      <RefundDialog open={!!refundTarget} amount={refundTarget ? formatMoney(refundTarget.total) : ''} customerName={refundTarget?.username} orderNumber={refundTarget?.order_number} reason={refundReason} onReasonChange={setRefundReason} onSubmit={handleRefund} onCancel={() => setRefundTarget(null)} busy={refundBusy} error={refundError} title="Refund this order" />
    </section>
  )
}
