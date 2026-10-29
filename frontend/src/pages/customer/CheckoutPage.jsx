import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { checkout, getCart, listAddresses, cancelOrder, verifyOrderPayment } from '@/api/customer.api'
import { formatMoney } from '@/utils/media'

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true })
      existing.addEventListener('error', () => resolve(false), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({ items: [], summary: {} })
  const [addresses, setAddresses] = useState([])
  const [addressId, setAddressId] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadCheckoutData = useCallback(async () => {
    try {
      const [cartResult, addressResult] = await Promise.all([getCart(), listAddresses()])
      setCart(cartResult)
      setAddresses(addressResult)
      const defaultAddress = addressResult.find((address) => Number(address.is_default))
      setAddressId((current) => current || String(defaultAddress?.address_id || addressResult[0]?.address_id || ''))
    } catch (requestError) {
      setError(requestError.message || 'Unable to prepare checkout.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void Promise.resolve().then(loadCheckoutData) }, [loadCheckoutData])

  async function cancelAfterFailure(orderId, message) {
    try {
      await cancelOrder(orderId)
      window.dispatchEvent(new Event('gearnix:cart-updated'))
      setError(`${message} The order was cancelled and stock released.`)
    } catch (cancelError) {
      setError(`${message} We could not confirm cancellation: ${cancelError.message || 'please check your order status.'}`)
    }
  }

  async function beginPayment(event) {
    event.preventDefault()
    setError(''); setNotice('')
    if (!addressId) return setError('Select a shipping address to continue.')
    if (!cart.items?.length) return setError('Your cart is empty.')
    if (cart.items.some((item) => !Number(item.is_available))) return setError('Remove unavailable items or adjust their quantities before checkout.')
    setBusy(true)
    let createdOrder
    try {
      const result = await checkout(Number(addressId))
      createdOrder = result.order
      const payment = result.payment
      const ready = await loadRazorpay()
      if (!ready || !window.Razorpay) {
        await cancelAfterFailure(createdOrder.order_id, 'Razorpay Checkout could not be loaded.')
        return
      }

      const razorpay = new window.Razorpay({
        key: payment.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: payment.amount_paise,
        currency: payment.currency || 'INR',
        name: 'Gearnix',
        description: `Order ${createdOrder.order_number || createdOrder.order_id}`,
        order_id: payment.razorpay_order_id,
        prefill: { name: selectedAddress?.full_name, contact: selectedAddress?.phone },
        notes: { order_id: String(createdOrder.order_id) },
        theme: { color: '#E040C8' },
        handler: async (response) => {
          setBusy(true); setError('')
          try {
            await verifyOrderPayment(createdOrder.order_id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            window.dispatchEvent(new Event('gearnix:cart-updated'))
            navigate(`/orders/${createdOrder.order_id}`, { replace: true, state: { payment: 'success' } })
          } catch (requestError) {
            setError(`${requestError.message || 'We could not confirm this payment yet.'} Check your order status before trying again.`)
            setBusy(false)
          }
        },
        modal: { ondismiss: () => { setBusy(false); setNotice('Payment window closed. Your order remains pending until you complete payment or it expires.') } },
      })

      if (typeof razorpay.on === 'function') {
        razorpay.on('payment.failed', async (response) => {
          await cancelAfterFailure(createdOrder.order_id, response?.error?.description || 'Payment failed.')
          setBusy(false)
        })
      }
      razorpay.open()
    } catch (requestError) {
      if (createdOrder?.order_id) await cancelAfterFailure(createdOrder.order_id, requestError.message || 'Could not start payment.')
      else setError(requestError.message || 'Could not create your order.')
    } finally { setBusy(false) }
  }

  const selectedAddress = addresses.find((address) => String(address.address_id) === String(addressId))
  const itemsAvailable = cart.items?.length > 0 && cart.items.every((item) => Number(item.is_available))

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Secure checkout</p><h1 className="mt-2 font-primary text-3xl font-bold">Delivery and payment</h1><p className="mt-2 text-brand-text-muted">Choose where to send your order, then pay securely with Razorpay.</p></header>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}{notice && <p role="status" className="rounded-lg border border-amber-400/30 bg-amber-950/20 p-3 text-sm text-amber-100">{notice}</p>}
      {loading ? <p role="status" className="py-12 text-center text-brand-text-muted">Preparing checkout…</p> : !cart.items?.length ? <div className="rounded-xl border border-white/10 bg-brand-black p-8 text-center"><p>Your cart is empty.</p><Link to="/products" className="mt-4 inline-flex min-h-11 items-center text-brand-accent-pink hover:underline">Browse products</Link></div> : (
        <form onSubmit={beginPayment} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5 rounded-xl border border-brand-border-subtle bg-brand-black p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-primary text-xl font-bold">Shipping address</h2><Link to="/addresses" className="min-h-11 content-center text-sm font-semibold text-brand-accent-pink hover:underline">Manage addresses</Link></div>
            {addresses.length === 0 ? <p className="rounded-md border border-amber-400/30 p-4 text-sm text-amber-100">Add a delivery address before checkout. <Link to="/addresses" className="underline">Add address</Link></p> : <fieldset className="space-y-3"><legend className="sr-only">Select a delivery address</legend>{addresses.map((address) => <label key={address.address_id} className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-brand-accent-pink ${String(address.address_id) === String(addressId) ? 'border-brand-accent-pink bg-white/5' : 'border-white/10 hover:border-white/30'}`}><input type="radio" name="address" value={address.address_id} checked={String(address.address_id) === String(addressId)} onChange={() => setAddressId(String(address.address_id))} className="mt-1 size-4 accent-fuchsia-600" /><span className="text-sm leading-6"><span className="font-semibold">{address.full_name}</span>{Number(address.is_default) > 0 && <span className="ml-2 rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">Default</span>}<br /><span className="text-brand-text-muted">{address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.postal_code}<br />{address.phone}</span></span></label>)}</fieldset>}
          </div>
          <aside className="space-y-4 rounded-xl border border-brand-border-subtle bg-brand-black p-5 lg:sticky lg:top-6"><h2 className="font-primary text-xl font-bold">Order summary</h2><ul className="space-y-3 border-t border-white/10 pt-4">{cart.items.map((item) => <li key={item.product_id} className="flex justify-between gap-3 text-sm"><span className="text-brand-text-muted">{item.name} × {item.quantity}</span><span>{formatMoney(item.line_total)}</span></li>)}</ul><div className="flex justify-between border-t border-white/10 pt-4"><span className="text-brand-text-muted">Subtotal</span><span className="font-bold">{formatMoney(cart.summary?.subtotal)}</span></div><p className="text-xs leading-5 text-brand-text-muted">You’ll confirm payment in Razorpay’s secure payment window.</p><Button type="submit" disabled={busy || !addresses.length || !itemsAvailable} className="min-h-11 w-full bg-grad-cta text-white hover:brightness-110">{busy ? 'Starting secure payment…' : `Pay ${formatMoney(cart.summary?.subtotal)}`}</Button><Link to="/cart" className="block min-h-11 content-center text-center text-sm text-brand-text-muted hover:text-white">Return to cart</Link></aside>
        </form>
      )}
    </section>
  )
}
