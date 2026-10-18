@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js 24 LTS from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>22||(major===22&&minor>=12)?0:1)"
if errorlevel 1 (
  echo This website requires Node.js 22.12 or newer. Node.js 24 LTS is recommended.
  pause
  exit /b 1
)
echo Preparing the exact website dependencies. The first run requires internet.
call npm ci --include=dev --no-fund --no-audit
if errorlevel 1 (
  echo Installation failed. Check your internet connection and the error above.
  pause
  exit /b 1
)
echo Starting Veyra. Keep this window open. Press Ctrl+C to stop.
call npm run dev -- --host 127.0.0.1 --open
if errorlevel 1 pause
endlocal
