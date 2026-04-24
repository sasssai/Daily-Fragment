-- Storage policy の正本を置きます
-- `storage.objects` などに対する policy はここで管理し、
-- 変更後に `npm run db:diff:storage <migration名>` で migration を生成してください。

-- =========================================================
-- post-images bucket の policy
--
-- パス規約: post-images/{uid}/{timestamp}.{ext}
--   - 先頭セグメント = アップロードユーザーのUID
--   - upload時に自分のUID配下にしか書けない(本人なりすまし防止)
--   - read: ピン済み(public)投稿に紐づく画像は誰でも、非公開は本人のみ
-- =========================================================

-- INSERT: 認証ユーザーは自分の UID 配下にのみアップロード可
create policy "post_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

-- SELECT (公開): ピン済み投稿に紐づく画像は誰でも取得可(signed URL 発行が通る)
create policy "post_images_select_pinned_public"
on storage.objects
for select
to public
using (
  bucket_id = 'post-images'
  and exists (
    select 1 from public.posts p
    where p.image_path = storage.objects.name
      and p.pinned = true
  )
);

-- SELECT (本人): 自分がアップロードした全画像は signed URL で取得可
create policy "post_images_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'post-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

-- UPDATE: 本人のみ(metadata 変更等)
create policy "post_images_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'post-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'post-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

-- DELETE: 本人のみ
create policy "post_images_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'post-images'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);
