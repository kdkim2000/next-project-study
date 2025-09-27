// src/app/search/page.tsx
import { 
  getAllPosts, 
  getAllCategories, 
  getAllTags
} from "@/lib/posts";
import SearchPageClient from "./SearchPageClient";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

// 메타데이터 생성 (서버 컴포넌트에서만 가능)
export async function generateMetadata({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  
  if (!query) {
    return {
      title: "검색 | Developer's Blog",
      description: "블로그 포스트를 검색해보세요."
    };
  }
  
  return {
    title: `"${query}" 검색 결과 | Developer's Blog`,
    description: `"${query}"에 대한 검색 결과를 확인해보세요.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const initialQuery = resolvedParams.q || '';
  
  // 서버에서 데이터 미리 로드
  const allPosts = getAllPosts();
  const allCategories = getAllCategories();
  const allTags = getAllTags();

  return (
    <SearchPageClient 
      allPosts={allPosts}
      allCategories={allCategories}
      allTags={allTags}
      initialQuery={initialQuery}
    />
  );
}