# ATEF — All Time Elite Fitness

Premium gym website and admin management system for ATEF, built with React,
Vite, Tailwind CSS, and Supabase. Deploys to Cloudflare Pages.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router DOM (SPA routing)
- Supabase (Auth, Database, Storage)
- Lucide React icons

## Project structure

```
src/
  components/
    layout/      Navbar, Footer, ProtectedRoute
    admin/       AdminLayout (sidebar), ConfirmDialog
    ui/          EmptyState, Skeleton loaders
  hooks/
    useAuth.jsx          Supabase auth context (sign in/out, password/email change)
    useGymSettings.jsx   Loads gym_settings + gym_timings for the public site
  lib/
    supabase.js          Supabase client (anon key only)
    whatsapp.js          wa.me link builder for the enquiry flow
  services/              One file per table: CRUD calls to Supabase
  pages/                 Public site pages
  pages/admin/           Admin dashboard pages (protected)
public/
  _redirects             SPA routing rule for Cloudflare Pages
SUPABASE_SETUP.md         Full schema, RLS policies, storage setup, auth setup
```

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the env file and fill in your Supabase project credentials:
   ```
   cp .env.example .env
   ```
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Follow **SUPABASE_SETUP.md** to create the database tables, RLS policies,
   storage buckets, and the one admin user.
4. Run the dev server:
   ```
   npm run dev
   ```
5. Sign in at `/admin/login` with the admin user you created in Supabase, and
   fill in Gym Information, Gym Timings, and your first Membership Plans —
   the public site reads everything live from Supabase, so it will look
   mostly empty (with tasteful "coming soon" states) until content is added.

## No customer accounts

There is no sign-up or customer login anywhere in this app. The only
the gym admin is created directly in Supabase Auth and then allow-listed in the `admin_users` table
dashboard. The public site only ever **reads** active content and **submits**
enquiries — see `SUPABASE_SETUP.md` for the exact RLS policies that enforce
this at the database level (not just hidden UI).

## Deploying to Cloudflare Pages

1. Push this repository to GitHub.
2. In Cloudflare Pages, create a new project from that repo.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add environment variables in the Cloudflare Pages project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. `public/_redirects` (already included) makes all routes fall back to
   `index.html` so React Router's client-side routing works correctly on
   Cloudflare Pages. No Netlify-specific configuration is used anywhere.

## Before going live — checklist

- [ ] `npm run build` completes with no errors
- [ ] All public routes load and show sensible empty states with no data
- [ ] Admin login works and unauthenticated visits to `/admin/*` redirect to `/admin/login`
- [ ] CRUD works for membership plans, gallery, diet plans, and exercises
- [ ] File upload/delete works against real Supabase Storage buckets
- [ ] RLS policies match `SUPABASE_SETUP.md` (test as both anon and admin)
- [ ] Enquiry form validates input, saves to Supabase, and opens WhatsApp with a pre-filled message
- [ ] Mobile layout has no horizontal overflow and the hamburger menu works
- [ ] No secrets (especially `service_role`) appear anywhere in the frontend code or bundle

## Content policy

No gym achievements, trainer names, certifications, awards, testimonials,
membership prices, timings, or statistics are hard-coded anywhere in this
project. Everything customer-facing that isn't confirmed business
information (name, address, phone, WhatsApp, Instagram, Google Maps link) is
either left as an admin-editable field or shown as a tasteful placeholder
until the admin fills it in.
