// src/app/api/contents/route.ts
// 콘텐츠 관련 API 엔드포인트 - 목록 조회 및 생성

import { NextRequest, NextResponse } from 'next/server';
import { contentQueries } from '../../../lib/database';
import { Content, ApiResponse, SearchFilters } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/contents
 * 콘텐츠 목록 조회 API
 * 
 * 쿼리 파라미터:
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 10)
 * - query: 검색 키워드
 * - type: 콘텐츠 타입 필터
 * - status: 상태 필터
 * - language: 언어 필터
 * - sortBy: 정렬 기준 (createdAt, updatedAt, title)
 * - sortOrder: 정렬 방향 (asc, desc)
 */
export async function GET(request: NextRequest) {
  try {
    console.log('콘텐츠 목록 조회 API 호출');

    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    
    // 페이지네이션 파라미터
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // 정렬 파라미터
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 검색 및 필터 파라미터
    const filters: SearchFilters = {
      query: searchParams.get('query') || undefined,
      type: searchParams.get('type') as any || undefined,
      status: searchParams.get('status') as any || undefined,
      language: searchParams.get('language') as any || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      author: searchParams.get('author') || undefined,
    };

    console.log('요청 파라미터:', { page, limit, sortBy, sortOrder, filters });

    // 유효성 검사
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: '잘못된 페이지네이션 파라미터입니다.',
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 데이터베이스에서 콘텐츠 조회
    const result = contentQueries.getAll(page, limit, filters);

    // 응답 데이터 구성
    const response: ApiResponse = {
      success: true,
      data: {
        contents: result.contents,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        }
      },
      message: `${result.contents.length}개의 콘텐츠를 조회했습니다.`
    };

    console.log(`콘텐츠 조회 완료: ${result.contents.length}개 항목`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('콘텐츠 목록 조회 오류:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.',
      code: 500
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/contents
 * 새 콘텐츠 생성 API
 * 
 * 요청 본문: Content 객체 (id, createdAt, updatedAt 제외)
 */
export async function POST(request: NextRequest) {
  try {
    console.log('새 콘텐츠 생성 API 호출');

    // 요청 본문에서 콘텐츠 데이터 추출
    const body = await request.json();
    console.log('요청 데이터:', body);

    // 필수 필드 검증
    const requiredFields = ['title', 'content', 'type', 'createdBy', 'updatedBy'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 슬러그 자동 생성 (제목 기반)
    if (!body.slug) {
      body.slug = generateSlug(body.title);
    }

    // 기본값 설정
    const contentData = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || generateExcerpt(body.content),
      type: body.type || 'article',
      status: body.status || 'draft',
      language: body.language || 'ko',
      meta: body.meta || {}, 
      createdBy: body.createdBy,
      updatedBy: body.updatedBy,
      currentVersion: 1,
      allowComments: body.allowComments ?? true,
      featuredOrder: body.featuredOrder || 0,
      tags: body.tags || [],
      publishedAt: body.status === 'published' ? new Date().toISOString() : undefined
    };

    console.log('처리된 콘텐츠 데이터:', contentData);

    // 슬러그 중복 검사
    const existingContent = contentQueries.getBySlug(contentData.slug);
    if (existingContent) {
      // 슬러그 뒤에 숫자 추가
      let counter = 1;
      let uniqueSlug = `${contentData.slug}-${counter}`;
      
      while (contentQueries.getBySlug(uniqueSlug)) {
        counter++;
        uniqueSlug = `${contentData.slug}-${counter}`;
      }
      
      contentData.slug = uniqueSlug;
      console.log('슬러그 중복으로 인한 변경:', uniqueSlug);
    }

    // 데이터베이스에 콘텐츠 생성
    const newContent = contentQueries.create(contentData);

    const response: ApiResponse = {
      success: true,
      data: newContent,
      message: '콘텐츠가 성공적으로 생성되었습니다.',
      code: 201
    };

    console.log('콘텐츠 생성 완료:', newContent.id);

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('콘텐츠 생성 오류:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '콘텐츠 생성 중 오류가 발생했습니다.',
      code: 500
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * 제목에서 URL 친화적인 슬러그 생성
 * 한글과 영문을 모두 지원
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // 한글 공백을 하이픈으로 변경
    .replace(/\s+/g, '-')
    // 특수문자 제거 (한글, 영문, 숫자, 하이픈만 남김)
    .replace(/[^\w\u3131-\u3163\uac00-\ud7a3-]/g, '')
    // 연속된 하이픈을 하나로 합침
    .replace(/-+/g, '-')
    // 시작과 끝의 하이픈 제거
    .replace(/^-|-$/g, '')
    // 최대 길이 제한
    .substring(0, 100);
}

/**
 * 콘텐츠 본문에서 요약문 자동 생성
 * HTML 태그를 제거하고 첫 200자만 추출
 */
function generateExcerpt(content: string, maxLength: number = 200): string {
  return content
    // HTML 태그 제거
    .replace(/<[^>]*>/g, '')
    // 연속된 공백을 하나로 합침
    .replace(/\s+/g, ' ')
    .trim()
    // 지정된 길이만큼 자르기
    .substring(0, maxLength)
    // 단어 중간에서 자른 경우 마지막 단어 제거
    .replace(/\s\S*$/, '')
    // 끝에 생략 표시 추가 (원본이 더 긴 경우만)
    + (content.length > maxLength ? '...' : '');
}