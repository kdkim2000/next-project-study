// src/components/Navigation.tsx
"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/path-utils";

interface NavItem {
  label: string;
  href: string;
}

export default function Navigation(): JSX.Element {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "홈", href: "/" },
    { label: "블로그", href: "/blog" },
    { label: "에디터", href: "/editor" },
  ];

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          href={withBasePath("/")}
          sx={{ 
            flexGrow: 1, 
            textDecoration: "none", 
            color: "inherit",
            fontWeight: 700
          }}
        >
          🚀 Developer's Blog
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.href}
              color="inherit"
              component={Link}
              href={withBasePath(item.href)}
              sx={{
                fontWeight: pathname === item.href ? 700 : 400,
                backgroundColor: pathname === item.href 
                  ? "rgba(255, 255, 255, 0.1)" 
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}