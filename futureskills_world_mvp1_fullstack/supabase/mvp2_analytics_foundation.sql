-- FutureSkills World MVP 2 Analytics Foundation
-- Run this in Supabase SQL Editor if you have not already done so.

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics_insert_own" on public.analytics_events;
create policy "analytics_insert_own"
on public.analytics_events
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "analytics_admin_read" on public.analytics_events;
create policy "analytics_admin_read"
on public.analytics_events
for select
to authenticated
using (public.is_admin());
