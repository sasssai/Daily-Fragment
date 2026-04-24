"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { type ExistingPost } from "./PostModal";

type PhotoViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  posts: ExistingPost[];
  dateLabel: string;
};

export function PhotoViewer({
  isOpen,
  onClose,
  onEdit,
  posts,
  dateLabel,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  const current = posts[index];
  const hasMany = posts.length > 1;

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
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
