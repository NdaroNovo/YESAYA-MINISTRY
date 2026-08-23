#!/bin/bash
# Static files collection script for production deployment

echo "🗂️  Collecting static files for production..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "env" ]; then
    source env/bin/activate
fi

# Collect static files
python manage.py collectstatic --noinput --clear

echo "✅ Static files collected successfully!"
echo "📁 Static files location: staticfiles/"
