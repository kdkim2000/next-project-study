// src/lib/seo-ts.ts
import type { Metadata } from 'next';
import { getMetaUrl, getFullUrl } from './path-utils';

export interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'website' | 'article' | 'blog';
  locale?: string;
  siteName?: string;
}

const defaultSEO = {
  siteName: "Developer's Blog Platform",
  author: 'Developer Team',
  locale: 'ko_KR',
  type: 'website' as const,
} as const;

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  author = defaultSEO.author,
  publishedTime,
  modifiedTime,
  type = defaultSEO.type,
  locale = defaultSEO.locale,
  siteName = defaultSEO.siteName,
}: SEOConfig): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = url ? getMetaUrl(url) : getMetaUrl();
  const fullImage = image ? getMetaUrl(image) : getMetaUrl('/og-default.jpg');

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: siteName,
    
    // Open Graph
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author],
        tags: keywords,
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: '@developers_blog',
      creator: `@${author.replace(/\s+/g, '_').toLowerCase()}`,
      title: fullTitle,
      description,
      images: [fullImage],
    },

    // Additional Meta Tags
    alternates: {
      canonical: fullUrl,
      types: {
        'application/rss+xml': getFullUrl('/rss.xml'),
      },
    },

    // Robots
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

    // Category
    category: type === 'article' ? 'technology' : undefined,
    
    // Additional metadata
    other: {
      'article:author': type === 'article' ? author : undefined,
      'article:published_time': type === 'article' ? publishedTime : undefined,
      'article:modified_time': type === 'article' ? modifiedTime : undefined,
      'article:tag': type === 'article' ? keywords.join(', ') : undefined,
    },
  };
}

export interface BlogPostData {
  title: string;
  description?: string;
  keywords?: string[];
  slug: string;
  date?: string;
  readingTime?: {
    text: string;
    minutes: number;
  };
}

export function generateBlogPostSEO(post: BlogPostData): Metadata {
  return generateSEOMetadata({
    title: post.title,
    description: post.description || `${post.title}에 대한 개발 블로그 포스트입니다.`,
    keywords: post.keywords || ['development', 'programming', 'blog'],
    url: `/blog/${post.slug}`,
    publishedTime: post.date,
    modifiedTime: post.date,
    type: 'article',
  });
}

export function generateHomeSEO(): Metadata {
  return generateSEOMetadata({
    title: '홈',
    description: 'React와 Next.js 개발 블로그 - 최신 웹 개발 기술과 튜토리얼을 공유합니다.',
    keywords: ['React', 'Next.js', '개발', '블로그', '웹개발', 'TypeScript', 'JavaScript'],
    url: '/',
  });
}

export function generateBlogListSEO(): Metadata {
  return generateSEOMetadata({
    title: '블로그',
    description: 'React, Next.js, TypeScript 등 최신 웹 개발 기술에 대한 글들을 모아놓았습니다.',
    keywords: ['React', 'Next.js', 'TypeScript', '웹개발', '프론트엔드', '블로그'],
    url: '/blog',
  });
}