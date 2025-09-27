// app/page.tsx
"use client";

import { Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <Box textAlign="center" mt={8}>
      {/* Hero 영역 페이드인 애니메이션 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h3" gutterBottom>
          환영합니다, Modern Business!
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Typography variant="h6" gutterBottom>
          전문적인 서비스를 제공하는 기업을 위한 랜딩 페이지 예제입니다.
        </Typography>
      </motion.div>

      {/* Contact 버튼 hover 시 scale 효과 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: "inline-block", marginTop: "24px" }}
      >
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/contact"
          sx={{
            mt: 3,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: "1.1rem"
          }}
        >
          문의하기
        </Button>
      </motion.div>
    </Box>
  );
}