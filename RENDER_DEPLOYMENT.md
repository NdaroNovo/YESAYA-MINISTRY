# Render Deployment Guide - YESAYA MINISTRY

## Overview
Hii ni guide kamili ya ku-deploy YESAYA MINISTRY backend kwenye Render platform kulingana na mfumo wenu.

## Prerequisites

1. **Akaunti ya Render**: https://render.com/
2. **Repository**: GitHub repository with the code
3. **Environment Variables**: Database credentials na configuration

## Step 1: Prepare Repository

### 1.1 Ensure .gitignore is Updated
Hakikisha `.gitignore` ina-files zifuatazo:
```
backend/.env
backend/db.sqlite3
backend/media
backend/staticfiles
backend/venv
```

### 1.2 Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy Backend on Render

### 2.1 Create New Web Service

1. Login kwenye Render dashboard
2. Bonyeza "New +" → "Web Service"
3. Connect GitHub repository
4. Select branch (usually `main`)

### 2.2 Configure Build and Runtime

**Root Directory**: `backend`

**Build Command**:
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**Start Command**:
```bash
gunicorn backend.wsgi:application --workers 4 --worker-class sync --worker-tmp-dir /dev/shm --timeout 120 --keepalive 5 --max-requests 1000 --max-requests-jitter 50
```

**Runtime**: Python 3.10.12

### 2.3 Configure Environment Variables

Weka environment variables zifuatazo:

**Required Variables:**
- `DATABASE_URL` - (Automatically connected kama unatumia Render PostgreSQL)
- `SECRET_KEY` - Generate random key
- `DEBUG` = `False`
- `ALLOWED_HOSTS` = `your-app-name.onrender.com`

**Optional Variables:**
- `REDIS_URL` - (Kama unatumia Render Redis)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
- `SUPABASE_URL`, `SUPABASE_KEY`

### 2.4 Configure Database

**Option A: Use Render PostgreSQL (Recommended)**
1. Create PostgreSQL database kwenye Render
2. Connect it to the web service
3. Render automatically sets `DATABASE_URL`

**Option B: Use External PostgreSQL**
1. Set `DATABASE_URL` environment variable manually:
   ```
   postgresql://username:password@host:port/database_name
   ```

### 2.5 Configure Disk Storage (for Media Files)

1. Scroll down to "Disks" section
2. Add new disk:
   - Name: `data`
   - Mount Path: `/opt/render/project/backend/media`
   - Size: 1 GB

### 2.6 Configure Health Check

Set health check path to: `/health/`

This will automatically monitor your application health.

## Step 3: Automatic Deployment

Render automatically deploys when:
- You push new code to GitHub
- Environment variables change
- Database connection changes

## Step 4: Deploy Frontend (Optional)

Kama unataka ku-deploy frontend pia:

### 4.1 Vercel Deployment
```bash
cd frontend
npm run build
```
Kisha deploy kwenye Vercel.

### 4.2 Update Frontend API URL
Badilisha API URL kwenye frontend configuration kuelekea kwenye Render URL.

## Step 5: Post-Deployment Setup

### 5.1 Run Migrations
Kama migrations hazijatekelewa automatically, run manually:

1. SSH kwenye Render shell (kama inapatikana)
2. Au add script kwenye `render.yaml`:
```yaml
buildCommand: pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput
```

### 5.2 Create Superuser
Kwa ku-create admin user:

1. Bonyeza "Shell" kwenye Render dashboard
2. Run:
```bash
python manage.py createsuperuser
```

### 5.3 Seed Default Data
```bash
python manage.py seed_defaults
```

## Monitoring and Logs

### View Logs
- Deployment logs: Tab ya "Events"
- Application logs: Tab ya "Logs"

### Health Check
Health check ipo kwenye: `https://your-app.onrender.com/health/`

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "service": "YESAYA Ministry Backend"
}
```

## Troubleshooting

### Build Failures
- Angalia build logs kwa error messages
- Hakikisha `requirements.txt` ina dependencies zote
- Hakikisha Python version ni sahihi

### Database Connection Issues
- Angalia `DATABASE_URL` environment variable
- Hakikisha database ipo accessible
- Test connection locally kwanza

### Static Files Issues
- Hakikisha `collectstatic` inafanya kazi
- Angalia `STATIC_ROOT` settings
- Check permissions

### Memory Issues
- Punguza workers kwenye gunicorn command
- Au upgrade plan kwa more memory

## Cost Optimization

### Free Tier Limits
- 512 MB RAM
- 0.1 CPU
- 750 hours/month

### Paid Tier Benefits
- More RAM/CPU
- Faster builds
- Better performance
- Support

## Security Best Practices

1. **Environment Variables**: Usiweke sensitive data kwenye code
2. **DEBUG Mode**: Always set to `False` in production
3. **ALLOWED_HOSTS**: Set only to your domain
4. **Database**: Use strong passwords
5. **HTTPS**: Automatically enabled on Render

## Domain Configuration (Optional)

### Custom Domain
1. Purchase domain
2. Add custom domain kwenye Render
3. Update DNS records

### SSL Certificates
Render automatically provides SSL certificates.

## Scaling

### Horizontal Scaling
- Add more instances kwenye Render dashboard
- Configure load balancing

### Vertical Scaling
- Upgrade plan kwa more resources
- Better for high traffic applications

## Backup and Recovery

### Database Backups
Render automatically backups PostgreSQL databases daily.

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

## Performance Optimization

### Gunicorn Settings
Current settings optimized for performance:
- 4 workers
- 120 second timeout
- Connection pooling
- Request recycling

### Database Optimization
- Use connection pooling
- Add indexes to frequently queried fields
- Optimize queries

## Support

For issues:
1. Check Render documentation: https://render.com/docs
2. Check deployment logs
3. Test locally with production settings
4. Contact Render support

## Checklist Before Deployment

- [ ] Code pushed to GitHub
- [ ] .gitignore properly configured
- [ ] Environment variables set
- [ ] Database connected
- [ ] Health check configured
- [ ] Static files collection tested
- [ ] Migrations applied
- [ ] Superuser created
- [ ] Default data seeded
- [ ] Frontend API URL updated
- [ ] HTTPS enabled
- [ ] Monitoring configured