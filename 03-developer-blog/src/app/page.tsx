import Link from "next/link";
import { format } from "date-fns";
import { getFeaturedPosts, getAllPosts, getCategoriesWithCount } from "@/lib/blog";
import PostCard from "@/components/PostCard";

export const dynamic = "force-static";

export default async function HomePage() {
  const [featured, recent, categories] = await Promise.all([
    getFeaturedPosts(3),
    getAllPosts(6),
    getCategoriesWithCount()
  ]);

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Featured</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {featured.map(p => <PostCard key={p.slug} post={p} />)}
      </div>

      <h2 style={{ marginTop: 24 }}>Recent</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recent.map((p) => (
          <li key={p.slug} style={{ margin: "16px 0", paddingBottom: 16, borderBottom: "1px solid #eee" }}>
            <h3 style={{ margin: "0 0 4px" }}>
              <Link href={`/posts/${p.slug}`}>{p.frontMatter.title}</Link>
            </h3>
            <div style={{ fontSize: 14, color: "#666" }}>
              {format(new Date(p.frontMatter.date), "yyyy-MM-dd")} · {p.readingTime.text}
            </div>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 24 }}>Categories</h2>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 0, listStyle: "none" }}>
        {categories.map((c) => (
          <li key={c.category} style={{ border: "1px solid #eee", borderRadius: 16, padding: "6px 12px" }}>
            <Link href={`/categories/${encodeURIComponent(c.category)}`}>
              #{c.category} ({c.count})
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
