# setup-windows.ps1 - Windows PowerShell용 프로젝트 설정 스크립트

Write-Host "🚀 E-Shop Catalog 프로젝트 설정 시작..." -ForegroundColor Green

# 의존성 설치
Write-Host "`n📦 의존성 설치 중..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install 실패" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Prisma 클라이언트 생성
Write-Host "`n🔧 Prisma 클라이언트 생성 중..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma 클라이언트 생성 실패" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# 데이터베이스 스키마 적용
Write-Host "`n🗄️ 데이터베이스 스키마 적용 중..." -ForegroundColor Yellow
npx prisma db push --force-reset
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 데이터베이스 스키마 적용 실패" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# 시드 데이터 생성
Write-Host "`n🌱 시드 데이터 생성 중..." -ForegroundColor Yellow
npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 시드 데이터 생성 실패" -ForegroundColor Red
    Write-Host "📋 수동으로 다시 시도: npm run db:seed" -ForegroundColor Cyan
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "`n✅ 설정 완료!" -ForegroundColor Green
Write-Host "📊 개발 서버 시작: npm run dev" -ForegroundColor Cyan
Write-Host "🔍 데이터베이스 확인: npm run db:studio" -ForegroundColor Cyan
Read-Host "`nPress Enter to exit"