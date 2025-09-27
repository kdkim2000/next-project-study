// src/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "src/blog/md");

// 게시글 메타데이터 타입 정의
export interface PostData {
  slug: string;
  title: string;
  date: string | null;
  description?: string;
  keywords?: string[];
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

// 게시글 전체 데이터 타입 정의
export interface PostWithContent extends PostData {
  contentHtml: string;
}

// 모든 글 불러오기 (메타데이터 포함)
export function getAllPosts(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);
    
    // 읽기 시간 계산
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || slug,
      date: data.date || null,
      description: data.description || null,
      keywords: data.keywords || [],
      readingTime: stats,
    };
  }).sort((a, b) => {
    // 날짜 기준 내림차순 정렬 (최신 글이 위로)
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// 특정 글 내용 불러오기 (HTML 변환 및 코드 하이라이팅 포함)
export async function getPostBySlug(slug: string): Promise<PostWithContent> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  // 마크다운을 HTML로 변환하면서 코드 하이라이팅 적용
  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      // 코드 하이라이팅 옵션
      ignoreMissing: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
    
  const contentHtml = processedContent.toString();
  
  // 읽기 시간 계산
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    description: data.description || null,
    keywords: data.keywords || [],
    readingTime: stats,
    contentHtml,
  };
}

// SEO용 메타데이터 생성 도우미 함수
export function generatePostMetadata(post: PostData) {
  return {
    title: `${post.title} | Developer's Blog`,
    description: post.description || `${post.title}에 대한 개발 블로그 포스트입니다.`,
    keywords: post.keywords?.join(', ') || 'development, programming, blog',
    openGraph: {
      title: post.title,
      description: post.description || `${post.title}에 대한 개발 블로그 포스트입니다.`,
      type: 'article',
      publishedTime: post.date || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || `${post.title}에 대한 개발 블로그 포스트입니다.`,
    },
  };
}