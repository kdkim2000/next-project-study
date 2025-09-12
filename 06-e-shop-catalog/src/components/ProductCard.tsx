// src/components/ProductCard.tsx - 제품 카드 컴포넌트 (고정 폭/높이, 줄수 고정)

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import {
  AddShoppingCart as AddShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

/** 고정 레이아웃용 상수 */
const CARD_WIDTH = { xs: '100%', sm: 280, md: 300 };   // 반응형 가로 폭
const CARD_HEIGHT = { xs: 480, sm: 500, md: 520 };     // 반응형 세로 높이
const IMAGE_HEIGHT = 200;

// 타이틀/설명 줄수에 맞춰 높이 예약(폰트 기본값 기준 대략치)
const TITLE_LINES = 2;
const DESC_LINES = 2;
const TITLE_LINE_HEIGHT = 24; // px (MUI h6 대략치)
const DESC_LINE_HEIGHT = 20;  // px (MUI body2 대략치)
const TITLE_MIN_HEIGHT = TITLE_LINES * TITLE_LINE_HEIGHT; // 48px
const DESC_MIN_HEIGHT = DESC_LINES * DESC_LINE_HEIGHT;    // 40px

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((v) => !v);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

  return (
    <Card
      sx={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* 추천 제품 뱃지 */}
      {product.featured && (
        <Chip
          label="추천"
          color="secondary"
          size="small"
          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
        />
      )}

      {/* 찜하기 버튼 */}
      <IconButton
        onClick={handleToggleFavorite}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
        }}
        size="small"
      >
        {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>

      {/* 제품 이미지: 고정 높이 */}
      <Link href={`/products/${product.id}`} passHref>
        <CardMedia
          component="img"
          height={IMAGE_HEIGHT}
          image={product.images[0] || '/api/placeholder/300/200'}
          alt={product.name}
          sx={{ cursor: 'pointer', objectFit: 'cover' }}
        />
      </Link>

      <CardContent
        sx={{
          flexGrow: 1,                // 콘텐츠 영역이 남은 공간을 채움
          display: 'flex',
          flexDirection: 'column',    // 버튼을 하단에 고정하기 위함
          gap: 1,
          pb: 2,
        }}
      >
        {/* 카테고리 */}
        {product.category && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            {product.category.name}
          </Typography>
        )}

        {/* 제품명: 2줄 고정, 높이 예약 */}
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
              display: '-webkit-box',
              WebkitLineClamp: TITLE_LINES,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: `${TITLE_MIN_HEIGHT}px`,
            }}
          >
            {product.name}
          </Typography>
        </Link>

        {/* 설명: 2줄 고정, 높이 예약 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexShrink: 0,
            display: '-webkit-box',
            WebkitLineClamp: DESC_LINES,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: `${DESC_MIN_HEIGHT}px`,
          }}
        >
          {product.description}
        </Typography>

        {/* 평점/리뷰 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating value={product.rating} readOnly size="small" precision={0.5} />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>

        {/* 가격/재고 */}
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatPrice(product.price)}
          </Typography>
          <Typography variant="caption" color={product.stock > 0 ? 'success.main' : 'error.main'}>
            {product.stock > 0 ? `재고 ${product.stock}개` : '품절'}
          </Typography>
        </Box>

        {/* 여백을 채워 버튼을 하단으로 밀기 */}
        <Box sx={{ flexGrow: 1 }} />

        {/* 장바구니 버튼 */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{ mt: 1 }}
        >
          {product.stock > 0 ? '장바구니 담기' : '품절'}
        </Button>
      </CardContent>
    </Card>
  );
}
