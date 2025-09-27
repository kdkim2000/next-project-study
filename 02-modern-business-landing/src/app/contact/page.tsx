// app/contact/page.tsx
"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`이름: ${name}\n메시지: ${message}`);
  };

  // 폼 필드 애니메이션 variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      {/* 제목 애니메이션 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom>
          문의하기
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          궁금한 점이 있으시면 언제든지 연락주세요. 빠른 시간 내에 답변드리겠습니다.
        </Typography>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {/* 이름 필드 애니메이션 */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TextField
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </motion.div>

        {/* 메시지 필드 애니메이션 */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TextField
            label="메시지"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            required
          />
        </motion.div>

        {/* 제출 버튼 애니메이션 */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              mt: 2,
              px: 4,
              py: 1.2,
              borderRadius: 2
            }}
          >
            보내기
          </Button>
        </motion.div>
      </form>
    </Box>
  );
}