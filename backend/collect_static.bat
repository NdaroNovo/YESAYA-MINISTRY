@echo off
REM Static files collection script for production deployment (Windows)

echo 🗂️  Collecting static files for production...

REM Navigate to backend directory
cd /d "%~dp0"

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else if exist env\Scripts\activate.bat (
    call env\Scripts\activate.bat
)

REM Collect static files
python manage.py collectstatic --noinput --clear

echo ✅ Static files collected successfully!
echo 📁 Static files location: staticfiles/

pause