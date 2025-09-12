// src/components/Header.tsx - 앱 헤더 컴포넌트

'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

/**
 * 앱의 상단 헤더 컴포넌트
 * 로고, 제목, 장바구니 아이콘 등을 포함
 */
export default function Header() {
  const { items, getTotalItems, getTotalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  // 장바구니 드로어 토글
  const toggleCartDrawer = (open: boolean) => {
    setIsCartOpen(open);
  };

  // 수량 증가
  const handleIncreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  // 수량 감소
  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {/* 로고와 제목 */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <StoreIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
                E-Shop Catalog
              </Typography>
            </Box>
          </Link>

          {/* 공간 확보 */}
          <Box sx={{ flexGrow: 1 }} />

          {/* 장바구니 아이콘 */}
          <IconButton
            color="inherit"
            onClick={() => toggleCartDrawer(true)}
            aria-label="장바구니 보기"
          >
            <Badge badgeContent={getTotalItems()} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 장바구니 드로어 */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => toggleCartDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            padding: 2,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          장바구니 ({getTotalItems()}개)
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {items.length === 0 ? (
          // 빈 장바구니
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              color: 'text.secondary',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">장바구니가 비어있습니다</Typography>
          </Box>
        ) : (
          // 장바구니 아이템 목록
          <>
            <List sx={{ flexGrow: 1, maxHeight: 400, overflow: 'auto' }}>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    p: 2,
                  }}
                >
                  {/* 제품 정보 */}
                  <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(item.product.price)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem(item.productId)}
                      aria-label="제품 제거"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* 수량 조절 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDecreaseQuantity(item.productId, item.quantity)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 2, minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleIncreaseQuantity(item.productId, item.quantity)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* 총 금액 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                총 금액:
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                {formatPrice(getTotalPrice())}
              </Typography>
            </Box>

            {/* 버튼들 */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                sx={{ flex: 1 }}
              >
                전체 삭제
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ flex: 2 }}
                onClick={() => {
                  alert('주문 기능은 데모에서는 지원되지 않습니다.');
                }}
              >
                주문하기
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
}