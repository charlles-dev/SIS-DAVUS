-- Create test users
-- Password for all users is: 123456

create extension if not exists pgcrypto;

-- Admin User
insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    )
select
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4 (),
    'authenticated',
    'authenticated',
    'admin@davus.com',
    crypt ('123456', gen_salt ('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin User", "role": "ADMIN"}',
    now(),
    now()
where
    not exists (
        select 1
        from auth.users
        where
            email = 'admin@davus.com'
    );

-- Manager User
insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    )
select
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4 (),
    'authenticated',
    'authenticated',
    'manager@davus.com',
    crypt ('123456', gen_salt ('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Manager User", "role": "MANAGER"}',
    now(),
    now()
where
    not exists (
        select 1
        from auth.users
        where
            email = 'manager@davus.com'
    );

-- Operator User
insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    )
select
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4 (),
    'authenticated',
    'authenticated',
    'operator@davus.com',
    crypt ('123456', gen_salt ('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Operator User", "role": "OPERATOR"}',
    now(),
    now()
where
    not exists (
        select 1
        from auth.users
        where
            email = 'operator@davus.com'
    );

-- Insert identities
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  uuid_generate_v4(),
  id,
  format('{"sub": "%s", "email": "%s"}', id, email)::jsonb,
  'email',
  id::text,
  now(),
  now(),
  now()
from auth.users
where email in ('admin@davus.com', 'manager@davus.com', 'operator@davus.com')
and not exists (
  select 1 from auth.identities 
  where auth.identities.user_id = auth.users.id
);