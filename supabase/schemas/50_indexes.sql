-- index 定義を置きます
-- 例: btree, gin, partial index

-- =========================================================
-- カレンダー表示用: 特定ユーザーの投稿を日付降順で引く
-- (user_id, posted_at DESC)
-- =========================================================
create index if not exists posts_user_posted_at_idx
  on public.posts (user_id, posted_at desc);

-- =========================================================
-- ポートフォリオ / 抽出用: ピン済み投稿だけを高速検索
-- pinned=true の行だけを含む部分インデックス(サイズ効率良)
-- =========================================================
create index if not exists posts_pinned_partial_idx
  on public.posts (user_id, pinned_at desc)
  where pinned = true;

-- =========================================================
-- handle から profile を引く(/{handle} アクセス時)
-- unique 制約で自動的に作られるが、明示しておく
-- =========================================================
create index if not exists profiles_handle_idx
  on public.profiles (handle)
  where handle is not null;
