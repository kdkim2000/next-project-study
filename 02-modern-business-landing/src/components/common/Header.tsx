// src/components/common/Header.tsx
'use client'
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'

/**
 * 헤더 네비게이션 컴포넌트 (Client Component)
 * 반응형 네비게이션 메뉴 구현
 */
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // 네비게이션 메뉴 아이템들
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ]

  // 모바일 드로어 토글 함수
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // 모바일 드로어 내용
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Modern Business
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <Link href={item.href} style={{ width: '100%', textDecoration: 'none' }}>
              <ListItemText 
                primary={item.label} 
                sx={{ textAlign: 'center', py: 1 }}
              />
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          {/* 로고 */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Modern Business
            </Link>
          </Typography>

          {/* 데스크톱 네비게이션 메뉴 */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  href={item.href}
                  sx={{ 
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          ) : (
            // 모바일 햄버거 메뉴
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Header