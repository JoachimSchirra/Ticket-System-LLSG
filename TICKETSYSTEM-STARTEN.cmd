@echo off
setlocal
title LLSG Service Desk
if not exist "%~dp0server.mjs" (
  echo Die Projektdateien fehlen neben dieser Startdatei.
  echo Bitte im Explorer mit der rechten Maustaste auf die ZIP-Datei klicken,
  echo "Alle extrahieren" waehlen und dann TICKETSYSTEM-STARTEN.cmd
  echo im entpackten Ordner starten.
  pause
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Bitte Node.js installieren.
  pause
  exit /b 1
)
node "%~dp0server.mjs" --open
if errorlevel 1 pause
