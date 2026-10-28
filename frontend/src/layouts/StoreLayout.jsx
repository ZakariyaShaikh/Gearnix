import { createElement, useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  FiGrid,
  FiHeart,
  FiHome,
  FiMinus,
  FiPlus,
  FiUser,
} from 'react-icons/fi'
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaCcAmex,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
} from 'react-icons/fa6'
import { toast } from 'sonner'
import { getCart, getWishlist } from '@/api/customer.api'
import { Logo } from '@/components/shared/Logo'
import { StoreHeader } from '@/components/shared/StoreHeader'
import { ADMIN_PERMISSIONS } from '@/constants/permissions'
import { SITE } from '@/constants/site'
import { useAuth } from '@/auth/AuthContext'

const socialLinks = [
  { name: 'Facebook', url: SITE.socials.facebook, icon: FaFacebookF },
  { name: 'Instagram', url: SITE.socials.instagram, icon: FaInstagram },
  { name: 'X', url: SITE.socials.x, icon: FaXTwitter },
  { name: 'TikTok', url: SITE.socials.tiktok, icon: FaTiktok },
]

const paymentIcons = {
  visa: FaCcVisa,
  mastercard: FaCcMastercard,
  amex: FaCcAmex,
  paypal: FaCcPaypal,
}

function FooterColumn({ id, title, children, open, onToggle }) {
  return (
    <section className="border-b border-white/10 md:border-0">
      <h2 className="hidden font-primary text-xl font-bold md:block">{title}</h2>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onToggle(id)}
        className="flex min-h-14 w-full items-center justify-between py-3 text-left font-primary text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink md:hidden"
      >
        {title}
        {open ? <FiMinus aria-hidden="true" size={24} /> : <FiPlus aria-hidden="true" size={24} />}
      </button>
      <div className={`grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none md:mt-8 md:grid-rows-[1fr] md:opacity-100 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:opacity-100'}`}>
        <div className="overflow-hidden">
          <div className="space-y-4 pb-5 text-sm text-white/90 md:pb-0 md:text-base">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="block w-fit min-h-6 transition-colors hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">
      {children}
    </Link>
  )
}

function NewsletterPreview() {
  function showPreview(event) {
    event.preventDefault()
    toast.info('Newsletter signup is a demo preview and is not connected.')
  }

  return (
    <form onSubmit={showPreview} className="space-y-3">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email address"
        className="min-h-11 w-full rounded-md border border-white/20 bg-black/30 px-3 text-sm text-white placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
      />
      <button type="submit" className="min-h-11 rounded-full bg-grad-cta px-5 font-semibold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        Subscribe
      </button>
      <p className="text-xs text-white/60">Demo only; your email will not be saved.</p>
      <div className="pt-3">
        <h3 className="mb-3 font-primary text-base font-bold">Payments</h3>
        <div className="flex flex-wrap gap-2">
          {SITE.paymentMethods.map((method) => {
            const PaymentIcon = paymentIcons[method]
            return PaymentIcon ? (
              <span key={method} className="flex h-8 w-12 items-center justify-center rounded bg-white text-zinc-800">
                {createElement(PaymentIcon, { 'aria-label': method, size: 28 })}
              </span>
            ) : null
          })}
        </div>
      </div>
    </form>
  )
}

function StoreFooter() {
  const [openFooter, setOpenFooter] = useState(null)
  const addressAvailable = SITE.address && SITE.address !== 'TODO-STORE-ADDRESS'
  const phoneAvailable = SITE.phone && SITE.phone !== 'TODO-PHONE'
  const emailAvailable = SITE.email && SITE.email !== 'TODO-EMAIL'
  const activeSocials = socialLinks.filter(({ url }) => url)

  return (
    <footer className="bg-[#17171A] px-4 pb-[calc(68px+env(safe-area-inset-bottom))] pt-12 text-white sm:px-6 md:pb-12">
      <div className="w-full px-4 sm:px-6">
        <div className="grid gap-x-8 lg:grid-cols-[1.25fr_1fr_1fr_0.85fr_1.2fr]">
          <FooterColumn id="contact" title="Contact us" open={openFooter === 'contact'} onToggle={(id) => setOpenFooter((current) => current === id ? null : id)}>
            {addressAvailable && <p className="max-w-xs leading-6">{SITE.address}</p>}
            {phoneAvailable && <a className="block min-h-6 w-fit hover:text-brand-accent-pink" href={`tel:${SITE.phone}`}>{SITE.phone}</a>}
            {emailAvailable && <a className="block min-h-6 w-fit hover:text-brand-accent-pink" href={`mailto:${SITE.email}`}>{SITE.email}</a>}
            {!addressAvailable && !phoneAvailable && !emailAvailable && <p className="leading-6 text-white/70">Store contact details will be added when provided.</p>}
          </FooterColumn>
          <FooterColumn id="help" title="Let us help" open={openFooter === 'help'} onToggle={(id) => setOpenFooter((current) => current === id ? null : id)}>
            <FooterLink to="/orders">Track my order</FooterLink>
            <FooterLink to="/orders">Order support</FooterLink>
            <FooterLink to="/products">Search products</FooterLink>
          </FooterColumn>
          <FooterColumn id="policies" title="Our policies" open={openFooter === 'policies'} onToggle={(id) => setOpenFooter((current) => current === id ? null : id)}>
            <p className="leading-6 text-white/70">Store policies will be published here when finalized.</p>
          </FooterColumn>
          <FooterColumn id="account" title="My Account" open={openFooter === 'account'} onToggle={(id) => setOpenFooter((current) => current === id ? null : id)}>
            <FooterLink to="/profile">My account</FooterLink>
            <FooterLink to="/orders">Order history</FooterLink>
            <FooterLink to="/wishlist">Wish list</FooterLink>
            <span aria-disabled="true" className="block text-white/50">Gift cards (unavailable)</span>
            {SITE.features.storeLocation && <FooterLink to="/">{SITE.address}</FooterLink>}
          </FooterColumn>
          <FooterColumn id="newsletter" title="Newsletters" open={openFooter === 'newsletter'} onToggle={(id) => setOpenFooter((current) => current === id ? null : id)}>
            <NewsletterPreview />
          </FooterColumn>
        </div>

        <div className="mt-12 border-t border-white/15 pt-10 text-center">
          <Link to="/" aria-label="Gearnix home" className="mx-auto block w-52 max-w-full">
            <Logo color="light" />
          </Link>
          <p className="mt-5 text-sm text-white/90">Copyright © {SITE.copyrightYear} {SITE.name}. All Rights Reserved.</p>
          {activeSocials.length > 0 && (
            <nav aria-label="Social media" className="mt-6 flex justify-center gap-4">
              {activeSocials.map(({ name, url, icon }) => (
                <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} className="inline-flex size-12 items-center justify-center rounded-full bg-brand-accent-pink text-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(255,63,163,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none">
                  {createElement(icon, { 'aria-hidden': true, size: 20 })}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}

function MobileTabs({ status, wishlistCount }) {
  const location = useLocation()
  const accountPath = status === 'authenticated' ? '/profile' : '/login'
  const tabs = [
    { to: '/', label: 'Home', icon: FiHome, exact: true },
    { to: '/products', label: 'Shopping', icon: FiGrid },
    { to: '/wishlist', label: 'Wishlist', icon: FiHeart, count: wishlistCount },
    { to: accountPath, label: 'Account', icon: FiUser },
  ]

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] text-brand-text-dark md:hidden">
      {tabs.map(({ to, label, icon, exact, count }) => {
        const active = exact ? location.pathname === to : location.pathname.startsWith(to)
        return (
          <Link key={label} to={to} aria-current={active ? 'page' : undefined} aria-label={count ? `${label}, ${count} items` : label} className={`flex min-h-[68px] flex-col items-center justify-center gap-1 border-r border-zinc-200 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent-magenta last:border-r-0 ${active ? 'text-brand-accent-magenta' : ''}`}>
            <span className="relative">
              {createElement(icon, { 'aria-hidden': true, size: 24 })}
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-brand-accent-magenta text-[9px] font-bold leading-none text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function StoreLayout() {
  const { hasPermission, status } = useAuth()
  const location = useLocation()
  const canAccessAdmin =
    status === 'authenticated' && ADMIN_PERMISSIONS.some(hasPermission)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  const refreshCounts = useCallback(async () => {
    if (status !== 'authenticated') {
      setCartCount(0)
      setWishlistCount(0)
      return
    }

    const [cartResult, wishlistResult] = await Promise.allSettled([getCart(), getWishlist()])
    if (cartResult.status === 'fulfilled') {
      const items = cartResult.value?.items
      setCartCount(Array.isArray(items) ? items.reduce((total, item) => total + Number(item.quantity || 0), 0) : 0)
    } else {
      toast.error(`Could not load cart count: ${cartResult.reason.message}`)
    }
    if (wishlistResult.status === 'fulfilled') {
      setWishlistCount(wishlistResult.value.length)
    } else {
      toast.error(`Could not load wishlist count: ${wishlistResult.reason.message}`)
    }
  }, [status])

  useEffect(() => {
    Promise.resolve().then(refreshCounts)
    window.addEventListener('gearnix:cart-updated', refreshCounts)
    return () => window.removeEventListener('gearnix:cart-updated', refreshCounts)
  }, [refreshCounts])

  return (
    <div className="min-h-screen bg-brand-base text-brand-text-primary">
      <StoreHeader
        isHome={location.pathname === '/'}
        status={status}
        canAccessAdmin={canAccessAdmin}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <main className="min-h-[calc(100vh-3.5rem)] w-full px-4 py-8 pb-[calc(68px+env(safe-area-inset-bottom))] sm:px-6 md:min-h-[calc(100vh-4.5rem)] md:pb-12">
        <Outlet />
      </main>
      <StoreFooter />
      <MobileTabs status={status} wishlistCount={wishlistCount} />
    </div>
  )
}
