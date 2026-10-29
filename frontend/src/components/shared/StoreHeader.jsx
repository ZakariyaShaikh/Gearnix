import { createElement, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as motionObject, useReducedMotion } from 'motion/react'
import { Link, NavLink } from 'react-router-dom'
import {
  FiChevronDown,
  FiGrid,
  FiHeart,
  FiHome,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { listBlogs } from '@/api/blogs.api'
import { listCategories, listPublicProducts } from '@/api/catalog.api'
import { Logo } from '@/components/shared/Logo'
import { formatMoney, getMediaUrl } from '@/utils/media'

const MotionDiv = motionObject.div
const MotionNav = motionObject.nav
const MotionButton = motionObject.button

const pageLinks = [
  { label: 'My Account', to: '/profile' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
]

const baseNavigation = [
  { label: 'Home', to: '/', exact: true },
  { label: 'Collections', menu: 'collections' },
  { label: 'Products', menu: 'products' },
  { label: 'Pages', menu: 'pages' },
  { label: 'Blog', menu: 'blog' },
]

function CountBadge({ count }) {
  if (!count) return null
  return (
    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand-accent-magenta text-[9px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}

function IconLink({ to, label, icon, count, image }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = image ? getMediaUrl(image) : ''

  return (
    <Link
      to={to}
      aria-label={count ? `${label}, ${count} items` : label}
      className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-brand-text-primary transition-colors hover:bg-white/10 hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta motion-reduce:transition-none"
    >
      {imageUrl && !imageFailed ? (
        <img src={imageUrl} alt="" onError={() => setImageFailed(true)} className="size-7 rounded-full object-cover" />
      ) : createElement(icon, { 'aria-hidden': true, size: 22 })}
      <CountBadge count={count} />
    </Link>
  )
}

function MenuSection({ title, items, onNavigate }) {
  return (
    <section className="min-w-0">
      <h2 className="font-primary text-lg font-bold text-brand-text-dark">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.length ? items.map((item) => (
          <li key={`${item.to}-${item.label}`}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className="block rounded-sm text-sm text-zinc-700 transition-colors hover:text-brand-accent-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta"
            >
              {item.label}
            </Link>
          </li>
        )) : (
          <li className="text-sm text-zinc-500" role="status">No items available.</li>
        )}
      </ul>
    </section>
  )
}

function FeaturedProduct({ product }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = getMediaUrl(product?.primary_image_url)

  if (!product) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-zinc-100 p-4 text-center text-xs text-zinc-600">
        Featured product unavailable.
      </div>
    )
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="block overflow-hidden rounded-2xl bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta"
    >
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImageFailed(true)}
          className="aspect-square w-full object-contain p-3"
        />
      ) : (
        <div
          role="img"
          aria-label={`TODO-ASSET: ${product.name} product cutout, square 1:1`}
          className="flex aspect-square items-center justify-center border-b border-zinc-200 bg-zinc-100 p-4 text-center text-xs font-medium text-zinc-500"
        >
          TODO-ASSET · featured product cutout · 1:1
        </div>
      )}
      <div className="p-4">
        <p className="line-clamp-2 font-semibold">{product.name}</p>
        <p className="mt-2 text-sm font-bold">{formatMoney(product.price)}</p>
      </div>
    </Link>
  )
}

function MenuContents({ menu, data, error, loading, onNavigate }) {
  if (loading) {
    return <p className="p-8 text-sm text-zinc-600" role="status">Loading menu…</p>
  }
  if (error) {
    return <p className="p-8 text-sm text-red-700" role="alert">{error}</p>
  }

  const categories = data.categories.map((category) => ({
    label: category.name,
    to: `/products?category=${encodeURIComponent(category.category_id)}`,
  }))
  const products = data.products.map((product) => ({
    label: product.name,
    to: `/products/${product.slug}`,
  }))
  const posts = data.blogs.map((blog) => ({
    label: blog.title,
    to: `/blogs/${blog.slug}`,
  }))

  if (menu === 'pages') {
    return <div className="p-6"><MenuSection title="Pages" items={pageLinks} onNavigate={onNavigate} /></div>
  }
  if (menu === 'blog') {
    return (
      <div className="p-6">
        <MenuSection
          title="Blog"
          items={[{ label: 'Blog', to: '/blogs' }, ...posts]}
          onNavigate={onNavigate}
        />
      </div>
    )
  }
  if (menu === 'products') {
    return (
      <div className="grid gap-8 p-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_1fr]">
        <MenuSection title="Products" items={products} onNavigate={onNavigate} />
        <MenuSection title="Collections" items={categories} onNavigate={onNavigate} />
        <MenuSection title="Pages" items={pageLinks} onNavigate={onNavigate} />
        <section>
          <h2 className="mb-4 font-primary text-lg font-bold text-brand-text-dark">Products</h2>
          <FeaturedProduct product={data.products[0]} />
        </section>
      </div>
    )
  }

  return (
    <div className="grid gap-8 p-6 sm:grid-cols-2 lg:grid-cols-4">
      <MenuSection title="Collections" items={categories} onNavigate={onNavigate} />
      <MenuSection title="Products" items={products} onNavigate={onNavigate} />
      <MenuSection title="Pages" items={pageLinks} onNavigate={onNavigate} />
      <MenuSection title="Blog" items={[{ label: 'Blog', to: '/blogs' }, ...posts]} onNavigate={onNavigate} />
    </div>
  )
}

function MobileMenuGroup({ title, open, onToggle, children }) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex min-h-12 w-full items-center justify-between py-2 text-left font-primary font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
      >
        {title}
        <FiChevronDown aria-hidden="true" className={`transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pb-4 pl-3">{children}</div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </section>
  )
}

export function StoreHeader({
  isHome,
  status,
  canAccessAdmin,
  cartCount,
  wishlistCount,
  profileImage,
}) {
  const headerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 40)
  const [menuData, setMenuData] = useState({ menu: null, categories: [], products: [], blogs: [] })
  const [menuError, setMenuError] = useState(null)
  const requestedMenu = activeMenu || (mobileMenuOpen ? mobileSection : null)

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    if (!requestedMenu) return undefined

    let active = true
    const requests = [
      listCategories({ includeHidden: false }),
      listPublicProducts({ page: 1, limit: 8 }),
      listBlogs({ page: 1, limit: 4 }),
    ]

    Promise.all(requests)
      .then(([categories, productResult, blogResult]) => {
        if (!active) return
        setMenuData({
          menu: requestedMenu,
          categories,
          products: productResult.items,
          blogs: blogResult.items,
        })
      })
      .catch((error) => {
        if (active) setMenuError({ menu: requestedMenu, message: error.message })
      })

    return () => { active = false }
  }, [requestedMenu])

  const menuLoading = Boolean(requestedMenu && menuData.menu !== requestedMenu && menuError?.menu !== requestedMenu)
  const visibleMenuError = menuError?.menu === requestedMenu ? menuError.message : ''

  useEffect(() => {
    if (!activeMenu && !mobileMenuOpen) return undefined
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setActiveMenu(null)
        setMobileMenuOpen(false)
      }
    }
    function closeOnOutsideClick(event) {
      if (!headerRef.current?.contains(event.target)) setActiveMenu(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('pointerdown', closeOnOutsideClick)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('pointerdown', closeOnOutsideClick)
    }
  }, [activeMenu, mobileMenuOpen])

  const headerBackground = activeMenu
    ? 'bg-grad-header-purple'
    : isHome && !isScrolled
      ? 'bg-brand-black lg:bg-transparent'
      : 'bg-brand-black'
  const headerPosition = isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0'
  const headerHeight = isHome
    ? 'min-h-14 lg:min-h-[116px]'
    : 'min-h-14 md:min-h-[75px]'
  const motionTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: 'easeOut' }
  const menuLinkClass = 'block min-h-11 rounded px-2 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink'
  const categoryLinks = menuData.categories.map((category) => (
    <Link
      key={category.category_id}
      to={`/products?category=${encodeURIComponent(category.category_id)}`}
      onClick={() => setMobileMenuOpen(false)}
      className={menuLinkClass}
    >
      {category.name}
    </Link>
  ))
  const productLinks = menuData.products.map((product) => (
    <Link
      key={product.product_id}
      to={`/products/${product.slug}`}
      onClick={() => setMobileMenuOpen(false)}
      className={menuLinkClass}
    >
      {product.name}
    </Link>
  ))
  const blogLinks = menuData.blogs.map((blog) => (
    <Link
      key={blog.blog_id}
      to={`/blogs/${blog.slug}`}
      onClick={() => setMobileMenuOpen(false)}
      className={menuLinkClass}
    >
      {blog.title}
    </Link>
  ))
  const mobileMenuState = (items, menu) => {
    if (items.length) return items
    if (menuLoading && requestedMenu === menu) {
      return <p className="text-sm text-white/60" role="status">Loading menu…</p>
    }
    if (visibleMenuError && requestedMenu === menu) {
      return <p className="text-sm text-red-300" role="alert">{visibleMenuError}</p>
    }
    return <p className="text-sm text-white/60">No items available.</p>
  }

  function toggleMenu(menu) {
    setActiveMenu((current) => current === menu ? null : menu)
  }

  function renderMenuTrigger(item) {
    if (!item.menu) {
      return (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.exact}
          onClick={() => setActiveMenu(null)}
          className={({ isActive }) => `relative rounded px-2 py-2 text-sm font-medium transition-colors hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none ${isActive ? 'font-bold text-brand-accent-pink' : 'text-white'}`}
        >
          {item.label}
        </NavLink>
      )
    }

    const open = activeMenu === item.menu
    return (
      <button
        key={item.label}
        type="button"
        aria-expanded={open}
        aria-controls="store-navigation-panel"
        onMouseEnter={() => setActiveMenu(item.menu)}
        onClick={() => toggleMenu(item.menu)}
        className={`relative inline-flex items-center gap-1 rounded px-2 py-2 text-sm font-medium transition-colors hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none ${open ? 'font-bold text-brand-accent-pink' : 'text-white'}`}
      >
        {item.label}
        <FiChevronDown aria-hidden="true" size={14} className={open ? 'rotate-180' : ''} />
      </button>
    )
  }

  return (
    <header
      ref={headerRef}
      className={`${headerPosition} z-50 border-b border-white/10 text-white transition-colors duration-300 motion-reduce:transition-none ${headerHeight} ${headerBackground}`}
    >
      <div className={`flex w-full items-center justify-between gap-2 px-4 sm:px-6 ${isHome ? 'min-h-14 lg:min-h-[116px]' : 'min-h-14 md:min-h-[75px]'}`}>
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta motion-reduce:transition-none"
          >
            {mobileMenuOpen ? <FiX aria-hidden="true" size={22} /> : <FiMenu aria-hidden="true" size={22} />}
          </button>
          <Link
            to="/products"
            aria-label="Search products"
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta motion-reduce:transition-none"
          >
            <FiSearch aria-hidden="true" size={22} />
          </Link>
        </div>

        <Link to="/" aria-label="Gearnix home" className="w-[150px] shrink-0 sm:w-[190px]">
          <Logo color="light" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 lg:flex">
          {baseNavigation.map(renderMenuTrigger)}
        </nav>

        <div className="flex items-center gap-1">
          <span className="hidden md:inline-flex"><IconLink to="/products" label="Search products" icon={FiSearch} /></span>
          <span className="hidden md:inline-flex"><IconLink key={profileImage || 'account-icon'} to={status === 'authenticated' ? '/profile' : '/login'} label="Account" icon={FiUser} image={status === 'authenticated' ? profileImage : null} /></span>
          <span className="hidden md:inline-flex"><IconLink to="/wishlist" label="Wishlist" icon={FiHeart} count={wishlistCount} /></span>
          <IconLink to="/cart" label="Cart" icon={FiShoppingCart} count={cartCount} />
          {canAccessAdmin && (
            <Link to="/admin" className="hidden min-h-11 items-center rounded px-3 text-sm font-medium hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta md:inline-flex">
              Admin
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeMenu && (
          <MotionDiv
            id="store-navigation-panel"
            initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            transition={motionTransition}
            className="absolute inset-x-0 top-full hidden border-t border-black/10 bg-white text-brand-text-dark shadow-xl lg:block"
          >
            <div className="w-full">
              <MenuContents
                menu={activeMenu}
                data={menuData}
                error={visibleMenuError}
                loading={menuLoading}
                onNavigate={() => setActiveMenu(null)}
              />
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <MotionButton
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={motionTransition}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/70"
            />
            <MotionNav
              aria-label="Mobile menu"
              initial={{ x: reduceMotion ? 0 : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : '-100%' }}
              transition={motionTransition}
              className="absolute inset-y-0 left-0 flex w-[min(88vw,24rem)] flex-col overflow-y-auto bg-brand-black px-5 pb-8 pt-5 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <Link to="/" aria-label="Gearnix home" onClick={() => setMobileMenuOpen(false)} className="w-[150px]">
                  <Logo color="light" />
                </Link>
                <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta">
                  <FiX aria-hidden="true" size={22} />
                </button>
              </div>

              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={menuLinkClass}>
                <FiHome aria-hidden="true" className="mr-3 inline" />Home
              </NavLink>
              <MobileMenuGroup title="Collections" open={mobileSection === 'collections'} onToggle={() => setMobileSection((current) => current === 'collections' ? null : 'collections')}>
                {mobileMenuState(categoryLinks, 'collections')}
              </MobileMenuGroup>
              <MobileMenuGroup title="Products" open={mobileSection === 'products'} onToggle={() => setMobileSection((current) => current === 'products' ? null : 'products')}>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)} className={menuLinkClass}>Products</Link>
                {mobileMenuState(productLinks, 'products')}
              </MobileMenuGroup>
              <MobileMenuGroup title="Pages" open={mobileSection === 'pages'} onToggle={() => setMobileSection((current) => current === 'pages' ? null : 'pages')}>
                {pageLinks.map((item) => <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={menuLinkClass}>{item.label}</Link>)}
              </MobileMenuGroup>
              <MobileMenuGroup title="Blog" open={mobileSection === 'blog'} onToggle={() => setMobileSection((current) => current === 'blog' ? null : 'blog')}>
                <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className={menuLinkClass}>Blog</Link>
                {mobileMenuState(blogLinks, 'blog')}
              </MobileMenuGroup>
              {canAccessAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={`${menuLinkClass} mt-3`}>Admin</Link>}
            </MotionNav>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
