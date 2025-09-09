// src/app/api/search/route.ts
import { NextResponse } from 'next/server';
import { searchPosts } from '@/lib/blog';
import type { SearchFilters } from '@/types/blog';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get('query') ?? undefined;
    const category = searchParams.get('category') ?? undefined;
    const tagsParam = searchParams.get('tags') ?? undefined;

    const tags = tagsParam
      ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean)
      : undefined;

    const filters: SearchFilters = {
      query: q,
      category,
      tags,
    };

    const results = await searchPosts(filters);

    return NextResponse.json(
      { success: true, data: results },
      {
        headers: {
          'Cache-Control': 's-maxage=120, stale-while-revalidate=300',
        },
      },
    );
  } catch (error) {
    console.error('GET /api/search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 },
    );
  }
}
