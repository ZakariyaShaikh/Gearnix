import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FiArrowRight, FiHeart, FiShoppingCart } from 'react-icons/fi'
import { toast } from 'sonner'
import { addCartItem, addWishlistItem } from '@/api/customer.api'
import { getPublicProductBySlug, listPublicProducts } from '@/api/catalog.api'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'
import { useAuth } from '@/auth/AuthContext'
import { formatMoney, getMediaUrl } from '@/utils/media'
import { PageMeta } from '@/components/shared/PageMeta'

export function ProductDetailPage() {
  const { slug } = useParams()
  const { status } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [response, setResponse] = useState({ slug: null, product: null, error: '' })
  const [selection, setSelection] = useState({ slug: null, index: 0 })
  const [relatedResponse, setRelatedResponse] = useState({ slug: null, items: [], error: '' })
  const loading = response.slug !== slug
  const product = loading ? null : response.product
  const error = loading ? '' : response.error
  const selectedImage = selection.slug === slug ? selection.index : 0
  const relatedLoading = relatedResponse.slug !== slug
  const relatedProducts = relatedLoading ? [] : relatedResponse.items
  const relatedError = relatedLoading ? '' : relatedResponse.error
  const [action, setAction] = useState('')

  useEffect(() => {
    let active = true
    getPublicProductBySlug(slug).then((result) => {
      if (!active) return
      setResponse({ slug, product: result, error: '' })
    }).catch((requestError) => {
      if (!active) return
      setResponse({ slug, product: null, error: requestError.message })
    })

    listPublicProducts({ page: 1, limit: 8 }).then((result) => {
      if (!active) return
      setRelatedResponse({
        slug,
        items: result.items.filter((item) => item.slug !== slug).slice(0, 4),
        error: '',
      })
    }).catch((requestError) => {
      if (active) setRelatedResponse({ slug, items: [], error: requestError.message })
    })

    return () => { active = false }
  }, [slug])

  async function performAction(type) {
    if (status !== 'authenticated') {
      navigate('/login', { state: { from: location } })
      return
    }
    setAction(type)
    try {
      if (type === 'cart') await addCartItem(product.product_id)
      else await addWishlistItem(product.product_id)
      window.dispatchEvent(new Event('gearnix:cart-updated'))
      toast.success(type === 'cart' ? 'Added to cart.' : 'Added to wishlist.')
    } catch (requestError) {
      toast.error(requestError.message)
    } finally {
      setAction('')
    }
  }

  if (loading) return <><PageMeta title="Product" /><p role="status" className="py-16 text-center">Loading product…</p></>
  if (error || !product) {
    return (
      <>
        <PageMeta title="Product Not Found" description="This product is not available." />
        <section className="max-w-xl py-16 mx-auto text-center">
          <h1 className="text-3xl font-bold font-primary">Product not found</h1>
          <p role="alert" className="mt-3 text-brand-text-muted">{error || 'This product may no longer be available.'}</p>
          <Link to="/products" className="inline-flex items-center px-6 mt-6 text-white rounded-full min-h-11 bg-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Browse products</Link>
        </section>
      </>
    )
  }

  const images = product.images || []
  const activeImage = images[selectedImage] || images.find((img) => img.image_url) || { image_url: '' }
  const imageUrl = getMediaUrl(activeImage?.image_url || '/placeholder-product.png')
  const inStock = Number(product.stock_quantity) > 0

  return (
    <article className="-mx-4 -mt-8 -mb-12 bg-[#f7f7f8] pb-12 text-zinc-900 sm:-mx-6">
      <PageMeta
        title={product.name}
        description={product.description || `Shop ${product.name} at Gearnix.`}
        image={activeImage?.image_url ? getMediaUrl(activeImage.image_url) : undefined}
      />
      <div className="w-full px-4 pt-6 sm:px-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 sm:text-sm">
          <Link to="/" className="transition-colors hover:text-fuchsia-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-600">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link to="/products" className="transition-colors hover:text-fuchsia-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-600">Products</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page" className="text-zinc-800">{product.name}</span>
        </nav>

        <div className="grid gap-8 pb-14 pt-5 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-7">
          <div className="space-y-3">
            <div className="relative flex items-center justify-center p-5 overflow-hidden bg-white aspect-square rounded-xl sm:p-8">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} fetchPriority="high" className="object-contain size-full" />
              ) : (
                <div className="text-2xl font-bold text-center font-primary text-zinc-400">{product.name}</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3" aria-label="Product images">
                {images.map((image, index) => (
                  <button
                    key={image.image_id}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    onClick={() => setSelection({ slug, index })}
                    className={`size-[4.5rem] overflow-hidden rounded-lg border-2 bg-white p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-600 sm:size-20 ${selectedImage === index ? 'border-fuchsia-600' : 'border-transparent hover:border-zinc-300'}`}
                  >
                    <img src={getMediaUrl(image.image_url)} alt="" loading="lazy" className="object-contain size-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-start">
            {product.categories?.length > 0 && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-700">
                {product.categories.map((category) => category.name).join(' · ')}
              </p>
            )}

            <h1 className="mt-3 text-2xl font-bold leading-tight font-primary sm:text-3xl lg:text-4xl">{product.name}</h1>
            <p className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">{formatMoney(product.price)}</p>
            <p className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${inStock ? 'text-emerald-700' : 'text-red-700'}`}>
              <span className={`size-2 rounded-full ${inStock ? 'bg-emerald-600' : 'bg-red-600'}`} aria-hidden="true" />
              {inStock ? 'In stock and ready to ship' : 'Currently out of stock'}
            </p>

            {product.description && (
              <p className="mt-6 text-sm leading-7 whitespace-pre-wrap max-w-prose text-zinc-600 sm:text-base">
                {product.description}
              </p>
            )}

            <div className="mt-8 grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_3.25rem]">
              <Button
                disabled={!inStock || action === 'cart'}
                onClick={() => performAction('cart')}
                className="min-h-12 gap-2 rounded-full bg-[#18151b] px-6 text-sm font-semibold text-white transition-colors hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiShoppingCart aria-hidden="true" />
                {action === 'cart' ? 'Adding to cart…' : 'Add to cart'}
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-label="Add to wishlist"
                disabled={action === 'wishlist'}
                onClick={() => performAction('wishlist')}
                className="bg-white rounded-full min-h-12 border-zinc-300 text-zinc-800 hover:border-fuchsia-600 hover:text-fuchsia-700"
              >
                <FiHeart aria-hidden="true" />
              </Button>
            </div>

            <div className="w-full pt-5 mt-8 border-t border-zinc-200">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Product details</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[6rem_1fr]">
                {product.sku && (
                  <>
                    <dt className="font-semibold text-zinc-700">SKU</dt>
                    <dd className="text-zinc-600">{product.sku}</dd>
                  </>
                )}
                {product.categories?.length > 0 && (
                  <>
                    <dt className="font-semibold text-zinc-700">Category</dt>
                    <dd className="text-zinc-600">{product.categories.map((category) => category.name).join(', ')}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[#151419] px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="w-full">
          <header className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">You may also like</p>
              <h2 className="mt-2 text-2xl font-bold font-primary sm:text-3xl">Complete your setup</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold min-h-11 text-white/80 hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300">
              View all products <FiArrowRight aria-hidden="true" />
            </Link>
          </header>
          {relatedError && <p role="alert" className="p-3 mb-5 text-sm text-red-300 border rounded-md border-red-500/40 bg-red-950/30">Related products could not be loaded: {relatedError}</p>}
          {relatedLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading related products">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/10 motion-reduce:animate-none" />)}
            </div>
          ) : relatedProducts.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => <ProductCard key={item.product_id} product={item} />)}
            </div>
          ) : !relatedError ? (
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/60">More gear is on the way.</p>
          ) : null}
        </div>
      </section>
    </article>
  )
}
