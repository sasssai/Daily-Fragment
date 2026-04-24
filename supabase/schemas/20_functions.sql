-- 関数定義を置きます
-- 例: trigger function, rpc 用 function

-- Sample: signup 時に profile を作成
create or replace function public.create_default_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, user_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'user_name', '')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;
