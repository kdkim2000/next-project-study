---
title: "Docker와 Kubernetes 실무 활용 전략"
date: "2024-01-08"
description: "컨테이너 기반 개발과 배포를 위한 Docker와 Kubernetes의 실무 활용 방법과 모범 사례를 알아봅니다."
keywords: ["docker", "kubernetes", "devops", "containerization"]
category: "devops"
tags: ["docker", "kubernetes", "containerization", "deployment", "scalability"]
---

# Docker와 Kubernetes 실무 활용 전략

컨테이너 기술은 현대 애플리케이션 개발과 배포의 핵심이 되었습니다.

## Docker 최적화 전략

### 멀티스테이지 빌드
```dockerfile
# 빌드 단계
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 실행 단계
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### .dockerignore 활용
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
coverage
.nyc_output
```

## Kubernetes 배포 전략

### Deployment 설정
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### 서비스 설정
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 모니터링과 로깅

### Health Check
```javascript
// Node.js 애플리케이션의 health check
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  
  res.status(200).send(healthCheck);
});
```

### Kubernetes Probes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## 보안 모범 사례

1. **비루트 사용자 실행**
2. **시크릿 관리**
3. **네트워크 정책 적용**
4. **이미지 스캐닝**

Docker와 Kubernetes를 제대로 활용하면 확장 가능하고 안정적인 애플리케이션을 구축할 수 있습니다.
