import type { Metadata } from "next";
import { Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : "http://localhost:3000";

const SITE_DESCRIPTION =
  "記録より記憶に残る一瞬を。日々の小さな光を、写真とひとことで集めるWebアプリ。";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  applicationName: "Daily Fragment",
  title: {
    default: "Daily Fragment — 日常のかけら",
    template: "%s · Daily Fragment",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Daily Fragment — 日常のかけら",
    description: SITE_DESCRIPTION,
    url: defaultUrl,
    siteName: "Daily Fragment",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `${defaultUrl}/icons/og-icon.png`,
        width: 1895,
        height: 995,
        alt: "Daily Fragment — 日常のかけら",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Fragment — 日常のかけら",
    description: SITE_DESCRIPTION,
    images: ["/icons/og-icon.png"],
  },
};

const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${shipporiMincho.className} flex min-h-screen w-full flex-col items-center antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
