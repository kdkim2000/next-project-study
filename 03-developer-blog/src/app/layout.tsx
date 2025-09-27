// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/Header";
import { Container } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Developer's Blog",
    template: "%s | Developer's Blog"
  },
  description: "Next.js와 MUI를 기반으로 한 개발 블로그 플랫폼입니다. React, TypeScript, 웹 개발에 관한 다양한 주제를 다룹니다.",
  keywords: ["development", "programming", "nextjs", "react", "typescript", "mui", "blog"],
  authors: [{ name: "Developer" }],
  creator: "Developer",
  publisher: "Developer's Blog",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://your-domain.com",
    siteName: "Developer's Blog",
    title: "Developer's Blog",
    description: "Next.js와 MUI를 기반으로 한 개발 블로그 플랫폼입니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer's Blog",
    description: "Next.js와 MUI를 기반으로 한 개발 블로그 플랫폼입니다.",
    creator: "@developer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 추가 메타 태그들 */}
        <meta name="theme-color" content="#1976d2" />
        <meta name="color-scheme" content="light" />
        <link rel="canonical" href="https://your-domain.com" />
        
        {/* Prism.js 테마 CSS */}
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <Container sx={{ mt: 4, pb: 4 }}>{children}</Container>
        </Providers>
      </body>
    </html>
  );
}