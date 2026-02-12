-- Trigger to automatically create admin_user entry for new signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.admin_users (user_id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'admin');
  return new;
end;
$$ language plpgsql security definer;

-- Enable the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
