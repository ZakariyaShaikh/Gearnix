# Gearnix: Phases

Status key: ✅ done · 🔄 in progress · ⬜ not started

## Phase 0: Backend foundation ✅

Complete and tested. Covers:
- Auth: register, email OTP, login, refresh-token sessions (1 hour access token, 7 day refresh cookie), logout, logout everywhere
- Users: profile, password change, profile image, account deletion, `GET /api/users/me` with permission keys
- Permissions: role-based permission checks against the database on every request
- Role management: user list, role change with history, role permissions editing
- Catalog: categories, products, product images, search, pagination
- Blogs: public and admin lists, create, update, cover image
- Customer: cart, wishlist, addresses
- Orders: checkout, Razorpay payment, payment verification, webhook fallback, order history, cancellation, stale order cleanup

## Phase 1: Frontend foundation ⬜

**Goal:** a running React app with routing, authentication state, the API client, and the layout shells.

**Deliverables:**
- Vite + React + Tailwind project in `frontend/`
- shadcn/ui initialized, with the base UI components
- React Router with the route structure in `architecture.md`
- Auth context: access token kept in memory, session restored on page load through `POST /api/auth/refresh`
- API client: sends the access token, sends cookies, retries once after a 401 (one refresh at a time)
- Route guards: `RequireLogin` and `RequirePermission`
- Permission keys in one constants file
- Empty `AdminLayout` and `StoreLayout` with a header and sidebar

**Done when:**
- The app runs on `localhost:5173`
- Login works, and the session survives a page reload
- A guest opening `/admin` is sent to login
- A customer opening an admin page sees "not allowed", not an empty page
- No console errors

## Phase 2: Super Admin panel ⬜

**Goal:** the Super Admin can manage people and roles without touching the database.

**Deliverables:**
- Admin dashboard with counts (users, products, orders)
- **Users page:** list with search and role filter, change a user's role, show role history
- **Roles page:** list roles with their permissions, edit a role's permissions, Super Admin shown as locked
- Sidebar shows only the sections the user's permissions allow

**Done when:**
- Changing a user's role takes effect on that user's next request
- Editing a role's permissions works, and the locked role can't be edited
- Attempting a blocked action shows the server's error message

## Phase 3: Product Admin panel ⬜

**Goal:** Product Admin can run the catalog.

**Deliverables:**
- **Categories page:** list including hidden ones, create, rename, hide and show
- **Products page:** list including hidden ones, search, pagination
- **Product form:** name, description, price, stock, multi-select categories, hide and show
- **Product images:** upload up to 5 at once, set the primary image, delete an image

**Done when:**
- A new product appears on the storefront once it's visible
- Hidden products and categories disappear from the storefront but stay in the admin
- Image changes show immediately

## Phase 4: Blog Admin panel ⬜

**Goal:** Blog Admin can write and publish posts.

**Deliverables:**
- **Blog list:** drafts and published posts, with status badges
- **Blog editor:** title, slug (generated from the title, editable), excerpt, content, cover image
- Save as draft, publish, unpublish
- Cover image upload and removal

**Done when:**
- A draft is not visible on the storefront until published
- Publishing sets the date; unpublishing keeps it

## Phase 5: Storefront and landing page ⬜

**Goal:** a customer can browse the store. The landing page matches the reference design.

**Deliverables:**
- **Landing page:** the home page, built to the reference design (`design.md`)
- **Product listing:** search, pagination, category filter
- **Product detail:** image gallery, price, stock status, add to cart, add to wishlist
- **Blogs:** list and detail pages
- Header with search, cart count, account menu; footer
- Responsive layouts for phones, tablets, and desktops

**Done when:**
- The landing page matches the agreed reference screenshots
- Every page works on a phone-sized screen
- Only published blogs and visible products appear

## Phase 6: Customer account and checkout ⬜

**Goal:** a customer can register, shop, pay, and track orders.

**Deliverables:**
- Register, email OTP verification, login, logout
- Profile page and password change
- Addresses page: add, edit, delete, choose default
- Cart page: quantities, removal, unavailable items marked, totals
- Checkout: choose address, create order, open Razorpay Checkout, confirm payment
- Order history and order detail, with a cancel button for unpaid orders
- Wishlist page

**Done when:**
- A full purchase works end to end in Razorpay test mode
- A payment that fails leaves the order cancelled and the stock released
- The customer sees a clear result after payment, whether it succeeded or not

## Phase 7: Quality pass ⬜

**Goal:** the app is solid enough to show real users.

**Deliverables:**
- Loading skeletons, empty states, and error states on every page
- Accessibility pass: keyboard navigation, focus rings, labels, contrast
- Reduced-motion support for all animations
- SEO basics: page titles, descriptions, Open Graph tags on storefront pages
- Performance pass: image sizes, lazy loading, code splitting for admin
- Smoke tests for the main purchase and admin flows

**Done when:** all of the above are checked, and no page shows a raw error or blank screen.

## Phase 8: Staging deployment ⬜

**Goal:** the app runs on the internet, in test mode.

**Deliverables:**
- Frontend on Vercel
- Backend on Render or Railway
- Hosted MySQL, with every SQL file applied in order
- Product and blog images moved to Cloudinary (the backend's local `uploads/` folder doesn't survive hosting)
- Production settings: cookie `SameSite=None; Secure`, the frontend URL in `CLIENT_URL`, HTTPS everywhere
- Razorpay test webhook pointing to the deployed backend

**Done when:** a full test purchase works on the live staging URLs.

## Phase 9: Go live ⬜

**Goal:** real customers can buy.

**Prerequisites:** Razorpay business account activated (KYC approved). Legal pages are written.

**Deliverables:**
- Razorpay live keys and a live webhook
- One real low-value purchase, refunded afterward
- Custom domain with HTTPS
- Legal pages: privacy policy, terms, refund and cancellation, shipping
- Database backups enabled
- Error logging on the backend

**Done when:** a real purchase completes and appears correctly in the admin panel and in Razorpay.