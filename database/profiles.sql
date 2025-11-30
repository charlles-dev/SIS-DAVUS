-- Create a table for public profiles
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    username text,
    full_name text,
    role text default 'OPERATOR',
    is_active boolean default true,
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone" on public.profiles for
select using (true);

create policy "Users can insert their own profile" on public.profiles for
insert
with
    check (auth.uid () = id);

create policy "Users can update own profile" on public.profiles for
update using (auth.uid () = id);

-- Create a trigger to sync auth.users with public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, role, is_active)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'OPERATOR'),
    true
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing users (Admin)
insert into
    public.profiles (
        id,
        username,
        full_name,
        role,
        is_active
    )
select
    id,
    raw_user_meta_data ->> 'username',
    raw_user_meta_data ->> 'full_name',
    coalesce(
        raw_user_meta_data ->> 'role',
        'OPERATOR'
    ),
    true
from auth.users on conflict (id) do nothing;