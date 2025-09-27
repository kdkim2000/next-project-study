// src/app/tag/[tag]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  getAllTags, 
  getPostsByTag, 
  generatePostMetadata,
  getAllPosts 
} from "@/lib/posts";
import { 
  Typography, 
  Breadcrumbs, 
  Card, 
  CardContent, 
  Box,
  Chip,
  Container
} from "@mui/material";
import { CalendarToday, AccessTime, LocalOffer } from "@mui/icons-material";

type Props = {
  params: Promise<{ tag: string }>;
};

// 정적 경로 생성
export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ 
    tag: tag.slug 
  }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const tagPosts = getPostsByTag(resolvedParams.tag);
  
  if (tagPosts.length === 0) {
    return {
      title: "태그를 찾을 수 없습니다 | Developer's Blog"
    };
  }
  
  return {
    title: `#${resolvedParams.tag} 태그 | Developer's Blog`,
    description: `#${resolvedParams.tag} 태그가 달린 블로그 포스트 ${tagPosts.length}개를 확인해보세요.`,
    keywords: `${resolvedParams.tag}, 태그, 블로그, 개발`,
  };
}

export default async function TagPage({ params }: Props) {
  const resolvedParams = await params;
  const tagPosts = getPostsByTag(resolvedParams.tag);
  const allTags = getAllTags();
  const currentTag = allTags.find(tag => tag.slug === resolvedParams.tag);
  
  if (tagPosts.length === 0) {
    notFound();
  }
  
  return (
    <Container>
      {/* 브레드크럼 네비게이션 */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            홈
          </Link>
          <Link href="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
            블로그
          </Link>
          <Typography color="text.primary">
            #{resolvedParams.tag}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* 태그 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalOffer sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            #{resolvedParams.tag}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {currentTag?.count || tagPosts.length}개의 포스트가 이 태그와 연결되어 있습니다.
        </Typography>
      </Box>

      {/* 포스트 목록 */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        {tagPosts.map((post) => (
          <Card 
            key={post.slug} 
            component={Link}
            href={`/blog/${post.slug}`}
            sx={{ 
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {post.title}
              </Typography>
              
              {post.description && (
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  paragraph
                  sx={{ mb: 2 }}
                >
                  {post.description}
                </Typography>
              )}
              
              {/* 카테고리 표시 */}
              {post.category && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={post.category}
                    component={Link}
                    href={`/category/${post.category}`}
                    size="small"
                    color="primary"
                    variant="filled"
                    clickable
                    sx={{ textDecoration: 'none' }}
                  />
                </Box>
              )}
              
              {/* 메타 정보 */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 2,
                flexWrap: 'wrap' 
              }}>
                {post.date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {post.date}
                    </Typography>
                  </Box>
                )}
                
                {post.readingTime && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {post.readingTime.text}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* 기타 태그 */}
              {post.tags && post.tags.length > 1 && (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {post.tags
                    .filter(tag => tag !== resolvedParams.tag)
                    .slice(0, 4)
                    .map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        component={Link}
                        href={`/tag/${tag}`}
                        clickable
                        sx={{ 
                          fontSize: '0.7rem',
                          textDecoration: 'none',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText'
                          }
                        }}
                      />
                    ))}
                  {post.tags.filter(tag => tag !== resolvedParams.tag).length > 4 && (
                    <Typography variant="caption" color="text.secondary">
                      +{post.tags.filter(tag => tag !== resolvedParams.tag).length - 4} more
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* 관련 태그 추천 */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          관련 태그
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {allTags
            .filter(tag => tag.slug !== resolvedParams.tag)
            .slice(0, 10)
            .map(tag => (
              <Chip
                key={tag.slug}
                label={`#${tag.name} (${tag.count})`}
                component={Link}
                href={`/tag/${tag.slug}`}
                clickable
                variant="outlined"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
        </Box>
      </Box>
    </Container>
  );
}