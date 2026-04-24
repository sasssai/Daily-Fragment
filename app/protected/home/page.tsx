import { HomeCalendar } from "@/components/home/HomeCalendar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ExistingPost } from "@/components/home/PostModal";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const user = claimsData?.claims;
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle")
    .eq("user_id", user.sub)
    .single();

  if (!profile?.handle) {
    redirect("/onboarding");
  }

  const { data: postsRaw } = await supabase
    .from("posts")
    .select("id, image_path, caption, posted_at, pinned")
    .eq("user_id", user.sub)
    .order("posted_at", { ascending: false });

  const posts: ExistingPost[] = await Promise.all(
    (postsRaw ?? []).map(async (p) => {
      const { data: urlData } = await supabase.storage
        .from("post-images")
        .createSignedUrl(p.image_path, 3600);
      return {
        id: p.id,
        image_path: p.image_path,
        caption: p.caption,
        posted_at: p.posted_at,
        pinned: p.pinned,
        imageUrl: urlData?.signedUrl ?? null,
      };
    })
  );

  return <HomeCalendar posts={posts} userId={user.sub} />;
}
