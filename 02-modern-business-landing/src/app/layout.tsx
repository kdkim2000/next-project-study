// app/layout.tsx
"use client";

import { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, CssBaseline, Button } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>Modern Business Landing</title>
        <meta name="description" content="기업 랜딩 페이지 예제 (Next.js + MUI + Framer Motion)" />
      </head>
      <body>
        <CssBaseline />
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                ModernBiz
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button color="inherit" component={Link} href="/">Home</Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button color="inherit" component={Link} href="/about">About</Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button color="inherit" component={Link} href="/contact">Contact</Button>
              </motion.div>
            </Toolbar>
          </AppBar>
        </motion.div>
        
        <Container sx={{ mt: 4 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </Container>
      </body>
    </html>
  );
}