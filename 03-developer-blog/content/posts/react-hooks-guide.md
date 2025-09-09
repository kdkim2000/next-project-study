---
title: "React Hooks 완벽 가이드: useState와 useEffect 마스터하기"
excerpt: "React Hooks의 기본인 useState와 useEffect를 실무 예제와 함께 자세히 알아보겠습니다. 함수형 컴포넌트에서 상태 관리와 사이드 이펙트를 효과적으로 다루는 방법을 배워보세요."
date: "2024-12-15"
author: "김개발"
category: "React"
tags: ["React", "Hooks", "JavaScript", "Frontend"]
featured: true
---

# React Hooks 완벽 가이드

React 16.8에서 소개된 Hooks는 함수형 컴포넌트에서 상태와 다른 React 기능들을 사용할 수 있게 해주는 강력한 도구입니다. 이 글에서는 가장 기본이 되는 `useState`와 `useEffect` Hook을 깊이 있게 다뤄보겠습니다.

## useState로 상태 관리하기

`useState`는 함수형 컴포넌트에서 상태를 관리할 수 있게 해주는 Hook입니다.

### 기본 사용법

```javascript
import React, { useState } from 'react';

function Counter() {
  // count라는 상태 변수와 setCount라는 상태 업데이트 함수를 선언
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        클릭
      </button>
    </div>
  );
}
```

### 객체 상태 관리

```javascript
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  return (
    <form>
      <input 
        type="text" 
        value={user.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="이름"
      />
      <input 
        type="email" 
        value={user.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="이메일"
      />
      <input 
        type="number" 
        value={user.age}
        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
        placeholder="나이"
      />
    </form>
  );
}
```

## useEffect로 사이드 이펙트 처리하기

`useEffect`는 컴포넌트에서 사이드 이펙트를 수행할 수 있게 해주는 Hook입니다.

### 기본 사용법

```javascript
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    // cleanup 함수
    return () => clearInterval(interval);
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시에만 실행

  return <div>타이머: {seconds}초</div>;
}
```

### 의존성 배열 활용

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // userId가 변경될 때마다 실행

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## 실무 팁과 주의사항

### 1. 상태 업데이트는 비동기적

```javascript
function AsyncUpdate() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // 이전 값이 출력됨!
    
    // 업데이트된 값을 사용하려면
    setCount(prevCount => {
      console.log(prevCount + 1); // 새로운 값 출력
      return prevCount + 1;
    });
  };

  return <button onClick={handleClick}>클릭</button>;
}
```

### 2. useEffect 무한 루프 방지

```javascript
// ❌ 잘못된 예시 - 무한 루프
function BadExample() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(setData);
  }); // 의존성 배열이 없으면 매 렌더링마다 실행

  return <div>{data.length}</div>;
}

// ✅ 올바른 예시
function GoodExample() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(setData);
  }, []); // 빈 배열로 마운트 시에만 실행

  return <div>{data.length}</div>;
}
```

### 3. 커스텀 Hook으로 로직 재사용

```javascript
// 커스텀 Hook 정의
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// 사용
function CounterApp() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={increment}>증가</button>
      <button onClick={decrement}>감소</button>
      <button onClick={reset}>리셋</button>
    </div>
  );
}
```

## 마무리

React Hooks는 함수형 컴포넌트를 더욱 강력하게 만들어주는 도구입니다. `useState`와 `useEffect`를 제대로 이해하고 사용한다면, 더 깔끔하고 재사용 가능한 컴포넌트를 만들 수 있습니다.

다음 포스트에서는 `useContext`, `useReducer` 등 고급 Hook들에 대해 알아보겠습니다!

> **참고 자료**
> - [React 공식 문서 - Hooks](https://reactjs.org/docs/hooks-intro.html)
> - [useState Hook 상세 가이드](https://reactjs.org/docs/hooks-state.html)
> - [useEffect Hook 완벽 가이드](https://reactjs.org/docs/hooks-effect.html)