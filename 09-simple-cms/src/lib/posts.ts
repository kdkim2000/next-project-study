// lib/posts.ts
// JSON 파일을 사용한 간단한 데이터 저장 시스템

import fs from 'fs';
import path from 'path';

// 글 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 데이터 파일 경로
const dataFilePath = path.join(process.cwd(), 'data', 'posts.json');

// 데이터 디렉토리가 없으면 생성
const dataDir = path.dirname(dataFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 데이터 파일이 없으면 빈 배열로 초기화
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
}

// 모든 글 가져오기
export function getAllPosts(): Post[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('글 목록 읽기 오류:', error);
    return [];
  }
}

// ID로 특정 글 가져오기
export function getPostById(id: string): Post | null {
  const posts = getAllPosts();
  return posts.find(post => post.id === id) || null;
}

// 새 글 생성
export function createPost(title: string, content: string): Post {
  const posts = getAllPosts();
  const newPost: Post = {
    id: Date.now().toString(), // 간단한 ID 생성
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  posts.push(newPost);
  saveAllPosts(posts);
  
  return newPost;
}

// 글 수정
export function updatePost(id: string, title: string, content: string): Post | null {
  const posts = getAllPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return null;
  }
  
  posts[index] = {
    ...posts[index],
    title,
    content,
    updatedAt: new Date().toISOString(),
  };
  
  saveAllPosts(posts);
  return posts[index];
}

// 글 삭제
export function deletePost(id: string): boolean {
  const posts = getAllPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length === posts.length) {
    return false; // 삭제할 글이 없음
  }
  
  saveAllPosts(filteredPosts);
  return true;
}

// 모든 글을 파일에 저장
function saveAllPosts(posts: Post[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('글 저장 오류:', error);
    throw new Error('글 저장에 실패했습니다.');
  }
}