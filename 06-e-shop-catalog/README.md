# 📚 Project06: E-Shop Catalog - React & Next.js 완전 학습 가이드

> **전자상거래 제품 카탈로그를 통한 현대적 웹 개발 완전 정복**
> 
> React와 Next.js가 처음인 개발자를 위한 단계별 학습서

---

## 🎯 프로젝트 소개

이 프로젝트는 **실무에서 바로 활용 가능한 전자상거래 제품 카탈로그**를 구축하면서 React와 Next.js의 핵심 개념들을 체계적으로 학습할 수 있도록 설계된 교육용 프로젝트입니다.

### 왜 이 프로젝트가 중요한가?
- 🏢 **실무 적용성**: 실제 서비스에서 사용되는 패턴과 기술 스택
- 📈 **단계적 학습**: 기초부터 고급까지 체계적인 난이도 조절
- 🔧 **실습 중심**: 이론과 실습이 균형잡힌 학습 방식
- 🚀 **최신 기술**: Next.js 15, React 19 등 최신 기술 스택

---

## 📋 학습 목표

### 🎯 핵심 학습 목표

#### 1. 데이터베이스 연동 마스터하기
- **목표**: 현대적인 ORM을 활용한 데이터베이스 연동 완전 이해
- **학습 내용**: Prisma ORM, SQLite, 데이터 모델링, CRUD 패턴
- **실무 가치**: 백엔드와의 효율적인 데이터 통신 구현 역량

#### 2. 동적 데이터 페칭 완전 정복
- **목표**: 비동기 데이터 처리와 상태 관리의 전문가 되기
- **학습 내용**: API Routes, fetch 패턴, 로딩/에러 처리, 상태 최적화
- **실무 가치**: 사용자 경험을 고려한 데이터 로딩 전략 수립

#### 3. 성능 최적화 전문가 되기
- **목표**: 대규모 애플리케이션에서 통하는 성능 최적화 기법 습득
- **학습 내용**: 컴포넌트 최적화, 이미지 최적화, 메모이제이션, 무한 스크롤
- **실무 가치**: 확장 가능하고 성능이 우수한 애플리케이션 개발 능력

### 🛠 구현 기술 목표

각 기술을 단순히 사용하는 것이 아니라, **왜 필요한지, 언제 사용하는지, 어떻게 최적화하는지**까지 완전히 이해하는 것이 목표입니다.

---

## 📚 React & Next.js 이론 기초

### 🔍 React란 무엇인가?

React는 **사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리**입니다. 우리 프로젝트에서 React의 핵심 개념들을 어떻게 활용하는지 살펴보겠습니다.

#### 컴포넌트 기반 아키텍처

```typescript
// src/components/ProductCard.tsx에서 확인할 수 있는 컴포넌트 구조
const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  // 🎯 컴포넌트는 재사용 가능한 UI 조각입니다
  // 각 제품 카드가 독립적으로 작동하면서도 일관된 구조를 유지합니다
  
  return (
    <Card sx={{ /* 스타일링 */ }}>
      {/* 컴포넌트 내부 구조 */}
    </Card>
  );
});
```

**왜 컴포넌트를 사용하는가?**
- ✅ **재사용성**: 한 번 만든 컴포넌트를 여러 곳에서 사용
- ✅ **유지보수**: 변경사항이 생겨도 한 곳만 수정하면 됨
- ✅ **테스팅**: 각 컴포넌트를 독립적으로 테스트 가능

#### 상태(State) 관리의 이해

```typescript
// src/app/page.tsx에서 상태 관리 패턴 확인
const [products, setProducts] = useState<ParsedProduct[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// 🎯 상태는 컴포넌트의 "기억"입니다
// 사용자 상호작용이나 데이터 변경에 따라 화면이 다시 그려집니다
```

**상태가 중요한 이유:**
- 🔄 **반응성**: 데이터가 변경되면 화면이 자동으로 업데이트
- 🎮 **상호작용**: 사용자의 행동에 따라 화면이 변화
- 📊 **데이터 동기화**: 여러 컴포넌트 간 데이터 공유

### 🚀 Next.js의 혁신

Next.js는 **React 기반의 풀스택 웹 프레임워크**로, React만으로는 복잡한 실무 프로젝트를 구축하기 어려운 부분들을 해결해줍니다.

#### App Router - 혁신적인 라우팅 시스템

```
src/app/
├── page.tsx              # 홈페이지 (/)
├── products/
│   └── [id]/
│       └── page.tsx      # 제품 상세 페이지 (/products/123)
├── api/
│   ├── products/
│   │   ├── route.ts      # GET /api/products
│   │   └── [id]/
│   │       └── route.ts  # GET /api/products/123
│   └── categories/
│       └── route.ts      # GET /api/categories
└── layout.tsx            # 전체 레이아웃
```

**Next.js App Router의 장점:**
- 📁 **파일 기반 라우팅**: 폴더 구조가 곧 URL 구조
- 🔀 **동적 라우팅**: `[id]`로 동적 경로 생성
- 🔗 **API 통합**: 프론트엔드와 백엔드를 한 프로젝트에서 관리

#### Server-Side Rendering (SSR)의 이해

```typescript
// Next.js는 서버에서 HTML을 미리 생성합니다
// 이로 인해 다음과 같은 장점이 있습니다:

// 1. 빠른 초기 로딩
// 2. SEO 최적화
// 3. 소셜 미디어 공유 최적화
```

---

## 🗄️ 1. 데이터베이스 연동 - Prisma ORM 마스터하기

### 📖 이론: ORM이란 무엇인가?

**ORM(Object-Relational Mapping)**은 객체 지향 언어와 관계형 데이터베이스 사이의 번역기 역할을 합니다.

#### 전통적인 방식 vs ORM 방식

**전통적인 SQL 방식:**
```sql
SELECT * FROM products 
WHERE categoryId = '123' 
AND price BETWEEN 100000 AND 500000 
ORDER BY createdAt DESC;
```

**Prisma ORM 방식:**
```typescript
// src/app/api/products/route.ts에서 실제 사용하는 코드
const products = await prisma.product.findMany({
  where: {
    categoryId: '123',
    price: {
      gte: 100000,
      lte: 500000,
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
  include: {
    category: true, // 관계된 데이터도 함께 가져오기
  },
});
```

### 🛠 실습: Prisma 스키마 설계

우리 프로젝트의 데이터 모델을 살펴보겠습니다:

```prisma
// prisma/schema.prisma - 실제 프로젝트 스키마
model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float    
  stock       Int      
  images      String   // SQLite용 JSON 문자열
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  featured    Boolean  @default(false)
  rating      Float    @default(0.0)
  reviewCount Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  cartItems   CartItem[]

  // 성능 최적화를 위한 인덱스
  @@index([categoryId])
  @@index([featured])
  @@index([price])
  @@map("products")
}
```

**핵심 학습 포인트:**
- 🔑 **Primary Key**: `@id @default(cuid())`로 고유 식별자 생성
- 🔗 **관계 설정**: `category Category @relation(...)`으로 테이블 간 관계 정의
- ⚡ **성능 최적화**: `@@index([categoryId])`로 자주 조회되는 필드에 인덱스 추가
- 🗂️ **테이블 매핑**: `@@map("products")`로 실제 테이블명 지정

### 🔧 실습: 데이터베이스 연결 및 쿼리

#### 1. Prisma 클라이언트 설정

```typescript
// src/lib/prisma.ts - 싱글톤 패턴으로 연결 관리
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// 🎯 개발 환경에서 hot reload로 인한 다중 연결 방지
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

export default prisma;
```

**왜 싱글톤 패턴을 사용하는가?**
- 🔄 **연결 재사용**: 매번 새로운 연결을 생성하지 않음
- 💾 **메모리 효율성**: 하나의 연결 인스턴스만 유지
- 🚀 **개발 최적화**: hot reload시에도 연결 유지

#### 2. 복잡한 쿼리 구현

```typescript
// src/app/api/products/route.ts - 실무에서 자주 사용하는 복잡한 쿼리
export async function GET(request: NextRequest) {
  // URL 파라미터 파싱
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  // 동적 WHERE 조건 구성 🎯
  const where: any = {};
  
  if (category && category !== 'all') {
    where.categoryId = category;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // 실제 쿼리 실행
  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({ success: true, data: products });
}
```

**학습 포인트:**
- 🔍 **동적 쿼리**: 조건에 따라 WHERE 절을 동적으로 구성
- 🔗 **관계 조회**: `include: { category: true }`로 관련 데이터 함께 조회
- 📄 **페이지네이션**: `skip`과 `take`로 페이지 단위 조회
- 🔤 **검색 기능**: `contains`와 `mode: 'insensitive'`로 대소문자 구분 없는 검색

---

## 🌐 2. 동적 데이터 페칭 - API와 상태 관리

### 📖 이론: 비동기 프로그래밍의 이해

웹 애플리케이션에서 데이터를 가져오는 것은 **비동기적**으로 이루어집니다. 서버에서 응답이 올 때까지 기다려야 하기 때문입니다.

#### JavaScript 비동기 처리의 진화

```typescript
// 1단계: Callback Hell (콜백 지옥)
getData(function(result1) {
  getMoreData(result1, function(result2) {
    getEvenMoreData(result2, function(result3) {
      // 😱 가독성이 매우 떨어짐
    });
  });
});

// 2단계: Promise
getData()
  .then(result1 => getMoreData(result1))
  .then(result2 => getEvenMoreData(result2))
  .then(result3 => {
    // 🙂 조금 더 나음
  });

// 3단계: async/await (우리 프로젝트에서 사용)
const result1 = await getData();
const result2 = await getMoreData(result1);
const result3 = await getEvenMoreData(result2);
// 😍 동기 코드처럼 읽기 쉬움
```

### 🔧 실습: Next.js API Routes 구현

#### API Route 구조 이해

```typescript
// src/app/api/products/route.ts - RESTful API 구현
export async function GET(request: NextRequest) {
  try {
    // 🎯 1. 요청 파라미터 파싱
    const { searchParams } = new URL(request.url);
    
    // 🎯 2. 데이터베이스 쿼리
    const products = await prisma.product.findMany({
      // 쿼리 조건들...
    });
    
    // 🎯 3. 성공 응답
    return NextResponse.json({
      success: true,
      data: { products, pagination },
    });
    
  } catch (error) {
    // 🎯 4. 에러 처리
    return NextResponse.json(
      { success: false, error: '데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
```

**API 설계 원칙:**
- 📝 **일관된 응답 구조**: `{ success: boolean, data?: any, error?: string }`
- 🔍 **명확한 HTTP 상태 코드**: 200(성공), 404(없음), 500(서버 오류)
- 🛡️ **에러 처리**: try-catch로 예외 상황 대응
- 📊 **구조화된 데이터**: 클라이언트에서 사용하기 쉬운 형태로 반환

### 🔧 실습: 클라이언트 사이드 데이터 페칭

#### 상태 관리와 데이터 페칭의 조합

```typescript
// src/app/page.tsx - 실무 표준 패턴
export default function HomePage() {
  // 🎯 상태 정의: 데이터, 로딩, 에러 상태를 분리해서 관리
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);      // 🔄 로딩 상태 시작
      setError(null);        // 🧹 이전 에러 초기화

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);  // ✅ 성공시 데이터 설정
      } else {
        setError(data.error);             // ❌ API 레벨 에러 처리
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.');  // 🌐 네트워크 에러 처리
    } finally {
      setLoading(false);     // ⏹️ 로딩 상태 종료
    }
  };

  // 🎯 의존성 배열을 통한 자동 재실행
  useEffect(() => {
    fetchProducts();
  }, [filters]); // filters가 변경될 때마다 다시 실행
}
```

**학습 포인트:**
- 🔄 **상태 패턴**: 데이터-로딩-에러 상태의 표준 패턴
- 🎣 **useEffect Hook**: 컴포넌트 생명주기와 사이드 이펙트 관리
- 🔒 **에러 처리**: 네트워크 오류와 비즈니스 로직 오류 구분
- 🎯 **의존성 관리**: useEffect 의존성 배열로 재실행 조건 제어

### 🎨 사용자 경험 최적화

#### 로딩 상태 표시

```typescript
// src/app/page.tsx - 스켈레톤 UI로 사용자 경험 향상
const ProductCardSkeleton = () => (
  <Box>
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1, mb: 2 }} />
    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
    <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" height={28} />
  </Box>
);

// 로딩 중일 때 실제 레이아웃과 유사한 스켈레톤 표시
{loading ? (
  <Grid container spacing={3}>
    {Array.from({ length: 12 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <ProductCardSkeleton />
      </Grid>
    ))}
  </Grid>
) : (
  // 실제 제품 목록 표시
)}
```

**UX 개선 포인트:**
- ⏳ **스켈레톤 UI**: 로딩 중에도 레이아웃을 미리 보여줘서 체감 속도 향상
- 🔄 **점진적 로딩**: 데이터가 준비되는 대로 순차적으로 표시
- 💬 **의미있는 메시지**: "로딩 중..."이 아닌 구체적인 상황 설명

---

## 🚀 3. 성능 최적화 - 확장 가능한 애플리케이션 만들기

### 📖 이론: React 성능 최적화의 원리

React에서 성능 문제의 주요 원인은 **불필요한 리렌더링**입니다. 컴포넌트가 실제로 변경되지 않았음에도 다시 그려지는 것을 방지해야 합니다.

#### 리렌더링이 발생하는 경우

```typescript
// 부모 컴포넌트의 상태가 변경되면
const [count, setCount] = useState(0);

// 모든 자식 컴포넌트가 다시 렌더링됩니다 (문제!)
<ProductCard product={product1} />  // 🔄 불필요한 리렌더링
<ProductCard product={product2} />  // 🔄 불필요한 리렌더링
<ProductCard product={product3} />  // 🔄 불필요한 리렌더링
```

### 🔧 실습: React.memo로 컴포넌트 최적화

```typescript
// src/components/ProductCard.tsx - memo로 최적화된 컴포넌트
const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  // 🎯 memo는 props가 변경되지 않으면 리렌더링을 건너뜁니다
  
  const { addItem } = useCart();
  
  // ⚡ useCallback으로 함수를 메모이제이션
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    
    // 🎉 사용자 피드백을 위한 토스트 메시지
    const toast = document.createElement('div');
    toast.textContent = `${product.name}이(가) 장바구니에 추가되었습니다.`;
    // ... 토스트 애니메이션 로직
  }, [product, addItem]);  // 의존성이 변경될 때만 함수 재생성

  return (
    <Card sx={{
      // 🎨 GPU 가속을 활용한 부드러운 애니메이션
      willChange: 'transform',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}>
      {/* 컴포넌트 내용 */}
    </Card>
  );
});
```

**성능 최적화 포인트:**
- 🧠 **React.memo**: props 비교를 통한 리렌더링 방지
- 🎣 **useCallback**: 함수 재생성 방지로 자식 컴포넌트 최적화
- 🎨 **CSS 최적화**: GPU 가속 활용으로 부드러운 애니메이션
- 💾 **메모리 관리**: 불필요한 객체 생성 방지

### 🖼️ 이미지 최적화 전략

```typescript
// src/components/ProductCard.tsx - Next.js Image 최적화
const [imageLoading, setImageLoading] = useState(true);
const [imageError, setImageError] = useState(false);

// 🎯 이미지 로딩 상태를 관리하여 사용자 경험 향상
const handleImageLoad = useCallback(() => {
  setImageLoading(false);
}, []);

const handleImageError = useCallback(() => {
  setImageLoading(false);
  setImageError(true);
}, []);

return (
  <Box sx={{ position: 'relative', height: 200 }}>
    {/* 📍 로딩 중 스켈레톤 표시 */}
    {imageLoading && (
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={200}
        sx={{ position: 'absolute', zIndex: 1 }}
      />
    )}
    
    {/* 🖼️ Next.js Image 컴포넌트로 자동 최적화 */}
    <Image
      src={mainImageUrl}
      alt={product.name}
      fill
      style={{ 
        objectFit: 'cover',
        opacity: imageLoading ? 0 : 1,  // 🎭 부드러운 페이드 인
        transition: 'opacity 0.3s',
      }}
      onLoad={handleImageLoad}
      onError={handleImageError}
      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
      priority={false}  // 📱 스크롤되는 이미지는 lazy loading
    />
  </Box>
);
```

**이미지 최적화 전략:**
- 🔄 **자동 포맷 변환**: WebP, AVIF 등 최적 포맷 자동 선택
- 📱 **반응형 이미지**: 화면 크기에 맞는 이미지 크기 제공
- ⏱️ **지연 로딩**: 화면에 나타날 때만 이미지 로드
- 🎭 **로딩 애니메이션**: 스켈레톤과 페이드 인으로 자연스러운 전환

---

## 🛣️ 4. 동적 라우팅과 쿼리 파라미터

### 📖 이론: 현대적 라우팅 시스템의 이해

전통적인 웹사이트는 각 페이지가 별도의 HTML 파일이었지만, SPA(Single Page Application)에서는 JavaScript로 페이지를 동적으로 생성합니다.

#### Next.js App Router의 혁신

```
📁 파일 시스템 = URL 구조
src/app/
├── page.tsx                    → /
├── products/
│   ├── page.tsx               → /products
│   └── [id]/
│       └── page.tsx           → /products/123, /products/abc
└── api/
    └── products/
        ├── route.ts           → GET /api/products
        └── [id]/
            └── route.ts       → GET /api/products/123
```

### 🔧 실습: 동적 라우팅 구현

```typescript
// src/app/products/[id]/page.tsx - 동적 라우팅 페이지
export default function ProductDetailPage() {
  const params = useParams();  // 🎯 URL 파라미터 추출
  const router = useRouter();   // 🧭 네비게이션 제어
  
  const [product, setProduct] = useState<ParsedProduct | null>(null);
  const productId = params.id as string;  // URL에서 ID 추출

  const fetchProductDetail = async () => {
    try {
      // 🌐 동적 API 호출
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data.product);
      } else {
        setError(data.error || '제품을 찾을 수 없습니다.');
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();  // 🔄 ID가 있을 때만 데이터 로드
    }
  }, [productId]);

  return (
    <Container>
      {/* 🧭 브레드크럼 네비게이션 */}
      <Breadcrumbs>
        <Link href="/">홈</Link>
        {product?.category && (
          <Link href={`/?category=${product.category.id}`}>
            {product.category.name}
          </Link>
        )}
        <Typography>{product?.name}</Typography>
      </Breadcrumbs>
      
      {/* 제품 상세 정보 */}
    </Container>
  );
}
```

### 🔧 실습: 쿼리 파라미터 활용

```typescript
// src/app/api/products/route.ts - 쿼리 파라미터 처리
export async function GET(request: NextRequest) {
  // 🔍 URL에서 쿼리 파라미터 추출
  const { searchParams } = new URL(request.url);
  
  // 📄 페이지네이션 파라미터
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  
  // 🔍 필터링 파라미터
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  
  // 💰 가격 범위 파라미터
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  // 🎯 파라미터를 기반으로 동적 쿼리 구성
  const where: any = {};
  
  if (category && category !== 'all') {
    where.categoryId = category;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // 실제 쿼리 실행 및 결과 반환
  const products = await prisma.product.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });
}
```

**쿼리 파라미터 활용 패턴:**
- 📄 **페이지네이션**: `?page=2&limit=12`
- 🔍 **검색**: `?search=iPhone`
- 🏷️ **필터링**: `?category=electronics&minPrice=100000`
- 📊 **정렬**: `?sortBy=price&sortOrder=asc`

---

## 📄 5. 페이지네이션 vs 무한 스크롤

### 📖 이론: 데이터 로딩 전략의 비교

대량의 데이터를 효율적으로 표시하는 방법에는 두 가지 주요 접근법이 있습니다.

#### 페이지네이션 vs 무한 스크롤

| 특징 | 페이지네이션 | 무한 스크롤 |
|------|------------|-----------|
| **사용자 경험** | 명확한 진행 상황 | 끊김 없는 탐색 |
| **성능** | 일정한 메모리 사용 | 누적적 메모리 사용 |
| **SEO** | 각 페이지 개별 URL | 단일 URL |
| **구현 복잡도** | 간단 | 상대적으로 복잡 |
| **적합한 용도** | 결과 탐색, 목적성 있는 검색 | 콘텐츠 발견, 브라우징 |

### 🔧 실습: 전통적인 페이지네이션

```typescript
// src/components/Pagination.tsx - 직관적인 페이지네이션 구현
export default function Pagination({ pagination, onPageChange, onLimitChange }: PaginationProps) {
  // 🧮 현재 표시 범위 계산
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* 📊 현재 상태 정보 */}
      <Typography variant="body2">
        전체 {pagination.total.toLocaleString()}개 중{' '}
        {startItem.toLocaleString()}-{endItem.toLocaleString()}개 표시
      </Typography>

      {/* 📄 페이지 네비게이션 */}
      <MUIPagination
        count={pagination.totalPages}
        page={pagination.page}
        onChange={(event, value) => onPageChange(value)}
        showFirstButton
        showLastButton
      />

      {/* ⚙️ 페이지 크기 조절 */}
      <FormControl size="small">
        <Select value={pagination.limit} onChange={handleLimitChange}>
          <MenuItem value={12}>12개씩</MenuItem>
          <MenuItem value={24}>24개씩</MenuItem>
          <MenuItem value={48}>48개씩</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
```

### 🔧 실습: 무한 스크롤 구현

```typescript
// src/components/InfiniteScrollProducts.tsx - 고급 무한 스크롤
export default function InfiniteScrollProducts({ filters }: InfiniteScrollProductsProps) {
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 🎣 데이터 로딩 함수
  const fetchProducts = useCallback(async (pageNumber: number, resetProducts = false) => {
    // API 호출 로직...
    
    if (resetProducts) {
      setProducts(newProducts);           // 🔄 필터 변경시 리셋
    } else {
      setProducts(prev => [...prev, ...newProducts]);  // ➕ 기존 데이터에 추가
    }
  }, [filters]);

  // 👀 Intersection Observer로 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 🎯 마지막 요소가 50% 보일 때 다음 페이지 로드
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage, false);
        }
      },
      { threshold: 0.5 }  // 50% 보일 때 트리거
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // 🧹 메모리 누수 방지를 위한 클린업
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, page]);

  return (
    <>
      {/* 📦 제품 그리드 */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* 👀 스크롤 감지 영역 */}
      <Box ref={observerRef} sx={{ height: 100, display: 'flex', justifyContent: 'center' }}>
        {loading && <CircularProgress />}
      </Box>
    </>
  );
}
```

**핵심 구현 포인트:**
- 👀 **Intersection Observer**: 스크롤 이벤트보다 효율적인 감지
- 🧠 **useCallback 최적화**: 불필요한 함수 재생성 방지
- 🔄 **상태 관리**: 필터 변경시 리셋, 스크롤시 누적
- 🧹 **메모리 관리**: observer 클린업으로 메모리 누수 방지

---

## 🛒 6. 장바구니 기능 - Context API 마스터하기

### 📖 이론: 전역 상태 관리의 필요성

React에서 컴포넌트 간 데이터를 공유하는 방법에는 여러 가지가 있습니다:

#### Props Drilling 문제

```typescript
// ❌ Props Drilling - 중간 컴포넌트들이 불필요한 props를 받음
<App cart={cart} setCart={setCart}>
  <Header cart={cart} setCart={setCart}>
    <Navigation cart={cart} setCart={setCart}>
      <CartIcon cart={cart} setCart={setCart} />  {/* 최종 목적지 */}
    </Navigation>
  </Header>
  <Main cart={cart} setCart={setCart}>
    <ProductList cart={cart} setCart={setCart}>
      <ProductCard cart={cart} setCart={setCart} />
    </ProductList>
  </Main>
</App>
```

#### Context API 해결책

```typescript
// ✅ Context API - 필요한 컴포넌트에서 직접 접근
<CartProvider>
  <App>
    <Header>
      <CartIcon />  {/* useCart()로 직접 접근 */}
    </Header>
    <Main>
      <ProductCard />  {/* useCart()로 직접 접근 */}
    </Main>
  </App>
</CartProvider>
```

### 🔧 실습: Context + Reducer 패턴

```typescript
// src/contexts/CartContext.tsx - 실무 표준 패턴
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: ParsedProduct; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[] } };

// 🎯 리듀서 함수 - 상태 변경 로직을 한 곳에 집중
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        // 🔄 기존 아이템 수량 업데이트
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        // ➕ 새 아이템 추가
        const newItem: CartItem = {
          id: `cart-${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
        };
        return {
          ...state,
          items: [...state.items, newItem],
        };
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // 🗑️ 수량이 0 이하면 아이템 제거
        return {
          ...state,
          items: state.items.filter(item => item.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      };
    }

    default:
      return state;
  }
};

// 🏪 Context Provider 컴포넌트
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // 💾 로컬 스토리지와 동기화
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopping-cart');
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: { items: parsedCart } });
      }
    } catch (error) {
      console.error('장바구니 로드 실패:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('shopping-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('장바구니 저장 실패:', error);
    }
  }, [state.items]);

  // 🧮 파생 상태 계산 함수들
  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // 🎯 Context 값 제공
  const contextValue: CartContextType = {
    items: state.items,
    addItem: (product, quantity = 1) => 
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity } }),
    removeItem: (productId) => 
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } }),
    updateQuantity: (productId, quantity) => 
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
```

### 🔧 실습: Context 사용하기

```typescript
// src/components/Header.tsx - Context 사용 예시
export default function Header() {
  const { items, getTotalItems, getTotalPrice } = useCart();  // 🎣 Hook으로 간편 접근

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6">E-Shop Catalog</Typography>
        
        {/* 🛒 장바구니 아이콘 */}
        <IconButton onClick={() => setIsCartOpen(true)}>
          <Badge badgeContent={getTotalItems()} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* 🛒 장바구니 드로어 */}
        <Drawer open={isCartOpen} onClose={() => setIsCartOpen(false)}>
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
          
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">
              총 금액: {formatPrice(getTotalPrice())}
            </Typography>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
```

**Context API 활용 포인트:**
- 🏪 **중앙집중식 상태**: 모든 장바구니 로직을 한 곳에서 관리
- 🎣 **Hook 패턴**: useCart()로 어디서든 쉽게 접근
- 💾 **영속성**: localStorage로 브라우저 새로고침 후에도 유지
- 🧮 **파생 상태**: 총 가격, 총 개수 등을 자동 계산

---

## 🔍 7. 제품 필터링 시스템

### 📖 이론: 검색과 필터링의 UX 원칙

사용자가 원하는 제품을 빠르게 찾을 수 있도록 돕는 것이 필터링 시스템의 목표입니다.

#### 효과적인 필터링 시스템의 요소

1. **즉시 반응**: 사용자 입력에 즉시 반응하는 인터페이스
2. **명확한 피드백**: 현재 적용된 필터를 명확히 표시
3. **쉬운 초기화**: 필터를 쉽게 지울 수 있는 방법 제공
4. **성능 최적화**: 과도한 API 호출 방지

### 🔧 실습: 통합 필터링 시스템

```typescript
// src/components/ProductFilter.tsx - 포괄적인 필터 시스템
export default function ProductFilter({ filters, categories, onFiltersChange, onClearFilters }: ProductFilterProps) {
  // 🔍 검색어 디바운싱 상태
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000000,
  ]);

  // ⏱️ 디바운싱으로 API 호출 최적화
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: searchInput || undefined,
      });
    }, 500); // 500ms 지연으로 과도한 API 호출 방지

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 🎚️ 가격 범위 슬라이더 처리
  const handlePriceRangeCommitted = (event: React.SyntheticEvent, newValue: number | number[]) => {
    const value = newValue as number[];
    onFiltersChange({
      ...filters,
      minPrice: value[0] || undefined,
      maxPrice: value[1] || undefined,
    });
  };

  // 📊 현재 적용된 필터 개수 계산
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.search) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') count++;
    return count;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* 🏷️ 필터 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ mr: 1 }} />
        <Typography variant="h6">필터 및 정렬</Typography>
        {getActiveFiltersCount() > 0 && (
          <Chip
            label={`${getActiveFiltersCount()}개 적용`}
            size="small"
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* 🔍 검색 입력 */}
        <TextField
          fullWidth
          label="제품 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="제품명 또는 설명으로 검색"
        />

        {/* 🏷️ 카테고리 선택 */}
        <FormControl fullWidth>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={filters.category || 'all'}
            onChange={(e) => onFiltersChange({
              ...filters,
              category: e.target.value === 'all' ? undefined : e.target.value,
            })}
          >
            <MenuItem value="all">전체</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 📊 정렬 옵션 */}
        <FormControl fullWidth>
          <InputLabel>정렬</InputLabel>
          <Select
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFiltersChange({
                ...filters,
                sortBy: sortBy as any,
                sortOrder: sortOrder as 'asc' | 'desc',
              });
            }}
          >
            <MenuItem value="createdAt-desc">최신순</MenuItem>
            <MenuItem value="price-asc">가격 낮은순</MenuItem>
            <MenuItem value="price-desc">가격 높은순</MenuItem>
            <MenuItem value="rating-desc">평점 높은순</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 💰 가격 범위 슬라이더 */}
      <Box sx={{ px: 2, mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>가격 범위</Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue as number[])}
          onChangeCommitted={handlePriceRangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value.toLocaleString()}원`}
          min={0}
          max={1000000}
          step={10000}
        />
      </Box>

      {/* 🧹 필터 초기화 */}
      {getActiveFiltersCount() > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
          >
            필터 초기화
          </Button>
        </Box>
      )}
    </Paper>
  );
}
```

**필터링 시스템 핵심 포인트:**
- ⏱️ **디바운싱**: 검색어 입력시 500ms 지연으로 API 호출 최적화
- 🔢 **상태 표시**: 현재 적용된 필터 개수를 사용자에게 표시
- 🎚️ **범위 선택**: 슬라이더로 직관적인 가격 범위 선택
- 🧹 **쉬운 초기화**: 한 번의 클릭으로 모든 필터 제거

---

## 🚀 프로젝트 실행 및 학습 진행

### 📥 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd e-shop-catalog

# 2. 의존성 설치 및 데이터베이스 설정
npm run setup

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:3000
```

### 🎯 단계별 학습 가이드

#### 1단계: 기본 구조 이해 (1주차)
- [ ] 파일 구조 파악 (`src/app`, `src/components`)
- [ ] 데이터베이스 스키마 분석 (`prisma/schema.prisma`)
- [ ] 기본 API 동작 확인 (`/api/products`)

#### 2단계: 컴포넌트 분석 (2주차)
- [ ] ProductCard 컴포넌트 상세 분석
- [ ] 상태 관리 패턴 이해 (`useState`, `useEffect`)
- [ ] Props 전달 방식 학습

#### 3단계: 고급 기능 구현 (3-4주차)
- [ ] Context API 동작 원리 이해
- [ ] 무한 스크롤 구현 분석
- [ ] 성능 최적화 기법 적용

#### 4단계: 확장 및 커스터마이징 (5주차)
- [ ] 새로운 기능 추가 (위시리스트, 리뷰 시스템)
- [ ] 디자인 커스터마이징
- [ ] 추가 필터 옵션 구현

### 🛠️ 개발 도구 활용

```bash
# 데이터베이스 상태 확인
npm run db:check

# Prisma Studio로 데이터 시각화
npm run db:studio

# 타입 체크
npm run type-check

# 코드 품질 검사
npm run lint
```

### 🎓 학습 목표 달성 체크리스트

#### 데이터베이스 연동 ✅
- [ ] Prisma 스키마 작성 및 수정 가능
- [ ] 복잡한 관계형 쿼리 구현 가능
- [ ] 데이터베이스 마이그레이션 이해

#### 동적 데이터 페칭 ✅
- [ ] API Routes 작성 및 수정 가능
- [ ] 비동기 상태 관리 패턴 이해
- [ ] 에러 처리 및 로딩 상태 구현

#### 성능 최적화 ✅
- [ ] React.memo와 useCallback 활용
- [ ] 이미지 최적화 기법 적용
- [ ] 불필요한 리렌더링 방지 구현

---

## 🎉 마무리

이 프로젝트를 통해 여러분은:

1. **실무 즉시 적용 가능한 React/Next.js 개발 역량** 습득
2. **현대적인 웹 개발 패턴과 모범 사례** 이해
3. **확장 가능하고 유지보수가 용이한 코드** 작성 능력
4. **사용자 경험을 고려한 성능 최적화** 기법

을 완전히 마스터하게 될 것입니다.

### 🚀 다음 단계

- 🔥 **Project07**: 실시간 채팅 애플리케이션
- 🔥 **Project08**: 소셜 미디어 대시보드  
- 🔥 **Project09**: 데이터 시각화 플랫폼
- 🔥 **Project10**: PWA 모바일 앱

**React와 Next.js 마스터로 가는 여정이 시작되었습니다!** 🎯

---

> 💡 **학습 팁**: 각 기능을 하나씩 주석 처리해가며 어떤 변화가 있는지 직접 확인해보세요. 
> 실습과 실험을 통해 더 깊이 이해할 수 있습니다!
│   │   ├── Header.tsx          # 앱 헤더
│   │   ├── ProductCard.tsx     # 제품 카드
│   │   ├── ProductFilter.tsx   # 필터링 컴포넌트
│   │   ├── Pagination.tsx      # 페이지네이션
│   │   └── ThemeProvider.tsx   # MUI 테마 프로바이더
│   ├── contexts/              # React Context
│   │   └── CartContext.tsx    # 장바구니 상태 관리
│   ├── lib/                   # 유틸리티
│   │   └── prisma.ts         # Prisma 클라이언트
│   ├── theme/                 # UI 테마 설정
│   │   └── theme.ts          # Material-UI 테마
│   └── types/                 # TypeScript 타입 정의
│       └── index.ts          # 공통 타입
├── prisma/
│   ├── schema.prisma         # 데이터베이스 스키마
│   └── seed.ts              # 시드 데이터
├── eslint.config.mjs        # ESLint 설정
├── tsconfig.json           # TypeScript 설정
└── package.json           # 프로젝트 설정
```

## 🗄️ 데이터베이스 스키마

### Category (카테고리)
- `id`: 고유 식별자
- `name`: 카테고리 이름
- `description`: 카테고리 설명

### Product (제품)
- `id`: 고유 식별자
- `name`: 제품명
- `description`: 제품 설명
- `price`: 가격
- `stock`: 재고 수량
- `images`: 제품 이미지 URL 배열
- `categoryId`: 카테고리 참조
- `featured`: 추천 제품 여부
- `rating`: 평점
- `reviewCount`: 리뷰 개수

## 🎯 주요 학습 포인트

### 1. Next.js App Router 사용법
- 파일 기반 라우팅 시스템
- 동적 라우팅 (`[id]`)
- API Routes 구현
- Layout과 Page 컴포넌트 구조

### 2. Prisma ORM 사용법
- 스키마 정의와 마이그레이션
- 클라이언트 생성과 쿼리 작성
- 관계형 데이터 모델링

### 3. React Context API
- 전역 상태 관리 패턴
- useContext와 useReducer 활용
- 로컬 스토리지와의 연동

### 4. Material-UI 활용
- 테마 커스터마이징
- 반응형 Grid 시스템
- 컴포넌트 스타일링

### 5. TypeScript 활용
- 인터페이스와 타입 정의
- Generic 타입 사용
- API 응답 타입 안정성

## 📋 사용 가능한 스크립트

- `npm run dev`: 개발 서버 시작 (Turbopack 사용)
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 시작
- `npm run lint`: ESLint 검사
- `npm run db:generate`: Prisma 클라이언트 생성
- `npm run db:push`: 데이터베이스 스키마 적용
- `npm run db:seed`: 샘플 데이터 추가
- `npm run db:studio`: Prisma Studio 실행 (데이터베이스 GUI)
- `npm run db:reset`: 데이터베이스 초기화 후 시드 데이터 재생성
- `npm run setup`: 초기 환경 설정 (설치, 스키마 적용, 시드 데이터 생성)

## 🔧 개발 팁

### 데이터베이스 관리
Prisma Studio를 사용하여 데이터를 시각적으로 확인하고 편집할 수 있습니다:
```bash
npm run db:studio
```

### 새 제품 추가
`prisma/seed.ts` 파일을 수정한 후 다음 명령어로 데이터를 재생성합니다:
```bash
npm run db:reset
```

### ESLint 설정
초보자를 위해 느슨한 ESLint 규칙이 적용되어 있습니다. 필요시 `eslint.config.mjs`에서 조정 가능합니다.

## 🚀 확장 가능한 기능들

이 프로젝트를 기반으로 다음 기능들을 추가해볼 수 있습니다:

- 사용자 인증 시스템
- 실제 결제 기능
- 리뷰 및 평점 시스템
- 위시리스트 기능
- 실시간 재고 관리
- 관리자 대시보드
- 이메일 알림
- 소셜 로그인

## 📖 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Material-UI 공식 문서](https://mui.com)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs)

## 🐛 문제 해결

### 데이터베이스 연결 오류
```bash
npm run db:push
```

### Prisma 클라이언트 오류
```bash
npm run db:generate
```

### 포트 충돌
`.env` 파일에서 다른 포트 사용:
```
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

---

**이 프로젝트는 React와 Next.js 학습을 위한 교육용 목적으로 제작되었습니다.**