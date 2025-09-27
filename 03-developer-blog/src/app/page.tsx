// src/app/page.tsx
import { Typography, Button, Box, Card, CardContent } from "@mui/material";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  // 서버에서 실행되므로 fs 모듈 사용 가능
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Developer&apos;s Blog
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Next.js와 MUI를 기반으로 한 학습용 프로젝트입니다.
        </Typography>
        <Typography paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          이 블로그는 단계적으로 기능을 확장해 나가는 교육용 프로젝트입니다. 
          React, Next.js, TypeScript 등 현대적인 웹 개발 기술을 학습하며 
          실제 동작하는 블로그 시스템을 구축해보세요.
        </Typography>
        <Link href="/blog" passHref>
          <Button variant="contained" size="large">
            블로그 보러가기
          </Button>
        </Link>
      </Box>

      {/* 최신 포스트 미리보기 */}
      {recentPosts.length > 0 && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            최신 포스트
          </Typography>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {recentPosts.map((post) => (
              <Card 
                key={post.slug} 
                component={Link} 
                href={`/blog/${post.slug}`}
                sx={{ 
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {post.title}
                  </Typography>
                  {post.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {post.date}
                    </Typography>
                    {post.readingTime && (
                      <Typography variant="caption" color="text.secondary">
                        {post.readingTime.text}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}