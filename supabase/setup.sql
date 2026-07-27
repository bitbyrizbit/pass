create type user_role as enum ('customer', 'staff', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'customer',
  display_name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Trigger to create profile automatically on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'customer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update orders RLS to check for staff/admin role
drop policy if exists "staff can view all orders" on orders;
drop policy if exists "staff can update order status" on orders;

create policy "staff can view all orders" on orders
  for select using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role in ('staff', 'admin'))
  );

create policy "staff can update order status" on orders
  for update using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role in ('staff', 'admin'))
  );

-- IMPORTANT: RUN THIS ONCE TO PROMOTE YOURSELF TO STAFF FOR TESTING
-- Replace 'your-test-email@example.com' with your actual registered email
/*
update profiles set role = 'staff'
where id = (select id from auth.users where email = 'your-test-email@example.com');
*/
