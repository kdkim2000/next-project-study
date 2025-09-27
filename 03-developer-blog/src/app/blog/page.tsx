// src/app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box,
  Card,
  CardContent 
} from "@mui/material";
import { AccessTime, CalendarToday } from "@mui/icons-material";

// 페이지 메타데이터
export const metadata = {
  title: "Blog Posts | Developer's Blog",
  description: "개발 관련 블로그 포스트들을 확인해보세요. Next.js, React, TypeScript 등 다양한 주제를 다룹니다.",
  keywords: "blog, development, programming, nextjs, react, typescript",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        블로그 목록
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        총 {posts.length}개의 포스트가 있습니다.
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {posts.map((post) => (
          <ListItem
            key={post.slug}
            sx={{ 
              px: 0, 
              py: 1,
              display: 'block'
            }}
          >
            <Card 
              component={Link} 
              href={`/blog/${post.slug}`}
              sx={{ 
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                
                {post.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 2 }}
                  >
                    {post.description}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {post.date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Box>
                  )}
                  
                  {post.readingTime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {post.readingTime.text}
                      </Typography>
                    </Box>
                  )}
                  
                  {post.keywords && post.keywords.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {post.keywords.slice(0, 3).map((keyword, index) => (
                        <Chip 
                          key={index}
                          label={keyword} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {post.keywords.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{post.keywords.length - 3} more
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </>
  );
}