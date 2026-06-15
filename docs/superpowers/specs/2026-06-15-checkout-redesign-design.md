# Checkout Redesign — Design Spec

**Date:** 2026-06-15
**Pages in scope:** CheckoutPage, ThankYouPage, ProductPage
**Reference:** Meridian Botanicals screenshot (attached in conversation)

---

## Summary

Redesign the storefront pages (Checkout, Thank You, Product) to match a high-converting supplement checkout reference design. The architecture (React 19 + Vite + Cloudflare Worker + existing component structure) is preserved. All changes are frontend-only.

---

## Decisions

| Topic | Decision |
|---|---|
| Bundle selector | **Yes — included.** 3 tiers (1/2/3 bottles). AMOUNT_MINOR becomes dynamic based on selection. |
| Subscribe & save tab | Visual toggle only (non-functional in this iteration). |
| Left column content | Full social proof: product hero, bundle selector, guarantee card, reviews + 3 testimonials, ingredients panel. |
| Color palette | Forest green `#1a3028`, amber `#c8620a`, cream `#f5f0e8` (see CSS tokens section). |
| Footer | White background with thin `#e4ddd2` top border. |
| ThankYouPage / ProductPage | Inherit same chrome (announcement bar, header, footer). Layout structure preserved; colors updated. |

---

## Color Tokens (`src/index.css`)

Replace the `/* === BRAND THEME === */` block with:

```css
/* === BRAND THEME === */
--brand:                 #1a3028;   /* forest green — primary */
--brand-foreground:      #ffffff;
--brand-accent:          #3a6a4a;   /* medium green — trust badges, shipping tags */
--brand-muted:           #a8cdb8;   /* pale green — ingredients text, announcement bar text */

--page-bg:               #f5f0e8;   /* warm cream */
--card-bg:               #ffffff;
--card-border:           #e0d9cc;

--cta-bg:                #c8620a;   /* amber — CTA button, urgency banner, MOST CHOSEN badge */
--cta-fg:                #ffffff;
--cta-hover:             #b55508;

--save-badge-bg:         #e8f5ee;
--save-badge-fg:         #2a7a4a;

--star-color:            #e8a020;   /* gold — star ratings */

/* Pay button overrides */
--pay-cta-from:          #c8620a;
--pay-cta-to:            #a84e08;
--pay-cta-hover-from:    #b55508;
--pay-cta-hover-to:      #963f05;
--pay-cta-foreground:    #ffffff;
```

---

## New Components

### `src/components/site/AnnouncementBar.tsx`
Top-most bar across all storefront pages. Dark green background. Shows:
- Live viewer count (static number, e.g. "11 others are viewing")
- "Free U.S. shipping on every order"
- "3rd-party tested"
- "Reserved for: {timer}" — uses `CheckoutTimer` value via prop or context

Props: `reservedTimer: string` (MM:SS format, passed down from ShopLayout)

### `src/components/site/UrgencyBanner.tsx`
Amber bar below AnnouncementBar. Shows:
- `"HURRY — Order in the next {timer} to guarantee your 2 FREE bottles with the 3-bottle bundle."`

Props: `timer: string`

### `src/components/checkout/ProductHeroCard.tsx`
White card in left column. Contains:
- Product image (`/public/product-image.jpeg`)
- "STEP 1 OF 1 · BUILD YOUR ORDER" step label
- Product name (large, with italic variant like "Daily Greens *Complex*")
- Short description (2 sentences)
- Trust pills: ✓ NSF Certified · ✓ Non-GMO · ✓ Vegan · ✓ Made in Oregon

All copy lives inline in this file (per project convention).

### `src/components/checkout/BundleSelector.tsx`
Contains the subscribe/one-time toggle and the 3 bundle cards. Manages its own `selectedBundle` state and calls `onChange(bundle)` on the parent.

```typescript
export type Bundle = {
  id: 'one-bottle' | 'two-bottle' | 'three-bottle';
  bottleCount: number;
  supplyLabel: string;           // "90-day supply + 2 free"
  freeBonusBottles: number;      // 2 for three-bottle, 0 otherwise
  pricePerBottle: number;        // display price per bottle (dollars)
  totalAmountMinor: number;      // charge in cents (used as AMOUNT_MINOR)
  originalAmountMinor: number;   // for strikethrough display
  savingsMinor?: number;         // savings amount in cents
  isMostChosen?: boolean;
  mostChosenPercent?: number;
};

export const BUNDLES: Bundle[] = [ /* defined inline */ ];
```

Default selection: three-bottle bundle (`isMostChosen: true`).

Subscribe/save tab is rendered but clicking it does nothing (shows a "coming soon" toast or is simply non-interactive). Mark with a `// TODO: subscription flow` comment.

### `src/components/checkout/GuaranteeCard.tsx`
White card with amber circular badge, "The Empty-Bottle Promise" label, italic headline, description copy, and two bullet points (✓ Refunds in 3 business days · ✓ Keep any free gifts). All copy inline.

### `src/components/checkout/ReviewsSection.tsx`
White card with star rating header (4.86 · 12,408 reviews · "Verified by Stamped") and 3 testimonial tiles in a 3-column grid. All testimonial copy inline.

### `src/components/checkout/IngredientsPanel.tsx`
Dark green card. Shows "What's Inside" / "32 Ingredients" header row and a 3-column grid of ingredient names with leaf prefix. "+ 20 more — full lab panel on the product page." footer. All content inline.

### `src/components/checkout/SecurityBadges.tsx`
4-column grid of small badge tiles below the CTA: SSL 256, PCI Compliant, Verified Since 19, Privacy No Resale. Used inside `OrderSummaryCard`.

---

## Modified Components

### `src/components/site/SiteHeader.tsx`
New layout:
- Left: circular logo icon (dark green) + brand name + "EST. 20XX" sub-label
- Center: nav links (Science · Ingredients · Reviews · Guarantee)
- Right: "🔒 Secure checkout" text

Remove `CheckoutTimer` from header (timer is now in `AnnouncementBar`).

### `src/components/site/SiteFooter.tsx`
- Background: `#ffffff`, border-top: `1px solid #e4ddd2`
- Three sections: copyright · nav links (Privacy · Terms · Refunds · Contact) · "🔒 Secure checkout"

### `src/components/checkout/OrderSummaryCard.tsx`
Restructured to show inside the right-column form card (no longer a standalone sidebar card):
- Order line items (product name + quantity driven by selected bundle)
- Shipping: FREE
- Total Today (large, bold)
- CTA button: amber background, `"🔒 RUSH MY ORDER — $XX.XX →"` with live price from selected bundle
- `SecurityBadges` below the button
- Terms text at bottom

Receives `selectedBundle: Bundle` as a prop (passed from `CheckoutPage`).

### `src/pages/CheckoutPage.tsx`
New layout structure:
```
<AnnouncementBar> (moved to ShopLayout)
<UrgencyBanner>  (moved to ShopLayout)

<main data-page="checkout" className="bg-[#f5f0e8]">
  <div className="max-w-[1100px] mx-auto px-4 py-6 grid grid-cols-[1.65fr_1fr] gap-5">

    {/* LEFT */}
    <div>
      <ProductHeroCard />
      <BundleSelector value={selectedBundle} onChange={setSelectedBundle} />
      <GuaranteeCard />
      <ReviewsSection />
      <IngredientsPanel />
    </div>

    {/* RIGHT — form card with dark green header */}
    <div className="sticky top-6">
      <div className="bg-white rounded-xl overflow-hidden">
        {/* "SAFE & SECURE ORDER FORM" dark green header — inline JSX, not a separate component */}
        <form onSubmit={handleSubmit}>
          <section>1 Contact — CustomerInfo</section>
          <section>2 Shipping — ShippingInfo</section>
          <section>3 Payment — PaymentInfo</section>
          <OrderSummaryCard selectedBundle={selectedBundle} payDisabled={...} />
        </form>
      </div>
    </div>

  </div>
</main>
```

`selectedBundle` state replaces the hardcoded `AMOUNT_MINOR`. The `pay()` call uses `selectedBundle.totalAmountMinor`.

`CheckoutHeader` component is **removed** (replaced by the new form card header).

### `src/layouts/ShopLayout.tsx`
Add `AnnouncementBar` and `UrgencyBanner` above the `SiteHeader`. `CheckoutTimer` logic lifts here: ShopLayout owns the countdown state and passes the formatted `MM:SS` string as `timer` to both `AnnouncementBar` and `UrgencyBanner`. `CheckoutTimer` is no longer rendered inside `SiteHeader`.

---

## ThankYouPage

No structural changes. Apply color token updates (green header accent, amber CTA on upsell button). The upsell banner button becomes amber. Page background becomes `#f5f0e8`.

---

## ProductPage

Apply same chrome (announcement bar + urgency banner via ShopLayout, new header/footer). Product content section uses cream background. CTA button becomes amber. No structural changes to the product content components.

---

## What Does NOT Change

- Worker code (`worker/`)
- All form input logic (`CustomerInfo`, `ShippingInfo`, `PaymentInfo`)
- `useCheckoutPayment`, `useThankYouPayment`, `useConvesioPayCheckout`
- Dashboard pages (`OrderPage`, `UsersPage`, `DashboardLayout`)
- `PaymentStatusDialog` behavior
- Route structure
- All `data-*` semantic markers (preserved per AGENTS.md)

---

## File Change Summary

| File | Action |
|---|---|
| `src/index.css` | Update brand CSS tokens |
| `src/layouts/ShopLayout.tsx` | Add AnnouncementBar + UrgencyBanner, lift timer state |
| `src/components/site/AnnouncementBar.tsx` | **New** |
| `src/components/site/UrgencyBanner.tsx` | **New** |
| `src/components/site/SiteHeader.tsx` | Redesign |
| `src/components/site/SiteFooter.tsx` | Redesign (white) |
| `src/components/checkout/ProductHeroCard.tsx` | **New** |
| `src/components/checkout/BundleSelector.tsx` | **New** (includes Bundle type + BUNDLES constant) |
| `src/components/checkout/GuaranteeCard.tsx` | **New** |
| `src/components/checkout/ReviewsSection.tsx` | **New** |
| `src/components/checkout/IngredientsPanel.tsx` | **New** |
| `src/components/checkout/SecurityBadges.tsx` | **New** |
| `src/components/checkout/OrderSummaryCard.tsx` | Update for dynamic bundle + amber CTA + SecurityBadges |
| `src/components/checkout/CheckoutHeader.tsx` | **Delete** (replaced by form card header inline) |
| `src/pages/CheckoutPage.tsx` | New layout, bundle state, remove AMOUNT_MINOR constant |
| `src/pages/ThankYouPage.tsx` | Color token updates only |
| `src/pages/ProductPage.tsx` | Color token + chrome updates |
