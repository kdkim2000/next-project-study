---
title: "React 기초 개념"
date: "2024-01-20"
category: "Frontend"
tags: ["React", "JavaScript", "Components"]
excerpt: "React의 핵심 개념인 컴포넌트와 JSX를 살펴봅시다."
---

# React 기초 개념

React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다.

## 컴포넌트

### 함수형 컴포넌트
가장 간단한 React 컴포넌트 형태입니다.

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### JSX 문법
JavaScript 안에서 HTML과 유사한 문법을 사용할 수 있습니다.

```jsx
const element = <h1>Hello, World!</h1>;
```

## State와 Props

### Props
- 부모 컴포넌트에서 자식 컴포넌트로 데이터 전달
- 읽기 전용 (immutable)

### State
- 컴포넌트 내부 상태 관리
- useState Hook 사용

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 수: {count}
    </button>
  );
}
```

## 마무리

React의 컴포넌트 기반 아키텍처는 재사용 가능하고 유지보수가 쉬운 UI를 만들 수 있게 해줍니다.
