import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cancelOrder, getOrder } from '@/api/customer.api'
import { formatDate, formatMoney } from '@/utils/media'

const statusLabels = { pending_payment: 'Payment pending', paid: 'Paid', cancelled: 'Cancelled', failed: 'Payment failed' }

export function OrderDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const [result, setResult] = useState({ id: null, order: null, items: [], payment: null, error: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(location.state?.payment === 'success' ? 'Payment verified. Your order is confirmed.' : '')

  useEffect(() => {
    let active = true
    getOrder(id).then((data) => { if (active) setResult({ id, order: data.order, items: data.items || [], payment: data.payment, error: '' }) }).catch((error) => { if (active) setResult({ id, order: null, items: [], payment: null, error: error.message || 'Unable to load this order.' }) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function handleCancel() {
    setBusy(true); setNotice('')
    try {
      const updated = await cancelOrder(Number(id))
      setResult((current) => ({ ...current, order: { ...current.order, ...updated, status: updated.status || 'cancelled' } }))
      setNotice('Order cancelled and stock released.')
    } catch (error) { setNotice(error.message || 'Unable to cancel this order.') }
    finally { setBusy(false) }
  }

  const order = result.id === id ? result.order : null
  const items = result.id === id ? result.items : []
  const payment = result.id === id ? result.payment : null
  const error = result.id === id ? result.error : ''
  const canCancel = order?.status === 'pending_payment'

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link to="/orders" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-accent-pink hover:underline">← Back to orders</Link>
      {loading ? <p role="status" className="py-12 text-center text-brand-text-muted">Loading order…</p> : error || !order ? <div className="rounded-xl border border-red-400/30 bg-red-950/20 p-6"><h1 className="font-primary text-2xl font-bold">Order unavailable</h1><p role="alert" className="mt-2 text-sm text-red-200">{error || 'This order could not be found.'}</p></div> : <>
        {notice && <p role="status" className={`rounded-lg border p-3 text-sm ${notice.toLowerCase().includes('unable') ? 'border-red-400/40 bg-red-950/30 text-red-200' : 'border-emerald-400/30 bg-emerald-950/20 text-emerald-200'}`}>{notice}</p>}
        <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Order details</p><h1 className="mt-2 font-primary text-3xl font-bold">{order.order_number}</h1><p className="mt-2 text-sm text-brand-text-muted">Placed {formatDate(order.created_at)}</p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">{statusLabels[order.status] || order.status}</span></header>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-5">
            <section className="rounded-xl border border-brand-border-subtle bg-brand-black p-5"><h2 className="font-primary text-xl font-bold">Items</h2><ul className="mt-4 divide-y divide-white/10">{items.map((item, index) => <li key={`${item.product_id}-${index}`} className="flex flex-wrap justify-between gap-3 py-4 first:pt-0 last:pb-0"><div><p className="font-semibold">{item.product_name}</p><p className="mt-1 text-sm text-brand-text-muted">{formatMoney(item.unit_price)} × {item.quantity}</p></div><p className="font-semibold">{formatMoney(item.line_total)}</p></li>)}</ul>{items.length === 0 && <p className="mt-3 text-sm text-brand-text-muted">No item details are available.</p>}</section>
            <section className="rounded-xl border border-brand-border-subtle bg-brand-black p-5"><h2 className="font-primary text-xl font-bold">Shipping address</h2><address className="mt-3 not-italic text-sm leading-6 text-brand-text-muted"><span className="font-semibold text-brand-text-primary">{order.ship_full_name}</span><br />{order.ship_line1}{order.ship_line2 ? `, ${order.ship_line2}` : ''}<br />{order.ship_city}, {order.ship_state} {order.ship_postal_code}<br />{order.ship_country_code === 'IN' ? 'India' : order.ship_country_code}<br />{order.ship_phone}</address></section>
          </div>
          <aside className="space-y-4 rounded-xl border border-brand-border-subtle bg-brand-black p-5"><h2 className="font-primary text-xl font-bold">Payment</h2><div className="flex justify-between gap-3 text-sm"><span className="text-brand-text-muted">Status</span><span>{order.status === 'paid' ? 'Paid' : payment?.status === 'created' ? 'Payment pending' : payment?.status || statusLabels[order.status] || order.status}</span></div><div className="flex justify-between gap-3 border-t border-white/10 pt-4"><span className="text-brand-text-muted">Subtotal</span><span>{formatMoney(order.subtotal)}</span></div><div className="flex justify-between gap-3 font-bold"><span>Total</span><span>{formatMoney(order.total)}</span></div>{canCancel && <Button type="button" variant="destructive" disabled={busy} onClick={handleCancel} className="min-h-11 w-full">{busy ? 'Cancelling…' : 'Cancel order'}</Button>}<Link to="/products" className="block min-h-11 content-center text-center text-sm text-brand-accent-pink hover:underline">Continue shopping</Link></aside>
        </div>
      </>}
    </section>
  )
}
