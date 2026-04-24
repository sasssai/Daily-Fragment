import { PublicPortfolio } from "@/components/public/PublicPortfolio";
import { type PinPost } from "@/components/public/PublicLightbox";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PublicHandlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, handle, display_name, bio")
    .eq("handle", handle)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: pinsRaw } = await supabase
    .from("posts")
    .select("id, image_path, caption, posted_at, pinned_at")
    .eq("user_id", profile.user_id)
    .eq("pinned", true)
    .order("pinned_at", { ascending: false });

  const pins: PinPost[] = await Promise.all(
    (pinsRaw ?? []).map(async (p) => {
      const { data: urlData } = await supabase.storage
        .from("post-images")
        .createSignedUrl(p.image_path, 3600);
      return {
        id: p.id,
        image_path: p.image_path,
        caption: p.caption,
        posted_at: p.posted_at,
        pinned_at: p.pinned_at,
        imageUrl: urlData?.signedUrl ?? null,
      };
    })
  );

  return (
    <PublicPortfolio
      profile={{
        handle: profile.handle!,
        display_name: profile.display_name,
        bio: profile.bio,
      }}
      pins={pins}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("handle, display_name, bio")
    .eq("handle", handle)
    .single();

  if (!profile) {
    return { title: "Not Found · Daily Fragment" };
  }

  return {
    title: `${profile.display_name ?? profile.handle} · Daily Fragment`,
    description: profile.bio ?? `@${profile.handle} on Daily Fragment`,
  };
}
