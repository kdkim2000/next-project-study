// src/app/api/products/route.ts - 제품 목록을 가져오는 API 라우트 (SQLite 이미지 파싱 포함)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseProductsImages } from '@/lib/imageUtils';
import { ProductListResponse, PaginationInfo } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 추출
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    console.log('🔍 API 요청 파라미터:', { page, limit, category, search, sortBy, sortOrder });

    // 필터 조건 구성
    const where: any = {};

    // 카테고리 필터
    if (category && category !== 'all') {
      where.categoryId = category;
    }

    // 검색 필터
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive', // 대소문자 구분 없이 검색
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 가격 범위 필터
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // 정렬 옵션 구성
    const orderBy: any = {};
    switch (sortBy) {
      case 'name':
        orderBy.name = sortOrder;
        break;
      case 'price':
        orderBy.price = sortOrder;
        break;
      case 'rating':
        orderBy.rating = sortOrder;
        break;
      default:
        orderBy.createdAt = sortOrder;
    }

    // 총 개수 조회 (페이지네이션용)
    const total = await prisma.product.count({ where });
    console.log('📊 총 제품 수:', total);

    // 제품 목록 조회
    const rawProducts = await prisma.product.findMany({
      where,
      include: {
        category: true, // 카테고리 정보 포함
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log('📦 조회된 제품 수:', rawProducts.length);

    // SQLite JSON 문자열 이미지를 배열로 파싱
    const products = parseProductsImages(rawProducts);

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    // 응답 데이터 구성
    const response: ProductListResponse = {
      products,
      pagination,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error('❌ 제품 목록 조회 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 목록을 불러오는데 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}