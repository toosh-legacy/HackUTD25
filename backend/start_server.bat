@echo off
echo Starting Backend Server...
echo.

cd /d "%~dp0"
call venv\Scripts\activate.bat
python wsgi.py

pause

