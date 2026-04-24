"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export type ExistingPost = {
  id: string;
  image_path: string;
  caption: string | null;
  posted_at: string;
  pinned: boolean;
  imageUrl: string | null;
};

type PostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  existingPosts: ExistingPost[];
  userId: string;
};

export function PostModal({
  isOpen,
  onClose,
  selectedDate,
  existingPosts,
  userId,
}: PostModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  const handleSave = async () => {
    if (!selectedDate) return;
    if (!file) {
      toast.error("Please select a photo");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const timestamp = Date.now();
      const path = `${userId}/${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: userId,
        image_path: path,
        caption: caption || null,
        posted_at: selectedDate,
      });

      if (insertError) throw insertError;

      toast.success("Saved");
      setFile(null);
      setCaption("");
      router.refresh();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Save failed";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (postId: string, imagePath: string) => {
    if (!confirm("Delete this post?")) return;

    const supabase = createClient();
    const { error: storageError } = await supabase.storage
      .from("post-images")
      .remove([imagePath]);

    if (storageError) {
      toast.error("Failed to delete image: " + storageError.message);
      return;
    }

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      toast.error("Failed to delete post: " + deleteError.message);
      return;
    }

    toast.success("Deleted");
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedDate ? selectedDate.replace(/-/g, " / ") : ""}
          </DialogTitle>
        </DialogHeader>

        {existingPosts.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Posts</p>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {existingPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative group rounded-md overflow-hidden border"
                >
                  {post.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.imageUrl}
                      alt={post.caption ?? ""}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  {post.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                      {post.caption}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id, post.image_path)}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-600 rounded px-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="h-px bg-border" />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Capture a moment</p>

          <div className="grid gap-2">
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="preview"
                className="w-full max-h-60 object-contain rounded border"
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="caption">Message</Label>
            <Input
              id="caption"
              type="text"
              placeholder="About this moment"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
