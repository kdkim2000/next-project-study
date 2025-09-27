// src/app/blog/page.tsx
import { 
  getAllPosts, 
  getAllCategories, 
  getAllTags
} from "@/lib/posts";
import BlogClient from "./BlogClient";

// 페이지 메타데이터 (서버 컴포넌트에서만 가능)
export const metadata = {
  title: "Blog Posts | Developer's Blog",
  description: "개발 관련 블로그 포스트들을 확인해보세요. Next.js, React, TypeScript 등 다양한 주제를 다룹니다.",
  keywords: "blog, development, programming, nextjs, react, typescript",
};

export default async function BlogPage() {
  // 서버에서 데이터 미리 로드
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <BlogClient 
      initialPosts={allPosts}
      categories={categories}
      tags={tags}
    />
  );
}