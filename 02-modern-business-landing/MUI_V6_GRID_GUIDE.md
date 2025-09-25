# 🔧 MUI v6 Grid 새로운 문법 가이드

## 📈 **업데이트된 Grid 문법**

MUI v6에서는 Grid 컴포넌트의 props 문법이 변경되었습니다. 이 가이드는 새로운 문법 적용 방법을 설명합니다.

---

## ⚡ **주요 변경사항**

### **Before (MUI v5)**
```typescript
<Grid item xs={12} sm={6} md={4}>
  <Card>카드 내용</Card>
</Grid>
```

### **After (MUI v6)**
```typescript
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
  <Card>카드 내용</Card>
</Grid>
```

---

## 🔍 **세부 변경 내용**

### **1. `item` prop 제거**
- ❌ **이전**: `<Grid item xs={12}>`
- ✅ **새로운**: `<Grid size={{ xs: 12 }}>`

### **2. 개별 breakpoint props → `size` 객체**
```typescript
// ❌ 이전 문법
<Grid item xs={12} sm={6} md={4} lg={3}>

// ✅ 새로운 문법
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
```

### **3. Container는 동일**
```typescript
// Container는 변경 없음
<Grid container spacing={4}>
  {/* Grid items */}
</Grid>
```

---

## 📝 **프로젝트에 적용된 실제 예시**

### **About 페이지**
```typescript
// Before
<Grid item xs={12} md={6}>
  <Typography variant="h4">우리의 비전</Typography>
</Grid>

// After
<Grid size={{ xs: 12, md: 6 }}>
  <Typography variant="h4">우리의 비전</Typography>
</Grid>
```

### **Services 페이지**  
```typescript
// Before
<Grid item xs={12} md={6} lg={4}>
  <Card>서비스 카드</Card>
</Grid>

// After
<Grid size={{ xs: 12, md: 6, lg: 4 }}>
  <Card>서비스 카드</Card>
</Grid>
```

### **Contact 폼**
```typescript
// Before
<Grid item xs={12} sm={6}>
  <TextField label="이름" />
</Grid>

// After
<Grid size={{ xs: 12, sm: 6 }}>
  <TextField label="이름" />
</Grid>
```

---

## 🎯 **Breakpoint 매핑**

### **사용 가능한 breakpoints**
```typescript
size={{
  xs: 12,    // 0px 이상
  sm: 6,     // 600px 이상
  md: 4,     // 900px 이상
  lg: 3,     // 1200px 이상
  xl: 2      // 1536px 이상
}}
```

### **실제 사용 패턴들**

#### **1. 모바일-데스크탑 레이아웃**
```typescript
// 모바일: 전체 너비, 데스크탑: 절반
<Grid size={{ xs: 12, md: 6 }}>
  <Card>콘텐츠</Card>
</Grid>
```

#### **2. 3단 레이아웃**
```typescript
// 모바일: 전체, 태블릿 이상: 3분의 1
<Grid size={{ xs: 12, md: 4 }}>
  <ServiceCard />
</Grid>
```

#### **3. 4단 레이아웃**
```typescript
// 점진적 반응형: 12 → 6 → 4 → 3
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
  <ProductCard />
</Grid>
```

#### **4. 폼 레이아웃**
```typescript
// 이름/이메일 필드: 모바일 세로배치, 데스크탑 가로배치
<Grid size={{ xs: 12, sm: 6 }}>
  <TextField fullWidth label="이름" />
</Grid>
<Grid size={{ xs: 12, sm: 6 }}>
  <TextField fullWidth label="이메일" />
</Grid>
```

---

## 🔄 **마이그레이션 체크리스트**

### **✅ 완료된 업데이트**
- [x] About 페이지 Grid 문법 업데이트
- [x] Services 페이지 Grid 문법 업데이트  
- [x] Contact 페이지 Grid 문법 업데이트
- [x] ServicesSection 컴포넌트 업데이트
- [x] ContactSection 컴포넌트 업데이트

### **📋 확인사항**
- [x] 모든 `item` prop 제거됨
- [x] 개별 breakpoint props가 `size` 객체로 변경됨
- [x] Container Grid는 그대로 유지됨
- [x] spacing과 기타 props는 동일하게 동작

---

## 🎨 **스타일링 추가 팁**

### **1. 조건부 크기 설정**
```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

<Grid size={isMobile ? { xs: 12 } : { xs: 12, md: 6 }}>
  <Component />
</Grid>
```

### **2. 동적 크기 계산**
```typescript
const gridSize = useMemo(() => ({
  xs: 12,
  md: items.length <= 2 ? 6 : 4
}), [items.length]);

<Grid size={gridSize}>
  <DynamicComponent />
</Grid>
```

### **3. 복잡한 레이아웃**
```typescript
// 사이드바 + 메인 콘텐츠
<Grid container spacing={3}>
  <Grid size={{ xs: 12, lg: 3 }}>
    <Sidebar />
  </Grid>
  <Grid size={{ xs: 12, lg: 9 }}>
    <MainContent />
  </Grid>
</Grid>
```

---

## 🐛 **문제 해결**

### **자주 발생하는 오류**

#### **1. `item` prop 사용시**
```
Warning: Failed prop type: The prop `item` is not supported.
```
**해결책**: `item` prop을 모두 제거하세요.

#### **2. 개별 breakpoint props 사용시**
```
Warning: Failed prop type: The prop `xs` is not supported.
```
**해결책**: `size` 객체로 감싸세요.

#### **3. 빈 size 객체**
```typescript
// ❌ 잘못된 사용
<Grid size={{}}>

// ✅ 올바른 사용  
<Grid size={{ xs: 12 }}>
```

---

## 🚀 **성능 개선점**

### **MUI v6 Grid의 장점**
1. **더 명확한 API**: `size` 객체로 한눈에 파악
2. **타입 안전성**: TypeScript 지원 강화
3. **일관성**: 다른 MUI 컴포넌트와 유사한 패턴
4. **확장성**: 미래 breakpoint 추가에 용이

---

## 📚 **참고 자료**

- [MUI Grid v6 공식 문서](https://mui.com/material-ui/react-grid/)
- [MUI v6 마이그레이션 가이드](https://mui.com/material-ui/migration/migration-grid-v2/)
- [Breakpoint 시스템 가이드](https://mui.com/material-ui/customization/breakpoints/)

---

**🎉 이제 모든 Grid 컴포넌트가 MUI v6 최신 문법으로 업데이트되었습니다!**

더욱 명확하고 타입 안전한 Grid 레이아웃을 사용할 수 있습니다.
