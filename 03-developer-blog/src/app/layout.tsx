// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/Header";
import { Container } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Developer's Blog",
  description: "Sample blog platform with Next.js & MUI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <Container sx={{ mt: 4 }}>{children}</Container>
        </Providers>
      </body>
    </html>
  );
}
