// src/app/page.tsx
// 🏠 메인 홈페이지 - SWR 데이터 페칭과 향상된 구조

'use client';

import { Box, CircularProgress, Alert } from '@mui/material';
import useSWR from 'swr';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

import { getServices, getCompanyInfo, type Service, type CompanyInfo } from '@/lib/api';
import { pageVariants, pageTransition } from '@/lib/animations';

// 🎯 데이터 페처 함수들
const fetchServices = async (): Promise<Service[]> => {
  const result = await getServices();
  if (!result.success || !result.data) {
    throw new Error(result.error || '서비스 데이터를 불러올 수 없습니다.');
  }
  return result.data;
};

const fetchCompanyInfo = async (): Promise<CompanyInfo> => {
  const result = await getCompanyInfo();
  if (!result.success || !result.data) {
    throw new Error(result.error || '회사 정보를 불러올 수 없습니다.');
  }
  return result.data;
};

// 🚀 메인 홈페이지 컴포넌트
export default function Home() {
  // 🔄 SWR로 데이터 페칭
  const {
    data: companyInfo,
    error: companyError,
    isLoading: companyLoading,
  } = useSWR('company-info', fetchCompanyInfo, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1분간 중복 요청 방지
  });

  const {
    data: services,
    error: servicesError,
    isLoading: servicesLoading,
  } = useSWR('services', fetchServices, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  // 📊 로딩 상태 처리
  const isLoading = companyLoading || servicesLoading;
  const hasError = companyError || servicesError;

  // 💫 로딩 화면
  if (isLoading) {
    return (
      <>
        <Header />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress size={48} thickness={4} />
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            데이터를 불러오는 중...
          </motion.div>
        </Box>
        <Footer companyName="Modern Business" />
      </>
    );
  }

  // ❌ 에러 상태 처리
  if (hasError) {
    return (
      <>
        <Header />
        <Box sx={{ p: 4 }}>
          <Alert
            severity="error"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mt: 4,
              borderRadius: 2,
            }}
          >
            <strong>데이터 로딩 오류</strong>
            <br />
            {companyError?.message || servicesError?.message || '알 수 없는 오류가 발생했습니다.'}
            <br />
            <small>페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</small>
          </Alert>
        </Box>
        <Footer companyName="Modern Business" />
      </>
    );
  }

  // 🔄 기본값 설정 (데이터가 없는 경우)
  const defaultCompanyInfo: CompanyInfo = {
    name: 'Modern Business',
    tagline: '혁신적인 비즈니스 솔루션',
    description: 'Next.js와 MUI v7을 활용한 현대적인 웹 개발',
    established: 2020,
    employees: 25,
    projects: 150,
  };

  const defaultServices: Service[] = [
    {
      id: 1,
      title: '웹 개발',
      description: '최신 기술을 활용한 반응형 웹사이트 제작',
      icon: '💻',
      features: ['Next.js / React 개발', '반응형 디자인', 'SEO 최적화'],
      price: '300만원부터',
      popular: true,
    },
    {
      id: 2,
      title: '모바일 앱',
      description: 'iOS/Android 네이티브 및 크로스플랫폼 앱',
      icon: '📱',
      features: ['React Native 개발', '네이티브 앱 개발', '앱스토어 배포'],
      price: '500만원부터',
    },
    {
      id: 3,
      title: '디지털 마케팅',
      description: 'SEO, 소셜미디어 마케팅을 통한 온라인 브랜딩',
      icon: '📈',
      features: ['SEO 최적화', '구글 애즈 관리', '소셜미디어 마케팅'],
      price: '100만원부터',
    },
  ];

  const finalCompanyInfo = companyInfo || defaultCompanyInfo;
  const finalServices = services || defaultServices;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      {/* 상단 헤더 네비게이션 */}
      <Header />
      
      {/* 메인 컨텐츠 영역 */}
      <main>
        {/* 히어로 섹션 - 메인 배너 */}
        <HeroSection companyInfo={finalCompanyInfo} />
        
        {/* 서비스 소개 섹션 */}
        <ServicesSection services={finalServices} />
        
        {/* 연락처 섹션 */}
        <ContactSection />
      </main>
      
      {/* 하단 푸터 */}
      <Footer companyName={finalCompanyInfo.name} />
    </motion.div>
  );
}

/* 
📚 학습 노트: SWR + 에러 처리 + 사용자 경험

1. 🔄 SWR 데이터 페칭:
   - 자동 캐싱 및 재검증
   - 네트워크 재연결 시 자동 갱신
   - 중복 요청 제거 (dedupingInterval)
   - 포커스 시 재검증 비활성화 (성능 최적화)

2. 📊 포괄적인 상태 관리:
   - 로딩, 에러, 성공 상태 모두 처리
   - 사용자 친화적인 에러 메시지
   - 기본값 제공으로 견고성 확보

3. 🎬 애니메이션과 UX:
   - 페이지 전환 애니메이션
   - 로딩 스피너 + 텍스트 펄스 효과
   - 부드러운 상태 변화

4. 🔧 에러 복구:
   - 명확한 에러 설명
   - 사용자 액션 가이드
   - 기본값 폴백으로 기능 유지

5. ⚡ 성능 최적화:
   - 조건부 렌더링
   - 최소한의 리렌더링
   - 효율적인 데이터 캐싱

6. 🌐 실무 적용:
   - 실제 API 연동 준비
   - 확장 가능한 구조
   - 유지보수 고려한 코드 구성
*/
