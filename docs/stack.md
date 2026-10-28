# Gearnix: Stack

## Frontend

| Library | Used for |
|---|---|
| Vite | Development server and production build |
| React | UI components |
| React Router | Page routes, route guards |
| Tailwind CSS | Utility-first styling and design tokens |
| shadcn/ui (on Radix UI) | Accessible base components: buttons, dialogs, menus, tables, forms |
| GSAP | Entrance, scroll, and hero animations |
| Lucide React | Icons |
| TanStack Query | Server data: caching, loading and error state, refetching |
| React Hook Form | Form state and submission |
| Zod | Form validation rules, shared with the same checks as the backend |
| Sonner | Toast notifications |
| date-fns | Date formatting |
| Razorpay Checkout.js | Loaded from `checkout.razorpay.com` to take the payment |


Styling rule: Tailwind classes first. Plain CSS only for things Tailwind can't express, such as keyframes that GSAP doesn't handle.

## Backend

| Library | Used for |
|---|---|
| Node.js | Runtime |
| Express | HTTP server and routing |
| mysql2 | MySQL driver, with stored procedure calls |
| jsonwebtoken | Access tokens |
| bcryptjs | Password hashing |
| cookie-parser | Reads the refresh cookie |
| cors | Allows the frontend origin, with credentials |
| helmet | Security headers |
| multer | Image upload parsing |
| razorpay | Razorpay API: create orders, fetch payments |
| node-cron | Scheduled job for stale orders |
| nodemailer | Sends OTP emails |
| dotenv | Loads `.env` |

Node's built-in `crypto` module handles token generation, SHA-256 hashing, HMAC signatures, and constant-time comparison.

## Database

| Item | Choice |
|---|---|
| Engine | MySQL 8 |
| Money | `DECIMAL(10,2)` in rupees, `INT` in paise for payments |
| Logic | Stored procedures for data changes, transactions, and locks |
| Hosting | A managed MySQL provider, such as Aiven or TiDB Cloud (Phase 8) |

## Tooling

| Tool | Used for |
|---|---|
| Git and GitHub | Source control |
| VS Code | Editor |
| GitHub Copilot | Code generation, following these docs |
| Postman | API testing |
| MySQL Workbench | Database checks and test data |
| ngrok | Public HTTPS URL for Razorpay webhook tests |

## Hosting (Phase 8 onward)

| Part | Service | Why |
|---|---|---|
| Frontend | Vercel | Free, fast static hosting for Vite builds |
| Backend | Render or Railway | Long-running Node process, which the cron job needs |
| Database | Aiven or TiDB Cloud | Managed MySQL |
| Images | Cloudinary | Persistent storage and resizing |
| Payments | Razorpay | Test mode first, then live after KYC |

## Not used, on purpose

| Technology | Reason |
|---|---|
| Next.js | Chosen against: the app is a client-side dashboard and store, and the backend is separate |
| Plain CSS only | Tailwind and shadcn/ui give consistent, maintainable styling |
| Redux | TanStack Query and React context cover the app's state needs |
| An ORM | The data layer is stored procedures, by design |
| `localStorage` for tokens | The refresh token is an httpOnly cookie; the access token stays in memory |

## Environment variables

See `architecture.md` section 12 for the full list.