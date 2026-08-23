#!/usr/bin/env python
"""
Database Connection Test Script
Hii script inasaidia kuku-test connection kwa PostgreSQL database
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

try:
    django.setup()
except Exception as e:
    print(f"❌ Django setup failed: {e}")
    sys.exit(1)

from django.db import connection
from django.core.management import call_command

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing Database Connection...")
    print("-" * 50)
    
    try:
        # Test basic connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT version()")
            version = cursor.fetchone()[0]
            print(f"✅ Database connected successfully!")
            print(f"📊 Database Version: {version[:50]}...")
            
            # Get database info
            cursor.execute("SELECT current_database()")
            db_name = cursor.fetchone()[0]
            print(f"🗄️  Database Name: {db_name}")
            
            # Get connection info
            cursor.execute("SELECT current_user")
            user = cursor.fetchone()[0]
            print(f"👤 Connected as: {user}")
            
        print("-" * 50)
        print("✅ All database tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n🔧 Troubleshooting Tips:")
        print("1. Check DATABASE_URL in .env file")
        print("2. Verify PostgreSQL server is running")
        print("3. Check firewall settings")
        print("4. Verify username and password")
        print("5. Ensure database exists")
        return False

def test_migrations():
    """Test if migrations can be applied"""
    print("\n🔍 Testing Migrations...")
    print("-" * 50)
    
    try:
        call_command('showmigrations', '--plan')
        print("✅ Migration plan generated successfully")
        return True
    except Exception as e:
        print(f"❌ Migration test failed: {e}")
        return False

def main():
    print("=" * 50)
    print("YESAYA MINISTRY - Database Connection Test")
    print("=" * 50)
    
    # Load environment variables
    from dotenv import load_dotenv
    env_file = BASE_DIR / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        print(f"✅ Loaded environment from {env_file}")
        
        # Show database URL (masked)
        db_url = os.getenv('DATABASE_URL', 'Not set')
        if 'postgresql' in db_url:
            # Mask password for security
            import re
            masked_url = re.sub(r':([^@]+)@', ':****@', db_url)
            print(f"🔗 Database URL: {masked_url}")
        else:
            print(f"🔗 Database URL: {db_url}")
    else:
        print(f"⚠️  Warning: .env file not found at {env_file}")
        print("   Using default database configuration")
    
    print("=" * 50)
    
    # Run tests
    connection_ok = test_database_connection()
    
    if connection_ok:
        test_migrations()
    
    print("=" * 50)
    
    if connection_ok:
        print("✅ Database is ready for use!")
        return 0
    else:
        print("❌ Please fix database connection issues")
        return 1

if __name__ == "__main__":
    sys.exit(main())
