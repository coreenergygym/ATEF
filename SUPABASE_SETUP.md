# ATEF — Supabase Setup Guide

This document contains everything needed to provision the Supabase backend for
the ATEF website: tables, RLS policies, storage buckets, storage policies, and
admin auth setup. Run the SQL in the Supabase SQL Editor, in order.

## 1. Environment variables

Create a `.env` file (copy from `.env.example`) in the project root:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Only the **anon public key** goes into the frontend. Never put the
`service_role` key in a Vite environment variable — anything prefixed
`VITE_` is bundled into the browser JS and is publicly readable.

## 2. Extensions

```sql
create extension if not exists "pgcrypto";
```

(Needed for `gen_random_uuid()`.)

## 3. Tables

```sql
-- MEMBERSHIP PLANS
create table membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration text,
  price numeric not null default 0,
  description text,
  features text[] default '{}',
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- GALLERY ITEMS
create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  title text,
  caption text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- DIET PLANS
create table diet_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text,
  detailed_content text,
  image_url text,
  image_path text,
  file_url text,
  file_path text,
  category text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- EXERCISES / MACHINES
create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  target_muscle text,
  target_body_part text,
  description text,
  image_url text,
  image_path text,
  video_url text,
  video_path text,
  instructions text,
  common_mistakes text,
  tips text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ENQUIRIES
create table enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  phone text not null check (char_length(trim(phone)) between 8 and 30),
  age integer check (age is null or (age between 10 and 100)),
  gender text,
  interested_plan text,
  fitness_goal text,
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Enrolled', 'Archived')),
  created_at timestamptz not null default now()
);

-- GYM SETTINGS (single row)
create table gym_settings (
  id uuid primary key default gen_random_uuid(),
  gym_name text,
  tagline text,
  about_short text,
  about_long text,
  address text,
  phone text,
  whatsapp text,
  instagram_url text,
  email text,
  maps_url text,
  logo_url text,
  updated_at timestamptz not null default now(),
  singleton boolean not null default true unique check (singleton = true)
);

-- GYM TIMINGS (one row per day)
create table gym_timings (
  id uuid primary key default gen_random_uuid(),
  day text not null unique check (
    day in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
  ),
  open_time time,
  close_time time,
  is_open boolean not null default true,
  updated_at timestamptz not null default now()
);
```

Optional but recommended — keep `updated_at` fresh automatically:

```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_membership_plans_updated before update on membership_plans
  for each row execute function set_updated_at();
create trigger trg_diet_plans_updated before update on diet_plans
  for each row execute function set_updated_at();
create trigger trg_exercises_updated before update on exercises
  for each row execute function set_updated_at();
create trigger trg_gym_settings_updated before update on gym_settings
  for each row execute function set_updated_at();
create trigger trg_gym_timings_updated before update on gym_timings
  for each row execute function set_updated_at();
```

## 4. Row Level Security (RLS)

Enable RLS on every table, then add explicit policies. **Do not disable RLS**
to make the app "work" — every policy below is intentional.

```sql
alter table membership_plans enable row level security;
alter table gallery_items enable row level security;
alter table diet_plans enable row level security;
alter table exercises enable row level security;
alter table enquiries enable row level security;
alter table gym_settings enable row level security;
alter table gym_timings enable row level security;
```

### Public (anon) read access — active content only

```sql
create policy "public read active membership plans"
  on membership_plans for select
  using (is_active = true);

create policy "public read active gallery items"
  on gallery_items for select
  using (is_active = true);

create policy "public read active diet plans"
  on diet_plans for select
  using (is_active = true);

create policy "public read active exercises"
  on exercises for select
  using (is_active = true);

create policy "public read gym settings"
  on gym_settings for select
  using (true);

create policy "public read gym timings"
  on gym_timings for select
  using (true);
```

### Public (anon) insert — enquiries only

```sql
create policy "public can submit enquiries"
  on enquiries for insert
  with check (status = 'New');
```

No select/update/delete policy is created for `anon` on `enquiries`, so the
public cannot read, edit, or delete enquiries — only an allow-listed admin can.

### Admin-only access

Do not treat every authenticated Supabase user as an admin. The database uses a small
`admin_users` allow-list keyed by the Supabase Auth user UUID. This keeps access intact
even if the admin later changes their email address.

```sql
create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
```

After creating the single admin user in **Authentication → Users**, run this once, replacing
the email with the owner's actual login email:

```sql
insert into public.admin_users (user_id)
select id from auth.users
where lower(email) = lower('OWNER_EMAIL_HERE')
on conflict (user_id) do nothing;
```

Then create the admin policies below. There is intentionally no public policy for
`admin_users`, so the allow-list itself is not exposed through the API.

```sql
create policy "admin full access membership plans" on membership_plans
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access gallery items" on gallery_items
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access diet plans" on diet_plans
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access exercises" on exercises
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access enquiries" on enquiries
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access gym settings" on gym_settings
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access gym timings" on gym_timings
  for all using (public.is_admin()) with check (public.is_admin());
```

If you already ran the older version of this guide, remove the old policies that use
`public.is_admin()` before creating these replacements.

## 5. Storage buckets

Create these buckets in Supabase Dashboard → Storage (or via SQL below). Make
them **public** for read (so images/videos load on the website), but restrict
write/delete to authenticated users only.

```sql
insert into storage.buckets (id, name, public)
values
  ('gallery', 'gallery', true),
  ('diet-plans', 'diet-plans', true),
  ('exercise-images', 'exercise-images', true),
  ('exercise-videos', 'exercise-videos', true),
  ('branding', 'branding', true)
on conflict (id) do nothing;
```

### Storage policies

Public can only **read** (view/download) files. Only users passing `public.is_admin()`
can upload, update, or delete.

```sql
-- Repeat this pattern for each bucket: gallery, diet-plans, exercise-images, exercise-videos, branding

create policy "public read gallery bucket"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "admin write gallery bucket"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "admin update gallery bucket"
  on storage.objects for update
  using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "admin delete gallery bucket"
  on storage.objects for delete
  using (bucket_id = 'gallery' and public.is_admin());

-- diet-plans
create policy "public read diet-plans bucket" on storage.objects for select using (bucket_id = 'diet-plans');
create policy "admin write diet-plans bucket" on storage.objects for insert with check (bucket_id = 'diet-plans' and public.is_admin());
create policy "admin update diet-plans bucket" on storage.objects for update using (bucket_id = 'diet-plans' and public.is_admin()) with check (bucket_id = 'diet-plans' and public.is_admin());
create policy "admin delete diet-plans bucket" on storage.objects for delete using (bucket_id = 'diet-plans' and public.is_admin());

-- exercise-images
create policy "public read exercise-images bucket" on storage.objects for select using (bucket_id = 'exercise-images');
create policy "admin write exercise-images bucket" on storage.objects for insert with check (bucket_id = 'exercise-images' and public.is_admin());
create policy "admin update exercise-images bucket" on storage.objects for update using (bucket_id = 'exercise-images' and public.is_admin()) with check (bucket_id = 'exercise-images' and public.is_admin());
create policy "admin delete exercise-images bucket" on storage.objects for delete using (bucket_id = 'exercise-images' and public.is_admin());

-- exercise-videos
create policy "public read exercise-videos bucket" on storage.objects for select using (bucket_id = 'exercise-videos');
create policy "admin write exercise-videos bucket" on storage.objects for insert with check (bucket_id = 'exercise-videos' and public.is_admin());
create policy "admin update exercise-videos bucket" on storage.objects for update using (bucket_id = 'exercise-videos' and public.is_admin()) with check (bucket_id = 'exercise-videos' and public.is_admin());
create policy "admin delete exercise-videos bucket" on storage.objects for delete using (bucket_id = 'exercise-videos' and public.is_admin());

-- branding
create policy "public read branding bucket" on storage.objects for select using (bucket_id = 'branding');
create policy "admin write branding bucket" on storage.objects for insert with check (bucket_id = 'branding' and public.is_admin());
create policy "admin update branding bucket" on storage.objects for update using (bucket_id = 'branding' and public.is_admin()) with check (bucket_id = 'branding' and public.is_admin());
create policy "admin delete branding bucket" on storage.objects for delete using (bucket_id = 'branding' and public.is_admin());
```

Recommended file size limits (set per bucket in Dashboard → Storage → bucket
settings): images ~10MB, videos ~200MB — adjust to your Supabase plan's
limits.

## 6. Admin authentication setup

1. In the Supabase Dashboard, go to **Authentication → Users → Add user**.
2. Create one user with the gym owner's email and a strong password. This is
   the only login the site will ever have — there is no public sign-up flow
   anywhere in the app.
3. Under **Authentication → Providers**, make sure **Email** is enabled and
   that **"Enable email confirmations"** matches what you want (for a single
   manually-created admin, it's fine to leave confirmations on since you
   create the user directly in the dashboard).
4. The admin can later change their own email/password from
   `/admin/settings` in the app, which uses Supabase Auth's built-in secure
   `updateUser()` flow (email changes require confirming the new address).

No custom password storage exists anywhere in this project — all
authentication is handled by Supabase Auth.

## 7. Seeding gym_timings (optional)

The admin can fill these in from `/admin/gym-timings`, but you can also seed
placeholder rows:

```sql
insert into gym_timings (day, open_time, close_time, is_open)
values
  ('Monday', null, null, false),
  ('Tuesday', null, null, false),
  ('Wednesday', null, null, false),
  ('Thursday', null, null, false),
  ('Friday', null, null, false),
  ('Saturday', null, null, false),
  ('Sunday', null, null, false)
on conflict (day) do nothing;
```

Until the admin sets real hours, the public Contact page shows "Timings will
be updated soon."

## 8. Summary checklist

- [ ] Tables created (7 content tables + `admin_users`)
- [ ] RLS enabled on all content tables and `admin_users`
- [ ] Public read policies for active content
- [ ] Public insert-only policy for enquiries
- [ ] Admin allow-list (`admin_users`) created and owner user added
- [ ] Admin full-access policies use `public.is_admin()`
- [ ] 5 storage buckets created, all public-read
- [ ] Storage write/update/delete restricted to `public.is_admin()`
- [ ] One admin user created in Authentication → Users
- [ ] `.env` filled in with project URL + anon key
