"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Pencil, Pin, PinOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type ExistingPost } from "./PostModal";

const MAX_PINS = 6;

type PhotoViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  posts: ExistingPost[];
  dateLabel: string;
  userId: string;
};

export function PhotoViewer({
  isOpen,
  onClose,
  onEdit,
  posts,
  dateLabel,
  userId,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(0);
  const [isPinning, setIsPinning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  const current = posts[index];
  const hasMany = posts.length > 1;

  const togglePin = async () => {
    if (!current) return;
    setIsPinning(true);
    const supabase = createClient();

    if (!current.pinned) {
      const { count, error: countError } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("pinned", true);

      if (countError) {
        toast.error("Could not check pin count: " + countError.message);
        setIsPinning(false);
        return;
      }

      if ((count ?? 0) >= MAX_PINS) {
        toast.error(`Max ${MAX_PINS} pins. Unpin one first.`);
        setIsPinning(false);
        return;
      }
    }

    const nowIso = new Date().toISOString();
    const { error } = await supabase
      .from("posts")
      .update({
        pinned: !current.pinned,
        pinned_at: !current.pinned ? nowIso : null,
      })
      .eq("id", current.id);

    if (error) {
      toast.error("Failed: " + error.message);
      setIsPinning(false);
      return;
    }

    toast.success(current.pinned ? "Unpinned" : "Pinned");
    router.refresh();
    setIsPinning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-5xl p-0 overflow-hidden gap-0"
        showCloseButton
      >
        <DialogTitle className="sr-only">{dateLabel}</DialogTitle>

        <div className="relative flex items-center justify-center bg-black min-h-[50vh] max-h-[80vh]">
          {current?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.imageUrl}
              alt={current.caption ?? ""}
              className="max-h-[80vh] max-w-full object-contain"
            />
          )}

          {current?.pinned && (
            <span className="absolute top-3 right-3 flex items-center gap-1 text-white bg-primary/90 text-xs rounded-full px-3 py-1 font-medium">
              <Pin className="h-3 w-3" />
              Pinned
            </span>
          )}

          {hasMany && (
            <>
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition disabled:opacity-30"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setIndex((i) => Math.min(posts.length - 1, i + 1))
                }
                disabled={index === posts.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition disabled:opacity-30"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute top-3 left-3 text-white bg-black/40 text-xs rounded px-2 py-1">
                {index + 1} / {posts.length}
              </span>
            </>
          )}
        </div>

        <div className="p-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{dateLabel}</p>
            {current?.caption ? (
              <p className="mt-1 text-sm leading-relaxed">{current.caption}</p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground/60">
                (photo only)
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={current?.pinned ? "default" : "outline"}
              size="sm"
              onClick={togglePin}
              disabled={isPinning}
              className={cn(current?.pinned && "bg-primary")}
            >
              {current?.pinned ? (
                <>
                  <PinOff className="h-3.5 w-3.5 mr-1" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="h-3.5 w-3.5 mr-1" />
                  Pin
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
