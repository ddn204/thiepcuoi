-- Thiệp cưới online: bảng, RLS, storage, RPC
-- Quy ước: chỉ user có trong public.admin_users mới quản trị được; khách (anon) chỉ đọc thiệp đã publish,
-- gửi lời chúc và gửi xác nhận tham dự.

-- ───────────────────────── Admin ─────────────────────────
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create policy "admin xem danh sách admin" on public.admin_users
  for select to authenticated using (public.is_admin());

-- ───────────────────────── Thiệp ─────────────────────────
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (char_length(slug) between 3 and 60 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null default '',
  data jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  owner_id uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger invitations_set_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

alter table public.invitations enable row level security;

create policy "ai cũng xem được thiệp đã publish" on public.invitations
  for select to anon, authenticated using (published);

create policy "admin quản lý thiệp" on public.invitations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────── Khách mời ─────────────────────────
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)
    check (code ~ '^[a-z0-9]{4,16}$'),
  created_at timestamptz not null default now()
);

create index guests_invitation_id_idx on public.guests (invitation_id, created_at);

alter table public.guests enable row level security;

create policy "admin quản lý khách mời" on public.guests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Khách không đọc thẳng bảng guests (tránh lộ danh sách); chỉ tra đúng 1 khách theo slug + code.
create or replace function public.get_guest(p_slug text, p_code text)
returns table (id uuid, display_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select g.id, g.display_name
  from public.guests g
  join public.invitations i on i.id = g.invitation_id
  where i.slug = p_slug and i.published and g.code = lower(p_code)
  limit 1;
$$;

grant execute on function public.get_guest(text, text) to anon, authenticated;

-- ───────────────────────── Lời chúc ─────────────────────────
create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index wishes_invitation_id_idx on public.wishes (invitation_id, created_at desc);

alter table public.wishes enable row level security;

create policy "xem lời chúc của thiệp đã publish" on public.wishes
  for select to anon, authenticated
  using (
    not hidden
    and exists (select 1 from public.invitations i where i.id = invitation_id and i.published)
  );

create policy "khách gửi lời chúc" on public.wishes
  for insert to anon, authenticated
  with check (
    not hidden
    and exists (select 1 from public.invitations i where i.id = invitation_id and i.published)
  );

create policy "admin quản lý lời chúc" on public.wishes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────── Xác nhận tham dự ─────────────────────────
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_id uuid references public.guests (id) on delete set null,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  attending boolean not null,
  guest_count smallint not null default 1 check (guest_count between 0 and 20),
  created_at timestamptz not null default now()
);

create index rsvps_invitation_id_idx on public.rsvps (invitation_id, created_at desc);

alter table public.rsvps enable row level security;

-- Khách chỉ được gửi, không đọc được danh sách xác nhận
create policy "khách gửi xác nhận tham dự" on public.rsvps
  for insert to anon, authenticated
  with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.published));

create policy "admin quản lý xác nhận tham dự" on public.rsvps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────── Storage: ảnh & nhạc ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-media',
  'invitation-media',
  true,
  15728640, -- 15 MB
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/wav'
  ]
)
on conflict (id) do nothing;

create policy "admin upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'invitation-media' and public.is_admin());

create policy "admin sửa media" on storage.objects
  for update to authenticated
  using (bucket_id = 'invitation-media' and public.is_admin());

create policy "admin xoá media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'invitation-media' and public.is_admin());
