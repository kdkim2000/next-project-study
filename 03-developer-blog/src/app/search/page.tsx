// src/app/search/page.tsx
// 서버 컴포넌트: 'use client' 절대 넣지 마세요.
import Link from "next/link";
import { format } from "date-fns";
import { searchPosts } from "@/lib/blog";

export const dynamic = "force-static"; // 정적 생성

type SearchParams = {
  q?: string;
  category?: string;
  tags?: string; // 쉼표 구분: "a,b,c"
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const q = (searchParams?.q ?? "").trim();
  const category = (searchParams?.category ?? "").trim();
  const tags = (searchParams?.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const results = await searchPosts({
    query: q || undefined,
    category: category || undefined,
    tags: tags.length ? tags : undefined,
  });

  return (
    <section>
      <h2>Search</h2>

      {/* GET 폼: 클라이언트 컴포넌트 사용 없이 서버에서 렌더링 */}
      <form
        method="GET"
        style={{ display: "grid", gap: 8, maxWidth: 520, marginBottom: 16 }}
      >
        <input name="q" placeholder="키워드" defaultValue={q} />
        <input
          name="category"
          placeholder="카테고리(정확히 일치)"
          defaultValue={category}
        />
        <input
          name="tags"
          placeholder="태그(쉼표로 구분: a,b,c)"
          defaultValue={searchParams?.tags ?? ""}
        />
        <button type="submit" style={{ width: 120 }}>
          검색
        </button>
      </form>

      <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
        결과: {results.length}건
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((p) => (
          <li
            key={p.slug}
            style={{
              margin: "16px 0",
              paddingBottom: 16,
              borderBottom: "1px solid #eee",
            }}
          >
            <h3 style={{ margin: "0 0 4px" }}>
              <Link href={`/posts/${p.slug}`}>{p.frontMatter.title}</Link>
            </h3>
            <div style={{ fontSize: 14, color: "#666" }}>
              {format(new Date(p.frontMatter.date), "yyyy-MM-dd")} ·{" "}
              {p.readingTime.text}
              {p.frontMatter.category ? (
                <> · #{p.frontMatter.category}</>
              ) : null}
              {p.frontMatter.tags?.length ? (
                <> · {p.frontMatter.tags.map((t) => `#${t}`).join(" ")}</>
              ) : null}
            </div>
            {p.frontMatter.excerpt ? (
              <p style={{ marginTop: 8 }}>{p.frontMatter.excerpt}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
