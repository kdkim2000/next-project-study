// src/app/blog/[slug]/page.tsx
import { getAllPosts, getPostBySlug, generatePostMetadata } from "@/lib/posts";
import { 
  Typography, 
  Divider, 
  Box, 
  Chip,
  Paper
} from "@mui/material";
import { AccessTime, CalendarToday } from "@mui/icons-material";

type Props = {
  params: Promise<{ slug: string }>; // Next.js 15에서 Promise 타입으로 변경
};

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params; // params를 await로 해결
  const post = await getPostBySlug(resolvedParams.slug);
  return generatePostMetadata(post);
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params; // params를 await로 해결
  const post = await getPostBySlug(resolvedParams.slug);

  return (
    <>
      {/* 포스트 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        {post.description && (
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 2, fontWeight: 400 }}
          >
            {post.description}
          </Typography>
        )}
        
        {/* 메타 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {post.date && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                작성일: {post.date}
              </Typography>
            </Box>
          )}
          
          {post.readingTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                읽기 시간: {post.readingTime.text}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* 키워드 태그 */}
        {post.keywords && post.keywords.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {post.keywords.map((keyword, index) => (
              <Chip 
                key={index}
                label={keyword} 
                size="small" 
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
        
        <Divider />
      </Box>

      {/* 포스트 내용 */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 0,
          '& .markdown-content': {
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 3,
              mb: 2,
              fontWeight: 600,
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.75rem' },
            '& h3': { fontSize: '1.5rem' },
            '& h4': { fontSize: '1.25rem' },
            '& p': {
              mb: 2,
              lineHeight: 1.7,
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3,
            },
            '& li': {
              mb: 0.5,
            },
            '& blockquote': {
              borderLeft: '4px solid #1976d2',
              pl: 2,
              py: 1,
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              fontStyle: 'italic',
              margin: '16px 0',
            },
            '& pre': {
              backgroundColor: '#2d3748',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              mb: 2,
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
                fontSize: '0.875rem',
                fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                color: '#e2e8f0',
              }
            },
            '& code': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            },
            '& pre code': {
              backgroundColor: 'transparent',
              padding: 0,
              color: '#e2e8f0',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              my: 2,
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              mb: 2,
              '& th, & td': {
                border: '1px solid #ddd',
                padding: '8px 12px',
                textAlign: 'left',
              },
              '& th': {
                backgroundColor: '#f5f5f5',
                fontWeight: 600,
              }
            }
          }
        }}
      >
        {/* 마크다운 변환된 HTML 삽입 */}
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
        />
      </Paper>
    </>
  );
}