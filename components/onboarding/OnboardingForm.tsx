"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const HANDLE_REGEX = /^[A-Za-z0-9_]{3,20}$/;
const RESERVED_HANDLES = ["auth", "protected", "onboarding", "api"];

export function OnboardingForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!HANDLE_REGEX.test(handle)) {
      toast.error("ハンドルは半角英数字と _ のみ、3〜20文字で入力してください");
      setIsLoading(false);
      return;
    }
    if (RESERVED_HANDLES.includes(handle.toLowerCase())) {
      toast.error("そのハンドルは使えません");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("ログイン状態を確認できませんでした");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        handle,
        display_name: displayName || null,
        bio: bio || null,
      })
      .eq("user_id", user.id);

    if (error) {
      if (error.code === "23505") {
        toast.error("そのハンドルはすでに使われています");
      } else {
        toast.error("保存に失敗しました: " + error.message);
      }
      setIsLoading(false);
      return;
    }

    toast.success("ようこそ");
    router.push("/protected/home");
  };

  return (
    <div
      className={cn("flex flex-col gap-6 px-4 md:px-0", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Hello</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            あなたのハンドルを決めてください。これが公開ページのURLになります。
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="handle">User ID</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="handle"
                    type="text"
                    placeholder="User_id"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  半角英数字と _ のみ、3〜20文字
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display-name">User name</Label>
                <Input
                  id="display-name"
                  type="text"
                  placeholder="Username"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Message</Label>
                <Input
                  id="bio"
                  type="text"
                  placeholder="Message"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "保存中…" : "はじめる"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
