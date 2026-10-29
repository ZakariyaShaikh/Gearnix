import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { getCart, removeCartItem, updateCartItem } from '@/api/customer.api'
import { getMediaUrl, formatMoney } from '@/utils/media'

export function CartPage() {
  const [cart, setCart] = useState({ items: [], summary: { total_items: 0, subtotal: 0 } })
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  const refreshCart = useCallback(async () => {
    try {
      const result = await getCart()
      setCart({ items: Array.isArray(result.items) ? result.items : [], summary: result.summary || {} })
    } catch (requestError) {
      setError(requestError.message || 'Unable to load your cart.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void Promise.resolve().then(refreshCart) }, [refreshCart])

  async function changeQuantity(item, quantity) {
    setBusyId(item.product_id); setError('')
    try {
      await updateCartItem(item.product_id, Number(quantity))
      await refreshCart()
      window.dispatchEvent(new Event('gearnix:cart-updated'))
    } catch (requestError) { setError(requestError.message || 'Unable to update this quantity.') }
    finally { setBusyId(null) }
  }

  async function removeItem(item) {
    setBusyId(item.product_id); setError('')
    try {
      await removeCartItem(item.product_id)
      await refreshCart()
      window.dispatchEvent(new Event('gearnix:cart-updated'))
    } catch (requestError) { setError(requestError.message || 'Unable to remove this item.') }
    finally { setBusyId(null) }
  }

  const hasUnavailable = cart.items.some((item) => !Number(item.is_available))
  const itemCount = Number(cart.summary.total_items || 0)

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Your account</p><h1 className="mt-2 font-primary text-3xl font-bold">Shopping cart</h1><p className="mt-2 text-brand-text-muted">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart.</p></header>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
      {loading ? <p role="status" className="py-12 text-center text-brand-text-muted">Loading your cart…</p> : cart.items.length === 0 ? <div className="rounded-xl border border-white/10 bg-brand-black p-10 text-center"><h2 className="font-primary text-xl font-bold">Your cart is empty</h2><p className="mt-2 text-brand-text-muted">Find something to add to your setup.</p><Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-accent-pink px-6 font-semibold text-white hover:bg-brand-accent-magenta">Browse products</Link></div> : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">{cart.items.map((item) => {
            const available = Boolean(Number(item.is_available))
            return <article key={item.product_id} className="grid gap-4 rounded-xl border border-brand-border-subtle bg-brand-black p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:p-5">
              <Link to={`/products/${item.slug}`} aria-label={`View ${item.name}`} className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"><img src={getMediaUrl(item.primary_image_url) || '/placeholder-product.png'} alt={item.name} loading="lazy" className="size-full object-contain" /></Link>
              <div className="flex min-w-0 flex-col justify-between gap-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link to={`/products/${item.slug}`} className="font-semibold hover:text-brand-accent-pink">{item.name}</Link><p className="mt-1 text-sm text-brand-text-muted">{formatMoney(item.price)} each</p></div><p className="font-semibold">{formatMoney(item.line_total ?? Number(item.price) * Number(item.quantity))}</p></div>
                {!available && <p className="rounded-md border border-amber-400/30 bg-amber-950/20 p-2 text-sm text-amber-200">This item is no longer available or the selected quantity exceeds stock.</p>}
                {available && <p className="text-sm text-emerald-300">In stock · {item.stock_quantity} available</p>}
                <div className="flex flex-wrap items-end justify-between gap-3"><div className="space-y-1.5"><label htmlFor={`cart-quantity-${item.product_id}`} className="block text-xs text-brand-text-muted">Quantity</label><select id={`cart-quantity-${item.product_id}`} aria-label={`Quantity for ${item.name}`} value={item.quantity} disabled={busyId === item.product_id} onChange={(event) => changeQuantity(item, event.target.value)} className="min-h-11 rounded-md border border-white/20 bg-zinc-900 px-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">{Array.from({ length: 99 }, (_, index) => index + 1).map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}</select></div><Button type="button" variant="outline" disabled={busyId === item.product_id} aria-label={`Remove ${item.name}`} onClick={() => removeItem(item)} className="min-h-11 border-red-400/40 text-red-200 hover:bg-red-950/30"><FiTrash2 aria-hidden="true" />Remove</Button></div>
              </div>
            </article>
          })}</div>
          <aside className="space-y-4 rounded-xl border border-brand-border-subtle bg-brand-black p-5 lg:sticky lg:top-6"><h2 className="font-primary text-xl font-bold">Order summary</h2><div className="flex justify-between gap-4 border-t border-white/10 pt-4 text-sm"><span className="text-brand-text-muted">Subtotal</span><span className="font-semibold">{formatMoney(cart.summary.subtotal)}</span></div><p className="text-xs leading-5 text-brand-text-muted">Shipping and any applicable charges are shown before payment.</p>{hasUnavailable && <p className="text-sm text-amber-200">Remove unavailable items or adjust their quantities before checkout.</p>}{hasUnavailable ? <Link to="/checkout" aria-disabled="true" tabIndex={-1} onClick={(event) => event.preventDefault()} className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-zinc-700 px-5 font-semibold text-white/60">Proceed to checkout</Link> : <Link to="/checkout" className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-grad-cta px-5 font-semibold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Proceed to checkout</Link>}</aside>
        </div>
      )}
    </section>
  )
}
