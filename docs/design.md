# Gearnix: Design

Source: reference store screenshots (desktop, home page, product menu, collection menu, blog menu, blog list). Values marked **(est.)** are estimated from the screenshots. Verify them with a color picker or DevTools before Phase 5. Values marked **TODO-DESIGN** must not be guessed.

## 1. Principles

1. **Dark, energetic storefront.** Near-black backgrounds, white text, magenta and violet accents, and large, bold display type.
2. **Match the reference's structure.** Same header, hero, feature strip, promo blocks, and menus. Gearnix's own brand, images, and copy.
3. **Motion with purpose.** Animation guides attention and confirms actions. It never blocks reading or clicking.
4. **Admin uses the same theme.** Dark surfaces, the same accent, animated feedback, and clear tables and forms.
5. **Accessible by default.** Reduced-motion users get the same content without movement.

## 2. Brand

| Element | Specification |
|---|---|
| Wordmark | `brand/logo-wordmark.svg`, white on dark, black on light |
| Mark | `brand/logo-mark.svg`: rounded square with a white G and a gradient diagonal, used as the favicon and small-size icon |
| Header | Mark + wordmark side by side, wordmark about 150px wide on mobile and 190px on desktop |
| Footer | Wordmark centered, about 220px wide |
| Clear space | At least the height of the "G" on all sides |
| Minimum size | Wordmark no smaller than 120px wide (below that, use the mark alone) |

## 3. Typography

### Families

| Role | Family | CSS variable | Weights | Source |
|---|---|---|---|---|
| Display: hero, section titles, menu headings, footer headings, feature titles, blog titles, story heading | Orbitron | `--font-family-primary` | 500, 700, 900 | Google Fonts |
| Default: navigation, body text, buttons, labels, product names, prices, forms, tables | Poppins | `--font-family-default` | 400, 500, 600, 700 | Google Fonts |

Fallback stacks:
- `'Orbitron', system-ui, sans-serif`
- `'Poppins', system-ui, sans-serif`

Load both with `font-display: swap`. In `index.css`, define the two variables on `:root`, and map them in `tailwind.config.js` as `font-primary` and `font-default`.

### Where each family is used

| Element | Family |
|---|---|
| Header navigation (Home, Collections, Products, Pages, Blog) | Poppins, 500 |
| Hero heading | Orbitron, 700 |
| Hero subtitle | Poppins, 400 |
| Hero button | Poppins, 600 |
| Mega menu column headings ("Product Detail") | Orbitron, 700 |
| Mega menu links | Poppins, 400 |
| Feature titles ("Free Shipping") | Orbitron, 700 |
| Feature descriptions | Poppins, 400 |
| "Our Story" heading | Orbitron, 700 |
| Story paragraph and "Read More" | Poppins, 400 and 500 |
| Blog page title ("NEWS") and blog card titles | Orbitron, 700, uppercase |
| Blog sidebar heading ("CATEGORIES") | Orbitron, 700, uppercase |
| Blog sidebar items | Orbitron, 500 |
| Product card name | Poppins, 600 |
| Product card price | Poppins, 700 |
| Footer headings | Orbitron, 700 |
| Footer links, contact details, copyright | Poppins, 400 |
| Newsletter input and "Submit" | Poppins, 400 and 600 |
| Admin headings and page titles | Orbitron, 700 |
| Admin tables, forms, buttons, menus | Poppins |

### Scale (desktop, est.)

| Token | Size | Line height | Family and weight | Used for |
|---|---|---|---|---|
| `display-xl` | 56px | 1.3 | Orbitron 700 | Hero heading |
| `display-lg` | 40px | 1.2 | Orbitron 700 | Section titles |
| `display-md` | 24px | 1.3 | Orbitron 700 | Feature titles, footer headings, menu headings |
| `display-sm` | 18px | 1.3 | Orbitron 500 | Blog sidebar items |
| `body-lg` | 18px | 1.6 | Poppins 400 | Hero subtitle |
| `body-md` | 17px | 1.6 | Poppins 400 | Paragraphs, links, descriptions |
| `body-sm` | 14px | 1.5 | Poppins 400 | Breadcrumbs, captions |
| `label` | 14px | 1.2 | Poppins 600 | Prices, badges, status labels |

### Text treatment

- Orbitron headings use **uppercase** only where the reference does: the blog page title, the blog sidebar heading, and blog card titles
- Other Orbitron headings use title case
- Poppins text on dark backgrounds is white at 85% opacity; on light backgrounds it's near-black
- Letter spacing: 0 for Poppins; Orbitron headings use 0.02em **(est.)**

## 4. Color

All colors are **(est.)**. Verify them before Phase 5.

| Token | Hex (est.) | Used for |
|---|---|---|
| `bg-base` | `#1F1F23` | Page background on dark sections |
| `bg-black` | `#000000` | Header on inner pages (News, product pages) |
| `bg-light` | `#FFFFFF` | Light sections, menu panels |
| `bg-panel` | `#F2F2F2` | Blog sidebar list |
| `bg-sidebar-head` | `#1A1A1A` | Blog sidebar title bar |
| `text-primary` | `#FFFFFF` | Text on dark |
| `text-muted` | `#B5B5BD` | Secondary text on dark |
| `text-dark` | `#111111` | Text on light |
| `accent-magenta` | `#E040C8` | Cart and wishlist badges, icon lines, active states |
| `accent-pink` | `#FF3FA3` | Feature icon lines, hover highlights |
| `accent-violet` | `#A855F7` | Gradient start |
| `accent-blue` | `#2F2AA0` | Story card gradient start |
| `glow-warm` | `#4A3A2E` | Header glow on the home page (top-left) |
| `glow-rose` | `#5A2A3D` | Header glow on the home page (top-right) |
| `border-subtle` | `rgba(255,255,255,0.08)` | Card borders on dark |

### Gradients

| Name | Stops (est.) | Used for |
|---|---|---|
| `grad-cta` | `#A855F7` → `#FF4FA0`, left to right | Primary hero button |
| `grad-story` | `#2F2AA0` → `#8B1FB5` → `#E0137E`, diagonal | "Our Story" card |
| `grad-header-home` | Warm brown to rose glow over `#1F1F23`, top band only | Home page header background |
| `grad-header-purple` | `#3A2A5A` → `#2A2F5A` | Header background while a menu is open |

## 5. Layout

| Token | Value (est.) |
|---|---|
| Container width | About 89% of the viewport, with 94px side margins at 1917px |
| Hero left inset | About 179px (larger than the header inset) |
| Section vertical spacing | About 120px between major sections |
| Grid gutter | 24px |
| Header height, home page | About 116px, including the menu area |
| Header height, inner pages | About 75px |
| Hero height | 100vh (about 860px on the reference screen) |

### Breakpoints

Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Mobile layouts are **TODO-DESIGN** until the mobile screenshot is provided. Until then: stack columns below `md`, and collapse the header navigation into a menu button below `lg`.

## 6. Header and navigation

### Layout (desktop)

- **Left:** logo
- **Center:** Home, Collections ▾, Products ▾, Pages ▾, Blog ▾
- **Right:** search icon, account icon, wishlist icon with badge, cart icon with badge

### Behavior

- **Home page:** transparent header over the hero, with the warm glow behind it
- **Inner pages:** solid black header, about 75px tall
- **Scroll:** header becomes solid after 40px of scroll (300ms transition). **(est.)**
- **Active item:** bold, with a small chevron. Hover adds an underline.
- **Badges:** magenta circle with a white count, top-right of the icon, 16px diameter. Hidden when the count is 0 **(est.: the reference shows 0)**

### Mega menus (Collections, Products)

- Full-width white panel below the header, with four columns
- Column headings in the display face at `display-md`, black
- Links in `body-md`, dark gray, with 16px spacing
- The Products menu ends with a **featured product card**: white rounded card (radius 16px), product image, bold name, price
- Appears with a fade and a 12px downward slide, 200ms. Links stagger 30ms apart

### Simple dropdown (Blog, Pages)

- Compact white panel, right-aligned under the trigger
- Items in `body-md`, dark text, with a light hover background
- Same fade and slide as the mega menu

### Mobile navigation **(TODO-DESIGN)**

Default until the reference is checked: a full-screen dark drawer slides in from the right (300ms). Items stacked, with submenus as accordions.

## 7. Hero (home)

- **Background:** `bg-base`, with the warm and rose glows from the header carried down softly at the top
- **Watermark text:** the product name in large display letters, behind the product image, at about 6% opacity (for example "MOUSE" for the mouse product). Gearnix will use its own category names here
- **Product image:** a transparent cutout of a gaming product, on the right, about 45% of the viewport width. Bottom-aligned, extending to the fold
- **Heading:** `display-xl`, two lines, on the left
- **Subtitle:** `body-lg`, white at 85% opacity, one line
- **Button:** "Shop The Collection" with an arrow. Pill shape (radius fully rounded), `grad-cta` background, white text, height about 64px, horizontal padding about 40px

## 8. Feature strip (below the hero)

Four equal columns on desktop (2 columns on tablet, 1 on mobile).

Each column:
- **Icon:** a dark circle, about 125px diameter, `bg-base` with a soft pink glow behind it (box shadow, `accent-pink` at 25%). The icon inside is a pink line icon, about 56px
- **Title:** `display-md`, white
- **Description:** `body-md`, muted, up to three lines

| Column | Title | Icon |
|---|---|---|
| 1 | Free Shipping | Truck with "FREE" label |
| 2 | Return Policy | Box with circular arrows |
| 3 | Save Money | Piggy bank with a dollar sign |
| 4 | Support 24/7 | Headset |

Gearnix's own copy goes here. Keep the same four topics unless you decide otherwise.

## 9. Promo blocks (below the feature strip)

Two cards, side by side, same height (about 500px), radius about 20px.

### Video card (left, about 57% width)

- A product photo, filling the card, with a dark gradient overlay at the bottom
- **Play button:** white circle, about 84px, with a magenta triangle in the center
- **Hover:** the circle grows to 1.08× (200ms). A pulse ring expands and fades every 2 seconds

### Story card (right, about 43% width)

- Background: `grad-story`
- **Heading:** "Our Story", `display-lg`, white
- **Paragraph:** `body-lg`, white at 90% opacity, four lines
- **Link:** "Read More" with a diagonal arrow, white. **Hover:** the arrow moves 4px diagonally (250ms)

## 10. Scroll-to-top button

- Circle, about 44px, white outline (1.5px), up-chevron centered, bottom-right, 32px from the edges
- Hidden until the user scrolls 400px, then fades in (250ms)
- Click scrolls smoothly to the top

## 11. Product cards

- **Image:** centered on a white or light background, padded, fixed aspect ratio (1:1). Transparent cutouts look best **(est.)**
- **Name:** `body-md` or `display-md`, bold
- **Price:** `label`, bold, with the ₹ symbol
- **Container:** white card, 1px border, radius 16px (light sections); on dark sections, `border-subtle` on `bg-base`
- **Hover:** card lifts 6px and gains a soft magenta glow. Image scales to 1.05. A "Quick add" bar slides up from the bottom of the card. All 400ms, ease-out

## 12. Blog listing ("NEWS")

Light page (white background), with the black header.

- **Page title:** "NEWS", `display-lg`, uppercase, black, centered
- **Breadcrumb:** "Home • News", `body-sm`, centered below the title. The bullet is a small dot
- **Left sidebar (about 25% width):**
  - Title bar: `#1A1A1A`, rounded top corners, with a filter icon and "CATEGORIES" in white `display-md`
  - List panel: `bg-panel`, rounded bottom corners
  - Items: `body-md`, with a small hollow circle bullet. Items in the reference: Headphones, Keyboards, Mouse, Accessories, Gaming Controllers, Wireless Headset, Wireless Keyboard
  - Hover: bullet fills magenta, text shifts 4px right (200ms)
- **Post grid (right, about 70% width):** two columns on desktop
  - **Card:** image on top (about 400px tall, 3:2 crop), rounded top corners, no border
  - **Title:** `display-md`, uppercase, black, below the image
  - **Excerpt and date:** **TODO-DESIGN** (not visible in the screenshot)
  - **Hover:** image scales to 1.06, title turns magenta (300ms)

## 13. Footer

Source: reference footer screenshot, desktop. Estimated values are marked **(est.)**.

### Structure (desktop, top to bottom)

1. **Link columns row:** five columns, same top alignment
2. **Divider:** full container width, 1px, `rgba(255,255,255,0.15)`
3. **Logo block:** centered logo, then copyright line, then social icons
4. **Background:** `#17171A` **(est.)**, text white

### Column layout (desktop, 1917px reference, est.)

| Column | Width (est.) | Content |
|---|---|---|
| Contact us | About 25% | Address, phone, email, social handle |
| Let us help | About 20% | Track My Order, Cancel My Order, Return My Order, Search |
| Our policies | About 22% | Shipping & Delivery, Returns & Cancellations, Terms & Conditions, Privacy Policy |
| My Account | About 15% | Store Location, Order History, Wish List, Gift Cards |
| Newsletters | About 18% | Email input, submit button, payments row |

### Column headings

- Display face (see section 3), `display-md` (24px), white, bold
- Sentence case as shown in the reference ("Contact us", "Let us help", "Our policies", "My Account", "Newsletters")
- Heading to first link: about 40px

### Links

- `body-md` (17px), white at 90% opacity **(est.)**
- Vertical spacing between links: about 24px **(est.)**
- Hover: full white, underline appears from left to right (200ms)
- Focus: 2px magenta ring

### Contact block

- Three or four lines: address, phone, email, social handle
- Same `body-md` styling, no bullets or icons
- **All values are placeholders** until Gearnix provides real details. Do not use the theme's address, phone, or email

### Newsletter block

- **Input:** pill shape, background `#26262C` **(est.)**, height about 60px, placeholder text "Enter your email", white at 60% opacity
- **Submit button:** white pill inside the input's right edge, text in `accent-pink` (`#FF4FA0` **(est.)**), label "Submit", height about 46px
- **Focus:** input border turns magenta (200ms)
- **Success and error:** toast message (section 17). The button shows a check icon for 1 second on success
- **Decision needed:** this needs a backend endpoint to store subscribers. See "Open decisions" below

### Payments row

- Four card badges in a row: Visa, Mastercard, American Express, PayPal
- Each badge: white rounded rectangle about 40px wide and 26px tall, with the logo centered, full color
- Spacing between badges: about 14px
- Label "Payments" above the row, `display-md`

### Divider and bottom block

- **Divider:** full container width, 1px, `rgba(255,255,255,0.15)`, about 80px below the columns
- **Logo:** centered, white, about 220px wide, about 40px below the divider
- **Copyright:** centered, `body-md`, white at 90%. Text: "Copyright © 2026 Gearnix. All Rights Reserved." (replace the year and name with Gearnix's own)
- **Social icons:** centered row of four pink circles, each about 50px in diameter, background `accent-pink` (`#FF4FA0` **(est.)**), white icon, 16px spacing. Order: Facebook, Instagram, X, TikTok. Hover: circle lifts 3px and gains a soft pink shadow (200ms)

### Footer animation

| Element | Animation | Trigger |
|---|---|---|
| Column headings | Fade up 12px, 400ms | Enters viewport, once |
| Link columns | Stagger 60ms between columns | Enters viewport, once |
| Social icons | Pop in (scale 0.8 to 1), stagger 80ms | Enters viewport, once |
| Link hover underline | Left-to-right wipe, 200ms | Hover |
| Social hover | Lift 3px with pink shadow, 200ms | Hover |

---

## 13A. Mobile navigation and footer

Source: reference mobile screenshots (footer and bottom bar). The mobile header and bottom bar are part of the storefront and appear on every page below `md` (768px).

### Mobile header

- **Background:** `bg-black`, height about 56px **(est.)**
- **Left:** hamburger icon (opens the mobile menu drawer), search icon next to it. Both white, about 22px
- **Center:** logo, white, about 150px wide
- **Right:** cart icon with badge (magenta circle, white count, top-right of the icon)
- **Sticky:** stays at the top while scrolling

### Mobile bottom tab bar

A fixed bar at the bottom of the screen, on every storefront page, below `md`.

| Tab | Icon | Label | Destination |
|---|---|---|---|
| Home | House outline | Home | `/` |
| Shopping | Grid of four squares | Shopping | `/products` |
| Wishlist | Heart outline, with badge | Wishlist | `/wishlist` (requires login, otherwise sent to login) |
| Account | Person outline | Account | `/profile` if logged in, otherwise `/login` |

- **Background:** white
- **Height:** about 68px **(est.)**, including the safe area on iOS
- **Icons:** about 24px, dark gray (`#111111`) **(est.)**, active tab in `accent-magenta`
- **Labels:** `label` size (14px), dark gray, below the icon
- **Divider:** 1px light gray line between tabs
- **Wishlist badge:** magenta circle, white count
- **Active state:** icon and label turn magenta. The active indicator slides between tabs (Motion `layoutId`, 250ms)
- **Content padding:** pages add 68px of bottom padding below `md` so the last item isn't hidden

### Mobile footer

Below `md`, the five desktop columns become accordion sections:

- **Headings:** Contact us, Let us help, Our policies, My Account, Newsletters. Display face, white, `display-md`
- **Plus icon:** white, 24px, on the right. Changes to a minus when open
- **Behavior:** tap a heading to open its content. Only one section is open at a time **(est.)**
- **Open animation:** height expands and content fades in, 250ms
- **Separator:** 1px line between sections, `rgba(255,255,255,0.12)`
- **Below the accordions:** the same divider, logo, copyright, and social icons as desktop, with the social circles at about 48px
- **Payments row:** shown inside the Newsletters section, as on desktop

### Mobile footer spacing

- Section padding: 20px left and right
- Vertical spacing between accordion headings: about 40px
- Bottom padding above the bottom tab bar: 68px

### Mobile menu drawer

Opened by the hamburger icon. Full-height dark drawer, slides in from the left (300ms). Top section lists the main navigation, with accordions for Collections, Products, Pages, and Blog. Bottom section holds the account and wishlist links.

**Note:** the drawer's exact layout is still **TODO-DESIGN**. Only the bottom tab bar and footer were in the screenshots.

---

## Open decisions for the footer

These affect the backend and content. Please decide before Phase 5.

1. **Newsletter:** should subscribers be stored in the database? If yes, we need a small backend module (one table, one endpoint, email validation). If no, the form can be hidden for now.
2. **Gift Cards:** the reference lists a "Gift Cards" link, but gift cards aren't in our scope. Remove it, or keep it as a page that says "Coming soon"?
3. **Store Location:** we need your real address for this page. Do you have one?
4. **Social links:** send the real Facebook, Instagram, X, and TikTok URLs (or tell me to remove any you don't use).
5. **Contact details:** send the store's phone number, email, and address for the contact block.

---

## Still outstanding from earlier

- The heading font name (the display face in section 3)
- The logo SVG file
- Feature icon SVGs (section 15)
- Optional screen recordings for the hero and product hover timing (section 17)

## 14. Buttons

| Variant | Background | Text | Shape | Hover |
|---|---|---|---|---|
| Primary (hero, CTAs) | `grad-cta` | White | Pill | Gradient shifts (background-position, 400ms); arrow moves 4px |
| Secondary | Transparent | White | Pill, 1.5px white border | Fills white, text black (250ms) |
| Dark (menus, admin) | `#1A1A1A` | White | Radius 8px | Background lightens to `#2A2A2F` |
| Destructive | `#B91C1C` | White | Radius 8px | Darkens 10% |

Height: 48px default, 64px hero. Focus: 2px magenta ring with 2px offset.

## 15. Icons

Library: **react-icons** for every icon Gearnix owns. Don't mix in other icon libraries.

Note: shadcn/ui components use Lucide internally (for example the close button on dialogs and the chevrons in select menus). Keep those as they are. Everything Gearnix builds, including storefront, admin, and footer icons, uses react-icons.

### Icon sets

| Use | Set | Icons |
|---|---|---|
| Storefront UI (thin outline, matches the reference) | `react-icons/fi` (Feather) | `FiSearch`, `FiUser`, `FiHeart`, `FiShoppingCart`, `FiMenu`, `FiX`, `FiChevronDown`, `FiChevronUp`, `FiArrowRight`, `FiArrowUpRight`, `FiPlus`, `FiMinus`, `FiCheck`, `FiHome`, `FiGrid`, `FiPlay` |
| Feature strip | `react-icons/fi` and `react-icons/pi` | `FiTruck` (shipping), `FiRefreshCw` (returns), `PiPiggyBank` (savings), `FiHeadphones` (support) |
| Social | `react-icons/fa6` | `FaFacebookF`, `FaInstagram`, `FaXTwitter`, `FaTiktok` |
| Payment badges | `react-icons/fa6` | `FaCcVisa`, `FaCcMastercard`, `FaCcAmex`, `FaCcPaypal` |
| Admin | `react-icons/fi` | Same as storefront, plus `FiEdit`, `FiTrash2`, `FiEye`, `FiEyeOff`, `FiUpload`, `FiStar`, `FiLogOut` |

### Icon rules

- **Size:** 22px in the header, 24px in the mobile tab bar, 56px in the feature strip, 16px inside buttons and badges
- **Stroke:** Feather's default is fine. Use `strokeWidth={1.75}` for the feature strip icons
- **Color:** `currentColor`, so the icon follows the text color around it
- **Feature icons:** pink (`accent-pink`) on a dark circle with a soft glow
- **Social icons:** white on pink circles
- **Payment badges:** full color, on white rounded rectangles
- **Animation:** icons don't animate on their own. Only their containers do (see section 17)

### Before importing

Check each icon name in the react-icons documentation, because names can differ slightly between sets. If a name is missing, choose the closest icon in the same set.

## 16. Imagery

- Product images are transparent cutouts on the storefront
- Blog and promo images: rounded corners (12px for cards, 20px for large promo cards)
- Hover effects: scale (1.05 to 1.06). No color filter
- All images have alt text. Decorative images use `alt=""`
- Use `loading="lazy"` for everything below the fold

## 17. Motion

### Library roles

| Library | Use |
|---|---|
| **GSAP** (with ScrollTrigger) | Hero entrance, scroll-triggered reveals, counters, parallax |
| **Motion** (`motion/react`) | Route transitions, layout animations (sidebar indicator, active tabs), drawer and dialog animations |
| **CSS transitions** (Tailwind) | Simple hover states: color, background, shadow |

Rule: use CSS for hover, Motion for component state changes, GSAP for timelines and scroll. Don't use two libraries for the same element.

### Durations and easing

| Token | Duration | Easing |
|---|---|---|
| `fast` | 150ms | ease-out |
| `base` | 250ms | ease-out |
| `slow` | 400ms | ease-out |
| `reveal` | 800ms | power3.out (GSAP) |
| `ambient` | 20s, loop | linear |

### Storefront animations

| Element | Animation | Trigger |
|---|---|---|
| Hero heading | Each line slides up 40px and fades in, stagger 80ms | Page load, 900ms |
| Hero subtitle | Fades in, 600ms, after the heading | Page load |
| Hero button | Fades and slides up 20px, 600ms, after the subtitle | Page load |
| Hero product image | Gentle float: up and down 8px over 4 seconds, looping. Slight upward drift on scroll (parallax 0.1×) | Load and scroll |
| Hero watermark text | Slow horizontal drift, 20 seconds, looping. Fades from 0 to 6% opacity | Load |
| Header background | Transparent to solid after 40px of scroll | Scroll |
| Nav dropdowns | Fade and slide 12px down, 200ms, links stagger 30ms | Hover and click |
| Feature icons | Circle scales from 0.8 to 1 with glow, stagger 120ms | Enters viewport (once) |
| Feature titles and text | Fade up 16px, 500ms, after the icon | Enters viewport (once) |
| Play button | Pulse ring expands and fades every 2 seconds | Always |
| Play button hover | Scales to 1.08, 200ms | Hover |
| Story card gradient | Background-position drifts slowly, 8 seconds, looping | Always |
| Story text | Fades up, 600ms | Enters viewport (once) |
| Product card | Lifts 6px, magenta glow, image scale 1.05, quick-add bar slides up | Hover |
| Blog card | Image scale 1.06, title turns magenta | Hover |
| Blog sidebar item | Bullet fills magenta, text shifts 4px right | Hover |
| Scroll-to-top | Fades in after 400px | Scroll |
| Route change | Fade out 150ms, fade in 250ms | Navigation |
| Cart drawer | Slides in from the right, 350ms, backdrop blur | Click |
| Mobile menu | Slides in from the right, 300ms | Tap |
| Toasts | Slide in from the top right, 250ms | Action result |

### Admin animations (fully animated, same theme)

| Element | Animation |
|---|---|
| Dashboard counters | Count up from 0, 1200ms, GSAP |
| Dashboard charts | Bars grow from the baseline, 600ms, staggered |
| Sidebar active item | Indicator slides between items (Motion `layoutId`) |
| Sidebar collapse | Width animates, labels fade, 250ms |
| Table rows | Fade in, stagger 30ms, on load and on filter change |
| Table row hover | Background tint, 150ms |
| Dialogs and sheets | Scale 0.96 to 1 with fade, 200ms (Radix + Motion) |
| Confirm dialogs | Destructive button shakes once on open |
| Form save | Button shows a check icon for 1 second after success |
| Status badges | Pulse once when the status changes |
| Role change | Badge animates from the old role to the new one |
| Loading | Skeleton shimmer, 1.5 seconds, looping |
| Empty states | Icon floats gently |
| Rich-text toolbar | Buttons lift 2px on hover, active button shows the magenta underline |

## 18. Reduced motion

When `prefers-reduced-motion` is set:
- Disable: hero float, watermark drift, story gradient drift, play button pulse, parallax, staggered reveals
- Keep: opacity fades, color changes, and hover states (shortened to 100ms)
- Entrance animations jump straight to their final state

## 19. Rich-text editor (blog content)

- **Editor:** Tiptap, with the toolbar styled to the admin theme
- **Toolbar:** bold, italic, underline, headings (H2, H3), lists, quote, link, image, undo, redo
- **Content:** saved as HTML, sanitized before saving and before rendering
- **Preview:** shows the post in the storefront's blog detail style
- **Editor surface:** `bg-base` with `border-subtle`, text white, 17px, generous line height (1.8)

## 20. Admin design

- **Theme:** dark surfaces (`bg-base`), cards in `#26262C` with `border-subtle`, the same magenta and violet accents as the storefront
- **Typography:** the same families as the storefront. Table text in `body-sm`, headings in `display-md`
- **Sidebar:** left, dark, with icons and labels. Collapses to icons on tablet, and becomes a sheet on phones
- **Tables:** search, filters, and pagination on top. Row actions in a menu on the right
- **Status colors:** active and published green `#22C55E`, hidden and draft gray `#71717A`, paid violet `#A855F7`, cancelled red `#EF4444`, pending amber `#F59E0B` **(est.)**
- **Forms:** labels above inputs, 44px inputs, radius 8px, focus ring in magenta

## 21. States every screen handles

| State | What the user sees |
|---|---|
| Loading | Skeleton with the final layout |
| Empty | Short message, one action, icon floats |
| Error | Plain-language server message, with a retry button |
| Forbidden | "You don't have access to this page" |
| Not found | Page with a link back to the store |

## 22. Accessibility

- Body text contrast at least 4.5:1, large text 3:1. Check every color on `bg-base` and on the gradients
- Visible focus ring on every interactive element: 2px magenta, 2px offset
- Every image has alt text. Decorative images use `alt=""`
- Forms have visible labels
- Touch targets at least 44×44px on mobile
- Reduced-motion support everywhere (see section 18)

## 23. Copy and formatting

- Money: `₹2,499.00`, Indian digit grouping (`₹1,24,999.00`)
- Dates: `23 Oct 2026`
- Buttons use verbs: "Shop The Collection", "Add to cart", "Save changes", "Publish"
- Error messages come from the server when it provides one