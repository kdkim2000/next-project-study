// src/app/sitemap.xml/route.ts - 사이트맵을 생성하는 API 라우트

import { NextResponse } from 'next/server';
import { getAllPosts, getCategoriesWithCount } from '@/lib/blog';

// 사이트 기본 정보 (실제 배포 시 수정 필요)
const SITE_URL = 'https://your-blog-domain.com';

/**
 * 사이트맵 GET 요청 핸들러
 * /sitemap.xml 경로로 접근했을 때 사이트맵 XML을 생성하여 반환
 */
export async function GET() {
  try {
    // 모든 포스트와 카테고리 데이터 가져오기
    const [posts, categories] = await Promise.all([
      getAllPosts(),
      getCategoriesWithCount(),
    ]);

    // 현재 날짜 (ISO 형식)
    const currentDate = new Date().toISOString();

    // 사이트맵 XML 생성
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 홈페이지 -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 포스트 목록 페이지 -->
  <url>
    <loc>${SITE_URL}/posts</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- 카테고리 목록 페이지 -->
  <url>
    <loc>${SITE_URL}/categories</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 검색 페이지 -->
  <url>
    <loc>${SITE_URL}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- 개별 포스트 페이지들 -->
  ${posts.map(post => `
  <url>
    <loc>${SITE_URL}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}

  <!-- 개별 카테고리 페이지들 -->
  ${categories.map(categoryData => `
  <url>
    <loc>${SITE_URL}/categories/${encodeURIComponent(categoryData.category)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`;

    // 사이트맵 XML을 응답으로 반환
    return new NextResponse(sitemapXml.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8', // XML 콘텐츠 타입
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24시간 캐싱
      },
    });
  } catch (error) {
    console.error('사이트맵 생성 중 오류:', error);
    
    // 오류 발생 시 500 에러 반환
    return new NextResponse('사이트맵을 생성할 수 없습니다.', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}