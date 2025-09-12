// force-reset.js - 강제 데이터베이스 초기화 및 시드 데이터 생성

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function forceReset() {
  try {
    console.log('🔥 강제 데이터베이스 초기화 시작...');
    
    // 1. 데이터베이스 파일 삭제
    const dbPath = path.join(__dirname, 'prisma', 'dev.db');
    const dbJournalPath = path.join(__dirname, 'prisma', 'dev.db-journal');
    
    try {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('🗑️  기존 데이터베이스 파일 삭제됨');
      }
      if (fs.existsSync(dbJournalPath)) {
        fs.unlinkSync(dbJournalPath);
        console.log('🗑️  기존 저널 파일 삭제됨');
      }
    } catch (error) {
      console.log('⚠️  파일 삭제 실패 (무시하고 계속):', error.message);
    }

    await prisma.$disconnect();

    // 2. 새로운 데이터베이스 생성 및 스키마 적용
    console.log('🔧 새 데이터베이스 생성 중...');
    const { execSync } = require('child_process');
    
    try {
      execSync('npx prisma db push --force-reset', { 
        stdio: 'inherit',
        cwd: __dirname 
      });
    } catch (error) {
      console.error('❌ 데이터베이스 생성 실패:', error.message);
      return;
    }

    // 3. 새로운 Prisma 클라이언트로 시드 데이터 생성
    console.log('🌱 시드 데이터 생성 중...');
    const newPrisma = new PrismaClient();

    // 카테고리 생성
    const electronics = await newPrisma.category.create({
      data: {
        name: '전자제품',
        description: '스마트폰, 태블릿, 노트북 등 각종 전자기기',
      },
    });

    const fashion = await newPrisma.category.create({
      data: {
        name: '패션',
        description: '의류, 신발, 액세서리 등 패션 아이템',
      },
    });

    const books = await newPrisma.category.create({
      data: {
        name: '도서',
        description: '소설, 전문서, 만화책 등 다양한 도서',
      },
    });

    const sports = await newPrisma.category.create({
      data: {
        name: '스포츠/레저',
        description: '운동용품, 아웃도어 장비 등',
      },
    });

    const home = await newPrisma.category.create({
      data: {
        name: '홈/가전',
        description: '생활용품, 가전제품, 인테리어 소품 등',
      },
    });

    // 제품 데이터
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: '최신 A17 Pro 칩셋을 탑재한 프리미엄 스마트폰입니다.',
        price: 1290000,
        stock: 25,
        images: JSON.stringify(['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400']),
        categoryId: electronics.id,
        featured: true,
        rating: 4.8,
        reviewCount: 156,
      },
      {
        name: 'MacBook Air M3',
        description: '혁신적인 M3 칩을 탑재한 초경량 노트북입니다.',
        price: 1590000,
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400']),
        categoryId: electronics.id,
        featured: true,
        rating: 4.9,
        reviewCount: 89,
      },
      {
        name: '클래식 데님 재킷',
        description: '시대를 초월한 클래식한 디자인의 데님 재킷입니다.',
        price: 89000,
        stock: 45,
        images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400']),
        categoryId: fashion.id,
        rating: 4.4,
        reviewCount: 78,
      },
      {
        name: '프리미엄 가죽 운동화',
        description: '이탈리아산 천연 가죽으로 제작된 고급 운동화입니다.',
        price: 189000,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400']),
        categoryId: fashion.id,
        featured: true,
        rating: 4.7,
        reviewCount: 203,
      },
      {
        name: '클린 코드',
        description: '소프트웨어 개발자를 위한 필독서입니다.',
        price: 35000,
        stock: 50,
        images: JSON.stringify(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400']),
        categoryId: books.id,
        featured: true,
        rating: 4.8,
        reviewCount: 892,
      },
    ];

    // 제품 생성
    for (const productData of products) {
      await newPrisma.product.create({
        data: productData,
      });
      console.log(`✅ ${productData.name} 생성 완료`);
    }

    console.log('\n🎉 강제 초기화 완료!');
    console.log(`📦 ${products.length}개의 제품이 생성되었습니다.`);
    console.log('🏷️ 5개의 카테고리가 생성되었습니다.');
    console.log('📊 개발 서버 시작: npm run dev');

    await newPrisma.$disconnect();

  } catch (error) {
    console.error('❌ 강제 초기화 실패:', error);
    process.exit(1);
  }
}

forceReset();