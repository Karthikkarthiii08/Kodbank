@echo off
echo.
echo ========================================
echo Starting Kodbank Servers...
echo ========================================
echo.

echo Starting Backend Server (Port 3000)...
start "Kodbank Backend" cmd /k "cd kodbank\backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Port 8080)...
start "Kodbank Frontend" cmd /k "cd kodbank\frontend && npm start"

timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8080
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul

start http://localhost:8080

echo.
echo Servers are running!
echo Keep the terminal windows open.
echo Close them to stop the servers.
echo.
pause
