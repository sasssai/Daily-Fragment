drop policy "profiles_select_own" on "public"."profiles";


  create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "image_path" text not null,
    "caption" text,
    "posted_at" date not null default CURRENT_DATE,
    "pinned" boolean not null default false,
    "pinned_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."posts" enable row level security;

alter table "public"."profiles" add column "bio" text;

alter table "public"."profiles" add column "display_name" text;

alter table "public"."profiles" add column "handle" text;

CREATE INDEX posts_pinned_partial_idx ON public.posts USING btree (user_id, pinned_at DESC) WHERE (pinned = true);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE INDEX posts_user_posted_at_idx ON public.posts USING btree (user_id, posted_at DESC);

CREATE INDEX profiles_handle_idx ON public.profiles USING btree (handle) WHERE (handle IS NOT NULL);

CREATE UNIQUE INDEX profiles_handle_key ON public.profiles USING btree (handle);

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."posts" add constraint "posts_caption_length" CHECK (((caption IS NULL) OR (char_length(caption) <= 280))) not valid;

alter table "public"."posts" validate constraint "posts_caption_length";

alter table "public"."posts" add constraint "posts_pinned_at_consistency" CHECK ((((pinned = true) AND (pinned_at IS NOT NULL)) OR ((pinned = false) AND (pinned_at IS NULL)))) not valid;

alter table "public"."posts" validate constraint "posts_pinned_at_consistency";

alter table "public"."posts" add constraint "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_handle_format" CHECK (((handle IS NULL) OR ((handle ~ '^[A-Za-z0-9_]{3,20}$'::text) AND (handle <> ALL (ARRAY['auth'::text, 'protected'::text, 'onboarding'::text, 'api'::text, 'explore'::text, 'settings'::text, 'home'::text, 'post'::text, 'admin'::text, 'root'::text, 'null'::text, 'undefined'::text]))))) not valid;

alter table "public"."profiles" validate constraint "profiles_handle_format";

alter table "public"."profiles" add constraint "profiles_handle_key" UNIQUE using index "profiles_handle_key";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";


  create policy "posts_delete_own"
  on "public"."posts"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "posts_insert_own"
  on "public"."posts"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "posts_select_own"
  on "public"."posts"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "posts_select_pinned_public"
  on "public"."posts"
  as permissive
  for select
  to public
using ((pinned = true));



  create policy "posts_update_own"
  on "public"."posts"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "profiles_select_public"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



