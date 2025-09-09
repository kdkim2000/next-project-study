// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { getCategoriesWithCount } from '@/lib/blog';

export async function GET() {
  try {
    const categories = await getCategoriesWithCount();
    return NextResponse.json(
      { success: true, data: categories },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load categories' },
      { status: 500 },
    );
  }
}
