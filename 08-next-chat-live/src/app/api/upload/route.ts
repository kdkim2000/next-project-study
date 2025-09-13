// src/app/api/upload/route.ts
/**
 * 파일 업로드를 처리하는 API 라우트
 * Next.js 13+ App Router 스타일로 작성
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type: string = data.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 파일 확장자 검증
    const allowedTypes = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      file: ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'xlsx', 'xls', 'ppt', 'pptx']
    };

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension) {
      return NextResponse.json(
        { error: '파일 확장자를 확인할 수 없습니다.' },
        { status: 400 }
      );
    }

    const validExtensions = type === 'image' ? allowedTypes.image : [...allowedTypes.image, ...allowedTypes.file];
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `지원하지 않는 파일 형식입니다. (${validExtensions.join(', ')})` },
        { status: 400 }
      );
    }

    // 파일 저장 경로 설정
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // 업로드 폴더 생성 (없으면)
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.log('업로드 디렉토리가 이미 존재하거나 생성됨');
    }

    // 고유한 파일명 생성 (UUID + 원본 확장자)
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    const filePath = join(uploadDir, uniqueFileName);

    // 파일을 Buffer로 변환하여 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 클라이언트에 반환할 파일 URL
    const fileUrl = `/uploads/${uniqueFileName}`;

    console.log(`파일 업로드 성공: ${file.name} -> ${uniqueFileName}`);

    return NextResponse.json({
      message: '파일 업로드 성공',
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET 메서드는 지원하지 않음을 명시
export async function GET() {
  return NextResponse.json(
    { error: '이 엔드포인트는 POST 요청만 지원합니다.' },
    { status: 405 }
  );
}