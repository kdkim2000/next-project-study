// src/lib/rss.ts - RSS 피드 생성 유틸리티

import { getAllPosts } from './blog';
import { RSSItem } from '@/types/blog';

// 사이트 기본 정보 (실제 배포 시 수정 필요)
const SITE_URL = 'https://your-blog-domain.com';
const SITE_TITLE = "Developer's Blog";
const SITE_DESCRIPTION = '개발자를 위한 기술 블로그';

/**
 * RSS XML 피드를 생성하는 함수
 * @returns RSS XML 문자열
 */
export async function generateRSSFeed(): Promise<string> {
  const posts = await getAllPosts(20); // 최신 20개 포스트만 RSS에 포함
  
  // RSS 아이템들 생성
  const rssItems: RSSItem[] = posts.map(post => ({
    title: post.title,
    description: post.excerpt,
    link: `${SITE_URL}/posts/${post.slug}`,
    pubDate: new Date(post.date).toUTCString(),
    category: post.category,
  }));

  // RSS XML 생성
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <description>${SITE_DESCRIPTION}</description>
    <link>${SITE_URL}</link>
    <language>ko-kr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    
    ${rssItems.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category><![CDATA[${item.category}]]></category>
    </item>
    `).join('')}
  </channel>
</rss>`;

  return rssXml.trim();
}