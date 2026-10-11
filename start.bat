@echo off
setlocal
echo ==========================================================
echo   VidCompress Demo Server (Windows)
echo ==========================================================
echo Starting local web server on http://localhost:8000 ...

:: Check for python / py
where python >nul 2>nul
if %errorlevel% equ 0 (
    start http://localhost:8000
    python -m http.server 8000
    goto :eof
)

where py >nul 2>nul
if %errorlevel% equ 0 (
    start http://localhost:8000
    py -m http.server 8000
    goto :eof
)

echo.
echo [Notice] Python was not found in your PATH.
echo Launching index.html directly in your default browser...
start "" "index.html"
pause
