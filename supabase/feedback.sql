-- Feedback table (run in Supabase SQL editor)
-- Allows INSERT from anon/authenticated, but does NOT allow SELECT from client.

create extension if not exists "pgcrypto";

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Allow unauthenticated and authenticated users to submit feedback
create policy "anon can submit feedback"
on public.feedback
for insert
to anon
with check (true);

create policy "authenticated can submit feedback"
on public.feedback
for insert
to authenticated
with check (true);

-- Required grants for API access
grant usage on schema public to anon;
grant insert on public.feedback to anon;
grant usage on schema public to authenticated;
grant insert on public.feedback to authenticated;

