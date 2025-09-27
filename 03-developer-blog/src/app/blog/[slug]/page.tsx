// src/app/blog/[slug]/page.tsx
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { Typography, Divider } from "@mui/material";

type Props = {
  params: { slug: string };
};

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {post.title}
      </Typography>
      {post.date && (
        <Typography variant="subtitle2" gutterBottom>
          작성일: {post.date}
        </Typography>
      )}
      <Divider sx={{ my: 2 }} />
      {/* Markdown 변환된 HTML 삽입 */}
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </>
  );
}
