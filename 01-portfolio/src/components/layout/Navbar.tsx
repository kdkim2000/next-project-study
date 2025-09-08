// src/components/layout/Navbar.tsx
// 전역 테마와 연동된 네비게이션 바

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Menu, Close } from '@mui/icons-material'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { mainNavigation } from '@/data/navigation'
import { personalInfo } from '@/data/personal'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            {/* 로고 */}
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.dark',
                },
                transition: 'color 0.2s ease-in-out',
              }}
            >
              {personalInfo.name}
            </Typography>

            {/* 데스크톱 메뉴 */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {mainNavigation.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.href}
                    sx={{
                      mx: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      color: pathname === item.href ? 'primary.main' : 'text.primary',
                      fontWeight: pathname === item.href ? 'bold' : 'normal',
                      bgcolor: pathname === item.href ? 'action.hover' : 'transparent',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                <ThemeToggle />
              </Box>
            )}

            {/* 모바일 햄버거 메뉴 */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThemeToggle />
                <IconButton onClick={handleDrawerToggle}>
                  <Menu />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            bgcolor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            메뉴
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        
        <List>
          {mainNavigation.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                selected={pathname === item.href}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}