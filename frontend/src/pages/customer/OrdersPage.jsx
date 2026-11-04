import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { listOrders } from '@/api/customer.api'
import { formatDate, formatMoney } from '@/utils/media'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const [result, setResult] = useState({ page: null, items: [], pagination: null, error: '' })
  const [isFetching, setIsFetching] = useState(true)
  const lastFetchRef = useRef(0)

  const fetchOrders = useCallback(() => {
    const now = Date.now()
    if (now - lastFetchRef.current < 60000 && result.page === page) return
    lastFetchRef.current = now
    let active = true
    listOrders({ page, limit: 10 }).then((data) => { if (active) setResult({ page, items: data.items, pagination: data.pagination, error: '' }) }).catch((error) => { if (active) setResult({ page, items: [], pagination: null, error: error.message || 'Unable to load your orders.' }) }).finally(() => { if (active) setIsFetching(false) })
    return () => { active = false }
  }, [page, result.page])

  useEffect(() => {
    const cleanup = fetchOrders()
    return cleanup
  }, [fetchOrders])

  useEffect(() => {
    function onFocus() { fetchOrders() }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [fetchOrders])

  function goToPage(nextPage) {
    const params = new URLSearchParams(searchParams)
    if (nextPage <= 1) params.delete('page')
    else params.set('page', String(nextPage))
    setSearchParams(params)
  }

  const orders = result.page === page ? result.items : []
  const pagination = result.page === page ? result.pagination : null
  const error = result.page === page ? result.error : ''
  const loading = isFetching || result.page !== page

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Your account</p><h1 className="mt-2 font-primary text-3xl font-bold">Order history</h1><p className="mt-2 text-brand-text-muted">Review your purchases and payment status.</p></header>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
      {loading ? <p role="status" className="py-12 text-center text-brand-text-muted">Loading orders…</p> : orders.length === 0 && !error ? <div className="rounded-xl border border-white/10 bg-brand-black p-10 text-center"><h2 className="font-primary text-xl font-bold">No orders yet</h2><p className="mt-2 text-brand-text-muted">When you place an order, its status will appear here.</p><Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-accent-pink px-6 font-semibold text-white hover:bg-brand-accent-magenta">Browse products</Link></div> : null}
      {!loading && orders.length > 0 && <div className="space-y-4">{orders.map((order) => <article key={order.order_id} className="grid gap-4 rounded-xl border border-brand-border-subtle bg-brand-black p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="space-y-2"><div className="flex flex-wrap items-center gap-3"><h2 className="font-semibold">{order.order_number}</h2><StatusBadge status={order.status} /></div><p className="text-sm text-brand-text-muted">Placed {formatDate(order.created_at)} · {order.item_count} {Number(order.item_count) === 1 ? 'item' : 'items'}</p></div><div className="flex items-center justify-between gap-4 sm:justify-end"><p className="font-bold">{formatMoney(order.total)}</p>{order.status === 'pending_payment' && <Link to={`/orders/${order.order_id}`} className="inline-flex min-h-11 items-center rounded-full bg-brand-accent-pink px-4 text-sm font-semibold text-white hover:bg-brand-accent-magenta">Checkout</Link>}<Link to={`/orders/${order.order_id}`} aria-label={`View order ${order.order_number}`} className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm font-semibold hover:border-brand-accent-pink hover:text-brand-accent-pink">View order</Link></div></article>)}</div>}
      {pagination && pagination.total_pages > 1 && <nav aria-label="Order pages" className="flex items-center justify-center gap-3"><Button type="button" variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)} className="min-h-11 border-white/20 text-white">Previous</Button><span className="text-sm text-brand-text-muted">Page {page} of {pagination.total_pages}</span><Button type="button" variant="outline" disabled={page >= pagination.total_pages} onClick={() => goToPage(page + 1)} className="min-h-11 border-white/20 text-white">Next</Button></nav>}
    </section>
  )
}
