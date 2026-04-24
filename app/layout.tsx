import type { Metadata } from "next";
import { Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  applicationName: "hanami",
  title: "hanami — 今日の小さな光",
  description: "記録より記憶に残る一瞬を。",
  openGraph: {
    title: "hanami — 今日の小さな光",
    description: "記録より記憶に残る一瞬を。",
    url: defaultUrl,
    siteName: "hanami",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `${defaultUrl}/icons/og-icon.png`,
        width: 1200,
        height: 630,
        alt: "Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "hanami — 今日の小さな光",
    description: "記録より記憶に残る一瞬を。",
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
