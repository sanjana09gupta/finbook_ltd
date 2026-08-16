-- supabase/migrations/0001_create_bookings.sql
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  name text not null,
  email text not null,
  company text,
  phone text,
  message text not null,
  status text not null default 'reserving' check (status in ('reserving', 'confirmed', 'failed')),
  google_event_id text,
  meet_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slot_start)
);

alter table public.bookings enable row level security;
-- No public policies: only the secret key (used server-side only) may read/write this table.
