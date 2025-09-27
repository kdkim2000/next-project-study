// src/components/Header.tsx
"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Developer&apos;s Blog
          </Typography>
        </Link>
        <Button color="inherit" component={Link} href="/blog">
          Blog
        </Button>
      </Toolbar>
    </AppBar>
  );
}
