// src/components/ProductCard.tsx - 제품 카드 컴포넌트

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
  Badge,
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

/**
 * 제품 정보를 카드 형태로 표시하는 컴포넌트
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = React.useState(false);

  // 장바구니에 제품 추가
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이벤트 방지
    e.stopPropagation();
    addItem(product, 1);
  };

  // 찜하기 토글
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <Card
      sx={{
        height: '100%',
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
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
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
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        }}
        size="small"
      >
        {isFavorite ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      {/* 제품 이미지 */}
      <Link href={`/products/${product.id}`} passHref>
        <CardMedia
          component="img"
          height="200"
          image={product.images[0] || '/api/placeholder/300/200'}
          alt={product.name}
          sx={{
            cursor: 'pointer',
            objectFit: 'cover',
          }}
        />
      </Link>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 카테고리 */}
        {product.category && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {product.category.name}
          </Typography>
        )}

        {/* 제품명 */}
        <Link 
          href={`/products/${product.id}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 1,
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
              },
              // 텍스트가 2줄을 넘으면 말줄임표 처리
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '3rem',
            }}
          >
            {product.name}
          </Typography>
        </Link>

        {/* 설명 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.description}
        </Typography>

        {/* 평점과 리뷰 수 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={product.rating}
            readOnly
            size="small"
            precision={0.5}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>

        {/* 가격과 재고 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            {formatPrice(product.price)}
          </Typography>
          <Typography
            variant="caption"
            color={product.stock > 0 ? 'success.main' : 'error.main'}
          >
            {product.stock > 0 ? `재고 ${product.stock}개` : '품절'}
          </Typography>
        </Box>

        {/* 장바구니 추가 버튼 */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{ mt: 'auto' }}
        >
          {product.stock > 0 ? '장바구니 담기' : '품절'}
        </Button>
      </CardContent>
    </Card>
  );
}