// src/lib/imageUtils.ts - SQLite의 JSON 문자열 이미지 데이터를 파싱하는 유틸리티

/**
 * SQLite에 저장된 JSON 문자열 이미지 데이터를 배열로 파싱
 * @param imagesJson - JSON 문자열 형태의 이미지 데이터
 * @returns 파싱된 이미지 URL 배열
 */
export function parseImages(imagesJson: string): string[] {
  try {
    const parsed = JSON.parse(imagesJson);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // 단일 문자열인 경우 배열로 변환
    return [parsed];
  } catch (error) {
    console.error('이미지 JSON 파싱 실패:', error);
    // 파싱 실패시 빈 배열 반환
    return [];
  }
}

/**
 * 이미지 URL 배열을 SQLite 저장용 JSON 문자열로 변환
 * @param images - 이미지 URL 배열
 * @returns JSON 문자열
 */
export function stringifyImages(images: string[]): string {
  try {
    return JSON.stringify(images);
  } catch (error) {
    console.error('이미지 배열 문자열화 실패:', error);
    return JSON.stringify([]);
  }
}

/**
 * 제품 데이터의 이미지를 파싱하여 프론트엔드용 형태로 변환
 * @param product - 데이터베이스에서 가져온 제품 정보
 * @returns 파싱된 이미지 배열을 포함한 제품 정보
 */
export function parseProductImages<T extends { images: string }>(
  product: T
): Omit<T, 'images'> & { images: string[] } {
  return {
    ...product,
    images: parseImages(product.images),
  };
}

/**
 * 여러 제품의 이미지를 일괄 파싱
 * @param products - 제품 배열
 * @returns 파싱된 제품 배열
 */
export function parseProductsImages<T extends { images: string }>(
  products: T[]
): (Omit<T, 'images'> & { images: string[] })[] {
  return products.map(parseProductImages);
}

/**
 * 기본 플레이스홀더 이미지 제공
 * @param width - 이미지 너비
 * @param height - 이미지 높이
 * @returns 플레이스홀더 이미지 URL
 */
export function getPlaceholderImage(width: number = 400, height: number = 400): string {
  return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
}

/**
 * 이미지 URL이 유효한지 검증
 * @param url - 검증할 이미지 URL
 * @returns 유효성 여부
 */
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    // 일반적인 이미지 확장자 체크
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    // Unsplash 같은 이미지 서비스 도메인 체크
    const imageServices = ['unsplash.com', 'placeholder.com', 'picsum.photos'];
    const isImageService = imageServices.some(service => 
      url.includes(service)
    );
    
    return hasImageExtension || isImageService;
  } catch {
    return false;
  }
}

/**
 * 이미지 배열에서 유효하지 않은 URL을 필터링하고 플레이스홀더로 대체
 * @param images - 이미지 URL 배열
 * @param placeholder - 대체할 플레이스홀더 이미지 (선택사항)
 * @returns 검증된 이미지 URL 배열
 */
export function validateAndFilterImages(
  images: string[], 
  placeholder?: string
): string[] {
  const validImages = images.filter(isValidImageUrl);
  
  // 유효한 이미지가 없으면 플레이스홀더 추가
  if (validImages.length === 0) {
    return [placeholder || getPlaceholderImage()];
  }
  
  return validImages;
}