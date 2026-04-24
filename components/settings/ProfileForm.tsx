"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const HANDLE_REGEX = /^[A-Za-z0-9_]{3,20}$/;
const RESERVED_HANDLES = ["auth", "protected", "onboarding", "api"];

type ProfileFormProps = {
  initialHandle: string;
  initialDisplayName: string;
  initialBio: string;
  userId: string;
  className?: string;
};

export function ProfileForm({
  initialHandle,
  initialDisplayName,
  initialBio,
  userId,
  className,
}: ProfileFormProps) {
  const [handle, setHandle] = useState(initialHandle);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!HANDLE_REGEX.test(handle)) {
      toast.error("Username must be 3–20 letters, numbers, or _");
      setIsSaving(false);
      return;
    }
    if (RESERVED_HANDLES.includes(handle.toLowerCase())) {
      toast.error("Reserved username");
      setIsSaving(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        handle,
        display_name: displayName || null,
        bio: bio || null,
      })
      .eq("user_id", userId);

    if (error) {
      if (error.code === "23505") {
        toast.error("Username is already taken");
      } else {
        toast.error("Save failed: " + error.message);
      }
      setIsSaving(false);
      return;
    }

    toast.success("Saved");
    router.refresh();
    setIsSaving(false);
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="handle">Username</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <Input
                id="handle"
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              3–20 letters, numbers, or _ · your public page URL
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="display-name">Displayname</Label>
            <Input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Message</Label>
            <Input
              id="bio"
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
