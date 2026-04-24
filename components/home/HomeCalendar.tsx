"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { PostModal, type ExistingPost } from "./PostModal";

type HomeCalendarProps = {
  posts: ExistingPost[];
  userId: string;
};

const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const selectedDatePosts = selectedDate
    ? postsByDate.get(selectedDate) ?? []
    : [];

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
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrevMonth}>
            ←
          </Button>
          <h2 className="text-xl font-semibold sm:text-2xl min-w-32 text-center">
            {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
          </h2>
          <Button variant="outline" size="sm" onClick={goNextMonth}>
            →
          </Button>
          <Button variant="ghost" size="sm" onClick={goThisMonth}>
            今月
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
            写真
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
            一言
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
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

          return (
            <button
              type="button"
              key={key}
              onClick={() => setSelectedDate(key)}
              className={cn(
                "bg-background aspect-square p-1 text-left flex flex-col gap-0.5 hover:bg-muted/50 transition-colors",
                !inMonth && "opacity-40",
                isToday && "ring-2 ring-primary ring-inset"
              )}
            >
              <span
                className={cn(
                  "text-xs",
                  isToday && "font-bold text-primary"
                )}
              >
                {d.getDate()}
              </span>

              {firstPost && activeTab === "photo" && firstPost.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={firstPost.imageUrl}
                  alt={firstPost.caption ?? ""}
                  className="w-full flex-1 object-cover rounded-sm"
                />
              )}

              {firstPost && activeTab === "text" && (
                <div className="flex-1 flex items-start">
                  <p className="text-xs line-clamp-3 leading-tight">
                    {firstPost.caption ?? "(写真のみ)"}
                  </p>
                </div>
              )}

              {dayPosts.length > 1 && (
                <span className="text-[10px] text-muted-foreground self-end">
                  +{dayPosts.length - 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        日付をクリックして、その日の瞬間を残す
      </p>

      <PostModal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        selectedDate={selectedDate}
        existingPosts={selectedDatePosts}
        userId={userId}
      />
    </div>
  );
}
