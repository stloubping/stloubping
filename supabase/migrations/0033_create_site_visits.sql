create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  page_path text not null check (char_length(page_path) between 1 and 200),
  session_id uuid not null,
  visited_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists site_visits_visited_on_idx on public.site_visits (visited_on desc);
create index if not exists site_visits_page_path_idx on public.site_visits (page_path);

alter table public.site_visits enable row level security;

create policy "Public can record anonymous visits"
  on public.site_visits for insert to anon, authenticated
  with check (page_path <> '' and session_id is not null);

create policy "Admins can read site visits"
  on public.site_visits for select to authenticated
  using (exists (select 1 from public.club_admins where club_admins.user_id = auth.uid()));
