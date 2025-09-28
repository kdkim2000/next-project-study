// src/app/blog/page.tsx
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
} from "@mui/material";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { generateBlogListSEO } from "@/lib/seo";

// SEO 메타데이터 생성
export const metadata = generateBlogListSEO();

export default function BlogPage() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📚 블로그
        </Typography>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            아직 작성된 포스트가 없습니다.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            src/blog/md/ 폴더에 마크다운 파일을 추가하거나 에디터를 사용해 포스트를 작성해보세요.
          </Typography>
          <Button variant="contained" component={Link} href="/editor">
            ✍️ 첫 번째 포스트 작성하기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📚 개발 블로그
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          React, Next.js, TypeScript 등 최신 웹 개발 기술에 대한 실용적인 가이드와 튜토리얼을 제공합니다.
          실제 프로젝트에서 사용할 수 있는 예제 코드와 베스트 프랙티스를 공유합니다.
        </Typography>
        
        {/* 통계 정보 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <Chip 
            label={`총 ${posts.length}개의 포스트`} 
            variant="outlined" 
            color="primary" 
          />
          <Chip 
            label="매주 업데이트" 
            variant="outlined" 
            color="secondary" 
          />
        </Box>

        {/* 에디터 링크 */}
        <Button 
          variant="outlined" 
          component={Link} 
          href="/editor"
          sx={{ mb: 3 }}
        >
          ✍️ 새 포스트 작성하기
        </Button>
      </Box>

      {/* 포스트 목록 */}
      <Box sx={{ display: "grid", gap: 3 }}>
        {posts.map((post) => (
          <Card
            key={post.slug}
            component={Link}
            href={`/blog/${post.slug}`}
            sx={{
              textDecoration: "none",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 2,
              },
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                
                {post.description && (
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {post.description}
                  </Typography>
                )}

                {/* 키워드 표시 */}
                {post.keywords && post.keywords.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {post.keywords.map((keyword) => (
                      <Chip
                        key={keyword}
                        label={keyword}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}

                {/* 메타 정보 */}
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider"
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {post.date && (
                      <Typography variant="caption" color="text.secondary">
                        📅 {new Date(post.date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                    )}
                    
                    {post.readingTime && (
                      <Typography variant="caption" color="text.secondary">
                        ⏱️ {post.readingTime.text}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="caption" color="primary">
                    자세히 읽기 →
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* RSS 피드 링크 */}
      <Box sx={{ textAlign: "center", mt: 6, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          📡 RSS 피드로 최신 포스트 받기
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          RSS 리더를 사용해 새로운 포스트 알림을 받아보세요
        </Typography>
        <Button 
          variant="outlined" 
          component="a" 
          href="/rss.xml" 
          target="_blank"
          rel="noopener noreferrer"
        >
          📡 RSS 구독하기
        </Button>
      </Box>

      {/* SEO를 위한 추가 정보 */}
      <Box sx={{ mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          🎯 블로그 소개
        </Typography>
        <Typography variant="body2" color="text.secondary">
          이 블로그는 Vue.js에서 React로 전환하는 개발팀을 위한 교육 자료를 제공합니다. 
          실무에서 바로 적용할 수 있는 Next.js 프로젝트 예제와 TypeScript 활용법, 
          그리고 현대적인 웹 개발 베스트 프랙티스를 다룹니다.
        </Typography>
      </Box>
    </Container>
  );
}