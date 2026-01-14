@echo off
setlocal

echo ====================================
echo   LFA Builder Platform Setup
echo ====================================

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b 1
)
echo [OK] Python found.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b 1
)
echo [OK] Node.js found.

echo.
echo --- Setting up Backend ---
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activate venv...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b 1
)

if not exist .env (
    echo Creating .env from example...
    copy .env.example .env
    echo [NOTE] Don't forget to edit backend\.env with your API keys!
)

cd ..

echo.
echo --- Setting up Frontend ---
cd frontend

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b 1
)

if not exist .env.local (
    echo Creating .env.local from example...
    copy .env.local.example .env.local
)

echo.
echo ====================================
echo   Setup Complete!
echo ====================================
echo.
echo To run the backend:
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn app.api.server:app --reload
echo.
echo To run the frontend:
echo   cd frontend
echo   npm run dev
echo.
pause
