import { createElement } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { toast } from 'sonner'
import { addCartItem, addWishlistItem } from '@/api/customer.api'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/AuthContext'
import { formatMoney, getMediaUrl } from '@/utils/media'

function ProductAction({ productId, action, label, icon, disabled }) {
  const { status } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function handleAction(event) {
    event.preventDefault()
    event.stopPropagation()
    if (status !== 'authenticated') {
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      await action(productId)
      window.dispatchEvent(new Event('gearnix:cart-updated'))
      toast.success(label === 'Add to cart' ? 'Added to cart.' : 'Added to wishlist.')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      aria-label={label}
      disabled={disabled}
      onClick={handleAction}
      className="min-h-11 gap-2 border-brand-border-subtle bg-brand-black text-brand-text-primary hover:border-brand-accent-pink hover:text-brand-accent-pink"
    >
      {createElement(icon, { 'aria-hidden': true, size: 17 })}
      <span>{label}</span>
    </Button>
  )
}

export function ProductCard({ product, light = false }) {
  const image = getMediaUrl(product.primary_image_url)

  return (
    <article className={`group overflow-hidden rounded-2xl border transition duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1.5 hover:shadow-[0_12px_34px_rgba(224,64,200,0.18)] ${light ? 'border-zinc-200 bg-white text-brand-text-dark' : 'border-brand-border-subtle bg-brand-base text-brand-text-primary'}`}>
      <Link to={`/products/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent-pink">
        <div className="aspect-square overflow-hidden bg-white p-5">
          {image ? (
            <img src={image} alt={product.name} loading="lazy" className="size-full object-contain transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105" />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-center text-sm font-semibold text-zinc-500">{product.name}</div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 min-h-12 font-default font-semibold">{product.name}</h3>
          <p className="font-default font-bold">{formatMoney(product.price)}</p>
          <p className={`text-xs ${Number(product.stock_quantity) > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {Number(product.stock_quantity) > 0 ? 'In stock' : 'Out of stock'}
          </p>
        </div>
      </Link>
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        <ProductAction productId={product.product_id} action={addCartItem} label="Add to cart" icon={FiShoppingCart} disabled={Number(product.stock_quantity) < 1} />
        <ProductAction productId={product.product_id} action={addWishlistItem} label="Add to wishlist" icon={FiHeart} />
      </div>
    </article>
  )
}
