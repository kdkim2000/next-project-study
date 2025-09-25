// public/sw-simple.js - 아주 단순한 캐시 전략 예시
// 버전 바꾸면 이전 캐시를 자동 정리할 수 있어요.
const CACHE_VERSION = 'v1';
const PRECACHE = `precache-${CACHE_VERSION}`;
const RUNTIME = `runtime-${CACHE_VERSION}`;

// 처음 설치될 때 미리 담아둘 파일(필수 아님, 있으면 더 좋아요)
const PRECACHE_URLS = [
  '/',               // 메인 페이지
  '/favicon.ico',    // 파비콘
  // '/offline.html', // 오프라인 전용 페이지가 있다면 추가
];

// 설치 단계: 위 목록을 캐시에 담고, 곧바로 새 SW를 사용하도록 준비
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting(); // 새 서비스워커를 즉시 활성화 대기 상태로
});

// 활성화 단계: 이전 버전 캐시 깔끔히 삭제 + 현재 페이지들 제어
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => ![PRECACHE, RUNTIME].includes(key))
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

// 메시지로 강제 업데이트를 허용 (선택)
// 클라이언트에서 navigator.serviceWorker.controller.postMessage('SKIP_WAITING') 호출 가능
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// 요청 가로채기: GET + 동일 출처만 처리(외부 도메인/POST 등은 건드리지 않음)
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1) GET만 캐싱
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 2) 동일 출처(우리 사이트)만 캐시
  if (url.origin !== self.location.origin) return;

  // 3) API는 캐시하지 않음 (실시간 데이터 왜곡 방지)
  if (url.pathname.startsWith('/api/')) return;

  // 4) 내비게이션(페이지 이동) 요청: 네트워크 우선, 실패 시 캐시/오프라인 대체
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(req);
        // 오프라인이면 캐시된 페이지 또는 홈(/) 반환
        return cached || caches.match('/') /* || caches.match('/offline.html') */;
      }
    })());
    return;
  }

  // 5) 정적 파일(JS/CSS/이미지/폰트): 캐시 우선, 없으면 네트워크
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2?)$/i.test(url.pathname);

  if (isStatic) {
    event.respondWith((async () => {
      const cache = await caches.open(PRECACHE);
      const cached = await cache.match(req);
      if (cached) return cached;

      const res = await fetch(req);
      // 성공한 응답만 캐시에 저장
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })());
  }
});
