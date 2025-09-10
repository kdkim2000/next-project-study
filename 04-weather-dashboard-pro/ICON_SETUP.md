# 아이콘 설정 가이드

PWA 기능을 위해 다음 아이콘들을 `public` 폴더에 추가해야 합니다.

## 필요한 아이콘 파일들

```
public/
├── favicon.ico              # 16x16, 32x32 파비콘
├── icon-72x72.png          # 72x72 PWA 아이콘
├── icon-96x96.png          # 96x96 PWA 아이콘  
├── icon-128x128.png        # 128x128 PWA 아이콘
├── icon-144x144.png        # 144x144 PWA 아이콘
├── icon-152x152.png        # 152x152 PWA 아이콘
├── icon-192x192.png        # 192x192 PWA 아이콘
├── icon-384x384.png        # 384x384 PWA 아이콘
├── icon-512x512.png        # 512x512 PWA 아이콘
├── screenshot-wide.png     # 1280x720 PWA 스크린샷 (가로형)
└── screenshot-narrow.png   # 750x1334 PWA 스크린샷 (세로형)
```

## 아이콘 생성 방법

### 1. 온라인 생성기 사용 (권장)
- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/)
- 하나의 고화질 이미지(512x512 이상)를 업로드하면 모든 사이즈 자동 생성

### 2. 디자인 툴 사용
- Figma, Canva, Photoshop 등에서 직접 제작
- 날씨 관련 아이콘 추천: 구름, 태양, 비, 온도계 등

### 3. 무료 아이콘 다운로드
- [Flaticon](https://www.flaticon.com/)
- [Icons8](https://icons8.com/)
- [Feather Icons](https://feathericons.com/)

## 임시 아이콘 생성

개발 중 임시로 사용할 수 있는 간단한 아이콘을 생성하는 방법:

```html
<!-- 임시 파비콘을 위한 SVG -->
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#1976d2"/>
  <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">🌤</text>
</svg>
```

## 스크린샷 생성

PWA 매니페스트에서 사용할 스크린샷:

1. **가로형 (1280x720)**: 데스크톱/태블릿 화면
2. **세로형 (750x1334)**: 모바일 화면

브라우저 개발자 도구에서 해당 크기로 설정 후 스크린샷 촬영

## 아이콘 최적화

- PNG 파일 최적화: [TinyPNG](https://tinypng.com/)
- SVG 최적화: [SVGOMG](https://jakearchibald.github.io/svgomg/)
- 투명 배경 권장
- 모서리 둥글게 처리 (PWA 가이드라인)