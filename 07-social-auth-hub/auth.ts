// /auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";

// 데모용 RBAC: ENV로 관리자 지정
const adminEmails = (process.env.AUTH_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function inferRole(email?: string | null) {
  if (!email) return "user";
  return adminEmails.includes(email.toLowerCase()) ? "admin" : "user";
}

export const authConfig: NextAuthConfig = {
  // 기본이 JWT 세션(무DB) — 학습에 적합
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7d
  trustHost: true,
  providers: [
    Google, // v5는 ENV(AUTH_GOOGLE_*) 자동 인식
    GitHub, // ENV(AUTH_GITHUB_*)
    Resend, // Email Magic Link (ENV AUTH_RESEND_KEY)
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = inferRole(user.email);
        if (user.name) token.name = user.name;
      }
      // 클라이언트 useSession().update({...}) 반영
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      session.user.role = (token.role as "admin" | "user") ?? "user";
      if (token.name) session.user.name = token.name;
      return session;
    },
    // 미들웨어 위임 방식으로 라우트 보호
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      // 공개 페이지 허용
      if (
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/api/auth")
      )
        return true;

      const loggedIn = !!auth?.user;

      // /profile 보호
      if (pathname.startsWith("/profile")) return loggedIn;

      // /admin RBAC
      if (pathname.startsWith("/admin")) {
        return loggedIn && auth?.user?.role === "admin";
      }
      // 그 외 기본 허용
      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
