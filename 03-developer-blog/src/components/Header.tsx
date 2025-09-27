// src/components/Header.tsx
"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import Link from "next/link";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Developer&apos;s Blog
          </Typography>
        </Link>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} href="/blog">
            Blog
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/search"
            startIcon={<Search />}
          >
            Search
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}