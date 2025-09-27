// app/about/page.tsx
"use client";

import Section from "@/components/Section";
import { motion } from "framer-motion";

export default function AboutPage() {
  // 섹션 애니메이션 variants
  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* 첫 번째 섹션 - 좌측에서 슬라이드 */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Section title="회사 소개">
          <p>저희 회사는 고객 중심 서비스를 제공하며 최신 기술을 활용합니다.</p>
          <p>지속적인 혁신과 품질 향상을 통해 고객만족을 실현합니다.</p>
        </Section>
      </motion.div>

      {/* 두 번째 섹션 - 우측에서 슬라이드 */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Section title="비전">
          <p>미래지향적 혁신으로 고객과 함께 성장합니다.</p>
          <p>글로벌 시장에서 리더십을 발휘하는 기업이 되겠습니다.</p>
        </Section>
      </motion.div>

      {/* 세 번째 섹션 추가 - 하단에서 슬라이드 */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Section title="핵심 가치">
          <p>신뢰, 혁신, 협력을 바탕으로 지속가능한 성장을 추구합니다.</p>
          <p>모든 이해관계자와 함께하는 상생의 가치를 실현합니다.</p>
        </Section>
      </motion.div>
    </>
  );
}