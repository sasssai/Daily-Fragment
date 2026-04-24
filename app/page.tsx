import AuthHeader from "@/components/header/AuthHeader";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  return (
    <>
      <AuthHeader />
      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-20 sm:py-28 gap-14 text-center">
        <header className="flex flex-col gap-3">
          <h1 className="text-5xl sm:text-7xl font-medium tracking-wide leading-tight">
            Daily Fragment
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground tracking-widest">
            日常のかけら
          </p>
        </header>

        <div className="max-w-xl flex flex-col gap-4">
          <p className="text-lg sm:text-xl leading-relaxed">
            記録より記憶に残る一瞬を。
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-loose">
            毎日のひとこまを写真と一言で残し、
            <br />
            記憶に留めたい瞬間だけを世界に公開する。
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {isLoggedIn ? (
            <Button asChild size="lg">
              <Link href="/protected/home">Open your calendar</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Log in</Link>
              </Button>
            </>
          )}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 max-w-3xl mt-6 text-sm">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl">01</span>
            <p className="font-medium">Capture</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              写真と一言で、<br />日々の断片を残す
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl">02</span>
            <p className="font-medium">Pin</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              最大6つ、<br />記憶に残したい瞬間を選ぶ
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl">03</span>
            <p className="font-medium">Share</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              ピンした瞬間だけが、<br />あなたのページに咲く
            </p>
          </div>
        </section>

        <footer className="mt-16 text-xs text-muted-foreground">
          Daily Fragment
        </footer>
      </div>
    </>
  );
}
