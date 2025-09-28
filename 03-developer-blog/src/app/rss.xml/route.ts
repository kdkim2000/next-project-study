// src/app/rss.xml/route.ts
import { getAllPosts } from '@/lib/posts';
import { getFullUrl } from '@/lib/path-utils';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const posts = getAllPosts();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Developer's Blog Platform</title>
    <description>React와 Next.js 개발 블로그</description>
    <link>${baseUrl}</link>
    <language>ko-KR</language>
    <managingEditor>developer@example.com (Developer Team)</managingEditor>
    <webMaster>developer@example.com (Developer Team)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${getFullUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
    
    ${posts
      .slice(0, 20) // 최신 20개 포스트만
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || post.title}]]></description>
      <link>${getFullUrl(`/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${getFullUrl(`/blog/${post.slug}`)}</guid>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()}</pubDate>
      ${post.keywords?.length ? `<category><![CDATA[${post.keywords.join(', ')}]]></category>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}