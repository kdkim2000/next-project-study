// prisma/seed.ts - CommonJS 호환 SQLite 시드 스크립트

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * SQLite 데이터베이스에 샘플 데이터를 추가하는 함수
 * Windows 환경과 ts-node 호환성을 고려한 버전
 */
async function main() {
  console.log('🌱 SQLite 데이터베이스 시딩 시작...');

  try {
    // 개발 환경에서 기존 데이터 삭제
    console.log('🗑️  기존 데이터 삭제 중...');
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // 카테고리 생성
    console.log('📁 카테고리 생성 중...');
    const electronics = await prisma.category.create({
      data: {
        name: '전자제품',
        description: '스마트폰, 태블릿, 노트북 등 각종 전자기기',
      },
    });

    const fashion = await prisma.category.create({
      data: {
        name: '패션',
        description: '의류, 신발, 액세서리 등 패션 아이템',
      },
    });

    const books = await prisma.category.create({
      data: {
        name: '도서',
        description: '소설, 전문서, 만화책 등 다양한 도서',
      },
    });

    const sports = await prisma.category.create({
      data: {
        name: '스포츠/레저',
        description: '운동용품, 아웃도어 장비 등',
      },
    });

    const home = await prisma.category.create({
      data: {
        name: '홈/가전',
        description: '생활용품, 가전제품, 인테리어 소품 등',
      },
    });

    // 제품 데이터 배열
    const products = [
      // 전자제품
      {
        name: 'iPhone 15 Pro',
        description: '최신 A17 Pro 칩셋을 탑재한 프리미엄 스마트폰입니다. 티타늄 소재로 제작되어 더욱 견고하고 가벼워졌습니다.',
        price: 1290000,
        stock: 25,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        ]),
        categoryId: electronics.id,
        featured: true,
        rating: 4.8,
        reviewCount: 156,
      },
      {
        name: 'MacBook Air M3',
        description: '혁신적인 M3 칩을 탑재한 초경량 노트북. 하루 종일 지속되는 배터리와 뛰어난 성능을 자랑합니다.',
        price: 1590000,
        stock: 15,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        ]),
        categoryId: electronics.id,
        featured: true,
        rating: 4.9,
        reviewCount: 89,
      },
      {
        name: 'Samsung Galaxy Tab S9',
        description: '생산성과 창의성을 위한 프리미엄 안드로이드 태블릿. S펜이 포함되어 있어 메모와 그림 그리기에 최적화되어 있습니다.',
        price: 890000,
        stock: 30,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        ]),
        categoryId: electronics.id,
        rating: 4.6,
        reviewCount: 124,
      },
      
      // 패션
      {
        name: '클래식 데님 재킷',
        description: '시대를 초월한 클래식한 디자인의 데님 재킷. 고품질 면 100% 소재로 편안하고 내구성이 뛰어납니다.',
        price: 89000,
        stock: 45,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
        ]),
        categoryId: fashion.id,
        rating: 4.4,
        reviewCount: 78,
      },
      {
        name: '프리미엄 가죽 운동화',
        description: '이탈리아산 천연 가죽으로 제작된 고급 운동화. 편안한 착용감과 세련된 디자인을 동시에 만족시킵니다.',
        price: 189000,
        stock: 20,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        ]),
        categoryId: fashion.id,
        featured: true,
        rating: 4.7,
        reviewCount: 203,
      },
      
      // 도서
      {
        name: '클린 코드',
        description: '소프트웨어 개발자를 위한 필독서. 읽기 좋은 코드를 작성하는 방법에 대한 실용적인 가이드입니다.',
        price: 35000,
        stock: 50,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        ]),
        categoryId: books.id,
        featured: true,
        rating: 4.8,
        reviewCount: 892,
      },
      {
        name: 'JavaScript: The Good Parts',
        description: 'JavaScript의 핵심 개념과 좋은 부분들을 다루는 프로그래밍 서적. 웹 개발자에게 추천하는 책입니다.',
        price: 28000,
        stock: 35,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        ]),
        categoryId: books.id,
        rating: 4.5,
        reviewCount: 567,
      },
      
      // 스포츠/레저
      {
        name: '프로페셔널 요가매트',
        description: '친환경 소재로 제작된 프리미엄 요가매트. 뛰어난 그립감과 쿠셔닝으로 안전하고 편안한 요가 연습을 도와줍니다.',
        price: 65000,
        stock: 40,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        ]),
        categoryId: sports.id,
        rating: 4.6,
        reviewCount: 234,
      },
      {
        name: '경량 등산 백팩 30L',
        description: '가벼우면서도 내구성이 뛰어난 등산용 백팩. 방수 기능과 에어 메시 시스템으로 편안한 등산을 지원합니다.',
        price: 128000,
        stock: 25,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        ]),
        categoryId: sports.id,
        rating: 4.7,
        reviewCount: 145,
      },
      
      // 홈/가전
      {
        name: '스마트 공기청정기',
        description: 'WiFi 연결 기능이 있는 스마트 공기청정기. 앱을 통해 원격 제어가 가능하고 실시간 공기질 모니터링을 제공합니다.',
        price: 290000,
        stock: 18,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        ]),
        categoryId: home.id,
        featured: true,
        rating: 4.5,
        reviewCount: 167,
      },
      {
        name: '원목 커피 테이블',
        description: '천연 원목으로 제작된 북유럽 스타일 커피 테이블. 심플하면서도 고급스러운 디자인으로 어떤 인테리어에도 잘 어울립니다.',
        price: 159000,
        stock: 12,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        ]),
        categoryId: home.id,
        rating: 4.3,
        reviewCount: 89,
      },
      {
        name: '무선 블루투스 이어폰',
        description: '최신 블루투스 5.3 기술과 액티브 노이즈 캔슬링 기능을 탑재한 프리미엄 무선 이어폰입니다.',
        price: 179000,
        stock: 35,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
        ]),
        categoryId: electronics.id,
        rating: 4.6,
        reviewCount: 312,
      },
    ];

    // 제품 데이터 개별 생성 (Windows 환경에서 더 안정적)
    console.log('📦 제품 생성 중...');
    let createdCount = 0;
    for (const productData of products) {
      await prisma.product.create({
        data: productData,
      });
      createdCount++;
      console.log(`  ✅ ${productData.name} 생성 완료 (${createdCount}/${products.length})`);
    }

    console.log('✅ SQLite 시딩 완료!');
    console.log(`📦 ${products.length}개의 제품이 추가되었습니다.`);
    console.log('🏷️ 5개의 카테고리가 생성되었습니다.');
    console.log('📊 데이터베이스 파일 위치: prisma/dev.db');
    console.log('🔍 Prisma Studio로 데이터 확인: npm run db:studio');
    
  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error);
    throw error;
  }
}

// 메인 함수 실행
main()
  .catch((e) => {
    console.error('❌ 시딩 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });