# Abhishek — Portfolio

An animated personal portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, GSAP, Motion and Lenis.

**Numbers, code & design that grow your brand.**

---

## Quick start

You need **Node.js 20.9 or newer**.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run placeholders` | Regenerate the placeholder project images |

### Contact form email (Resend)

1. Create a free account at [resend.com](https://resend.com) and make an API key.
2. Copy the example env file and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Meaning |
   | --- | --- |
   | `RESEND_API_KEY` | Your Resend API key |
   | `CONTACT_TO_EMAIL` | The inbox that receives messages |
   | `CONTACT_FROM_EMAIL` | The sender. Use `Portfolio <onboarding@resend.dev>` while testing; for real use, verify your own domain in Resend and send from it |
   | `NEXT_PUBLIC_SITE_URL` | Your live URL, e.g. `https://abhishek.com` (used for SEO, sitemap and social previews) |

3. Restart `npm run dev`.

Until the key is set, the form validates normally but shows a friendly "not connected yet" message instead of sending. Messages are validated again on the server (Zod), HTML-escaped, rate-limited (5 per 10 minutes per IP) and protected by a hidden honeypot field.

---

## Editing your content

All text lives in `/data`. You should never need to touch the components to update your content.

| File | What's in it |
| --- | --- |
| `data/site.ts` | Name, tagline, intro, email, WhatsApp, social links, project count, photo path, nav links |
| `data/projects.ts` | Every project: card info and the full case study (challenge, what I did, process, results, gallery) |
| `data/experience.ts` | Timeline entries |
| `data/skills.ts` | Skill cards, marquee words, process steps, testimonials, contact form options |

**Placeholders** are written in `[square brackets]`, for example `[your email]`, `[year]` and `[XX%]`. Search the `/data` folder for `[` to find every one.

A few behave specially:

- **Email**: while it's still `[your email]`, it isn't turned into a `mailto:` link or added to the SEO data.
- **Social links**: `[url]` links are left out of the JSON-LD `sameAs` list until you add real URLs.
- **WhatsApp**: set `whatsappLink` to digits only, with the country code (e.g. `9779800000000`) to make the number a clickable `wa.me` link.
- **Years as a USA counsellor**: set `counsellingYears` to a number (e.g. `3`) and the About counter animates to it. While it's `null`, it shows `[XX]`.
- **Projects counter**: set `projectsCount` to a number (e.g. `25`) and the About counter animates to it. While it's `null`, it shows `[XX]`.
- **Testimonials**: replace each `[Client quote]` slot with a real quote. Placeholder cards are drawn with a dashed border so they're easy to spot.

### Your photo

Save a portrait at `public/images/profile.jpg` (portrait orientation, about 1000×1250 px works well). It automatically replaces the styled placeholder in the hero arch. Restart the dev server, or rebuild for production, after adding it.

### Project images

Each project has a cover and two gallery images in `public/images/projects/`, named `<slug>-1.jpg` (cover), `<slug>-2.jpg` and `<slug>-3.jpg`. The current files are generated placeholders. Replace them with real images using the same names, or point `cover` / `gallery` in `data/projects.ts` at any other file in `/public`. Use a 4:3 ratio for covers. `next/image` handles resizing, lazy loading and AVIF/WebP.

### Adding a project

Copy one object in `data/projects.ts`, give it a unique `slug` (that becomes `/work/<slug>`), choose a `category` (`Marketing`, `Design` or `Strategy`), and fill in the rest. It appears in the Work section, the filters, the sitemap, and as a case study page automatically.

---

## Changing the accent colour

Open `app/globals.css` and edit the tokens at the top:

```css
:root {
  --accent: #c6ff3d;          /* buttons, highlights, progress bar */
  --accent-contrast: #0b0d12; /* text sitting ON the accent colour */
  --accent-ink: #4a7300;      /* accent used AS text in light mode */
}
.dark {
  --accent-ink: var(--accent); /* in dark mode, accent text uses the accent itself */
}
```

- `--accent` is the only value you need to change for the dark theme.
- Light mode uses `--accent-ink` for accent-coloured text, because bright lime on a light background fails contrast. If you pick a new accent, set `--accent-ink` to a darker shade of it that has at least 4.5:1 contrast against `#f4f2ec`.
- If your new accent is dark, change `--accent-contrast` to a light colour so button text stays readable.

The other theme colours (`--bg`, `--surface`, `--border`, `--text`, `--muted`) sit in the same block: `:root` is the light theme and `.dark` is the dark theme (the default).

---

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository. Vercel detects Next.js automatically; keep the default settings.
3. Under **Environment Variables**, add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` and `NEXT_PUBLIC_SITE_URL` (your Vercel or custom domain URL).
4. Click **Deploy**.
5. Optional: add your custom domain under **Project → Settings → Domains**, update `NEXT_PUBLIC_SITE_URL` to match, and redeploy.

Every later push to your main branch redeploys automatically.

---

## How it's built

```
app/
  layout.tsx            fonts, metadata, JSON-LD, global providers
  page.tsx              home page
  template.tsx          fade-in for each new route
  work/[slug]/page.tsx  case study pages (statically generated)
  api/contact/route.ts  contact form → Resend
  opengraph-image.tsx   generated social preview image
  sitemap.ts, robots.ts, manifest.ts, icon.svg, not-found.tsx
components/
  sections/   Navbar, Hero, About, Skills, Work, Experience, Process,
              Testimonials, Contact, ContactForm, Footer, CaseStudy, NextProject
  ui/         MagneticButton, Cursor, Preloader, Marquee, SplitText, TiltCard,
              Counter, ScrollProgress, SectionHeading, TransitionLink, SocialIcon, HashScroll
  providers/  LenisProvider, ThemeProvider, MotionProvider, TransitionProvider
data/         your content
lib/          gsap.ts (plugins registered once), gsap-queue.ts, scroll.ts,
              app-ready.ts, contact-schema.ts, hooks.ts, utils.ts
```

### Animation rules

- **GSAP** handles anything tied to scroll position: the hero heading split, the About word-by-word light-up, the pinned horizontal Work scroll, the Experience line, the pinned Process steps, the marquee's scroll-reactive speed, the footer wordmark, and parallax.
- **Motion** handles anything tied to state or interaction: hover, tap, the cursor, magnetic buttons, the filter pill (`layoutId`), card reordering, the mobile menu, the carousel drag, form states, and page transitions (`AnimatePresence`).
- No element is animated by both. Where a component needs both, they're on separate wrapper elements (e.g. GSAP fades in the skill card's wrapper and Motion tilts the inner card).
- Only `transform` and `opacity` are animated.
- Every GSAP animation is created inside `useGSAP` with a scope, so it's cleaned up on unmount. Below-the-fold sections queue their setup (`lib/gsap-queue.ts`) so phones never get one long block of work during page load.
- Lenis drives smooth scrolling from GSAP's ticker and feeds `ScrollTrigger.update`.

### Reduced motion

When the visitor's OS asks for reduced motion: Lenis is turned off, parallax and pinned/horizontal scroll are skipped (Work becomes a grid), the marquee and floating chips stop, the custom cursor is disabled, Motion skips transform animations, and reveals become simple fades.

### Notes

- The preloader shows once per browser tab session (`sessionStorage`).
- The custom cursor only runs on devices with a mouse or trackpad.
- The About paragraph's words start at 20% opacity by design and brighten as you scroll. Automated contrast checkers (including Lighthouse) flag the dimmed words. The full text is always in the page and readable by screen readers.
