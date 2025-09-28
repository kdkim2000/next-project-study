// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/Header";
import { generateWebsiteJSONLD } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Developer's Blog Platform",
  description: "React와 Next.js를 학습하는 개발자 블로그",
  keywords: "React, Next.js, TypeScript, 웹개발, 블로그",
  authors: [{ name: "Developer Team" }],
  creator: "Developer Team",
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJSONLD = generateWebsiteJSONLD();

  return (
    <html lang="ko">
      <head>
        {/* RSS 피드 링크 */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Developer's Blog Platform RSS Feed"
          href="/rss.xml"
        />
        
        {/* 사이트맵 링크 */}
        <link
          rel="sitemap"
          type="application/xml"
          href="/sitemap.xml"
        />
        
        {/* Prism.js 코드 하이라이팅 CSS */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"
          rel="stylesheet"
        />
        
        {/* 구조화 데이터 (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJSONLD) }}
        />
        
        {/* 메타 태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1976d2" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* Open Graph 기본 이미지 */}
        <meta property="og:image" content="/og-default.jpg" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Developer's Blog Platform" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@developers_blog" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}