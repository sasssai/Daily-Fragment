-- テーブル定義を置きます
-- 例: table, trigger

-- =========================================================
-- profiles: ユーザープロフィール (auth.users と 1:1)
-- signup時にトリガーで自動作成、handle等は /onboarding で後から設定
-- =========================================================
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  user_name text,
  display_name text,
  bio text,
  handle text unique,
  created_at timestamp with time zone not null default now()
);

comment on table public.profiles is 'ユーザー1人につき1レコード、signup trigger で自動作成';
comment on column public.profiles.user_name is 'テンプレ由来、未使用(将来削除候補)';
comment on column public.profiles.display_name is '画面表示用の名前';
comment on column public.profiles.bio is '一言プロフィール';
comment on column public.profiles.handle is 'URL用ID、/{handle} で公開ページに到達、英数字と_のみ、3-20文字';

drop trigger if exists create_profile_on_signup on auth.users;
create trigger create_profile_on_signup
after insert on auth.users
for each row
execute function public.create_default_profile();

-- =========================================================
-- posts: 投稿(写真+一言)
-- pinned=true が公開宣言と同義、/{handle} と / に露出
-- =========================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_path text not null,
  caption text,
  posted_at date not null default current_date,
  pinned boolean not null default false,
  pinned_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

comment on table public.posts is '投稿(写真+一言)。pinned=true が公開宣言';
comment on column public.posts.image_path is 'Storage post-images bucket 内の相対パス、{uid}/{timestamp}.jpg 形式';
comment on column public.posts.caption is '一言キャプション';
comment on column public.posts.posted_at is '投稿対象の日付(カレンダーのセルに対応)';
comment on column public.posts.pinned is 'true = 公開宣言、/{handle} と / に露出する';
comment on column public.posts.pinned_at is 'ピン時刻、/ のシャッフル抽出時の安定化(タイブレーク)に使用';
