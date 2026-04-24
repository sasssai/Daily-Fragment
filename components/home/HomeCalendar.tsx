"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { PostModal, type ExistingPost } from "./PostModal";

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
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
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

                {firstPost && firstPost.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={firstPost.imageUrl}
                    alt={firstPost.caption ?? ""}
                    className="w-full flex-1 object-cover rounded-sm"
                  />
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
      )}

      {activeTab === "text" && (
        <div className="flex flex-col divide-y rounded-lg border">
          {allDaysInCurrentMonth.map((row) => {
            const isToday = row.dateKey === todayKey;
            return (
              <button
                type="button"
                key={row.dateKey}
                onClick={() => setSelectedDate(row.dateKey)}
                className={cn(
                  "flex items-start gap-4 px-4 py-2.5 hover:bg-muted/50 text-left transition-colors",
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
