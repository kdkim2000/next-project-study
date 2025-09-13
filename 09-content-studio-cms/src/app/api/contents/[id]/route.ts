// src/app/api/contents/[id]/route.ts
// 개별 콘텐츠 관련 API 엔드포인트 - 조회, 수정, 삭제

import { NextRequest, NextResponse } from 'next/server';
import { contentQueries } from '../../../../lib/database';
import { ApiResponse } from '../../../../types';

// Next.js 13+ App Router에서 동적 라우트 파라미터 타입
interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/contents/[id]
 * 특정 콘텐츠 조회 API
 */
export async function GET(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    console.log(`콘텐츠 조회 API 호출 - ID: ${id}`);

    // ID 유효성 검사
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 ID가 필요합니다.',
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 데이터베이스에서 콘텐츠 조회
    const content = contentQueries.getById(id);

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: '요청한 콘텐츠를 찾을 수 없습니다.',
          code: 404
        } as ApiResponse,
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: content,
      message: '콘텐츠를 성공적으로 조회했습니다.'
    };

    console.log(`콘텐츠 조회 완료 - 제목: ${content.title}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('콘텐츠 조회 오류:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.',
      code: 500
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PUT /api/contents/[id]
 * 콘텐츠 수정 API
 */
export async function PUT(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    console.log(`콘텐츠 수정 API 호출 - ID: ${id}`);

    // ID 유효성 검사
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 ID가 필요합니다.',
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 기존 콘텐츠 확인
    const existingContent = contentQueries.getById(id);
    if (!existingContent) {
      return NextResponse.json(
        {
          success: false,
          error: '수정할 콘텐츠를 찾을 수 없습니다.',
          code: 404
        } as ApiResponse,
        { status: 404 }
      );
    }

    // 요청 본문에서 수정 데이터 추출
    const updates = await request.json();
    console.log('수정 요청 데이터:', updates);

    // 수정할 수 없는 필드들은 제거
    const allowedFields = [
      'title', 'slug', 'content', 'excerpt', 'type', 'status', 
      'language', 'meta', 'updatedBy', 'publishedAt', 'allowComments',
      'featuredOrder', 'tags'
    ];

    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // 상태가 'published'로 변경되는 경우 publishedAt 설정
    if (updates.status === 'published' && existingContent.status !== 'published') {
      filteredUpdates.publishedAt = new Date().toISOString();
    }

    // 슬러그 중복 검사 (슬러그가 변경되는 경우)
    if (updates.slug && updates.slug !== existingContent.slug) {
      const duplicateContent = contentQueries.getBySlug(updates.slug);
      if (duplicateContent && duplicateContent.id !== id) {
        // 슬러그 뒤에 숫자 추가하여 중복 해결
        let counter = 1;
        let uniqueSlug = `${updates.slug}-${counter}`;
        
        while (contentQueries.getBySlug(uniqueSlug)) {
          counter++;
          uniqueSlug = `${updates.slug}-${counter}`;
        }
        
        filteredUpdates.slug = uniqueSlug;
        console.log('슬러그 중복으로 인한 변경:', uniqueSlug);
      }
    }

    console.log('필터링된 수정 데이터:', filteredUpdates);

    // 데이터베이스에서 콘텐츠 업데이트
    const updatedContent = contentQueries.update(id, filteredUpdates);

    if (!updatedContent) {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 수정에 실패했습니다.',
          code: 500
        } as ApiResponse,
        { status: 500 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: updatedContent,
      message: '콘텐츠가 성공적으로 수정되었습니다.'
    };

    console.log('콘텐츠 수정 완료');

    return NextResponse.json(response);

  } catch (error) {
    console.error('콘텐츠 수정 오류:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '콘텐츠 수정 중 오류가 발생했습니다.',
      code: 500
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/contents/[id]
 * 콘텐츠 삭제 API
 */
export async function DELETE(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    console.log(`콘텐츠 삭제 API 호출 - ID: ${id}`);

    // ID 유효성 검사
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 ID가 필요합니다.',
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 기존 콘텐츠 확인
    const existingContent = contentQueries.getById(id);
    if (!existingContent) {
      return NextResponse.json(
        {
          success: false,
          error: '삭제할 콘텐츠를 찾을 수 없습니다.',
          code: 404
        } as ApiResponse,
        { status: 404 }
      );
    }

    // 발행된 콘텐츠 삭제 시 추가 확인 (선택적)
    if (existingContent.status === 'published') {
      console.log('경고: 발행된 콘텐츠를 삭제합니다.');
      // 실제 운영 환경에서는 추가 권한 확인이나 소프트 삭제를 고려할 수 있음
    }

    // 데이터베이스에서 콘텐츠 삭제
    const deleted = contentQueries.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 삭제에 실패했습니다.',
          code: 500
        } as ApiResponse,
        { status: 500 }
      );
    }

    const response: ApiResponse = {
      success: true,
      message: '콘텐츠가 성공적으로 삭제되었습니다.',
      data: { deletedId: id }
    };

    console.log('콘텐츠 삭제 완료');

    return NextResponse.json(response);

  } catch (error) {
    console.error('콘텐츠 삭제 오류:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '콘텐츠 삭제 중 오류가 발생했습니다.',
      code: 500
    };

    return NextResponse.json(response, { status: 500 });
  }
}