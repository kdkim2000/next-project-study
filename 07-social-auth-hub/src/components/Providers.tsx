// src/components/Providers.tsx - NextAuth.js 세션 프로바이더
"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null; // 서버에서 전달받은 세션 (선택사항)
}

/**
 * NextAuth.js 세션 프로바이더 컴포넌트
 * - 전체 앱에서 세션 상태를 사용할 수 있게 해줌
 * - useSession, signIn, signOut 등의 훅 사용 가능
 */
export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}