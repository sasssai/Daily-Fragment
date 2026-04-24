-- 制約定義を置きます
-- 例: unique, check, foreign key

-- =========================================================
-- profiles.handle のバリデーション
--   - 3〜20文字
--   - 英数字と _ のみ
--   - 予約語(auth, protected, onboarding, api, explore, settings, home, post)禁止
-- =========================================================
alter table public.profiles
  drop constraint if exists profiles_handle_format;

alter table public.profiles
  add constraint profiles_handle_format
  check (
    handle is null
    or (
      handle ~ '^[A-Za-z0-9_]{3,20}$'
      and handle not in (
        'auth', 'protected', 'onboarding', 'api',
        'explore', 'settings', 'home', 'post',
        'admin', 'root', 'null', 'undefined'
      )
    )
  );

-- =========================================================
-- posts.caption の長さ制限
--   空文字は null に正規化、最大280文字(Twitterの短文感を参考に)
-- =========================================================
alter table public.posts
  drop constraint if exists posts_caption_length;

alter table public.posts
  add constraint posts_caption_length
  check (caption is null or char_length(caption) <= 280);

-- =========================================================
-- posts.pinned と pinned_at の整合性
--   pinned=true なら pinned_at は必須
--   pinned=false なら pinned_at は null であるべき
-- =========================================================
alter table public.posts
  drop constraint if exists posts_pinned_at_consistency;

alter table public.posts
  add constraint posts_pinned_at_consistency
  check (
    (pinned = true and pinned_at is not null)
    or (pinned = false and pinned_at is null)
  );
