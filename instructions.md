# Project Setup: Pikuland Landing Page (Next.js + Tailwind)

## 1. Core Mission
Build a high-performance, SEO-friendly landing page for "Pikuland" based on the provided design. The vibe is playful, kid-oriented, and vibrant.

## 2. Assets Management (Priority 1)
- **Pre-analysis:** Before coding, scan the `./assets` folder.
- **Renaming:** Rename files to a clean kebab-case format (e.g., `Hero_Image_Final.png` -> `hero-image.png`).
- **Organization:** Move all processed assets to `/public/assets/`.
- **SVGs:** Treat decorative squiggles, stars, and icons as SVGs for sharp scaling.

## 3. Visual Identity & Styling
- **Framework:** Next.js (App Router), Tailwind CSS.
- **Colors:** - Pink: `#E91E63` | Blue: `#00AEEF` | Yellow: `#FFC107`
- **Global Styles:**
  - Border Radius: Large and organic (`rounded-[2.5rem]`).
  - Borders: Thick white borders (`border-8`) for featured containers.
  - Rotation: Subtle tilts (`-rotate-2` or `rotate-1`) on card elements to enhance the "playful" feel.

## 4. Component Structure
- **Navbar:** Sticky, glassmorphism or solid white, with a rounded CTA button.
- **Hero:** H1 Typography with playful line height. Video container with thick border and floating decorative SVG elements.
- **Service Cards:** Use a staggered grid (asymmetric layout) for "Petualangan Tanpa Batas" section.
- **Gallery:** Responsive masonry grid using `columns-2` or `grid-cols`.

## 5. Technical Requirements
- Use `next/image` for all images to ensure SEO & Performance.
- Semantic HTML tags: `<header>`, `<main>`, `<section>`, `<footer>`.
- Responsive: Ensure mobile-first approach (stacking columns on small screens).
- Animations: Use Tailwind transitions or Framer Motion for "floating" effects.