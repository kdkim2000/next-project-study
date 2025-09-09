import { getAllPosts } from "@/lib/blog";
import PostCard from "@/components/PostCard";

export const dynamic = "force-static";

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <section>
      <h2>Posts</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {posts.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
    </section>
  );
}
