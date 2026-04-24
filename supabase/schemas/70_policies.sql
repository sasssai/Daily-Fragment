-- policy 定義を置きます
-- 例: select, insert, update, delete policy

-- =========================================================
-- profiles
--   SELECT: 誰でも可 (/{handle} で公開ポートフォリオに到達するため)
--   UPDATE: 本人のみ可
--   INSERT は signup trigger(security definer)が行うので policy 不要
-- =========================================================
create policy "profiles_select_public"
on public.profiles
for select
to public
using (true);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- =========================================================
-- posts
--   SELECT (自分の全投稿): 認証ユーザーが自分の投稿を見る
--   SELECT (ピン済み投稿): 誰でも見られる = ピン=公開宣言の本体
--   INSERT: 認証ユーザーが自分の user_id で書き込み
--   UPDATE: 本人のみ(ピン操作・caption編集等)
--   DELETE: 本人のみ
-- =========================================================
create policy "posts_select_own"
on public.posts
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "posts_select_pinned_public"
on public.posts
for select
to public
using (pinned = true);

create policy "posts_insert_own"
on public.posts
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "posts_update_own"
on public.posts
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "posts_delete_own"
on public.posts
for delete
to authenticated
using ((select auth.uid()) = user_id);
