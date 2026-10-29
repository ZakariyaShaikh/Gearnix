import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { addCartItem, getWishlist, removeWishlistItem } from '@/api/customer.api'
import { getMediaUrl, formatMoney } from '@/utils/media'

export function WishlistPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    getWishlist().then((data) => { if (active) setItems(data) }).catch((requestError) => { if (active) setError(requestError.message || 'Unable to load your wishlist.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function removeItem(item) {
    setBusyId(item.product_id); setError(''); setNotice('')
    try {
      await removeWishlistItem(item.product_id)
      setItems((current) => current.filter((saved) => saved.product_id !== item.product_id))
      window.dispatchEvent(new Event('gearnix:cart-updated'))
      setNotice(`${item.name} removed from your wishlist.`)
    } catch (requestError) { setError(requestError.message || 'Unable to remove this item.') }
    finally { setBusyId(null) }
  }

  async function moveToCart(item) {
    setBusyId(item.product_id); setError(''); setNotice('')
    try {
      await addCartItem(item.product_id)
      window.dispatchEvent(new Event('gearnix:cart-updated'))
      setNotice(`${item.name} added to your cart.`)
    } catch (requestError) { setError(requestError.message || 'Unable to add this item to your cart.') }
    finally { setBusyId(null) }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Your account</p><h1 className="mt-2 flex items-center gap-3 font-primary text-3xl font-bold"><FiHeart aria-hidden="true" className="text-brand-accent-pink" />Wishlist</h1><p className="mt-2 text-brand-text-muted">Products you’ve saved for later.</p></header>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}{notice && <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{notice}</p>}
      {loading ? <p role="status" className="py-12 text-center text-brand-text-muted">Loading your wishlist…</p> : items.length === 0 ? <div className="rounded-xl border border-white/10 bg-brand-black p-10 text-center"><h2 className="font-primary text-xl font-bold">Your wishlist is empty</h2><p className="mt-2 text-brand-text-muted">Save products from their detail pages to find them here.</p><Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-accent-pink px-6 font-semibold text-white hover:bg-brand-accent-magenta">Browse products</Link></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => {
        const available = Boolean(Number(item.is_available))
        return <article key={item.product_id} className="overflow-hidden rounded-xl border border-brand-border-subtle bg-brand-black"><Link to={`/products/${item.slug}`} className="flex aspect-[4/3] items-center justify-center bg-white p-5" aria-label={`View ${item.name}`}><img src={getMediaUrl(item.primary_image_url) || '/placeholder-product.png'} alt={item.name} loading="lazy" className="size-full object-contain" /></Link><div className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div><Link to={`/products/${item.slug}`} className="font-semibold hover:text-brand-accent-pink">{item.name}</Link><p className="mt-1 font-bold">{formatMoney(item.price)}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${available ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-200'}`}>{available ? 'In stock' : 'Unavailable'}</span></div><div className="flex gap-2"><Button type="button" aria-label={`Add ${item.name} to cart`} disabled={!available || busyId === item.product_id} onClick={() => moveToCart(item)} className="min-h-11 flex-1 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta"><FiShoppingCart aria-hidden="true" />Add to cart</Button><Button type="button" variant="outline" disabled={busyId === item.product_id} aria-label={`Remove ${item.name} from wishlist`} onClick={() => removeItem(item)} className="min-h-11 border-white/20 text-white hover:bg-white/10"><FiTrash2 aria-hidden="true" /></Button></div></div></article>
      })}</div>}
    </section>
  )
}
