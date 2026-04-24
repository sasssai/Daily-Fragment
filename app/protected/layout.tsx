import AppHeader from "@/components/header/AppHeader";
import { UserProfile, UserProvider } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) {
    // ユーザーが取得できなかった場合LPページにリダイレクト
    redirect("/");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("user_id, user_name")
    .eq("user_id", user.sub)
    .single();

  const profile: UserProfile = {
    userId: user.sub,
    userName: profileData?.user_name ?? "",
  };

  return (
    <UserProvider user={profile}>
      <AppHeader />
      <main className="flex flex-1 flex-col px-4 py-6 md:py-8">{children}</main>
    </UserProvider>
  );
}
