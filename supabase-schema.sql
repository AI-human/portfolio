-- ==============================================================================
-- SUPABASE SCHEMA FOR TAHMIDUL KASHFI'S PORTFOLIO
-- Run this in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)
-- ==============================================================================

-- 1. Create Projects Table
create table if not exists public.projects (
  id text primary key,
  title text not null,
  tag text not null,
  blurb text not null,
  stack jsonb not null default '[]'::jsonb,
  date text not null,
  metric jsonb,
  video text,
  link text,
  linkedin text,
  span text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Experience / Research Table
create table if not exists public.experience (
  id text primary key,
  role text not null,
  org text not null,
  period text not null,
  body text not null,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Certifications Table
create table if not exists public.certifications (
  id text primary key,
  title text not null,
  issuer text not null,
  date text not null,
  href text not null,
  image text not null,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Profile & Resume Table
create table if not exists public.profile (
  id text primary key default 'main',
  name text not null,
  tagline text not null,
  bio text not null,
  location text not null,
  student_status text not null,
  availability text not null,
  email text not null,
  portrait_url text not null,
  resume_url text not null,
  skills jsonb not null default '[]'::jsonb,
  socials jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.certifications enable row level security;
alter table public.profile enable row level security;

-- 6. RLS Policies: Anyone can view (SELECT), Only authenticated users can modify (INSERT, UPDATE, DELETE)
create policy "Allow public read access on projects" on public.projects for select using (true);
create policy "Allow authenticated write on projects" on public.projects for all using (auth.role() = 'authenticated');

create policy "Allow public read access on experience" on public.experience for select using (true);
create policy "Allow authenticated write on experience" on public.experience for all using (auth.role() = 'authenticated');

create policy "Allow public read access on certifications" on public.certifications for select using (true);
create policy "Allow authenticated write on certifications" on public.certifications for all using (auth.role() = 'authenticated');

create policy "Allow public read access on profile" on public.profile for select using (true);
create policy "Allow authenticated write on profile" on public.profile for all using (auth.role() = 'authenticated');

-- 7. Create Storage Bucket for Portfolio Assets (Videos, PDFs, Images)
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "Allow public read access on portfolio-assets"
on storage.objects for select using (bucket_id = 'portfolio-assets');

create policy "Allow authenticated upload on portfolio-assets"
on storage.objects for insert with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Allow authenticated update/delete on portfolio-assets"
on storage.objects for all using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
