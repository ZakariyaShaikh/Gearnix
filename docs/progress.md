# Gearnix: Progress

Last updated: 27 October 2026

## Backend

| Area | Status | Notes |
|---|---|---|
| Database foundation | ✅ | All tables, indexes, and constraints |
| Registration, OTP, login | ✅ | |
| Sessions: refresh, logout, logout-all | ✅ | Rotation and reuse protection tested |
| Permissions | ✅ | Checked against the database per request |
| User profile, password, image, delete | ✅ | |
| `GET /api/users/me` | ✅ | Returns permission keys |
| Role management | ✅ | Role change with history, role permissions |
| Categories | ✅ | Create, list, update |
| Products | ✅ | Create, list, detail, update, images, hide and show |
| Blogs | ✅ | List, detail, create, update, cover image |
| Cart | ✅ | Add, update, remove, view |
| Wishlist | ✅ | Add, remove, view |
| Addresses | ✅ | Add, edit, delete, default |
| Checkout and payment | ✅ | Checkout, Razorpay order, verification |
| Order history and cancel | ✅ | List, detail, cancel unpaid |
| Webhook | ✅ code · 🔄 real test | Signature check tested; real Razorpay event pending ngrok |
| Stale order cleanup | ✅ | Procedure tested; scheduled job written |
| Admin order management | ⬜ | Not started |
| Refunds | ⬜ | Logged only |
| Product and category delete | ⬜ | Intentionally hide only |
| Cloud image storage | ⬜ | Needed for Phase 8 |

## Frontend

| Phase | Status | Notes |
|---|---|---|
| 1. Foundation | 🔄 Partial | Tasks 1–10 are complete. Login status handling was fixed and a valid test-user login passed (R-277–R-283); sign-in with the supplied admin credentials remains unverified because both candidates were rejected (R-285). |
| 2. Super Admin panel | 🔄 Partial | Dashboard frontend exists with user/product counts; the all-orders/admin aggregate remains blocked (R-261). |
| 3. Product Admin panel | 🔄 Blocked | Tasks 18–20 implemented in the frontend. Full editing for hidden products is limited because the backend detail route omits hidden products. |
| 4. Blog Admin panel | 🔄 Partial | Tasks 21–24 implemented; authenticated admin API actions were not live-verified (R-262). |
| 5. Storefront and landing | 🔄 Partial | Tasks 25–30 implemented. Public blog/product images now allow cross-origin display; the product detail API still references a missing `t-3.jpg` file (R-250, R-318–R-322). |
| 6. Customer account and checkout | 🔄 Partial | Initial profile page and logout are implemented; remaining account and checkout work is pending. |
| 7. Quality pass | ⬜ |
| 8. Staging deployment | ⬜ |
| 9. Go live | ⬜ |

### Phase 1 task status

| Task | Status | Decisions needed |
|---|---|---|
| 1. Vite, React, Tailwind, and architecture folder structure | ✅ Done | None |
| 2. UI and data libraries; shadcn/ui base components | ✅ Done | None |
| 3. Google Fonts and Tailwind font family utilities | ✅ Done | None |
| 4. Design tokens in CSS and Tailwind | ✅ Done | None |
| 5. Brand SVGs and Logo component | ✅ Done | None |
| 6. Site details and permission constants | ✅ Done | Newsletter, Gift Cards, address, phone, email, and social links remain pending user details/decisions. |
| 7. API client with token refresh handling | ✅ Done | `VITE_API_URL` must be configured by the environment. |
| 8. AuthContext with session restore, login, logout, and permission checks | ✅ Done | None |
| 9. RequireLogin and RequirePermission guards | ✅ Done | None |
| 10. Placeholder routes and store/admin layout shells | ✅ Done | None |
| 11. Functional Login page | 🔄 Partial | Valid test-user login and refresh passed after the backend status fix (R-277–R-283). The supplied admin credentials were rejected (R-285), so valid admin sign-in remains unverified. |

Each completed task must have matching entries in docs/report.md before the task is marked done.

### Frontend task breakdown: Tasks 11–20

| Task | Scope | Status | Decisions needed |
|---|---|---|---|
| 11. Functional Login page | Sign in, display server errors, and redirect by safe return path or documented permission | 🔄 Partial | Valid test-user login and refresh passed after the backend status fix (R-277–R-283); invalid-credential feedback and session switching are verified in R-312. The supplied admin credentials were rejected (R-285), so valid admin sign-in remains unverified. |
| 12. Super Admin dashboard | Counts for users, products, and orders | 🔄 Partial | Dashboard frontend exists (R-190); all-orders count remains blocked because there is no admin-wide aggregate endpoint (R-187, R-193, R-261). |
| 13. Users list | Search and role filter | ✅ Done | API verification needs a valid admin login. |
| 14. User role change and history | Change role and show role history | 🔄 Blocked (partial) | Role changes use the existing endpoint. Backend has no history-read route/controller. |
| 15. Roles list | Show roles, permissions, and user counts | ✅ Done | API verification needs a valid admin login. |
| 16. Role permission editor | Save permissions and represent the locked role | ✅ Done | API verification needs a valid admin login. |
| 17. Permission-aware admin sidebar | Show only permitted sections | ✅ Done | Browser check passed with mocked permission sets. |
| 18. Category management | List, create, rename, hide, and show categories | ✅ Done | Existing backend intentionally supports hide/show rather than delete. |
| 19. Product list | Include hidden products, search, and pagination | ✅ Done | API verification needs a valid admin login. |
| 20. Product editor and images | Create/update products, categories, visibility, image upload, primary selection, and deletion | 🔄 Blocked (partial) | Existing hidden product details/images are unavailable from the backend detail route; reveal before full editing. Product deletion is hide/show only. |

Task 12–20 UI pages were browser-smoke-tested against mocked API responses. The supplied admin login was attempted against the local backend but was rejected with a server error; credentials were not saved or added to the repository. Final `npm run build` and `npm run lint` both pass.

### Frontend task breakdown: Tasks 21–30

| Task | Scope | Status | Decisions needed |
|---|---|---|---|
| 21. Blog API helpers | Public/admin list and detail, create/update, cover helpers | ✅ Done | Shared `src/api/client.js` only |
| 22. Admin blog list | Draft/published states, search, pagination, publish controls | 🔄 Partial | Admin API flow has not been verified against a live authenticated backend (R-257, R-262). |
| 23. Blog editor | Title, generated/editable slug, excerpt, rich content, draft/publish | 🔄 Partial | Save/publish flows have not been verified against a live authenticated backend (R-257, R-262). |
| 24. Blog cover | Upload and removal with documented file constraints | 🔄 Partial | Upload/removal flows have not been verified against a live authenticated backend (R-257, R-262). |
| 25. Storefront landing page | Hero, features, promos, product and story sections | ✅ Done | Reference screenshots were not supplied; follows `docs/design.md` |
| 26. Product listing | Search, category filter, pagination | ✅ Done | None |
| 27. Product detail | Gallery, price, stock, add-to-cart, wishlist | 🔄 Partial | Public upload images now use `Cross-Origin-Resource-Policy: cross-origin` (R-318–R-322); the referenced `/uploads/product-images/t-3.jpg` file is still missing and returns 404 (R-250). |
| 28. Public blog pages | Published list and sanitized detail | ✅ Done | Blog excerpt/date styling remains TODO-DESIGN |
| 29. Storefront header/footer | Search, cart/wishlist badges, footer, demo newsletter | ✅ Done | Newsletter is demo-only; real contact/social details remain unset |
| 30. Responsive and smoke-test pass | Responsive layouts and storefront browser checks | ✅ Done | Product detail still references a missing image file (R-250); public image CORP blocking is fixed (R-318–R-322); mobile drawer design remains TODO-DESIGN (R-249). |

Tasks 21–30 are documented in `docs/report.md` before this progress update. `npm run lint` and `npm run build` pass. Browser checks confirmed the public listing renders against the local API, blog HTML sanitization, mobile navigation, and no horizontal overflow at 390px. The authenticated blog admin flow was not verified against the backend because no valid local admin session was available. Public blog/product image CORP blocking was fixed in R-318–R-322. The product detail's `/uploads/product-images/t-3.jpg` reference remains missing (R-250), and the mobile drawer design remains TODO-DESIGN (R-249). Task 31 was not started.

## Pending from the user

- [ ] Reference store screenshots for `design.md` (desktop, mobile, product page, cart, footer)
- [ ] Decision: blog content format
- [ ] Decision: admin visual style
- [ ] Install ngrok and create the Razorpay test webhook
- [ ] Razorpay business KYC (needed before Phase 9)
- [ ] GitHub repository created and shared

## Known technical debt

- `src/services/auth.service.js` has an unused `findUserProfileServices` that references an unimported `findUserProfile`. Delete it.
- Some newer controllers respond inline, while auth uses `next(error)`. Align them when the shared error handler is reviewed.
- Local `uploads/` storage doesn't survive hosting. Move to Cloudinary in Phase 8.
- The Postman webhook signature test was skipped. Run it when ngrok is set up.
- Refund handling is a manual process until a refund endpoint exists.

## Decisions log

| Date | Decision |
|---|---|
| 27 Oct 2026 | Frontend: Vite, React, Tailwind, shadcn/ui; no Next.js |
| 27 Oct 2026 | Auth: 1 hour access token in memory, 7 day refresh cookie, rotation with reuse protection |
| 27 Oct 2026 | Build order: Super Admin, Product Admin, Blog Admin, storefront and landing |
| 27 Oct 2026 | Storefront matches the reference store's layout and feel; content and brand are Gearnix's own |