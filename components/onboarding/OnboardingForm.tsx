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
      toast.error("Username must be 3–20 letters, numbers, or _");
      setIsLoading(false);
      return;
    }
    if (RESERVED_HANDLES.includes(handle.toLowerCase())) {
      toast.error("Reserved username");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Could not verify login");
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
        toast.error("Username is already taken");
      } else {
        toast.error("Save failed: " + error.message);
      }
      setIsLoading(false);
      return;
    }

    toast.success("Welcome");
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
            Set up your profile.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="handle">Username</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="handle"
                    type="text"
                    placeholder="Username"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  3–20 letters, numbers, or _
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display-name">Displayname</Label>
                <Input
                  id="display-name"
                  type="text"
                  placeholder="Displayname"
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
                {isLoading ? "Saving…" : "Start"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
