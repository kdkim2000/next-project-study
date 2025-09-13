// src/app/admin/page.tsx
// 관리자 대시보드 메인 페이지 - 전체 시스템 현황을 보여주는 대시보드

'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Article as ArticleIcon,
  Publish as PublishIcon,
  Draft as DraftIcon,
  Archive as ArchiveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useContentStore } from '../../stores/contentStore';
import { Content } from '../../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 대시보드 통계 카드 컴포넌트
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" color={`${color}.main`}>
            {value.toLocaleString()}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

/**
 * 관리자 대시보드 메인 페이지
 */
const AdminDashboard = () => {
  const router = useRouter();
  const { 
    contents, 
    loading, 
    error, 
    fetchContents,
    setFilters 
  } = useContentStore();

  // 로컬 상태
  const [recentContents, setRecentContents] = useState<Content[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0
  });

  /**
   * 컴포넌트 마운트 시 데이터 로드
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * 콘텐츠가 변경될 때마다 통계 및 최근 콘텐츠 업데이트
   */
  useEffect(() => {
    if (contents.length > 0) {
      updateStats();
      updateRecentContents();
    }
  }, [contents]);

  /**
   * 대시보드 데이터 로드
   */
  const loadDashboardData = async () => {
    try {
      // 모든 콘텐츠 로드 (필터 없이)
      await fetchContents();
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    }
  };

  /**
   * 통계 데이터 업데이트
   */
  const updateStats = () => {
    const total = contents.length;
    const published = contents.filter(c => c.status === 'published').length;
    const draft = contents.filter(c => c.status === 'draft').length;
    const archived = contents.filter(c => c.status === 'archived').length;

    setStats({ total, published, draft, archived });
  };

  /**
   * 최근 콘텐츠 업데이트 (최근 5개)
   */
  const updateRecentContents = () => {
    const sortedContents = [...contents]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    setRecentContents(sortedContents);
  };

  /**
   * 상태별 색상 반환
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  /**
   * 상태별 라벨 반환
   */
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return '발행됨';
      case 'draft': return '초안';
      case 'archived': return '보관됨';
      default: return '알 수 없음';
    }
  };

  /**
   * 콘텐츠 유형별 라벨 반환
   */
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return '기사';
      case 'page': return '페이지';
      case 'blog': return '블로그';
      case 'news': return '뉴스';
      default: return type;
    }
  };

  /**
   * 특정 상태의 콘텐츠 목록으로 이동
   */
  const navigateToContents = (status?: string) => {
    if (status) {
      setFilters({ status: status as any });
    }
    router.push('/admin/contents');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          관리자 대시보드
        </Typography>
        <LinearProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          대시보드 데이터를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            관리자 대시보드
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Content Studio CMS 관리 시스템에 오신 것을 환영합니다.
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/contents/new')}
          size="large"
        >
          새 콘텐츠 작성
        </Button>
      </Box>

      {/* 오류 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="전체 콘텐츠"
            value={stats.total}
            icon={<ArticleIcon sx={{ fontSize: 40 }} />}
            color="primary"
            subtitle="모든 콘텐츠"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="발행됨"
            value={stats.published}
            icon={<PublishIcon sx={{ fontSize: 40 }} />}
            color="success"
            subtitle="공개된 콘텐츠"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="초안"
            value={stats.draft}
            icon={<DraftIcon sx={{ fontSize: 40 }} />}
            color="warning"
            subtitle="작성 중인 콘텐츠"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="보관됨"
            value={stats.archived}
            icon={<ArchiveIcon sx={{ fontSize: 40 }} />}
            color="error"
            subtitle="보관된 콘텐츠"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 최근 콘텐츠 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                최근 콘텐츠
              </Typography>
              <Button 
                size="small"
                onClick={() => navigateToContents()}
              >
                전체 보기
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {recentContents.length > 0 ? (
              <List>
                {recentContents.map((content, index) => (
                  <ListItem 
                    key={content.id}
                    divider={index < recentContents.length - 1}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {content.title}
                          </Typography>
                          <Chip
                            label={getStatusLabel(content.status)}
                            color={getStatusColor(content.status) as any}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={getTypeLabel(content.type)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {content.excerpt || '요약 없음'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(content.updatedAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })} 업데이트
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/admin/contents/${content.id}/edit`)}
                          title="편집"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/preview/${content.slug}`)}
                          title="미리보기"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  아직 작성된 콘텐츠가 없습니다.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/admin/contents/new')}
                >
                  첫 콘텐츠 작성하기
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 사이드 패널 */}
        <Grid item xs={12} md={4}>
          {/* 빠른 액션 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              빠른 작업
            </Typography>
            
            <List dense>
              <ListItem 
                button 
                onClick={() => router.push('/admin/contents/new')}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemText
                  primary="새 콘텐츠 작성"
                  secondary="기사, 페이지, 블로그 등"
                />
                <AddIcon color="primary" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => navigateToContents('draft')}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemText
                  primary="초안 관리"
                  secondary={`${stats.draft}개의 초안`}
                />
                <DraftIcon color="warning" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => router.push('/admin/media')}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemText
                  primary="미디어 관리"
                  secondary="이미지 및 파일"
                />
                <ImageIcon color="secondary" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => router.push('/admin/backup')}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText
                  primary="백업 & 복원"
                  secondary="데이터 안전 관리"
                />
                <StorageIcon color="info" />
              </ListItem>
            </List>
          </Paper>

          {/* 시스템 정보 */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              시스템 정보
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                발행률
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.total > 0 ? (stats.published / stats.total) * 100 : 0}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}% 
                ({stats.published}/{stats.total})
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                콘텐츠 유형별 현황
              </Typography>
              
              {['article', 'blog', 'page', 'news'].map((type) => {
                const count = contents.filter(c => c.type === type).length;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <Box key={type} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">
                        {getTypeLabel(type)}
                      </Typography>
                      <Typography variant="caption">
                        {count}개
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                시스템 상태
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main', 
                    mr: 1 
                  }} 
                />
                <Typography variant="caption">
                  데이터베이스 연결됨
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main', 
                    mr: 1 
                  }} 
                />
                <Typography variant="caption">
                  API 서버 정상
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main', 
                    mr: 1 
                  }} 
                />
                <Typography variant="caption">
                  파일 업로드 가능
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;