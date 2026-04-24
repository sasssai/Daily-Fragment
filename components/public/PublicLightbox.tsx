"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PinPost = {
  id: string;
  image_path: string;
  caption: string | null;
  posted_at: string;
  pinned_at: string | null;
  imageUrl: string | null;
};

type PublicLightboxProps = {
  pins: PinPost[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function PublicLightbox({
  pins,
  index,
  onClose,
  onPrev,
  onNext,
}: PublicLightboxProps) {
  const current = index !== null ? pins[index] : null;
  const hasMany = pins.length > 1;
  const isOpen = index !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-5xl p-0 overflow-hidden gap-0"
        showCloseButton
      >
        <DialogTitle className="sr-only">
          {current?.caption ?? "photo"}
        </DialogTitle>

        <div className="relative flex items-center justify-center bg-black min-h-[50vh] max-h-[80vh]">
          {current?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.imageUrl}
              alt={current.caption ?? ""}
              className="max-h-[80vh] max-w-full object-contain"
            />
          )}

          {hasMany && index !== null && (
            <>
              <button
                type="button"
                onClick={onPrev}
                disabled={index === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition disabled:opacity-30"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={index === pins.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition disabled:opacity-30"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute top-3 left-3 text-white bg-black/40 text-xs rounded px-2 py-1">
                {index + 1} / {pins.length}
              </span>
            </>
          )}
        </div>

        {current && (
          <div className="p-4">
            <p className="text-xs text-muted-foreground">{current.posted_at}</p>
            {current.caption ? (
              <p className="mt-1 text-sm leading-relaxed">{current.caption}</p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground/60">
                (photo only)
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
