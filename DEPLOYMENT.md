# 🚀 Deployment Guide

This project is pre-configured for easy deployment to multiple platforms. Choose your preferred option:

## Option 1: Render (Recommended) 🆓

Render provides excellent free hosting for Node.js apps and handles builds reliably.

### Steps:
1. Push your code to GitHub  
2. Go to [Render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `librenews/weblog.social`
5. Render will automatically detect Node.js and use these settings:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
6. Click "Deploy"

### Features:
- ✅ **Generous free tier** (750 hours/month)
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Auto-deploy** on git push
- ✅ **Reliable builds** with dependency caching

---

## Option 2: Railway (Paid Option) 🚂

Railway offers premium hosting with excellent developer experience.

### Steps:
1. Go to [Railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select this repository
4. Railway will auto-detect Node.js and deploy

### Features:
- ✅ Automatic HTTPS and custom domains
- ✅ Built-in monitoring and logs
- ✅ Auto-scaling
- ✅ $5/month after free trial

---

## Option 3: Vercel (Serverless) ⚡

Good for low-traffic usage with serverless functions.

### Steps:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

### Note:
Serverless functions have cold starts, so the first request might be slower.

---

## Option 4: DigitalOcean App Platform 🌊

### Steps:
1. Push to GitHub
2. Go to DigitalOcean → Apps
3. Create new app from GitHub
4. Select this repository
5. DigitalOcean will auto-detect Node.js

---

## Environment Variables

All platforms will automatically use:
- `PORT` - Set by the platform
- `NODE_ENV=production` - For production optimizations

No additional environment variables needed! The service uses Bluesky credentials from the client requests.

---

## Custom Domain Setup

After deployment, you can add a custom domain:

1. **Railway**: Project Settings → Domains → Add Custom Domain
2. **Render**: Service Settings → Custom Domains
3. **Vercel**: Project Settings → Domains
4. **DigitalOcean**: App Settings → Domains

---

## Health Check

All deployments include a health check endpoint at `/health` that platforms use to monitor your service.

---

## Recommendations by Use Case

- **Personal/Hobby Use**: Render (free tier)
- **Production/Business**: Railway (best developer experience)
- **Enterprise**: DigitalOcean App Platform
- **Minimal Traffic**: Vercel (serverless)
