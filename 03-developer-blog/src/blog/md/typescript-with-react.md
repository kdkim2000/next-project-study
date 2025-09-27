---
title: "TypeScript와 React"
date: "2024-01-25"
category: "Development"
tags: ["TypeScript", "React", "Type Safety"]
excerpt: "TypeScript를 React와 함께 사용하는 방법을 알아봅시다."
---

# TypeScript와 React

TypeScript는 JavaScript에 타입을 추가한 언어로, 더 안전하고 예측 가능한 코드를 작성할 수 있게 해줍니다.

## 기본 타입

### 기본 타입 정의
```typescript
// 기본 타입들
let name: string = "홍길동";
let age: number = 30;
let isActive: boolean = true;
```

### 배열과 객체
```typescript
// 배열
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["김철수", "이영희", "박민수"];

// 객체
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "홍길동",
  email: "hong@example.com"
};
```

## React에서의 TypeScript

### Props 타입 정의
```typescript
interface ButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean; // 선택적 프로퍼티
}

function Button({ title, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
}
```

### useState with TypeScript
```typescript
import { useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  return (
    <div>
      {loading ? "로딩중..." : user?.name}
    </div>
  );
}
```

## 장점

1. **컴파일 시점 에러 검출**: 런타임 에러를 미리 방지
2. **더 나은 IDE 지원**: 자동완성, 리팩토링 도구
3. **코드 가독성**: 타입이 문서화 역할

TypeScript를 사용하면 더 안정적이고 유지보수하기 쉬운 React 애플리케이션을 만들 수 있습니다.
