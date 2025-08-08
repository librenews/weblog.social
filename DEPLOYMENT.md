# 🚀 Deployment Guide

This project is pre-configured for easy deployment to multiple platforms. Choose your preferred option:

## Option 1: Railway (Recommended) ⭐

Railway offers the simplest deployment with automatic HTTPS and custom domains.

### Steps:
1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "Deploy from GitHub repo"
4. Select this repository
5. Railway will automatically detect the `railway.json` config and deploy

### Features:
- ✅ Automatic HTTPS
- ✅ Custom domains available
- ✅ Built-in monitoring
- ✅ Auto-scaling
- ✅ Free tier available ($5/month after)

---

## Option 2: Render (Great Free Option) 🆓

Render provides excellent free hosting for Node.js apps.

### Steps:
1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Render will use the `render.yaml` config automatically

### Features:
- ✅ Generous free tier
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Auto-deploy on git push

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
