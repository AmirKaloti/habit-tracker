@echo off
title HABITRON
cd /d "%~dp0"
echo ============================================
echo    HABITRON wird gestartet...
echo.
echo    Dieses Fenster bitte OFFEN lassen,
echo    solange du die App benutzt.
echo.
echo    Der Browser oeffnet sich gleich
echo    automatisch. Zum Beenden: Fenster
echo    schliessen oder STRG + C druecken.
echo ============================================
echo.
call npm run dev -- --open
pause
