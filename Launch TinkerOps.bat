@echo off
REM TinkerOps — MTW Workshop Dev Console
REM Double-click launcher. Starts the dev server and opens the dashboard.
title TinkerOps Dev Console
cd /d "%~dp0"

echo.
echo   TinkerOps starting...
echo.

REM Open the dashboard once the server has had a moment to bind port 5175.
start "" /b cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:5175/"

REM Run the dev server in this window (close it to stop TinkerOps).
"C:\Users\MadTi\scoop\shims\bun.exe" run dev
