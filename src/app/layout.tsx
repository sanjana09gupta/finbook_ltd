import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InteractiveMain } from "@/components/layout/InteractiveMain";
import { CustomCursor } from "@/components/layout/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Finbook Global | Outsourced Accounting, Bookkeeping & CFO Services",
    template: "%s | Finbook Global",
  },
  description:
    "Finbook Global provides outsourced bookkeeping, taxation, and CFO services for small and growing businesses in the USA and UK, run by chartered accountants.",
  metadataBase: new URL("https://finbookglobal.com"),
  icons: {
    icon: "/images/fav.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/images/arrow.png" as="image" type="image/png" />
        <link rel="preload" href="/images/left-click.png" as="image" type="image/png" />
      </head>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <CustomCursor />
        <Header />
        <InteractiveMain>{children}</InteractiveMain>
        <Footer />
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      </body>
    </html>
  );
}
