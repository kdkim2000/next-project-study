// src/app/products/[id]/page.tsx - 제품 상세 페이지

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Rating,
  Chip,
  Divider,
  Paper,
  ImageList,
  ImageListItem,
  TextField,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link as MUILink,
} from '@mui/material';
import {
  AddShoppingCart as AddShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { Product, ApiResponse } from '@/types';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

/**
 * 제품 상세 페이지 컴포넌트
 */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  // 상태 관리
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const productId = params.id as string;

  // 제품 상세 정보 가져오기
  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}`);
      const data: ApiResponse<{ product: Product; relatedProducts: Product[] }> = await response.json();

      if (data.success) {
        setProduct(data.data.product);
        setRelatedProducts(data.data.relatedProducts);
      } else {
        setError(data.error || '제품을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('제품 상세 정보 API 호출 실패:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  // 장바구니에 추가
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`);
    }
  };

  // 수량 변경
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    setQuantity(Math.max(1, Math.min(value, product?.stock || 1)));
  };

  // 찜하기 토글
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // 공유하기
  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('공유 실패:', error);
      }
    } else {
      // Web Share API를 지원하지 않는 경우 URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  // 로딩 중
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  // 에러 발생
  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          variant="outlined"
        >
          뒤로가기
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/" passHref>
          <MUILink underline="hover" color="inherit">
            홈
          </MUILink>
        </Link>
        {product.category && (
          <Link href={`/?category=${product.category.id}`} passHref>
            <MUILink underline="hover" color="inherit">
              {product.category.name}
            </MUILink>
          </Link>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {/* 뒤로가기 버튼 */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        뒤로가기
      </Button>

      {/* 제품 상세 정보 */}
      <Grid container spacing={4}>
        {/* 이미지 갤러리 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {/* 메인 이미지 */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 400,
                mb: 2,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Image
                src={product.images[selectedImageIndex] || '/api/placeholder/400/400'}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>

            {/* 이미지 썸네일 목록 */}
            {product.images.length > 1 && (
              <ImageList cols={4} rowHeight={80} sx={{ mt: 2 }}>
                {product.images.map((image, index) => (
                  <ImageListItem
                    key={index}
                    sx={{
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? 2 : 0,
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
        </Grid>

        {/* 제품 정보 */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* 카테고리 */}
            {product.category && (
              <Chip
                label={product.category.name}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}

            {/* 추천 제품 뱃지 */}
            {product.featured && (
              <Chip
                label="추천 제품"
                color="secondary"
                sx={{ ml: 1, mb: 2 }}
              />
            )}

            {/* 제품명 */}
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              {product.name}
            </Typography>

            {/* 평점과 리뷰 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviewCount}개 리뷰)
              </Typography>
            </Box>

            {/* 가격 */}
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              {formatPrice(product.price)}
            </Typography>

            {/* 재고 정보 */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                color={product.stock > 0 ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 'medium' }}
              >
                {product.stock > 0 ? `재고 ${product.stock}개 남음` : '품절'}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 구매 옵션 */}
            {product.stock > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  수량 선택
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <TextField
                    type="number"
                    label="수량"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{
                      min: 1,
                      max: product.stock,
                    }}
                    sx={{ width: 120 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    최대 {product.stock}개
                  </Typography>
                </Box>

                {/* 총 가격 */}
                <Typography variant="h6" sx={{ mb: 3 }}>
                  총 가격: {formatPrice(product.price * quantity)}
                </Typography>
              </Box>
            )}

            {/* 액션 버튼들 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ flex: 1 }}
              >
                {product.stock > 0 ? '장바구니 담기' : '품절'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleToggleFavorite}
                sx={{ minWidth: 60 }}
              >
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleShare}
                sx={{ minWidth: 60 }}
              >
                <ShareIcon />
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 제품 설명 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                제품 설명
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {product.description}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* 관련 제품 */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            관련 제품
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}