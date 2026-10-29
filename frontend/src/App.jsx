import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireLogin } from '@/auth/RequireLogin'
import { RequirePermission } from '@/auth/RequirePermission'
import { ADMIN_PERMISSIONS, PERMISSIONS } from '@/constants/permissions'
import { AdminLayout } from '@/layouts/AdminLayout'
import { StoreLayout } from '@/layouts/StoreLayout'
import { CategoriesPage } from '@/pages/admin/CategoriesPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ProductsPage } from '@/pages/admin/ProductsPage'
import { RolesPage } from '@/pages/admin/RolesPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { BlogDetailPage } from '@/pages/public/BlogDetailPage'
import { BlogsPage } from '@/pages/public/BlogsPage'
import { HomePage } from '@/pages/public/HomePage'
import { LoginPage } from '@/pages/public/LoginPage'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'
import { ProfilePage } from '@/pages/public/ProfilePage'
import { RegisterPage } from '@/pages/public/RegisterPage'
import { AddressesPage } from '@/pages/customer/AddressesPage'
import { CartPage } from '@/pages/customer/CartPage'
import { WishlistPage } from '@/pages/customer/WishlistPage'
import { CheckoutPage } from '@/pages/customer/CheckoutPage'
import { OrdersPage } from '@/pages/customer/OrdersPage'
import { OrderDetailPage } from '@/pages/customer/OrderDetailPage'
import { ProductsPage as StoreProductsPage } from '@/pages/public/ProductsPage'
import { PlaceholderPage } from '@/pages/public/PlaceholderPage'

const BlogsAdminPage = lazy(() =>
  import('@/pages/admin/BlogsPage').then((module) => ({
    default: module.BlogsAdminPage,
  })),
)

function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<StoreProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:slug" element={<BlogDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="cart"
          element={
            <RequireLogin>
              <CartPage />
            </RequireLogin>
          }
        />
        <Route
          path="checkout"
          element={
            <RequireLogin>
              <CheckoutPage />
            </RequireLogin>
          }
        />
        <Route
          path="orders"
          element={
            <RequireLogin>
              <OrdersPage />
            </RequireLogin>
          }
        />
        <Route
          path="orders/:id"
          element={
            <RequireLogin>
              <OrderDetailPage />
            </RequireLogin>
          }
        />
        <Route
          path="wishlist"
          element={
            <RequireLogin>
              <WishlistPage />
            </RequireLogin>
          }
        />
        <Route
          path="addresses"
          element={
            <RequireLogin>
              <AddressesPage />
            </RequireLogin>
          }
        />
        <Route
          path="profile"
          element={
            <RequireLogin>
              <ProfilePage />
            </RequireLogin>
          }
        />
      </Route>
      <Route
        path="/admin"
        element={
          <RequirePermission anyOf={ADMIN_PERMISSIONS}>
            <AdminLayout />
          </RequirePermission>
        }
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
              <ProductsPage />
            </RequirePermission>
          }
        />
        <Route
          path="blogs"
          element={
            <RequirePermission permission={PERMISSIONS.BLOG_READ}>
              <Suspense fallback={<p role="status">Loading blog admin…</p>}>
                <BlogsAdminPage />
              </Suspense>
            </RequirePermission>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
