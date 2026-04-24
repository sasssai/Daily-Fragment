import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle")
    .eq("user_id", user.sub)
    .single();

  if (profile?.handle) {
    redirect("/protected/home");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <OnboardingForm className="w-full max-w-md" />
    </div>
  );
}
