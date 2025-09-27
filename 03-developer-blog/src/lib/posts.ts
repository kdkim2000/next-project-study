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
  category?: string;  // 카테고리 추가
  tags?: string[];    // 태그 배열 추가
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

// 카테고리 데이터 타입
export interface CategoryData {
  name: string;
  slug: string;
  count: number;
  posts: PostData[];
}

// 태그 데이터 타입
export interface TagData {
  name: string;
  slug: string;
  count: number;
  posts: PostData[];
}

// 검색 결과 타입
export interface SearchResult {
  post: PostData;
  score: number;
  matchedFields: string[];
}

// 모든 글 불러오기 (메타데이터 포함)
export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
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
        category: data.category || 'uncategorized',
        tags: data.tags || [],
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
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // 마크다운을 HTML로 변환하면서 코드 하이라이팅 적용
  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
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
    category: data.category || 'uncategorized',
    tags: data.tags || [],
    readingTime: stats,
    contentHtml,
  };
}

// 모든 카테고리 가져오기
export function getAllCategories(): CategoryData[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, PostData[]>();
  
  posts.forEach(post => {
    const category = post.category || 'uncategorized';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(post);
  });
  
  return Array.from(categoryMap.entries()).map(([category, categoryPosts]) => ({
    name: category,
    slug: category,
    count: categoryPosts.length,
    posts: categoryPosts
  })).sort((a, b) => b.count - a.count);
}

// 특정 카테고리의 포스트 가져오기
export function getPostsByCategory(category: string): PostData[] {
  const posts = getAllPosts();
  return posts.filter(post => post.category === category);
}

// 모든 태그 가져오기
export function getAllTags(): TagData[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, PostData[]>();
  
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)!.push(post);
    });
  });
  
  return Array.from(tagMap.entries()).map(([tag, tagPosts]) => ({
    name: tag,
    slug: tag,
    count: tagPosts.length,
    posts: tagPosts
  })).sort((a, b) => b.count - a.count);
}

// 특정 태그의 포스트 가져오기
export function getPostsByTag(tag: string): PostData[] {
  const posts = getAllPosts();
  return posts.filter(post => post.tags?.includes(tag));
}

// 검색 기능 (제목, 본문, 태그, 카테고리 기반)
export function searchPosts(query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }
  
  const posts = getAllPosts();
  const searchTerm = query.toLowerCase();
  const results: SearchResult[] = [];
  
  posts.forEach(post => {
    let score = 0;
    const matchedFields: string[] = [];
    
    // 제목에서 검색 (가중치: 3)
    if (post.title.toLowerCase().includes(searchTerm)) {
      score += 3;
      matchedFields.push('title');
    }
    
    // 설명에서 검색 (가중치: 2)
    if (post.description?.toLowerCase().includes(searchTerm)) {
      score += 2;
      matchedFields.push('description');
    }
    
    // 카테고리에서 검색 (가중치: 2)
    if (post.category?.toLowerCase().includes(searchTerm)) {
      score += 2;
      matchedFields.push('category');
    }
    
    // 태그에서 검색 (가중치: 1.5)
    const matchingTags = post.tags?.filter(tag => 
      tag.toLowerCase().includes(searchTerm)
    ) || [];
    if (matchingTags.length > 0) {
      score += matchingTags.length * 1.5;
      matchedFields.push('tags');
    }
    
    // 키워드에서 검색 (가중치: 1)
    const matchingKeywords = post.keywords?.filter(keyword => 
      keyword.toLowerCase().includes(searchTerm)
    ) || [];
    if (matchingKeywords.length > 0) {
      score += matchingKeywords.length * 1;
      matchedFields.push('keywords');
    }
    
    if (score > 0) {
      results.push({
        post,
        score,
        matchedFields
      });
    }
  });
  
  // 점수순으로 정렬
  return results.sort((a, b) => b.score - a.score);
}

// 포스트 정렬 기능
export function sortPosts(posts: PostData[], sortBy: 'date' | 'title' | 'readingTime' = 'date'): PostData[] {
  return [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      
      case 'title':
        return a.title.localeCompare(b.title);
      
      case 'readingTime':
        const aTime = a.readingTime?.minutes || 0;
        const bTime = b.readingTime?.minutes || 0;
        return aTime - bTime;
      
      default:
        return 0;
    }
  });
}

// 포스트 필터링 기능
export function filterPosts(
  posts: PostData[], 
  filters: {
    categories?: string[];
    tags?: string[];
    searchQuery?: string;
  }
): PostData[] {
  let filteredPosts = [...posts];
  
  // 카테고리 필터
  if (filters.categories && filters.categories.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.categories!.includes(post.category || 'uncategorized')
    );
  }
  
  // 태그 필터
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.tags!.some(tag => post.tags?.includes(tag))
    );
  }
  
  // 검색어 필터
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const searchResults = searchPosts(filters.searchQuery);
    const searchSlugs = new Set(searchResults.map(result => result.post.slug));
    filteredPosts = filteredPosts.filter(post => searchSlugs.has(post.slug));
  }
  
  return filteredPosts;
}

// 관련 포스트 가져오기
export function getRelatedPosts(currentPost: PostData, limit: number = 3): PostData[] {
  const allPosts = getAllPosts().filter(post => post.slug !== currentPost.slug);
  
  // 같은 카테고리의 포스트 우선
  const sameCategoryPosts = allPosts.filter(post => 
    post.category === currentPost.category
  );
  
  // 공통 태그가 있는 포스트
  const commonTagPosts = allPosts.filter(post => 
    post.tags?.some(tag => currentPost.tags?.includes(tag))
  );
  
  // 중복 제거하면서 관련 포스트 조합
  const relatedPosts = [
    ...sameCategoryPosts.slice(0, limit),
    ...commonTagPosts.filter(post => 
      !sameCategoryPosts.some(scp => scp.slug === post.slug)
    ).slice(0, limit - sameCategoryPosts.length)
  ];
  
  // 부족하면 최신 포스트로 채우기
  if (relatedPosts.length < limit) {
    const remainingPosts = allPosts.filter(post => 
      !relatedPosts.some(rp => rp.slug === post.slug)
    ).slice(0, limit - relatedPosts.length);
    
    relatedPosts.push(...remainingPosts);
  }
  
  return relatedPosts.slice(0, limit);
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