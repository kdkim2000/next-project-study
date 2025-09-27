// src/app/category/[category]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  getAllCategories, 
  getPostsByCategory, 
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
import { CalendarToday, AccessTime, FolderOpen } from "@mui/icons-material";

type Props = {
  params: Promise<{ category: string }>;
};

// 정적 경로 생성
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({ 
    category: category.slug 
  }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const categoryPosts = getPostsByCategory(resolvedParams.category);
  
  if (categoryPosts.length === 0) {
    return {
      title: "카테고리를 찾을 수 없습니다 | Developer's Blog"
    };
  }
  
  return {
    title: `${resolvedParams.category} 카테고리 | Developer's Blog`,
    description: `${resolvedParams.category} 카테고리의 블로그 포스트 ${categoryPosts.length}개를 확인해보세요.`,
    keywords: `${resolvedParams.category}, 카테고리, 블로그, 개발`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryPosts = getPostsByCategory(resolvedParams.category);
  const allCategories = getAllCategories();
  const currentCategory = allCategories.find(cat => cat.slug === resolvedParams.category);
  
  if (categoryPosts.length === 0) {
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
            {resolvedParams.category}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* 카테고리 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FolderOpen sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            {resolvedParams.category}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {currentCategory?.count || categoryPosts.length}개의 포스트가 있습니다.
        </Typography>
      </Box>

      {/* 포스트 목록 */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        {categoryPosts.map((post) => (
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
              
              {/* 태그 */}
              {post.tags && post.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {post.tags.slice(0, 5).map((tag, index) => (
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
                  {post.tags.length > 5 && (
                    <Typography variant="caption" color="text.secondary">
                      +{post.tags.length - 5} more
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* 다른 카테고리 추천 */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          다른 카테고리
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {allCategories
            .filter(cat => cat.slug !== resolvedParams.category)
            .slice(0, 8)
            .map(category => (
              <Chip
                key={category.slug}
                label={`${category.name} (${category.count})`}
                component={Link}
                href={`/category/${category.slug}`}
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