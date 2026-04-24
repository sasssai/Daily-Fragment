import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_name")
    .eq("user_id", user.sub)
    .single();

  return (
    <div className="mx-auto flex w-full flex-1 flex-col gap-8 sm:gap-12">
      <h1 className="text-2xl font-bold break-words sm:text-4xl">
        Hello, {profile?.user_name ?? "User"}!
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base">
        このユーザー名は profiles テーブルから取得しています。
      </p>
    </div>
  );
}
