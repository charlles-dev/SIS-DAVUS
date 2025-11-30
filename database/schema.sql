-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4 (),
    name text not null,
    category text not null,
    unit text not null,
    current_stock numeric default 0,
    min_threshold numeric default 0,
    last_updated timestamptz default now()
);

-- Locations Table
create table if not exists public.locations (
    id uuid primary key default uuid_generate_v4 (),
    name text not null,
    active boolean default true
);

-- Assets Table
create table if not exists public.assets (
    id uuid primary key default uuid_generate_v4 (),
    name text not null,
    asset_tag text unique not null,
    brand text,
    location_id uuid references public.locations (id),
    status text not null,
    image text,
    purchase_date date,
    purchase_value numeric,
    created_at timestamptz default now()
);

-- Stock Movements Table
create table if not exists public.stock_movements (
    id uuid primary key default uuid_generate_v4 (),
    product_id uuid references public.products (id),
    type text not null check (type in ('IN', 'OUT')),
    quantity numeric not null,
    date timestamptz default now(),
    user_id uuid references auth.users (id),
    notes text
);

-- Purchase Requests Table
create table if not exists public.purchase_requests (
    id uuid primary key default uuid_generate_v4 (),
    product_id uuid references public.products (id),
    quantity numeric not null,
    unit text not null,
    requested_by uuid references auth.users (id),
    status text default 'PENDING',
    created_at timestamptz default now(),
    notes text
);

-- Checkouts Table
create table if not exists public.checkouts (
    id uuid primary key default uuid_generate_v4 (),
    asset_id uuid references public.assets (id),
    worker_name text not null,
    checked_out_at timestamptz default now(),
    expected_return timestamptz,
    returned_at timestamptz
);

-- Maintenance Orders Table
create table if not exists public.maintenance_orders (
    id uuid primary key default uuid_generate_v4 (),
    asset_id uuid references public.assets (id),
    vendor text,
    description text,
    cost numeric,
    status text not null,
    opened_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

alter table public.locations enable row level security;

alter table public.assets enable row level security;

alter table public.stock_movements enable row level security;

alter table public.purchase_requests enable row level security;

alter table public.checkouts enable row level security;

alter table public.maintenance_orders enable row level security;

-- Basic Policies
-- Allow read access to authenticated users
create policy "Allow read access to authenticated users" on public.products for
select using (
        auth.role () = 'authenticated'
    );

create policy "Allow read access to authenticated users" on public.assets for
select using (
        auth.role () = 'authenticated'
    );

create policy "Allow read access to authenticated users" on public.locations for
select using (
        auth.role () = 'authenticated'
    );

-- Allow insert/update based on roles (Simplified for now, allows all authenticated)
create policy "Allow all access to authenticated users" on public.products for all using (
    auth.role () = 'authenticated'
);

create policy "Allow all access to authenticated users" on public.assets for all using (
    auth.role () = 'authenticated'
);

create policy "Allow all access to authenticated users" on public.stock_movements for all using (
    auth.role () = 'authenticated'
);