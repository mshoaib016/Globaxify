-- Globaxify Phase 2 database schema
-- Run this in Supabase Dashboard > SQL Editor > New query.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'editor')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  cover_image text,
  project_url text,
  category text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  icon text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  author text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  message text not null,
  source text not null default 'contact',
  status text not null default 'new' check (status in ('new', 'in_progress', 'won', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  company text,
  quote text not null,
  avatar_url text,
  rating int check (rating between 1 and 5),
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null,
  public_url text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security on every application table.
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.inquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;

-- Profiles: users can read their own profile; only admins can manage profiles.
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

-- Public can read published website content; admins can manage it.
do $$
declare t text;
begin
  foreach t in array array['projects','services','blog_posts','testimonials','faqs'] loop
    execute format('drop policy if exists "Public reads published %1$s" on public.%1$I', t);
    if t = 'blog_posts' then
      execute format('create policy "Public reads published %1$s" on public.%1$I for select to anon, authenticated using (status = ''published'' or (select public.is_admin()))', t);
    else
      execute format('create policy "Public reads published %1$s" on public.%1$I for select to anon, authenticated using (published = true or (select public.is_admin()))', t);
    end if;
    execute format('drop policy if exists "Admins manage %1$s" on public.%1$I', t);
    execute format('create policy "Admins manage %1$s" on public.%1$I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

drop policy if exists "Admins manage inquiries" on public.inquiries;
create policy "Admins manage inquiries" on public.inquiries for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins manage settings" on public.site_settings;
create policy "Admins manage settings" on public.site_settings for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins manage media" on public.media_assets;
create policy "Admins manage media" on public.media_assets for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

-- Allow anonymous visitors to submit contact/quote forms only.
drop policy if exists "Visitors submit inquiries" on public.inquiries;
create policy "Visitors submit inquiries" on public.inquiries for insert to anon, authenticated
with check (true);

-- Storage bucket for admin-managed media. Keep it private initially.
insert into storage.buckets (id, name, public)
values ('globaxify-media', 'globaxify-media', false)
on conflict (id) do nothing;

drop policy if exists "Admins read media bucket" on storage.objects;
create policy "Admins read media bucket" on storage.objects for select to authenticated
using (bucket_id = 'globaxify-media' and (select public.is_admin()));
drop policy if exists "Admins upload media bucket" on storage.objects;
create policy "Admins upload media bucket" on storage.objects for insert to authenticated
with check (bucket_id = 'globaxify-media' and (select public.is_admin()));
drop policy if exists "Admins update media bucket" on storage.objects;
create policy "Admins update media bucket" on storage.objects for update to authenticated
using (bucket_id = 'globaxify-media' and (select public.is_admin()))
with check (bucket_id = 'globaxify-media' and (select public.is_admin()));
drop policy if exists "Admins delete media bucket" on storage.objects;
create policy "Admins delete media bucket" on storage.objects for delete to authenticated
using (bucket_id = 'globaxify-media' and (select public.is_admin()));

-- After creating your first user in Supabase Auth, promote that exact user:
-- update public.profiles set role = 'admin' where email = 'YOUR-ADMIN-EMAIL';
