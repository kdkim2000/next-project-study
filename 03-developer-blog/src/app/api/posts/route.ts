// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(
      { success: true, data: posts },
      {
        headers: {
          // CDN/Edge 캐시 힌트 (선택)
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load posts' },
      { status: 500 },
    );
  }
}
