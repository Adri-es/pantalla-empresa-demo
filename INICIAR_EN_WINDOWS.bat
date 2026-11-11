@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo  NEXA DISPLAY - Demo local
 echo ==========================================
where py >nul 2>&1
if %errorlevel%==0 (
 set "PY=py"
) else (
 where python >nul 2>&1
 if %errorlevel%==0 (
  set "PY=python"
 ) else (
  echo ERROR: Necesitas instalar Python desde https://www.python.org/downloads/
  echo Luego vuelve a ejecutar este archivo.
  pause
  exit /b 1
 )
)
start "" "http://localhost:8000"
echo Abriendo http://localhost:8000
 echo Deja esta ventana abierta mientras usas la pantalla.
%PY% -m http.server 8000 --bind 127.0.0.1
pause
