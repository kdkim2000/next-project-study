// src/app/page.tsx
// 🏠 메인 홈페이지 - Server Component 예제
// 이 파일은 기본적으로 Server Component입니다 ('use client' 없음)

import { Container } from '@mui/material';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

// 🚀 메인 홈페이지 컴포넌트
export default function Home() {
  // 📊 서버에서 데이터를 준비할 수 있습니다
  const companyInfo = {
    name: 'Modern Business',
    tagline: '혁신적인 비즈니스 솔루션',
    description: 'Next.js와 MUI를 활용한 현대적인 웹 개발',
  };

  const services = [
    {
      id: 1,
      title: '웹 개발',
      description: '최신 기술을 활용한 반응형 웹사이트 제작',
      icon: '💻',
    },
    {
      id: 2,
      title: '모바일 앱',
      description: 'iOS/Android 네이티브 및 크로스플랫폼 앱',
      icon: '📱',
    },
    {
      id: 3,
      title: '디지털 마케팅',
      description: 'SEO 최적화 및 디지털 마케팅 전략',
      icon: '📈',
    },
  ];

  return (
    <>
      {/* 상단 헤더 네비게이션 */}
      <Header />
      
      {/* 메인 컨텐츠 영역 */}
      <main>
        {/* 히어로 섹션 - 메인 배너 */}
        <HeroSection companyInfo={companyInfo} />
        
        {/* 서비스 소개 섹션 */}
        <ServicesSection services={services} />
        
        {/* 연락처 섹션 */}
        <ContactSection />
      </main>
      
      {/* 하단 푸터 */}
      <Footer companyName={companyInfo.name} />
    </>
  );
}

/* 
📚 학습 노트:
1. 이 컴포넌트는 Server Component입니다 ('use client' 없음)
2. 서버에서 미리 데이터를 준비할 수 있습니다
3. SEO에 유리하고 초기 로딩이 빠릅니다
4. props를 통해 하위 컴포넌트에 데이터를 전달합니다
5. 각 섹션을 컴포넌트로 분리하여 코드를 구조화했습니다
6. Header의 네비게이션이 이제 실제 페이지 라우팅을 지원합니다
*/