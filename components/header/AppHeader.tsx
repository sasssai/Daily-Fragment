"use client";
import Link from "next/link";
import React from "react";
import { Home, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "../MobileNavigation";
import { useUser } from "@/context/UserContext";

const navItems = [
  { href: "/protected/home", icon: Home, label: "Home" },
  { href: "/protected/settings", icon: Settings, label: "Settings" },
];

const Header = () => {
  const pathname = usePathname();
  const user = useUser();
  const displayName = user.displayName ?? user.handle ?? "your";

  const isHome = pathname === "/protected/home";

  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between bg-gray-50 px-4 py-3 shadow-sm md:px-16">
      <Link
        href={isHome ? "/protected/home" : "/"}
        className="flex flex-col leading-tight min-w-0"
      >
        {isHome ? (
          <span className="text-lg font-semibold truncate sm:text-xl">
            {displayName}&apos;s Fragment
          </span>
        ) : (
          <>
            <span className="text-lg font-semibold tracking-wide sm:text-xl">
              Daily Fragment
            </span>
            <span className="text-xs text-muted-foreground">
              日常のかけら
            </span>
          </>
        )}
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 md:hidden">
          <MobileNavigation navItems={navItems} />
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center rounded-md px-3 py-2 text-lg font-medium",
                    "before:absolute before:bottom-0 before:left-0 before:h-[2px] before:transition-all before:duration-300 before:ease-in-out",
                    isActive
                      ? "before:bg-primary text-primary before:w-full"
                      : "before:bg-primary text-primary/75 hover:text-primary before:w-0 hover:before:w-full",
                  )}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
