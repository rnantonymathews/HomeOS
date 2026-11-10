@echo off
title HomeOS App Window
echo Starting HomeOS...

:: Check if server is running on port 8085; start it if not
powershell -NoProfile -Command "if (-not (Get-NetTCPConnection -LocalPort 8085 -ErrorAction SilentlyContinue)) { Start-Process powershell -ArgumentList '-WindowStyle Hidden -Command Set-Location -Path ''%~dp0''; node server.js' }"

timeout /t 1 /nobreak >nul

set "BRAVE=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
set "PROFILE=%LOCALAPPDATA%\HomeOS\BrowserProfile"

if exist "%BRAVE%" (
    start "" "%BRAVE%" --user-data-dir="%PROFILE%" --app="http://localhost:8085" --start-maximized --no-first-run --no-default-browser-check
) else (
    start "" "http://localhost:8085"
)

