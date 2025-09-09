import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamic = "force-static";

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  const fm = post.frontMatter;

  return (
    <article>
      <h1 style={{ marginBottom: 4 }}>{fm.title}</h1>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
        {format(new Date(fm.date), "yyyy-MM-dd")} · {post.readingTime.text}
        {fm.category ? <> · #{fm.category}</> : null}
        {fm.tags?.length ? <> · {fm.tags.map((t) => `#${t}`).join(" ")}</> : null}
      </div>

      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
