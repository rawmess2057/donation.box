# Donation.Box Frontend Redesign Plan

## Design Direction: "Generosity in Motion"

Warm, narrative-driven design that treats each donation as a story beat. Scroll-based storytelling, ambient animations, full-screen celebrations on donation.

**Typography**: Plus Jakarta Sans (headings) + Literata (body) via `next/font/google`
**Palette**: Amber #D97706 (primary), Teal #0D9488 (accent), Cream #FFF9F0 (bg light), Charcoal #0C0A09 (bg dark)

---

## Phase 1: Design System Foundation

### Files to Create
| File | Description |
|------|-------------|
| `lib/design-system/tokens.ts` | Design tokens: colors (light/dark), typography, spacing, shadows, radii, animation, breakpoints |
| `lib/design-system/theme.tsx` | `ThemeProvider` context + `useTheme` hook, localStorage persistence, system preference detection |
| `lib/design-system/animations.ts` | Framer Motion variants: fadeInUp, scaleIn, slideIn, staggerChildren, cardHover, springTransition |

### Files to Edit
| File | Changes |
|------|---------|
| `app/globals.css` | Replace hardcoded colors with CSS custom properties; add dark mode classes; import Plus Jakarta Sans + Literata via `@theme`; keep existing float/fadeInUp/shimmer animations; add utility classes for dark mode |
| `app/layout.tsx` | Replace Geist → Plus Jakarta Sans + Literata; wrap with `ThemeProvider`; set metadata title template |

---

## Phase 2a: UI Primitive Components

All new files under `components/ui/`:

| Component | Features |
|-----------|----------|
| `Button.tsx` | Variants: primary, secondary, ghost, success. States: loading spinner, disabled, success check. Ripple effect on click. Framer Motion press animation. |
| `Card.tsx` | Base card with `variant` (default, elevated, bordered, glow). Hover scale. Optional image header section. |
| `Modal.tsx` | Portal-based. Backdrop blur. Framer Motion enter/exit. Focus trap. Esc to close. ARIA attributes. |
| `ProgressBar.tsx` | "Impact River" — animated gradient fill, milestone markers as glowing dots, label + percentage |
| `AnimatedNumber.tsx` | Counter animating from 0 → target using framer-motion `useSpring` |
| `Avatar.tsx` | Identicon-style avatar from Solana address (using gradient hash) |
| `Toast.tsx` | Toast notification system with `ToastProvider` + `useToast` hook. Variants: success, error, info. Auto-dismiss. |

---

## Phase 2b: Campaign Components Rewrite

| File | Changes |
|------|---------|
| `CampaignCard.tsx` | Hover parallax on image; "impact river" progress bar; X donors badge; staggered framer-motion entrance; gradient overlay on hover |
| `CampaignGrid.tsx` | CSS masonry layout; sticky category filter tabs; load-more button instead of pagination; section header with count |
| `DonationPanel.tsx` | Large preset tiles with icons; custom amount with animated SOL→USD conversion; impact preview text; framer-motion amount selection |
| `CampaignDonateClient.tsx` | Add `simulateTransaction` step; integrate toast for tx status (sending/confirmed/failed); wallet switch support |
| `DonationSuccessScreen.tsx` | Full-screen overlay with canvas-confetti; personalized impact card with AnimatedNumber; animated transaction hash; "Share as Story" image generator |
| `ShareButton.tsx` | Preserve existing functionality; restyle with new design system |

---

## Phase 2c: New Bespoke Components

| Component | Description |
|-----------|-------------|
| `ImpactCalculator.tsx` | Slider that converts SOL → impact units (meals, books, trees) based on campaign category. Animated counters. |
| `RealTimeProgressVisualizer.tsx` | Live "impact river" with donor avatar bubbles flowing in, milestone celebration moments |
| `ProjectDiscoveryFeed.tsx` | "Smart Feed" — horizontal scrollable rows: "Trending," "New," "Your Network Supports" |
| `DonationMoment.tsx` | Ripple animation on new feed items — expanding circle + glow + fade |

---

## Phase 3: Page-Level Redesigns

| Page | Changes |
|------|---------|
| `app/page.tsx` | Immersive hero with animated gradient/particle Canvas bg; stats count up on scroll via framer-motion `useInView`; "Live Donation Ticker" sticky bar; narrative lane sections |
| `app/campaign/[id]/page.tsx` | Dark mode toggle; full-width parallax cover image; Literata body for story; sticky donation panel on desktop; "Impact River" progress; live donor feed sidebar; milestone markers |
| `app/explore/page.tsx` | Horizontal scrollable category chips; CSS masonry grid; hover quick-preview on cards; filter bar (goal, urgency, category) |
| `app/impact/page.tsx` | Donation ripple animation on new items; slide-in from top with glow for auto-refresh; type-specific icons |
| `app/dashboard/page.tsx` | Impact infographic (total meals/trees based on SOL raised); donation timeline view; campaign health scorecards |
| `app/create/page.tsx` | Minor polish — new design system tokens applied |

---

## Phase 4: Performance & Accessibility

- Lazy load below-fold content via `next/dynamic`
- Replace `<img>` with `next/image` everywhere; add `preload` prop for hero images
- `prefers-reduced-motion` media query disables all framer-motion animations
- Focus trap in all modals; full keyboard navigation for donation flow
- ARIA: `role="progressbar"`, `aria-valuenow`, `aria-live="polite"` on dynamic counters
- Explicit width/height on images; skeleton placeholders for async content
- Run `@next/bundle-analyzer` to audit bundle

---

## Phase 5: Testing

- `vitest` + `@testing-library/react` + `@testing-library/user-event`
- Test files: Button, ProgressBar, DonationPanel, CampaignCard, ImpactCalculator, Modal, Toast
- Each test: renders correctly, handles user interaction, shows error/empty states

---

## Phase 6: Dependencies

```bash
npm install framer-motion canvas-confetti
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @types/canvas-confetti
```

---

## Risk Notes

1. Next.js 16: `params`/`searchParams` must be `await`ed; `preload` replaces `priority` on Image
2. Keep web3.js v1 — don't migrate to `@solana/kit` mid-redesign
3. Don't touch API routes or Solana provider logic
4. No user auth system — wallet-as-identity stays
5. Testing covers new/modified components only, not retrofit existing
