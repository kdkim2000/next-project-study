// src/lib/animations.ts
// 🎬 Framer Motion 애니메이션 설정 - 부드러운 사용자 경험

import { Variants } from 'framer-motion';

// 🌊 페이지 전환 애니메이션
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// 🎭 스크롤 기반 애니메이션
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

// 🎨 카드 애니메이션
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
  },
};

// 🌟 순차 애니메이션 (Stagger)
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// 📱 모바일 최적화된 애니메이션
export const mobileOptimizedVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30, // 모바일에서는 더 작은 움직임
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // 더 빠른 전환
      ease: 'easeOut',
    },
  },
};

// 🎯 버튼 상호작용 애니메이션
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.95,
  },
};

// 🌅 히어로 섹션 전용 애니메이션
export const heroVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
    },
  },
};

export const heroTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

export const heroButtonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.6,
      ease: 'easeOut',
    },
  },
};

// 🔄 로딩 애니메이션
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// 📊 통계 카운터 애니메이션
export const counterVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// 🎪 특별한 효과들
export const bounceVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const slideInVariants: Variants = {
  hidden: {
    x: '-100vw',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      damping: 20,
    },
  },
};

// 🌈 글래스모피즘 효과
export const glassMorphismVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(10px)',
    transition: {
      duration: 0.5,
    },
  },
};

// 📱 모바일 감지 및 최적화
export const getOptimizedVariants = (isMobile: boolean) => {
  if (isMobile) {
    return mobileOptimizedVariants;
  }
  return fadeInUp;
};

// 🎬 커스텀 이징 함수들
export const customEasing = {
  smooth: [0.6, 0.05, 0.01, 0.9],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  anticipate: [0.68, -0.55, 0.265, 1.55],
};

// 🎯 성능 최적화된 애니메이션 설정
export const optimizedTransition = {
  duration: 0.4,
  ease: 'easeOut',
  // GPU 가속 활용
  willChange: 'transform, opacity',
};

export default {
  pageVariants,
  pageTransition,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  cardVariants,
  staggerContainer,
  staggerItem,
  buttonVariants,
  heroVariants,
  heroTextVariants,
  heroButtonVariants,
  customEasing,
  optimizedTransition,
};

/* 
📚 학습 노트: Framer Motion 애니메이션 시스템

1. 🎯 Variants 패턴:
   - 상태별 애니메이션 정의
   - 재사용 가능한 애니메이션 세트
   - 복잡한 시퀀스 관리

2. 🌊 페이지 전환:
   - 부드러운 페이지 간 이동
   - 로딩 상태 시각화
   - 사용자 경험 향상

3. 📱 반응형 애니메이션:
   - 모바일 최적화된 움직임
   - 성능 고려한 가벼운 애니메이션
   - 배터리 효율성

4. ⚡ 성능 최적화:
   - GPU 가속 활용
   - will-change 속성 활용
   - 60fps 유지

5. 🎨 디자인 시스템 통합:
   - 일관된 애니메이션 언어
   - 브랜드 개성 반영
   - 접근성 고려
*/
