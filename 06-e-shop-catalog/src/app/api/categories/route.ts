// src/app/api/categories/route.ts - 카테고리 목록을 가져오는 API

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 모든 카테고리 조회 (제품 개수 포함)
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true, // 각 카테고리별 제품 개수
          },
        },
      },
      orderBy: {
        name: 'asc', // 이름순으로 정렬
      },
    });

    // 응답 데이터 변환 (제품 개수를 productCount로 변경)
    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
    });

  } catch (error) {
    console.error('카테고리 목록 조회 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: '카테고리 목록을 불러오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}