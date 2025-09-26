// app/contact/page.tsx
"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`이름: ${name}\n메시지: ${message}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        문의하기
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="메시지"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          보내기
        </Button>
      </form>
    </Box>
  );
}
