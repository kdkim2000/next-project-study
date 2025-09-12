// src/app/api/products/[id]/route.ts - 개별 제품 상세 정보를 가져오는 API (SQLite 이미지 파싱 포함)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseProductImages, parseProductsImages } from '@/lib/imageUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    console.log('🔍 제품 상세 조회 ID:', productId);

    // 제품 상세 정보 조회
    const rawProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true, // 카테고리 정보 포함
      },
    });

    // 제품이 없는 경우
    if (!rawProduct) {
      console.log('❌ 제품을 찾을 수 없음:', productId);
      return NextResponse.json(
        {
          success: false,
          error: '제품을 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    // SQLite JSON 문자열 이미지를 배열로 파싱
    const product = parseProductImages(rawProduct);

    // 관련 제품 조회 (같은 카테고리의 다른 제품들)
    const rawRelatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: productId, // 현재 제품 제외
        },
      },
      include: {
        category: true,
      },
      take: 4, // 최대 4개
    });

    // 관련 제품들도 이미지 파싱
    const relatedProducts = parseProductsImages(rawRelatedProducts);

    console.log('✅ 제품 상세 조회 성공:', product.name);
    console.log('📦 관련 제품 수:', relatedProducts.length);

    return NextResponse.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });

  } catch (error) {
    console.error('❌ 제품 상세 정보 조회 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 정보를 불러오는데 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}