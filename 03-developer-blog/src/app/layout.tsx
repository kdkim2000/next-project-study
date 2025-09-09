import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "%s | Developer's Blog",
    default: "Developer's Blog - 개발자 블로그",
  },
  description: "React/Next.js 기반 마크다운 블로그 샘플",
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "Developer's Blog",
    description: "React/Next.js 기반 마크다운 블로그 샘플",
    url: process.env.SITE_URL ?? "http://localhost:3000",
    siteName: "Developer's Blog",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism.min.css"
        />
      </head>
      <body className={inter.className}>
        <main style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px" }}>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0 }}>Developer&apos;s Blog</h1>
            <nav style={{ marginTop: 8, fontSize: 14 }}>
              <a href="/" style={{ marginRight: 12 }}>Home</a>
              <a href="/posts" style={{ marginRight: 12 }}>Posts</a>
              <a href="/categories" style={{ marginRight: 12 }}>Categories</a>
              <a href="/search" style={{ marginRight: 12 }}>Search</a>
              <a href="/rss.xml">RSS</a>
            </nav>
          </header>
          {children}
        </main>

        {/* Prism.js (코어 + autoloader) */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
