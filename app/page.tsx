import { Button } from "@/components/ui/button";
import { SakuraCanvas } from "@/components/landing/SakuraCanvas";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#305269] via-[#203a52] to-[#12243a] text-white overflow-x-hidden isolate">
      <SakuraCanvas />

      <nav className="relative flex w-full items-center justify-between px-6 py-5 md:px-12">
        <span className="text-lg font-semibold tracking-wide sm:text-xl">
          Daily Fragment
        </span>
        {!isLoggedIn && (
          <div className="flex gap-3 text-sm">
            <Link
              href="/auth/login"
              className="text-white/70 hover:text-white transition"
            >
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="text-white/70 hover:text-white transition"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>

      <div className="relative flex w-full flex-1 flex-col items-center justify-center px-6 py-16 sm:py-24 gap-14 text-center">
        <header className="flex flex-col gap-3">
          <h1 className="text-5xl sm:text-7xl font-medium tracking-wide leading-tight">
            Daily Fragment
          </h1>
          <p className="text-sm sm:text-base text-white/60 tracking-widest">
            日常のかけら
          </p>
        </header>

        <div className="max-w-xl flex flex-col gap-6">
          <p className="text-lg sm:text-xl leading-relaxed">
            記録より記憶に残る一瞬を。
          </p>
          <p className="text-sm sm:text-base text-white/70 leading-loose">
            忘れたことに気づかないくらい小さな幸せを。
            <br />
            記憶に留めたいと心が叫んだ瞬間を。
            <br />
            忘れる前に、忘れられる前に、記録ではなく記憶に残すために。
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {isLoggedIn ? (
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link href="/protected/home">Gathering your fragment</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/60 text-white bg-transparent hover:bg-white/10"
              >
                <Link href="/auth/login">Log in</Link>
              </Button>
            </>
          )}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 max-w-3xl mt-6 text-sm">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl text-white/40">01</span>
            <p className="font-medium">Capture</p>
            <p className="text-white/60 text-xs leading-relaxed">
              写真と一言で
              <br />
              日々の断片を残す
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl text-white/40">02</span>
            <p className="font-medium">Pin</p>
            <p className="text-white/60 text-xs leading-relaxed">
              記憶に留めたい
              <br />
              瞬間を選ぶ
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl text-white/40">03</span>
            <p className="font-medium">Share</p>
            <p className="text-white/60 text-xs leading-relaxed">
              ピンした瞬間を
              <br />
              世界に公開する
            </p>
          </div>
        </section>

        <footer className="mt-16 text-xs text-white/40">Daily Fragment</footer>
      </div>
    </div>
  );
}
