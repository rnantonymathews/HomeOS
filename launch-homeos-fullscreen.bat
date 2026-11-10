@echo off
title HomeOS Fullscreen
echo Starting HomeOS...

:: Check if server is running on port 8085; start it if not
powershell -NoProfile -Command "if (-not (Get-NetTCPConnection -LocalPort 8085 -ErrorAction SilentlyContinue)) { Start-Process powershell -ArgumentList '-WindowStyle Hidden -Command Set-Location -Path ''%~dp0''; node server.js' }"

timeout /t 1 /nobreak >nul

:: Launch Brave in dedicated True Kiosk Fullscreen (isolated profile prevents PWA hijack)
set "BRAVE=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
set "PROFILE=%LOCALAPPDATA%\HomeOS\BrowserProfile"

if exist "%BRAVE%" (
    start "" "%BRAVE%" --user-data-dir="%PROFILE%" --kiosk "http://localhost:8085" --no-first-run --no-default-browser-check
) else (
    start "" "http://localhost:8085"
)

