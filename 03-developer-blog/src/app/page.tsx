// src/app/page.tsx
import { Container, Typography, Box, Button, Card, CardContent, Grid, Chip } from "@mui/material";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { generateHomeSEO } from "@/lib/seo";

// SEO 메타데이터 생성
export const metadata = generateHomeSEO();

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3); // 최신 3개 포스트

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 히어로 섹션 */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          🚀 Developer's Blog Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          React와 Next.js를 배우며 성장하는 개발자 블로그
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: "auto" }}>
          최신 웹 개발 기술과 실무 경험을 공유합니다. 
          Vue.js에서 React로 전환하는 개발자들을 위한 실용적인 가이드와 예제 프로젝트들을 제공합니다.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            href="/blog" 
            sx={{ mr: 2 }}
          >
            📚 블로그 둘러보기
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            href="/editor"
          >
            ✍️ 포스트 작성하기
          </Button>
        </Box>
      </Box>

      {/* 기술 스택 소개 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: "center" }}>
          🛠️ 사용 기술
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {["React 19", "Next.js 15", "TypeScript", "Material-UI", "Markdown", "Prism.js"].map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" color="primary" />
          ))}
        </Box>
      </Box>

      {/* 최근 포스트 섹션 */}
      {recentPosts.length > 0 && (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
            📝 최근 포스트
          </Typography>
          <Grid container spacing={3}>
            {recentPosts.map((post) => (
              <Grid item xs={12} md={4} key={post.slug}>
                <Card 
                  component={Link} 
                  href={`/blog/${post.slug}`}
                  sx={{ 
                    textDecoration: "none", 
                    height: "100%",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent sx={{ height: "100%" }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {post.title}
                    </Typography>
                    {post.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {post.description}
                      </Typography>
                    )}
                    <Box sx={{ mt: "auto" }}>
                      {post.date && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.date).toLocaleDateString("ko-KR")}
                        </Typography>
                      )}
                      {post.readingTime && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          ⏱️ {post.readingTime.text}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="outlined" component={Link} href="/blog">
              모든 포스트 보기 →
            </Button>
          </Box>
        </Box>
      )}

      {/* 학습 목표 섹션 */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: "center" }}>
          🎯 학습 목표
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🔄 동적 라우팅
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next.js App Router를 활용한 현대적인 라우팅 시스템
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📁 파일 시스템 처리
              </Typography>
              <Typography variant="body2" color="text.secondary">
                마크다운 파일을 활용한 콘텐츠 관리 시스템
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                ⚡ 정적 사이트 생성
              </Typography>
              <Typography variant="body2" color="text.secondary">
                빌드 타임 최적화를 통한 고성능 웹사이트 구현
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* RSS 피드 링크 */}
      <Box sx={{ textAlign: "center", mt: 6, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          📡 RSS 피드 구독
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          새로운 포스트 소식을 RSS 피드로 받아보세요
        </Typography>
        <Button 
          variant="outlined" 
          component="a" 
          href="/rss.xml" 
          target="_blank"
          rel="noopener noreferrer"
        >
          RSS 구독하기
        </Button>
      </Box>
    </Container>
  );
}