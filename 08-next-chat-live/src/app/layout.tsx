// src/app/layout.tsx
/**
 * 간단한 레이아웃 - Material-UI 없이 기본 설정만
 * 초보자가 이해하기 쉽도록 최소한의 코드만 포함
 */
import './globals.css';

export const metadata = {
  title: 'Next Chat Live - 간단한 실시간 채팅',
  description: 'React와 Next.js로 만든 초보자용 채팅 애플리케이션',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}