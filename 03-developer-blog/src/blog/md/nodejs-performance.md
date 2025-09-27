---
title: "Node.js 성능 최적화 실무 가이드"
date: "2024-01-12"
description: "실제 운영 환경에서 Node.js 애플리케이션의 성능을 최적화하는 검증된 방법들을 소개합니다."
keywords: ["nodejs", "performance", "optimization", "backend"]
category: "backend"
tags: ["nodejs", "performance", "optimization", "monitoring", "scalability"]
---

# Node.js 성능 최적화 실무 가이드

Node.js 애플리케이션의 성능을 최적화하는 것은 사용자 경험과 직결되는 중요한 작업입니다.

## 메모리 최적화

### 1. 메모리 누수 방지
```javascript
// 잘못된 예시
const cache = {};
function addToCache(key, value) {
  cache[key] = value; // 메모리 누수 위험
}

// 올바른 예시
const cache = new Map();
const MAX_CACHE_SIZE = 1000;

function addToCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}
```

### 2. 스트림 활용
```javascript
const fs = require('fs');
const { pipeline } = require('stream');

// 대용량 파일 처리 시 스트림 사용
pipeline(
  fs.createReadStream('large-file.txt'),
  transformStream,
  fs.createWriteStream('output.txt'),
  (err) => {
    if (err) console.error('Pipeline failed:', err);
    else console.log('Pipeline succeeded');
  }
);
```

## CPU 최적화

### 워커 스레드 활용
```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // 메인 스레드
  const worker = new Worker(__filename);
  worker.postMessage({ numbers: [1, 2, 3, 4, 5] });
  
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
} else {
  // 워커 스레드
  parentPort.on('message', ({ numbers }) => {
    const sum = numbers.reduce((a, b) => a + b, 0);
    parentPort.postMessage(sum);
  });
}
```

## 데이터베이스 최적화

### 연결 풀링
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getUser(id) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}
```

## 모니터링과 프로파일링

### 성능 메트릭 수집
```javascript
const perf_hooks = require('perf_hooks');

function measurePerformance(fn, name) {
  return async (...args) => {
    const start = perf_hooks.performance.now();
    const result = await fn(...args);
    const end = perf_hooks.performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
}
```

이러한 최적화 기법들을 적용하면 Node.js 애플리케이션의 성능을 크게 향상시킬 수 있습니다.
