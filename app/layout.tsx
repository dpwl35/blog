import "@styles/style.scss";
import type { Metadata } from "next";
import { Header } from "./components/header";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import Script from "next/script";
import { themeEffect } from "@utils/themeEffect";
import MainWrapper from "./components/main-wrapper";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "dpwl.35.blog",
    template: "%s | dpwl.35.blog",
  },
  description: "소소한 기록용 블로그 입니다.",
  openGraph: {
    title: "dpwl.35.blog",
    description: "소소한 기록용 블로그",
    url: "https://dpwl35.com",
    siteName: "dpwl.35.blog",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-theme="light">
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})()`,
          }}
        />
      </head>
      <body>
        <div className="wrap">
          <Header />
          <MainWrapper>
            {children}
            <Analytics />
            <SpeedInsights />
          </MainWrapper>
          <Footer />
        </div>
      </body>
    </html>
  );
}
