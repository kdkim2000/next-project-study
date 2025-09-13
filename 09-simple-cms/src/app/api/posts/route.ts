// app/api/posts/route.ts
// 글 관리를 위한 간단한 API

import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost, updatePost, deletePost, getPostById } from '@/lib/posts';

// 모든 글 조회
export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '글 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 새 글 생성
export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();
    
    // 간단한 입력 검증
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용을 모두 입력해주세요.' },
        { status: 400 }
      );
    }
    
    const newPost = createPost(title, content);
    return NextResponse.json({ success: true, data: newPost });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '글 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 글 수정
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { title, content } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '글 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용을 모두 입력해주세요.' },
        { status: 400 }
      );
    }
    
    const updatedPost = updatePost(id, title, content);
    
    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: '글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updatedPost });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '글 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 글 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '글 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const deleted = deletePost(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: '글이 삭제되었습니다.' });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}