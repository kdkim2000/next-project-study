// src/app/api/media/upload/route.ts
// 미디어 파일 업로드 API - 이미지 및 파일 업로드 처리

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, MediaFile } from '../../../../types';
import db from '../../../../lib/database';

// 허용되는 파일 유형 및 최대 크기 설정
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/media/upload
 * 파일 업로드 API
 * multipart/form-data 형식으로 파일을 받아 저장하고 데이터베이스에 기록
 */
export async function POST(request: NextRequest) {
  try {
    console.log('파일 업로드 API 호출');

    // multipart/form-data 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: '업로드할 파일이 선택되지 않았습니다.',
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    console.log('업로드 파일 정보:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // 파일 유형 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `지원하지 않는 파일 형식입니다. 허용되는 형식: ${ALLOWED_TYPES.join(', ')}`,
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 가능합니다.`,
          code: 400
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 파일 저장 경로 설정
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 연도/월 기준 디렉토리 생성 (파일 관리 용이)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const fullUploadDir = path.join(uploadDir, yearMonth);

    // 디렉토리가 없으면 생성
    if (!existsSync(fullUploadDir)) {
      await mkdir(fullUploadDir, { recursive: true });
      console.log('업로드 디렉토리 생성:', fullUploadDir);
    }

    // 고유한 파일명 생성
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(fullUploadDir, fileName);

    // 웹 접근용 URL 생성
    const fileUrl = `/uploads/${yearMonth}/${fileName}`;

    console.log('파일 저장 경로:', filePath);
    console.log('웹 접근 URL:', fileUrl);

    // 파일을 디스크에 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);
    console.log('파일 저장 완료');

    // 데이터베이스에 파일 정보 저장
    const mediaFile: Omit<MediaFile, 'id'> = {
      filename: fileName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: fileUrl,
      uploadedAt: now.toISOString(),
      uploadedBy: 'admin-001' // 실제로는 인증된 사용자 ID 사용
    };

    const fileId = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 데이터베이스에 파일 정보 저장
    const insertFile = db.prepare(`
      INSERT INTO media_files (
        id, filename, original_name, mime_type, size, url, uploaded_at, uploaded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertFile.run(
      fileId,
      mediaFile.filename,
      mediaFile.originalName,
      mediaFile.mimeType,
      mediaFile.size,
      mediaFile.url,
      mediaFile.uploadedAt,
      mediaFile.uploadedBy
    );

    const savedFile: MediaFile = {
      id: fileId,
      ...mediaFile
    };

    const response: ApiResponse = {
      success: true,
      data: savedFile,
      message: '파일이 성공적으로 업로드되었습니다.',
      code: 201
    };

    console.log('파일 업로드 완료:', savedFile.id);

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('파일 업로드 오류:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.',
      code: 500
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * GET /api/media/upload
 * 업로드 관련 설정 정보 조회
 */
export async function GET() {
  try {
    const config = {
      maxFileSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_TYPES,
      maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024
    };

    const response: ApiResponse = {
      success: true,
      data: config,
      message: '업로드 설정 정보입니다.'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('설정 정보 조회 오류:', error);

    const response: ApiResponse = {
      success: false,
      error: '설정 정보를 불러오는 중 오류가 발생했습니다.',
      code: 500
    };

    return NextResponse.json(response, { status: 500 });
  }
}