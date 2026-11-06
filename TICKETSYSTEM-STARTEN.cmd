@echo off
setlocal
cd /d "%~dp0"
title LLSG Service Desk
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Bitte Node.js installieren.
  pause
  exit /b 1
)
node server.mjs --open
if errorlevel 1 pause
