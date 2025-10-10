# Phase 1: Nepali Palette, Accessibility, and Launch Readiness

This PR implements the Phase 1 redesign to simplify the site, set Nepali as the default vibe, and prepare the frontend for launch.

## Summary
- Adopted Nepali-inspired palette
  - Primary (Maroon): #8B1D1D
  - Accent (Saffron): #FF9933
  - Surface (Cream): #FAF3E7
- Prioritized Devanagari fonts (Noto Sans/Serif Devanagari)
- Improved accessibility: strong focus-visible rings, better contrast
- Simplified navigation and Nepali-first UX
- Updated meta/theme color and mask-icon tint
- Removed lingering emerald classes; consolidated on CSS variables

## Affected Areas
- Tailwind and global styles: `frontend/src/tailwind.css`, `frontend/index.html`
- Navigation and shell: `frontend/src/components/Navbar.tsx`
- Pages: Home, Menu, About, Contact, Checkout, NotFound
- Components: NewsletterForm, OrderShareCTA, TeaCard, Toast, GoogleReviews, InstagramFeed, UGCForm, StripeCheckout

## Notable Changes (high-level)
- Navbar brand and active states use `--color-primary` / `--color-accent`
- Home hero gradient updated to maroon overlay; CTAs use primary
- Menu side-rail active item uses surface/primary
- Contact & Checkout CTAs styled with primary; success states aligned
- TeaCard price pill and add-to-cart updated to primary/accent
- Toast success styling uses primary/accent; error/info intact
- 404 button uses primary; About page chips/map/gallery CTA updated
- AdminSocial UI and social links updated to primary/accent

## How to Test
1. Run frontend dev server:
   - `npm run dev` from `frontend/`
2. Verify pages:
   - Home: Hero overlay, CTAs, featured section, badges
   - Menu: Side nav active highlight; add-to-cart button
   - Contact & Checkout: Buttons and success states
   - 404: Primary button
   - About: Region chips active state, map card, gallery CTA
   - AdminSocial: Save key button and links
3. Accessibility
   - Keyboard tab through links/buttons and check focus-visible ring
   - Contrast looks good on light/dark modes
4. Build
   - `npm run build` from `frontend/` should succeed

## Deployment Notes
- Frontend (Vercel): Auto-deploy on push to default branch (per project settings)
- Backend: No code changes in this PR

## Screenshots (optional)
- Add screenshots of Home, Menu, Contact, Checkout, and About with new palette

## Rollback Plan
- Revert this commit to restore previous palette and component styles.
