import { LogoutButton } from "@/components/auth/LogoutButton";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle, display_name, bio")
    .eq("user_id", user.sub)
    .single();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Settings</h1>
        {profile?.handle && (
          <Link
            href={`/${profile.handle}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            View public page
          </Link>
        )}
      </div>
      <ProfileForm
        initialHandle={profile?.handle ?? ""}
        initialDisplayName={profile?.display_name ?? ""}
        initialBio={profile?.bio ?? ""}
        userId={user.sub}
      />
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}
