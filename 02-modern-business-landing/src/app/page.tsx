// src/app/page.tsx
import { Container, Box } from '@mui/material'
import Header from '@/components/common/Header'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/common/Footer'

/**
 * 홈페이지 메인 컴포넌트 (Server Component)
 * 여러 섹션을 조합하여 완성된 랜딩 페이지 구성
 */
export default function HomePage() {
  return (
    <Box component="main">
      {/* 헤더 네비게이션 */}
      <Header />
      
      {/* 메인 히어로 섹션 */}
      <HeroSection />
      
      {/* 서비스 소개 섹션 */}
      <ServicesSection />
      
      {/* 회사 소개 섹션 */}
      <AboutSection />
      
      {/* 연락처 섹션 */}
      <ContactSection />
      
      {/* 푸터 */}
      <Footer />
    </Box>
  )
}