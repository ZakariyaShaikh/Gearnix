import { createElement, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiHeadphones,
  FiRefreshCw,
  FiTruck,
} from 'react-icons/fi'
import { PiPiggyBank } from 'react-icons/pi'
import { listBlogs } from '@/api/blogs.api'
import { listCategories, listPublicProducts } from '@/api/catalog.api'
import { ProductCard } from '@/components/shared/ProductCard'
import { PageMeta } from '@/components/shared/PageMeta'
import { Button } from '@/components/ui/button'
import {
  BRAND_LOGOS,
  CATEGORY_FLANK_LEFT,
  CATEGORY_FLANK_RIGHT,
  CATEGORY_IMAGES,
  GAMING_ADVANTAGE_BG,
  HERO_IMAGES,
  REVIEW_IMAGES,
  STORY_IMAGE,
  WEEKLY_DEAL_IMAGE,
} from '@/constants/images'
import { formatDate, getMediaUrl } from '@/utils/media'

const benefits = [
  { title: 'Free Shipping', description: 'Fast, free delivery on gaming essentials.', icon: FiTruck },
  { title: 'Easy Returns', description: 'Shop with confidence, every time.', icon: FiRefreshCw },
  { title: 'Great Value', description: 'More performance for your setup.', icon: PiPiggyBank },
  { title: 'Here to Help', description: 'Support for every step of your journey.', icon: FiHeadphones },
]

const categories = [
  { title: 'Keyboards', image: CATEGORY_IMAGES[0], match: 'keyboard' },
  { title: 'Gaming Mouse', image: CATEGORY_IMAGES[1], match: 'mouse' },
  { title: 'Headphones', image: CATEGORY_IMAGES[2], match: 'headphone' },
  { title: 'Gaming Controllers', image: CATEGORY_IMAGES[3], match: 'controller' },
]

function SectionHeading({ eyebrow, title, to, linkLabel = 'Explore all' }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400">{eyebrow}</p>
        <h2 className="mt-2 font-primary text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400">
          {linkLabel} <FiArrowRight aria-hidden="true" />
        </Link>
      )}
    </header>
  )
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function updateVisibility() {
      setVisible(window.scrollY > 400)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })}
      className={`fixed bottom-24 right-5 z-30 inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-zinc-900 text-white shadow-lg transition-opacity duration-200 motion-reduce:transition-none md:bottom-8 md:right-8 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <FiArrowUp aria-hidden="true" size={20} />
    </button>
  )
}

export function HomePage() {
  const [products, setProducts] = useState([])
  const [posts, setPosts] = useState([])
  const [storeCategories, setStoreCategories] = useState([])
  const [productError, setProductError] = useState('')
  const [blogError, setBlogError] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    let active = true
    listPublicProducts({ page: 1, limit: 8 })
      .then((result) => {
        if (!active) return
        setProducts(result.items)
        setProductError('')
      })
      .catch((error) => {
        if (active) setProductError(error.message)
      })
      .finally(() => {
        if (active) setLoadingProducts(false)
      })

    listBlogs({ page: 1, limit: 3 })
      .then((result) => {
        if (!active) return
        setPosts(result.items)
        setBlogError('')
      })
      .catch((error) => {
        if (active) setBlogError(error.message)
      })

    listCategories({ includeHidden: false })
      .then((result) => {
        if (!active) return
        setStoreCategories(result)
        setCategoryError('')
      })
      .catch((error) => {
        if (active) setCategoryError(error.message)
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_IMAGES.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [heroIndex])

  const categoryHref = (match) => {
    const category = storeCategories.find((item) => item.name.toLowerCase().includes(match))
    return category ? `/products?category=${encodeURIComponent(category.category_id)}` : '/products'
  }

  return (
    <div className="-mx-4 -mt-8 space-y-20 overflow-hidden pb-12 text-white sm:-mx-6">
      <PageMeta
        title="Gaming Gear & Esports Essentials"
        description="Explore gaming gear, esports essentials, and stories to level up your setup at Gearnix."
      />
      <section className="relative isolate flex min-h-[min(720px,calc(100svh-3.5rem))] items-center overflow-hidden bg-[#101014] px-5 py-16 sm:px-8 lg:px-[8%]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_48%,rgba(88,48,122,0.28),transparent_44%),linear-gradient(90deg,#101014_5%,rgba(16,16,20,0.88)_40%,rgba(16,16,20,0.2)_100%)]" aria-hidden="true" />
        <span className="pointer-events-none absolute right-[-4%] top-1/2 -z-10 hidden -translate-y-1/2 font-primary text-[clamp(7rem,21vw,20rem)] font-black uppercase tracking-tight text-white/[0.045] lg:block" aria-hidden="true">GEAR</span>
        <div className="mx-auto grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 max-w-xl">
            <p className="font-default text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-300">Play without limits</p>
            <h1 className="mt-5 font-primary text-3xl font-bold leading-tight sm:text-5xl">
              Elevate your experience
              <span className="mt-2 block text-white">with top-tier gaming gear.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
              Discover the gear that brings your setup to life, from the first click to the final round.
            </p>
            <Button asChild className="mt-7 min-h-12 rounded-full bg-grad-cta px-7 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(217,70,239,0.25)] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none">
              <Link to="/products">
                Shop the collection <FiArrowRight aria-hidden="true" className="ml-2" />
              </Link>
            </Button>
          </div>
          <div className="relative mx-auto flex aspect-[1.13/1] w-full max-w-2xl items-center justify-center">
            {HERO_IMAGES.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={index === heroIndex ? 'Featured gaming setup' : ''}
                aria-hidden={index !== heroIndex}
                fetchPriority={index === 0 ? 'high' : undefined}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 size-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.6)] transition-opacity duration-700 motion-reduce:transition-none ${index === heroIndex ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              />
            ))}
            <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center gap-3 lg:bottom-4">
              <button type="button" aria-label="Previous featured image" onClick={() => setHeroIndex((current) => (current + HERO_IMAGES.length - 1) % HERO_IMAGES.length)} className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <FiChevronLeft aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2" aria-label="Choose featured image">
                {HERO_IMAGES.map((image, index) => (
                  <button key={image} type="button" aria-label={`Show featured image ${index + 1}`} aria-pressed={heroIndex === index} onClick={() => setHeroIndex(index)} className={`min-h-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${heroIndex === index ? 'w-7 bg-fuchsia-300' : 'w-3 bg-white/40 hover:bg-white/70'}`} />
                ))}
              </div>
              <button type="button" aria-label="Next featured image" onClick={() => setHeroIndex((current) => (current + 1) % HERO_IMAGES.length)} className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid w-full grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:gap-8" aria-label="Store benefits">
        {benefits.map(({ title, description, icon }) => (
          <article key={title} className="flex flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#211b27] text-fuchsia-300 shadow-[0_0_30px_rgba(217,70,239,0.13)] sm:size-[4.5rem]">
              {createElement(icon, { 'aria-hidden': true, size: 28, strokeWidth: 1.7 })}
            </span>
            <h2 className="mt-4 font-primary text-sm font-bold sm:text-base">{title}</h2>
            <p className="mt-1 max-w-[15rem] text-xs leading-5 text-white/60 sm:text-sm">{description}</p>
          </article>
        ))}
      </section>

      <section className="grid w-full gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <div className="group relative min-h-[18rem] overflow-hidden rounded-2xl bg-zinc-900 sm:min-h-[22rem]">
          <img src={STORY_IMAGE} alt="A colorful gaming setup ready to play" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" aria-hidden="true" />
          <Link to="/products" className="absolute inset-0 flex flex-col justify-end p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fuchsia-300 sm:p-9">
            <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-white text-fuchsia-600">
              <FiArrowRight aria-hidden="true" />
            </span>
            <p className="font-primary text-xl font-bold sm:text-2xl">Make your setup your own.</p>
            <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white/80">Explore the collection <FiArrowRight aria-hidden="true" /></span>
          </Link>
        </div>
        <div className="flex min-h-[18rem] flex-col justify-center rounded-2xl bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-7 sm:min-h-[22rem] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">A little about us</p>
          <h2 className="mt-3 font-primary text-3xl font-bold sm:text-4xl">Our Story</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/90 sm:text-base">
            Built around the joy of gaming, Gearnix brings the gear and inspiration for every kind of player and every kind of setup.
          </p>
          <Link to="/blogs" className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Read more <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="w-full space-y-7 px-4 sm:px-6">
        <SectionHeading eyebrow="Find your fit" title="Shop by category" to="/products" linkLabel="Shop all gear" />
        {categoryError && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">Categories could not be loaded: {categoryError}</p>}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.title} to={categoryHref(category.match)} className="group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl bg-[#19181e] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(217,70,239,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 sm:min-h-56 sm:p-5">
              <img src={category.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" aria-hidden="true" />
              <span className="relative mt-auto font-primary text-sm font-bold sm:text-lg">{category.title}</span>
              <span className="relative mt-2 inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-300">Shop now <FiArrowRight aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid w-full gap-5 px-4 sm:px-6 lg:grid-cols-2">
        {[
          { image: CATEGORY_FLANK_LEFT, title: 'Level up your play', label: 'Shop gaming gear' },
          { image: CATEGORY_FLANK_RIGHT, title: 'Find your next favorite', label: 'Explore the collection' },
        ].map((promotion) => (
          <Link key={promotion.title} to="/products" className="group relative flex min-h-56 items-end overflow-hidden rounded-2xl bg-zinc-900 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 sm:min-h-72 sm:p-8">
            <img src={promotion.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden="true" />
            <span className="relative">
              <span className="block font-primary text-xl font-bold sm:text-2xl">{promotion.title}</span>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-200">{promotion.label} <FiArrowRight aria-hidden="true" /></span>
            </span>
          </Link>
        ))}
      </section>

      <section className="w-full space-y-7 px-4 sm:px-6">
        <SectionHeading eyebrow="Picked for your setup" title="Top rated products" to="/products" linkLabel="View all products" />
        {productError && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{productError}</p>}
        {loadingProducts ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/10 motion-reduce:animate-none" />)}
          </div>
        ) : products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => <ProductCard key={product.product_id} product={product} />)}
          </div>
        ) : !productError ? (
          <p className="rounded-xl border border-white/10 bg-[#151519] p-8 text-center text-white/60">New gear is coming soon.</p>
        ) : null}
      </section>

      <section className="relative isolate overflow-hidden bg-[#16151a]">
        <img src={WEEKLY_DEAL_IMAGE} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/20" aria-hidden="true" />
        <div className="flex min-h-[22rem] w-full flex-col items-start justify-center px-6 py-12 sm:px-10 lg:min-h-[28rem] lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-300">This week only</p>
          <h2 className="mt-3 max-w-xl font-primary text-3xl font-bold sm:text-5xl">Big upgrades. Better deals.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 sm:text-base">Find your next essential and bring a little more power to your setup.</p>
          <Button asChild className="mt-7 min-h-12 rounded-full bg-grad-cta px-7 text-white hover:brightness-110">
            <Link to="/products">Shop weekly deals <FiArrowRight aria-hidden="true" className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      <section className="w-full space-y-7 px-4 sm:px-6">
        <SectionHeading eyebrow="Gear you know" title="Shop popular brands" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {BRAND_LOGOS.map((logo, index) => (
            <Link key={logo} to="/products" aria-label={`Shop brand ${index + 1}`} className="flex min-h-20 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] p-3 transition-colors hover:border-fuchsia-400/50 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 sm:min-h-24">
              <img src={logo} alt={`Popular brand ${index + 1}`} loading="lazy" className="max-h-12 max-w-full object-contain opacity-75 transition-opacity hover:opacity-100 sm:max-h-14" />
            </Link>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#15151b]">
        <img src={GAMING_ADVANTAGE_BG} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101014]/95 via-[#101014]/75 to-[#101014]/35" aria-hidden="true" />
        <div className="w-full px-6 py-16 sm:px-10 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Built for better play</p>
          <h2 className="mt-3 max-w-2xl font-primary text-3xl font-bold sm:text-5xl">Experience the gaming advantage.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">Modern equipment, thoughtful details, and the freedom to make your setup yours.</p>
          <Link to="/products" className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300">
            Discover your gear <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="w-full space-y-7 px-4 sm:px-6">
        <SectionHeading eyebrow="Made for your setup" title="The Gearnix community" to="/blogs" linkLabel="Read our stories" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {REVIEW_IMAGES.map((image, index) => (
            <Link key={image} to="/blogs" aria-label={`Explore Gearnix community setup ${index + 1}`} className="group aspect-[4/3] overflow-hidden rounded-xl bg-[#19181e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300">
              <img src={image} alt={`Gaming setup from the Gearnix community ${index + 1}`} loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
            </Link>
          ))}
        </div>
      </section>

      <section className="w-full space-y-7 px-4 sm:px-6">
        <SectionHeading eyebrow="From Gearnix" title="Latest stories" to="/blogs" linkLabel="Read all stories" />
        {blogError && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{blogError}</p>}
        {posts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.blog_id} className="group overflow-hidden rounded-xl border border-white/10 bg-[#151519]">
                <Link to={`/blogs/${post.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300">
                  <div className="aspect-[3/2] overflow-hidden bg-[#211f25]">
                    {post.cover_image ? <img src={getMediaUrl(post.cover_image)} alt={post.title} loading="lazy" className="size-full object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105" /> : <div className="flex size-full items-center justify-center p-6 text-center font-primary text-xl font-bold text-white/40">{post.title}</div>}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-white/55">{formatDate(post.published_at)}</p>
                    <h3 className="mt-2 font-primary text-lg font-bold group-hover:text-fuchsia-300">{post.title}</h3>
                    {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">{post.excerpt}</p>}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : !blogError ? (
          <p className="rounded-xl border border-white/10 bg-[#151519] p-8 text-center text-white/60">Stories will appear here once they are published.</p>
        ) : null}
      </section>

      <ScrollToTop />
    </div>
  )
}
