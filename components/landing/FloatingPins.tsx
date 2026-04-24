"use client";

import Link from "next/link";

export type Floater = {
  id: string;
  imageUrl: string;
  handle: string;
  caption: string | null;
};

type FloatingPinsProps = {
  pins: Floater[];
};

export function FloatingPins({ pins }: FloatingPinsProps) {
  if (pins.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {pins.map((pin, i) => {
        // 個体ごとに流れの速さ・出発点・遅延を少しずつバラす
        const duration = 38 + ((i * 7) % 24); // 38〜62秒
        const delay = (i * 3) % 10; // 0〜10秒ずれ
        const startTop = (i * 13) % 45; // 上辺から何%下にスタート
        const startLeft = 80 + (i % 3) * 6; // 画面端近く (80〜92%)
        const size = 64 + (i % 4) * 10; // 64〜94px

        return (
          <Link
            key={pin.id}
            href={`/${pin.handle}`}
            className="absolute pointer-events-auto group block"
            style={{
              top: `${startTop}%`,
              left: `${startLeft}%`,
              animation: `floatSakura ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
            aria-label={`Open ${pin.handle}'s page`}
          >
            <div
              className="relative rounded-full overflow-hidden border-2 border-white/30 shadow-xl shadow-black/30 hover:scale-[1.8] hover:border-white/90 hover:z-10 transition-all duration-500"
              style={{ width: `${size}px`, height: `${size}px` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pin.imageUrl}
                alt={pin.caption ?? ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              @{pin.handle}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
