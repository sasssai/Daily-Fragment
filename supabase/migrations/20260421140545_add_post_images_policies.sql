
  create policy "post_images_delete_own"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'post-images'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));



  create policy "post_images_insert_own"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'post-images'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));



  create policy "post_images_select_own"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'post-images'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));



  create policy "post_images_select_pinned_public"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'post-images'::text) AND (EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.image_path = objects.name) AND (p.pinned = true))))));



  create policy "post_images_update_own"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'post-images'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])))
with check (((bucket_id = 'post-images'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));



