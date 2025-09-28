// src/app/blog/[slug]/page.tsx
import { Container, Typography, Box, Chip, Paper, Breadcrumbs } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { generateBlogPostSEO, generateBlogPostJSONLD } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

// 동적 라우트를 위한 정적 경로 생성
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// SEO 메타데이터 생성
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  
  try {
    const post = await getPostBySlug(resolvedParams.slug);
    return generateBlogPostSEO(post);
  } catch (error) {
    return {
      title: '포스트를 찾을 수 없습니다',
      description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  
  let post;
  try {
    post = await getPostBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  // JSON-LD 구조화 데이터 생성
  const jsonLD = generateBlogPostJSONLD(post);

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
      />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* 브레드크럼 네비게이션 */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            홈
          </Link>
          <Link href="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
            블로그
          </Link>
          <Typography color="text.primary">{post.title}</Typography>
        </Breadcrumbs>

        {/* 포스트 헤더 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {post.title}
          </Typography>
          
          {post.description && (
            <Typography variant="h6" color="text.secondary" paragraph>
              {post.description}
            </Typography>
          )}

          {/* 메타 정보 */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2, 
            mb: 3,
            flexWrap: "wrap"
          }}>
            {post.date && (
              <Typography variant="body2" color="text.secondary">
                📅 {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long", 
                  day: "numeric",
                  weekday: "long",
                })}
              </Typography>
            )}
            
            {post.readingTime && (
              <Typography variant="body2" color="text.secondary">
                ⏱️ 읽는 시간: {post.readingTime.text}
              </Typography>
            )}

            {post.readingTime?.words && (
              <Typography variant="body2" color="text.secondary">
                📝 {post.readingTime.words.toLocaleString()}단어
              </Typography>
            )}
          </Box>

          {/* 키워드/태그 */}
          {post.keywords && post.keywords.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                🏷️ 태그:
              </Typography>
              <Box>
                {post.keywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* 포스트 본문 */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            border: 1, 
            borderColor: "divider",
            borderRadius: 2,
            mb: 4
          }}
        >
          <Box
            sx={{
              // 마크다운 스타일링
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                mt: 4,
                mb: 2,
                fontWeight: 600,
                lineHeight: 1.3,
              },
              "& h1": { fontSize: "2rem" },
              "& h2": { 
                fontSize: "1.75rem",
                borderBottom: 1,
                borderColor: "divider",
                pb: 1,
              },
              "& h3": { fontSize: "1.5rem" },
              "& h4": { fontSize: "1.25rem" },
              
              "& p": {
                mb: 2,
                lineHeight: 1.7,
                fontSize: "1rem",
              },
              
              "& ul, & ol": {
                mb: 2,
                pl: 3,
                "& li": {
                  mb: 1,
                  lineHeight: 1.6,
                },
              },
              
              "& blockquote": {
                borderLeft: 4,
                borderColor: "primary.main",
                pl: 2,
                ml: 0,
                fontStyle: "italic",
                color: "text.secondary",
                bgcolor: "grey.50",
                py: 1,
                borderRadius: "0 4px 4px 0",
              },
              
              // 코드 블록 스타일링
              "& pre": {
                backgroundColor: "#2d3748",
                color: "#e2e8f0",
                padding: 3,
                borderRadius: 2,
                overflow: "auto",
                mb: 2,
                fontSize: "0.875rem",
                lineHeight: 1.5,
              },
              
              "& code": {
                backgroundColor: "#f7fafc",
                color: "#d53f8c",
                padding: "2px 6px",
                borderRadius: 1,
                fontSize: "0.875em",
                fontFamily: "Monaco, Menlo, 'Ubuntu Mono', monospace",
              },
              
              "& pre code": {
                backgroundColor: "transparent",
                color: "inherit",
                padding: 0,
              },
              
              // 이미지 스타일링
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: 1,
                mb: 2,
              },
              
              // 링크 스타일링
              "& a": {
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },

              // 테이블 스타일링
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                mb: 2,
                "& th, & td": {
                  border: 1,
                  borderColor: "divider",
                  p: 1,
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: "grey.100",
                  fontWeight: 600,
                },
              },
            }}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </Paper>

        {/* 포스트 하단 정보 */}
        <Box sx={{ 
          p: 3, 
          bgcolor: "grey.50", 
          borderRadius: 2,
          textAlign: "center",
          mb: 4
        }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            이 포스트가 도움이 되셨나요? 
          </Typography>
          <Typography variant="body2" color="text.secondary">
            💡 더 많은 React와 Next.js 콘텐츠를 RSS로 받아보세요
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link 
              href="/rss.xml" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Chip 
                label="📡 RSS 구독하기" 
                clickable 
                color="primary" 
                variant="outlined" 
              />
            </Link>
          </Box>
        </Box>

        {/* 네비게이션 */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          pt: 3,
          borderTop: 1,
          borderColor: "divider"
        }}>
          <Link href="/blog" style={{ textDecoration: 'none' }}>
            <Chip 
              label="← 블로그 목록으로" 
              clickable 
              color="primary" 
            />
          </Link>
          
          <Link href="/editor" style={{ textDecoration: 'none' }}>
            <Chip 
              label="✍️ 포스트 작성하기" 
              clickable 
              variant="outlined" 
            />
          </Link>
        </Box>
      </Container>
    </>
  );
}