// src/lib/seo.ts
import { Metadata } from 'next';

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
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};

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
  const fullUrl = url ? `${defaultSEO.baseUrl}${url}` : defaultSEO.baseUrl;
  const fullImage = image ? `${defaultSEO.baseUrl}${image}` : `${defaultSEO.baseUrl}/og-default.jpg`;

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
        'application/rss+xml': `${defaultSEO.baseUrl}/rss.xml`,
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

    // Additional SEO enhancements
    category: type === 'article' ? 'technology' : undefined,
    classification: 'Development Blog',
    
    // JSON-LD structured data will be handled separately
    other: {
      'article:author': type === 'article' ? author : undefined,
      'article:published_time': type === 'article' ? publishedTime : undefined,
      'article:modified_time': type === 'article' ? modifiedTime : undefined,
      'article:tag': type === 'article' ? keywords.join(', ') : undefined,
    },
  };
}

export function generateBlogPostSEO(post: {
  title: string;
  description?: string;
  keywords?: string[];
  slug: string;
  date?: string;
  readingTime?: {
    text: string;
    minutes: number;
  };
}): Metadata {
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

// JSON-LD 구조화 데이터 생성
export function generateBlogPostJSONLD(post: {
  title: string;
  description?: string;
  slug: string;
  date?: string;
  readingTime?: {
    text: string;
    minutes: number;
  };
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `${defaultSEO.baseUrl}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: defaultSEO.author,
    },
    publisher: {
      '@type': 'Organization',
      name: defaultSEO.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${defaultSEO.baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${defaultSEO.baseUrl}/blog/${post.slug}`,
    },
    keywords: post.keywords?.join(', '),
    wordCount: post.readingTime ? Math.round(post.readingTime.minutes * 200) : undefined,
    timeRequired: post.readingTime ? `PT${post.readingTime.minutes}M` : undefined,
  };
}

export function generateWebsiteJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: defaultSEO.siteName,
    url: defaultSEO.baseUrl,
    description: 'React와 Next.js 개발 블로그',
    publisher: {
      '@type': 'Organization',
      name: defaultSEO.siteName,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${defaultSEO.baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}