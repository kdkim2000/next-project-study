// force-reset.js - 강제 데이터베이스 초기화 및 120개 샘플 시드 생성

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

const IMG = {
  electronics: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    'https://images.unsplash.com/photo-1512499617640-c2f999098c4b?w=400',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400',
    'https://images.unsplash.com/photo-1520974722071-972ec5f7aa49?w=400',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
  ],
  books: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    'https://images.unsplash.com/photo-1526312426976-593c962f4c05?w=400',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?w=400',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
  ],
  sports: [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
    'https://images.unsplash.com/photo-1521417531039-94e620e37d67?w=400',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400',
    'https://images.unsplash.com/photo-1517649763962-4b39a7b3b59a?w=400',
  ],
  home: [
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
    'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=400',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d51?w=400',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
  ],
};

const NAME_PARTS = {
  electronics: {
    brand: ['Auron', 'Helix', 'Nova', 'Xeno', 'Volt', 'Pulsar', 'Luma'],
    model: ['One', 'Pro', 'Air', 'Max', 'M3', 'Edge', 'Flex', 'Lite'],
    type: ['스마트폰', '태블릿', '노트북', '무선이어폰', '스마트워치', '모니터', '키보드'],
  },
  fashion: {
    brand: ['Urbanist', 'Classico', 'Nord', 'Atelier', 'Linea', 'Vista'],
    model: ['Classic', 'Essential', 'Premium', 'Vintage', 'Active', 'Daily'],
    type: ['데님 재킷', '가죽 운동화', '니트 스웨터', '트렌치 코트', '슬림 진', '후디'],
  },
  books: {
    brand: ['한빛미디어', '길벗', '위키북스', '인사이트', '오레일리'],
    model: ['개정판', '입문', '실전', '핵심 가이드', '마스터북'],
    type: ['클린 코드', '리팩터링', '자바의 정석', '모던 자바스크립트', '데이터베이스 설계'],
  },
  sports: {
    brand: ['ProFit', 'AirRun', 'MountainX', 'AquaWave', 'FlexPro', 'Sprint'],
    model: ['300', '500', 'X', 'Lite', 'Pro', 'Neo'],
    type: ['러닝화', '요가매트', '덤벨 세트', '캠핑체어', '하이킹백팩', '축구공'],
  },
  home: {
    brand: ['HomeEase', 'CleanUp', 'FreshAir', 'Lumina', 'Quieton', 'Comfy'],
    model: ['Mini', 'Plus', 'Pro', 'S', 'Max', 'Lite'],
    type: ['공기청정기', '무선청소기', '전기포트', '스탠드 조명', '토스터', '가습기'],
  },
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function makeProductName(parts) {
  return `${pick(parts.brand)} ${pick(parts.model)} ${pick(parts.type)}`;
}

function makeDescription(categoryKey, name) {
  const base = {
    electronics:
      '최신 세대 성능과 효율을 갖춘 전자기기입니다. 고해상도 디스플레이와 긴 배터리 수명을 제공합니다.',
    fashion:
      '편안한 착용감과 세련된 실루엣을 갖춘 패션 아이템입니다. 일상과 여행 모두에 어울립니다.',
    books:
      '개발자와 실무자를 위한 핵심 이론과 실습 예제를 담았습니다. 학습과 참고용으로 적합합니다.',
    sports:
      '가벼운 무게와 뛰어난 내구성을 갖춘 스포츠/레저용 제품입니다. 다양한 환경에서 안정적인 사용이 가능합니다.',
    home:
      '집안 어디에나 어울리는 미니멀 디자인의 생활/가전 제품입니다. 유지관리와 사용이 간편합니다.',
  };
  return `${name} — ${base[categoryKey]}`;
}

function priceFor(categoryKey) {
  switch (categoryKey) {
    case 'electronics':
      return rand(150000, 2500000);
    case 'fashion':
      return rand(29000, 259000);
    case 'books':
      return rand(12000, 68000);
    case 'sports':
      return rand(15000, 390000);
    case 'home':
      return rand(19000, 690000);
    default:
      return rand(10000, 100000);
  }
}

function stockFor() {
  return rand(0, 120);
}

function ratingFor() {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 ~ 5.0
}

function reviewsFor() {
  return rand(0, 1200);
}

function featuredFor() {
  return Math.random() < 0.18; // 약 18% 정도 대표상품
}

function imagesFor(categoryKey) {
  // 1~3장 랜덤 선택
  const bucket = IMG[categoryKey];
  const count = rand(1, 3);
  const shuffled = [...bucket].sort(() => Math.random() - 0.5).slice(0, count);
  return JSON.stringify(shuffled);
}

async function forceReset() {
  try {
    console.log('🔥 강제 데이터베이스 초기화 시작...');

    // 1) 기존 SQLite 파일 제거(있으면)
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
    } catch (err) {
      console.log('⚠️  파일 삭제 실패(무시):', err.message);
    }

    await prisma.$disconnect();

    // 2) 스키마 재적용 (force-reset)
    console.log('🔧 새 데이터베이스 생성 및 스키마 적용 중...');
    execSync('npx prisma db push --force-reset', {
      stdio: 'inherit',
      cwd: __dirname,
    });

    // 3) 시드 생성
    console.log('🌱 시드 데이터 생성 중...');
    const db = new PrismaClient();

    // 카테고리 생성
    const categories = {};
    categories.electronics = await db.category.create({
      data: { name: '전자제품', description: '스마트폰, 태블릿, 노트북 등 각종 전자기기' },
    });
    categories.fashion = await db.category.create({
      data: { name: '패션', description: '의류, 신발, 액세서리 등 패션 아이템' },
    });
    categories.books = await db.category.create({
      data: { name: '도서', description: '소설, 전문서, 만화책 등 다양한 도서' },
    });
    categories.sports = await db.category.create({
      data: { name: '스포츠/레저', description: '운동용품, 아웃도어 장비 등' },
    });
    categories.home = await db.category.create({
      data: { name: '홈/가전', description: '생활용품, 가전제품, 인테리어 소품 등' },
    });

    // 카테고리별 24개씩 → 총 120개 생성
    const perCategory = 24;
    const plan = [
      ['electronics', categories.electronics.id],
      ['fashion', categories.fashion.id],
      ['books', categories.books.id],
      ['sports', categories.sports.id],
      ['home', categories.home.id],
    ];

    let total = 0;
    for (const [key, categoryId] of plan) {
      const parts = NAME_PARTS[key];
      const batch = [];
      for (let i = 0; i < perCategory; i++) {
        const name = makeProductName(parts);
        batch.push({
          name,
          description: makeDescription(key, name),
          price: priceFor(key),
          stock: stockFor(),
          images: imagesFor(key), // 문자열(JSON)
          categoryId,
          featured: featuredFor(),
          rating: ratingFor(),
          reviewCount: reviewsFor(),
        });
      }

      // createMany: 빠르게 대량 삽입
      await db.product.createMany({ data: batch });
      total += batch.length;
      console.log(`✅ ${key} 카테고리에 ${batch.length}개 생성 완료`);
    }

    console.log('\n🎉 강제 초기화 완료!');
    console.log(`🏷️ 카테고리: ${Object.keys(categories).length}개`);
    console.log(`📦 제품: ${total}개 생성`);
    console.log('📊 개발 서버 시작: npm run dev');

    await db.$disconnect();
  } catch (error) {
    console.error('❌ 강제 초기화 실패:', error);
    process.exit(1);
  }
}

forceReset();
