import { Component, lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireLogin } from '@/auth/RequireLogin'
import { RequirePermission } from '@/auth/RequirePermission'
import { ADMIN_PERMISSIONS, PERMISSIONS } from '@/constants/permissions'
import { StoreLayout } from '@/layouts/StoreLayout'
import { HomePage } from '@/pages/public/HomePage'

const AdminLayout = lazy(() =>
  import('@/layouts/AdminLayout').then((module) => ({ default: module.AdminLayout })),
)
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const UsersPage = lazy(() =>
  import('@/pages/admin/UsersPage').then((module) => ({ default: module.UsersPage })),
)
const RolesPage = lazy(() =>
  import('@/pages/admin/RolesPage').then((module) => ({ default: module.RolesPage })),
)
const CategoriesPage = lazy(() =>
  import('@/pages/admin/CategoriesPage').then((module) => ({ default: module.CategoriesPage })),
)
const AdminProductsPage = lazy(() =>
  import('@/pages/admin/ProductsPage').then((module) => ({ default: module.ProductsPage })),
)
const BlogsAdminPage = lazy(() =>
  import('@/pages/admin/BlogsPage').then((module) => ({ default: module.BlogsAdminPage })),
)
const AdminOrdersPage = lazy(() =>
  import('@/pages/admin/OrdersPage').then((module) => ({ default: module.OrdersPage })),
)
const StoreProductsPage = lazy(() =>
  import('@/pages/public/ProductsPage').then((module) => ({ default: module.ProductsPage })),
)
const ProductDetailPage = lazy(() =>
  import('@/pages/public/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })),
)
const BlogsPage = lazy(() =>
  import('@/pages/public/BlogsPage').then((module) => ({ default: module.BlogsPage })),
)
const BlogDetailPage = lazy(() =>
  import('@/pages/public/BlogDetailPage').then((module) => ({ default: module.BlogDetailPage })),
)
const LoginPage = lazy(() =>
  import('@/pages/public/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/public/RegisterPage').then((module) => ({ default: module.RegisterPage })),
)
const ProfilePage = lazy(() =>
  import('@/pages/public/ProfilePage').then((module) => ({ default: module.ProfilePage })),
)
const CartPage = lazy(() =>
  import('@/pages/customer/CartPage').then((module) => ({ default: module.CartPage })),
)
const CheckoutPage = lazy(() =>
  import('@/pages/customer/CheckoutPage').then((module) => ({ default: module.CheckoutPage })),
)
const OrdersPage = lazy(() =>
  import('@/pages/customer/OrdersPage').then((module) => ({ default: module.OrdersPage })),
)
const OrderDetailPage = lazy(() =>
  import('@/pages/customer/OrderDetailPage').then((module) => ({ default: module.OrderDetailPage })),
)
const WishlistPage = lazy(() =>
  import('@/pages/customer/WishlistPage').then((module) => ({ default: module.WishlistPage })),
)
const AddressesPage = lazy(() =>
  import('@/pages/customer/AddressesPage').then((module) => ({ default: module.AddressesPage })),
)

class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('A page failed to render.', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="font-primary text-2xl font-bold">This page could not be displayed</h1>
          <p className="mt-3 text-brand-text-muted">Please reload the page and try again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-11 rounded-full bg-brand-accent-pink px-6 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Reload page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

function withPageLoading(element) {
  return (
    <Suspense fallback={<p role="status" className="py-16 text-center">Loading page…</p>}>
      {element}
    </Suspense>
  )
}

function App() {
  return (
    <RouteErrorBoundary>
      <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={withPageLoading(<StoreProductsPage />)} />
        <Route path="products/:slug" element={withPageLoading(<ProductDetailPage />)} />
        <Route path="blogs" element={withPageLoading(<BlogsPage />)} />
        <Route path="blogs/:slug" element={withPageLoading(<BlogDetailPage />)} />
        <Route path="login" element={withPageLoading(<LoginPage />)} />
        <Route path="register" element={withPageLoading(<RegisterPage />)} />
        <Route
          path="cart"
          element={withPageLoading(
            <RequireLogin>
              <CartPage />
            </RequireLogin>,
          )}
        />
        <Route
          path="checkout"
          element={withPageLoading(
            <RequireLogin>
              <CheckoutPage />
            </RequireLogin>,
          )}
        />
        <Route
          path="orders"
          element={withPageLoading(
            <RequireLogin>
              <OrdersPage />
            </RequireLogin>,
          )}
        />
        <Route
          path="orders/:id"
          element={withPageLoading(
            <RequireLogin>
              <OrderDetailPage />
            </RequireLogin>,
          )}
        />
        <Route
          path="wishlist"
          element={withPageLoading(
            <RequireLogin>
              <WishlistPage />
            </RequireLogin>,
          )}
        />
        <Route
          path="addresses"
          element={withPageLoading(
            <RequireLogin>
              <AddressesPage />
            </RequireLogin>,
          )}
        />
        <Route
          path="profile"
          element={withPageLoading(
            <RequireLogin>
              <ProfilePage />
            </RequireLogin>,
          )}
        />
      </Route>
      <Route
        path="/admin"
        element={withPageLoading(
          <RequirePermission anyOf={ADMIN_PERMISSIONS}>
            <AdminLayout />
          </RequirePermission>,
        )}
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <RequirePermission permission={PERMISSIONS.USER_READ}>
              <UsersPage />
            </RequirePermission>
          }
        />
        <Route
          path="roles"
          element={
            <RequirePermission permission={PERMISSIONS.ROLE_READ}>
              <RolesPage />
            </RequirePermission>
          }
        />
        <Route
          path="categories"
          element={
            <RequirePermission permission={PERMISSIONS.CATEGORY_READ}>
              <CategoriesPage />
            </RequirePermission>
          }
        />
        <Route
          path="products"
          element={
            <RequirePermission permission={PERMISSIONS.PRODUCT_READ}>
              <AdminProductsPage />
            </RequirePermission>
          }
        />
        <Route
          path="blogs"
          element={
            <RequirePermission permission={PERMISSIONS.BLOG_READ}>
              <BlogsAdminPage />
            </RequirePermission>
          }
        />
        <Route
          path="orders"
          element={
            <RequirePermission permission={PERMISSIONS.ORDER_READ}>
              <AdminOrdersPage />
            </RequirePermission>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />}       />
      </Routes>
    </RouteErrorBoundary>
  )
}

export default App
