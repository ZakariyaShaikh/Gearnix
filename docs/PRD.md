# Gearnix: Product Requirements Document

## 1. Overview

Gearnix is an online store for gaming and everyday tech accessories, such as mice, keyboards, headsets, and wired and wireless gear. Shoppers browse products, read blog posts, and buy with Razorpay. Staff manage the catalog, content, and people through role-based admin panels.

## 2. Goals

1. Let customers find and buy products in India, paying in rupees.
2. Let staff manage the store without developer help.
3. Keep payments and stock correct, even when things go wrong.
4. Match the reference store's look and feel, with Gearnix's own brand and content.

## 3. Users and roles

| Role | Who | Can |
|---|---|---|
| Guest | Anyone not logged in | Browse products and blogs, register, log in |
| Customer | Self-registered | Everything a guest can do, plus cart, wishlist, addresses, checkout, orders |
| Product Admin | Assigned by Super Admin | Manage categories and products, including images |
| Blog Admin | Assigned by Super Admin | Manage blog posts, including cover images |
| Super Admin | Created in the database | Everything above, plus manage users, roles, and permissions. Cannot create users from the app |

## 4. Functional requirements

### 4.1 Accounts and authentication

| ID | Requirement |
|---|---|
| AUTH-01 | A visitor can register with username, email, and password |
| AUTH-02 | A new account must verify its email with a one-time code before logging in |
| AUTH-03 | Login returns an access token (1 hour) and sets a refresh cookie (7 days) |
| AUTH-04 | The session is restored on page reload without asking for the password |
| AUTH-05 | Logout ends the current session; "log out everywhere" ends all sessions |
| AUTH-06 | Changing the password ends all other sessions |
| AUTH-07 | A suspended or deleted account loses access on its next request |
| AUTH-08 | Users can request a new verification code |

### 4.2 Profile and account

| ID | Requirement |
|---|---|
| ACC-01 | A user can view and edit their username |
| ACC-02 | A user can change their password, giving the current one |
| ACC-03 | A user can upload a profile image (JPEG, PNG, or WebP, 2 MB) |
| ACC-04 | A user can delete their account. Orders are kept |

### 4.3 Catalog (Product Admin)

| ID | Requirement |
|---|---|
| CAT-01 | Create, rename, hide, and show categories. Categories are not deleted |
| CAT-02 | Create a product with name, description, price in rupees, stock, and one or more categories |
| CAT-03 | Edit a product. Renaming keeps a clear slug |
| CAT-04 | Hide and show products. Products are not deleted |
| CAT-05 | Upload up to five images per product, set one as primary, delete an image |
| CAT-06 | Admin lists show hidden items |

### 4.4 Storefront

| ID | Requirement |
|---|---|
| SF-01 | Landing page matching the reference design |
| SF-02 | Product list: search, category filter, pagination |
| SF-03 | Product detail: gallery, price, stock status, add to cart, add to wishlist |
| SF-04 | Out-of-stock products are shown, and cannot be added to the cart |
| SF-05 | Hidden products are never shown to shoppers |
| SF-06 | Blog list and detail, published posts only |
| SF-07 | The site works on phones, tablets, and desktops |

### 4.5 Blogs (Blog Admin)

| ID | Requirement |
|---|---|
| BLG-01 | Create, edit, save as draft, publish, and unpublish posts |
| BLG-02 | Slug is generated from the title and can be changed |
| BLG-03 | Upload and remove a cover image |
| BLG-04 | Publishing records the date; unpublishing keeps it |

### 4.6 Cart, wishlist, and addresses (Customer)

| ID | Requirement |
|---|---|
| CRT-01 | Add to cart, change quantity (1 to 99), remove |
| CRT-02 | Cart shows the current price, and flags items that are unavailable |
| CRT-03 | Wishlist: add, remove, and see availability |
| CRT-04 | Addresses: add, edit, delete, choose a default. Indian addresses only, with a 10-digit mobile and 6-digit PIN |

### 4.7 Checkout and orders (Customer)

| ID | Requirement |
|---|---|
| CHK-01 | Checkout creates an order from the cart and reserves stock |
| CHK-02 | The customer pays with Razorpay Checkout |
| CHK-03 | The order is marked paid only after the payment is verified |
| CHK-04 | A customer can cancel an unpaid order, which releases the stock |
| CHK-05 | Unpaid orders are cancelled automatically after 30 minutes |
| CHK-06 | Order history and order detail show the saved address, items, and payment status |
| CHK-07 | A payment that arrives for a cancelled order is logged for a refund |

### 4.8 Users and roles (Super Admin)

| ID | Requirement |
|---|---|
| ADM-01 | List users, with search and a role filter |
| ADM-02 | Change a user's role. The change is recorded in history |
| ADM-03 | Nobody can change their own role |
| ADM-04 | The last user who can manage roles cannot be removed from that role |
| ADM-05 | View roles and their permissions |
| ADM-06 | Edit a role's permissions. Super Admin's permissions are locked |

## 5. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | Money is stored and calculated exactly, never with floating-point numbers |
| NFR-02 | Stock and payment changes are transactional |
| NFR-03 | Passwords and refresh tokens are never stored in plain text |
| NFR-04 | Secrets are never sent to the browser |
| NFR-05 | Every protected endpoint checks permissions on the server |
| NFR-06 | Admin list pages load within 1 second for up to 1,000 rows |
| NFR-07 | Storefront pages are responsive from 360px wide upward |
| NFR-08 | Animations respect the user's reduced-motion setting |
| NFR-09 | Forms show errors next to the field and at the top on submit |
| NFR-10 | No page shows a blank screen on error |

## 6. Out of scope (for now)

- Guest carts and merging carts at login
- Shipping rates, tax, discounts, and coupons
- Refunds through the app (refunds are handled in the Razorpay dashboard)
- Order fulfillment: marking shipped or delivered
- Reviews and ratings
- Multiple languages
- Mobile apps

## 7. Success criteria

- A customer can go from landing page to a paid order in under five minutes
- No stock is sold beyond what exists
- Staff can run the catalog and blog without developer help
- Every role sees only the menus it's allowed to use

## 8. Open questions

- Blog content format: plain text with paragraphs, Markdown, or a rich-text editor?
- Admin visual style: neutral shadcn theme, or the store's style?
- Shipping and tax: to be decided before Phase 6