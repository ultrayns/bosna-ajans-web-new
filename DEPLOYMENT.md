# 🚀 BOSNAAJANS Production Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Vercel CLI (`npm i -g vercel`)
- Domain configured (DNS pointing to Vercel/server)
- Cloudflare account (for R2 storage and CDN)

---

## 1. Environment Setup

```bash
# Copy production env template
cp .env.production.example .env.production

# Generate secure keys
openssl rand -base64 32  # Use for JWT_SECRET, ADMIN_JWT_SECRET, API_TOKEN_SALT
```

---

## 2. Deploy CMS (Docker)

### Option A: Using Docker Compose (VPS/Server)

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f strapi

# Access admin panel
# https://your-server-ip:1337/admin
```

### Option B: Using Cloud Provider (Railway/Render/Fly.io)

```bash
# Railway
railway login
railway init
railway up

# Or Render/Fly.io with their respective CLIs
```

---

## 3. Configure CMS

1. **Create Admin User**
   - Navigate to `https://cms.bosnaajans.com/admin`
   - Create first administrator account

2. **Configure API Permissions**
   - Settings → Users & Permissions → Roles → Public
   - Enable `find` and `findOne` for: Project, Service, Category, Client, Award

3. **Generate API Token**
   - Settings → API Tokens → Create new token
   - Type: Full access (or custom)
   - Copy token to `STRAPI_API_TOKEN` env var

4. **Upload Content**
   - Add projects, services, team members, etc.
   - Upload media files (will go to R2 if configured)

---

## 4. Deploy Frontend (Vercel)

### Initial Setup

```bash
cd apps/web

# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_STRAPI_URL
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add STRAPI_API_TOKEN
vercel env add SENTRY_DSN
```

### Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## 5. Configure Domain

### Vercel (Frontend)
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add `bosnaajans.com` and `www.bosnaajans.com`
3. Follow DNS instructions

### CMS (Docker Server)
1. Set up Nginx reverse proxy
2. Configure SSL with Certbot
3. Point `cms.bosnaajans.com` to server

```nginx
# /etc/nginx/sites-available/strapi
server {
    listen 80;
    server_name cms.bosnaajans.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 6. Configure Media Storage (Cloudflare R2)

1. **Create R2 Bucket**
   - Cloudflare Dashboard → R2 → Create bucket
   - Name: `bosnaajans-media`

2. **Create API Token**
   - R2 → Manage R2 API Tokens → Create API Token
   - Permissions: Object Read & Write

3. **Configure Custom Domain** (Optional)
   - R2 → bucket → Settings → Custom Domains
   - Add `media.bosnaajans.com`

4. **Update Environment**
   ```
   STORAGE_PROVIDER=r2
   R2_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY_ID=your-key
   R2_SECRET_ACCESS_KEY=your-secret
   R2_BUCKET_NAME=bosnaajans-media
   R2_PUBLIC_URL=https://media.bosnaajans.com
   ```

---

## 7. CI/CD (GitHub Actions)

The `.github/workflows/deploy.yml` automates:
- ✅ Frontend lint, type-check, build, test
- ✅ Deploy to Vercel on push to `main`
- ✅ Build and push CMS Docker image to GHCR

### Required Secrets

Add these in GitHub → Settings → Secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `STRAPI_URL`
- `SITE_URL`

---

## 8. Monitoring

### Sentry (Error Tracking)
- Already configured in `sentry.client.config.ts`
- Add `SENTRY_DSN` to environment

### Vercel Analytics
- Enable in Vercel Dashboard → Analytics
- Automatic for all Vercel deployments

---

## Quick Reference

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | https://bosnaajans.com | Vercel |
| CMS Admin | https://cms.bosnaajans.com/admin | Docker |
| CMS API | https://cms.bosnaajans.com/api | REST API |
| Media | https://media.bosnaajans.com | Cloudflare R2 |

---

## Troubleshooting

### CMS won't start
```bash
docker-compose -f docker-compose.prod.yml logs strapi
# Check database connection, environment variables
```

### Frontend build fails
```bash
npm run build
# Check for TypeScript errors, missing env vars
```

### Media uploads failing
```bash
# Check R2 credentials and bucket permissions
# Verify CORS settings on R2 bucket
```
