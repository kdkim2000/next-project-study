import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getAllPosts } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const set = new Set<string>();
  posts.forEach((p) => set.add(p.frontMatter.category ?? "uncategorized"));
  return [...set].map((category) => ({ category }));
}

export const dynamic = "force-static";

export default async function CategoryDetailPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category);
  const posts = (await getAllPosts()).filter(
    (p) => (p.frontMatter.category ?? "uncategorized").toLowerCase() === category.toLowerCase()
  );

  if (!posts.length) return notFound();

  return (
    <section>
      <h2>Category: #{category}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
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
    </section>
  );
}
