"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicLightbox, type PinPost } from "./PublicLightbox";

type Profile = {
  handle: string;
  display_name: string | null;
  bio: string | null;
};

type PublicPortfolioProps = {
  profile: Profile;
  pins: PinPost[];
  isLoggedIn: boolean;
};

export function PublicPortfolio({
  profile,
  pins,
  isLoggedIn,
}: PublicPortfolioProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col">
      <nav className="flex w-full items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-lg font-semibold tracking-wide sm:text-xl">
            Daily Fragment
          </span>
          <span className="text-xs text-muted-foreground">日常のかけら</span>
        </Link>
        <div className="flex gap-3 text-sm">
          {isLoggedIn ? (
            <Link
              href="/protected/home"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Your calendar →
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Log in
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto w-full px-4 py-10 sm:py-16 flex flex-col gap-10">
        <header className="text-center flex flex-col items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
            {profile.display_name ?? profile.handle}
          </h1>
          <p className="text-sm text-muted-foreground">@{profile.handle}</p>
          {profile.bio && (
            <p className="text-sm sm:text-base max-w-md mt-3 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </header>

        {pins.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No pinned fragment yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {pins.map((pin, i) => (
              <button
                key={pin.id}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="relative aspect-square overflow-hidden rounded-lg hover:brightness-95 transition bg-muted"
              >
                {pin.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pin.imageUrl}
                    alt={pin.caption ?? ""}
                    className="w-full h-full object-cover"
                  />
                )}
                {pin.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs p-2 text-left line-clamp-2">
                    {pin.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <PublicLightbox
          pins={pins}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((i) => (i === null ? null : Math.max(0, i - 1)))
          }
          onNext={() =>
            setLightboxIndex((i) =>
              i === null ? null : Math.min(pins.length - 1, i + 1)
            )
          }
        />
      </div>
    </div>
  );
}
