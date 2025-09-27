// app/components/Section.tsx
"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export default function Section({ title, children, delay = 0 }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      <Box my={4} sx={{ p: 3, borderRadius: 2, backgroundColor: "grey.50" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "primary.main", mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ "& p": { mb: 1, lineHeight: 1.6 } }}>
          {children}
        </Box>
      </Box>
    </motion.div>
  );
}