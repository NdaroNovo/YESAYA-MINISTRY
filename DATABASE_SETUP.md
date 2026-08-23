# Database Setup Guide - YESAYA MINISTRY

## Overview
Mfumo unatumia PostgreSQL kwa ajili ya kuhifadhi data kulingana na documentation. Hii ni guide ya kusanidi database yako ya PostgreSQL kwenye remote server.

## Configuration Steps

### 1. Create .env File
Kwenye folder ya `backend`, tengeneza faili linaloitwa `.env` na copy yaliyomo kwenye `.env.example`:

```bash
cd backend
copy .env.example .env
```

### 2. Configure Database URL
Badilisha `DATABASE_URL` kwenye `.env` file na weka maelezo ya PostgreSQL database yako:

```
DATABASE_URL=postgresql://username:password@host:port/database_name
```

**Mfano:**
```
DATABASE_URL=postgresql://yesaya_user:mySecurePassword123@192.168.1.100:5432/yesaya_ministry
```

**Vigamba:**
- `username` - Jina la mtumiaji wa PostgreSQL
- `password` - Nenosiri la PostgreSQL
- `host` - IP address au domain name ya server
- `port` - Port ya PostgreSQL (kawaida 5432)
- `database_name` - Jina la database

### 3. Database Connection Requirements

Kwa ajili ya remote server PostgreSQL connection, hakikisha:

1. **Server Configuration:**
   - PostgreSQL inaruhusu connections kutoka kwenye IP yako
   - Firewall inaruhusu port 5432
   - PostgreSQL imewezeshwa kukubali remote connections

2. **pg_hba.conf Configuration:**
   Weka kwenye `pg_hba.conf` kwenye server:
   ```
   host    all    all    your_ip/32    md5
   ```
   Badilisha `your_ip` na IP address yako.

3. **postgresql.conf Configuration:**
   Hakikisha:
   ```
   listen_addresses = '*'
   ```

### 4. Test Connection

Baada ya kubadilisha `.env`, jaribu ku-test connection:

```bash
cd backend
python manage.py check
python manage.py migrate
```

### 5. Create Database Tables

Kama hujui tayari, run migrations:

```bash
python manage.py migrate
```

### 6. Seed Default Data

```bash
python manage.py seed_defaults
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

## Troubleshooting

### Connection Timeout
- Hakikisha firewall inaruhusu port 5432
- Hakikisha PostgreSQL server inarun
- Angalia IP address kwenye `pg_hba.conf`

### Authentication Failed
- Hakikisha username na password ni sahihi
- Hakikisha user ana privileges za kuhusika na database

### Database Does Not Exist
- Create database kwanza kwa kutumia:
  ```sql
  CREATE DATABASE yesaya_ministry;
  ```

## Security Notes

- **HAKIKISHA** `.env` file haiko kwenye version control
- **HAKIKISHA** unatumia nenosiri imara kwa production
- **HAKIKISHA** server yako ina SSL/TLS enabled kwa production
- **HAKIKISHA** unaweza permissions za database ipasavyo

## Development vs Production

### Development (Local)
```
DATABASE_URL=sqlite:///db.sqlite3
```

### Production (Remote PostgreSQL)
```
DATABASE_URL=postgresql://user:password@remote-server:5432/database
```

## Support

Kama una matatizo na database connection:
1. Angalia Django error logs
2. Angalia PostgreSQL server logs
3. Hakikisha network connection inafanya kazi
4. Angalia firewall settings
