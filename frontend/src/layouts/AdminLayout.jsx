import { createElement } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FiBookOpen, FiBox, FiGrid, FiHome, FiUsers } from 'react-icons/fi'
import { Logo } from '@/components/shared/Logo'
import { useAuth } from '@/auth/AuthContext'
import { PERMISSIONS } from '@/constants/permissions'

const adminSections = [
  { to: '/admin', label: 'Dashboard', permission: null, icon: FiHome, end: true },
  { to: '/admin/users', label: 'Users', permission: PERMISSIONS.USER_READ, icon: FiUsers },
  { to: '/admin/roles', label: 'Roles', permission: PERMISSIONS.ROLE_READ, icon: FiGrid },
  { to: '/admin/categories', label: 'Categories', permission: PERMISSIONS.CATEGORY_READ, icon: FiGrid },
  { to: '/admin/products', label: 'Products', permission: PERMISSIONS.PRODUCT_READ, icon: FiBox },
  { to: '/admin/blogs', label: 'Blogs', permission: PERMISSIONS.BLOG_READ, icon: FiBookOpen },
]

export function AdminLayout() {
  const { hasPermission } = useAuth()
  const visibleSections = adminSections.filter(
    (section) => !section.permission || hasPermission(section.permission),
  )

  const navClass = ({ isActive }) =>
    `flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink ${
      isActive
        ? 'bg-brand-accent-pink/15 text-brand-accent-pink'
        : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text-primary'
    }`

  return (
    <div className="min-h-screen bg-brand-base text-brand-text-primary">
      <header className="flex min-h-[4.5rem] items-center justify-between border-b border-brand-border-subtle bg-brand-black px-4 sm:px-6">
        <Link to="/" aria-label="Gearnix home" className="w-36">
          <Logo color="light" />
        </Link>
        <h1 className="font-primary text-lg font-bold">Admin</h1>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded px-3 text-sm hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta"
        >
          <FiHome aria-hidden="true" size={20} />
          <span>Store</span>
        </Link>
      </header>
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl">
        <div className="flex min-w-0 flex-1 flex-col md:flex-row">
          <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto border-b border-brand-border-subtle p-3 md:w-60 md:shrink-0 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-5">
            {visibleSections.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={navClass}>
                {createElement(Icon, { 'aria-hidden': true, size: 18 })}
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <main className="min-w-0 flex-1 p-4 pb-20 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
