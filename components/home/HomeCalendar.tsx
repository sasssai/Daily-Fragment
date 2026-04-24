"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { PostModal, type ExistingPost } from "./PostModal";
import { PhotoViewer } from "./PhotoViewer";

type HomeCalendarProps = {
  posts: ExistingPost[];
  userId: string;
};

const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatMonthDay(key: string): string {
  const d = parseDateKey(key);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function formatWeekdayShort(key: string): string {
  const d = parseDateKey(key);
  return WEEK_LABELS[d.getDay()];
}

function formatViewerDateLabel(key: string): string {
  const d = parseDateKey(key);
  return `${MONTH_LABELS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (${
    WEEK_LABELS[d.getDay()]
  })`;
}

function generateCalendarDays(anchor: Date): Date[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();

  const start = new Date(year, month, 1 - startOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export function HomeCalendar({ posts, userId }: HomeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [activeTab, setActiveTab] = useState<"photo" | "text">("photo");
  const [viewerDate, setViewerDate] = useState<string | null>(null);
  const [modalDate, setModalDate] = useState<string | null>(null);

  const postsByDate = useMemo(() => {
    const map = new Map<string, ExistingPost[]>();
    for (const post of posts) {
      const key = post.posted_at;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    }
    return map;
  }, [posts]);

  const days = useMemo(
    () => generateCalendarDays(currentMonth),
    [currentMonth]
  );

  const allDaysInCurrentMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const result: { dateKey: string; posts: ExistingPost[] }[] = [];
    for (let d = 1; d <= lastDay; d++) {
      const date = new Date(year, month, d);
      const key = toDateKey(date);
      result.push({
        dateKey: key,
        posts: postsByDate.get(key) ?? [],
      });
    }
    return result;
  }, [currentMonth, postsByDate]);

  const handleCellClick = (key: string) => {
    const dayPosts = postsByDate.get(key) ?? [];
    if (dayPosts.length > 0) {
      setViewerDate(key);
    } else {
      setModalDate(key);
    }
  };

  const handleEditFromViewer = () => {
    if (viewerDate) {
      setModalDate(viewerDate);
      setViewerDate(null);
    }
  };

  const viewerPosts = viewerDate
    ? postsByDate.get(viewerDate) ?? []
    : [];
  const modalPosts = modalDate ? postsByDate.get(modalDate) ?? [] : [];

  const goPrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const goNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  const goThisMonth = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const todayKey = toDateKey(new Date());

  return (
    <div className="mx-auto flex w-full flex-1 flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrevMonth}>
            ←
          </Button>
          <h2 className="text-xl font-semibold sm:text-2xl min-w-44 text-center">
            {MONTH_LABELS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <Button variant="outline" size="sm" onClick={goNextMonth}>
            →
          </Button>
          <Button variant="ghost" size="sm" onClick={goThisMonth}>
            Today
          </Button>
        </div>

        <div className="flex items-center gap-1 rounded-md border p-1">
          <button
            type="button"
            onClick={() => setActiveTab("photo")}
            className={cn(
              "px-3 py-1 text-sm rounded transition-colors",
              activeTab === "photo"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={cn(
              "px-3 py-1 text-sm rounded transition-colors",
              activeTab === "text"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Text
          </button>
        </div>
      </header>

      {activeTab === "photo" && (
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border">
          {WEEK_LABELS.map((w) => (
            <div
              key={w}
              className="bg-muted text-center text-xs font-medium text-muted-foreground py-2"
            >
              {w}
            </div>
          ))}
          {days.map((d) => {
            const key = toDateKey(d);
            const inMonth = d.getMonth() === currentMonth.getMonth();
            const isToday = key === todayKey;
            const dayPosts = postsByDate.get(key) ?? [];
            const firstPost = dayPosts[0];
            const hasPhoto = !!firstPost?.imageUrl;

            return (
              <button
                type="button"
                key={key}
                onClick={() => handleCellClick(key)}
                className={cn(
                  "relative bg-background aspect-square overflow-hidden hover:brightness-95 transition",
                  !inMonth && "opacity-40",
                  isToday && "ring-2 ring-primary ring-inset z-10"
                )}
              >
                {hasPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={firstPost.imageUrl!}
                    alt={firstPost.caption ?? ""}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <span
                  className={cn(
                    "absolute top-1 left-1 text-xs font-medium z-10 px-1.5 py-0.5 rounded",
                    hasPhoto
                      ? "text-white bg-black/35"
                      : "text-foreground",
                    isToday &&
                      (hasPhoto
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-primary font-bold")
                  )}
                >
                  {d.getDate()}
                </span>

                {dayPosts.length > 1 && (
                  <span className="absolute bottom-1 right-1 text-[10px] text-white bg-black/55 rounded px-1.5 py-0.5 z-10">
                    +{dayPosts.length - 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "text" && (
        <div className="rounded-lg border overflow-hidden flex flex-col divide-y">
          {allDaysInCurrentMonth.map((row) => {
            const isToday = row.dateKey === todayKey;
            return (
              <button
                type="button"
                key={row.dateKey}
                onClick={() => handleCellClick(row.dateKey)}
                className={cn(
                  "flex items-start gap-4 px-4 py-2.5 hover:bg-muted/50 text-left transition-colors bg-background",
                  isToday && "bg-primary/5"
                )}
              >
                <div className="flex flex-col items-center w-14 shrink-0">
                  <span
                    className={cn(
                      "text-base font-medium leading-none",
                      isToday && "text-primary font-bold"
                    )}
                  >
                    {formatMonthDay(row.dateKey)}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatWeekdayShort(row.dateKey)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  {row.posts.length === 0 ? (
                    <span className="text-sm text-muted-foreground/30">—</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {row.posts.map((p) => (
                        <p
                          key={p.id}
                          className="text-sm leading-relaxed line-clamp-2"
                        >
                          {p.caption ?? (
                            <span className="text-muted-foreground">
                              (photo only)
                            </span>
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <PhotoViewer
        isOpen={viewerDate !== null}
        onClose={() => setViewerDate(null)}
        onEdit={handleEditFromViewer}
        posts={viewerPosts}
        dateLabel={viewerDate ? formatViewerDateLabel(viewerDate) : ""}
      />

      <PostModal
        isOpen={modalDate !== null}
        onClose={() => setModalDate(null)}
        selectedDate={modalDate}
        existingPosts={modalPosts}
        userId={userId}
      />
    </div>
  );
}
