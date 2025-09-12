@echo off
REM setup-windows.bat - Windows용 프로젝트 설정 배치 파일

echo 🚀 E-Shop Catalog 프로젝트 설정 시작...

echo.
echo 📦 의존성 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install 실패
    pause
    exit /b 1
)

echo.
echo 🔧 Prisma 클라이언트 생성 중...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma 클라이언트 생성 실패
    pause
    exit /b 1
)

echo.
echo 🗄️ 데이터베이스 스키마 적용 중...
call npx prisma db push --force-reset
if %errorlevel% neq 0 (
    echo ❌ 데이터베이스 스키마 적용 실패
    pause
    exit /b 1
)

echo.
echo 🌱 시드 데이터 생성 중...
call npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
if %errorlevel% neq 0 (
    echo ❌ 시드 데이터 생성 실패
    echo 📋 수동으로 다시 시도: npm run db:seed
    pause
    exit /b 1
)

echo.
echo ✅ 설정 완료!
echo 📊 개발 서버 시작: npm run dev
echo 🔍 데이터베이스 확인: npm run db:studio
echo.
pause