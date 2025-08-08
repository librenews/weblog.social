# 🚀 Deployment Guide

This project uses **yarn** for package management consistently across all platforms.

**Important**: Only `yarn.lock` is included - no `package-lock.json` to avoid conflicts.

---

## Option 1: Render (Recommended) 🆓

Render provides excellent free hosting for Node.js apps and handles builds reliably.

### Steps:
1. Push your code to GitHub  
2. Go to [Render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `librenews/weblog.social`
5. Render will automatically detect Node.js and use these settings:
   - **Build Command**: `yarn install && yarn build`  
   - **Start Command**: `yarn start`
6. Click "Deploy"

### Features:
- ✅ **Generous free tier** (750 hours/month)
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Auto-deploy** on git push
- ✅ **Reliable builds** with dependency caching
- ✅ **Yarn support** for better dependency resolution

---

## Option 2: Railway (Paid Option) 🚂

Railway offers premium hosting with excellent developer experience.

### Steps:
1. Go to [Railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select this repository: `librenews/weblog.social`
4. Railway will auto-detect Node.js and use these settings:
   - **Build Command**: `yarn install && yarn build` (auto-detected)
   - **Start Command**: `yarn start` (from railway.json)
5. Click "Deploy"

### Features:
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Built-in monitoring** and comprehensive logs
- ✅ **Auto-scaling** based on traffic
- ✅ **Yarn support** with dependency caching
- ✅ **$5/month** after free trial ($5 credit included)

---

## Option 3: Vercel (Serverless) ⚡

Good for low-traffic usage with serverless functions.

### Steps:
1. Install Vercel CLI: `npm i -g vercel` (or `yarn global add vercel`)
2. Run `vercel` in your project directory
3. Follow the prompts

### Build Configuration:
Vercel will automatically detect the build setup. If needed, you can specify:
- **Build Command**: `yarn build` or `npm run build`
- **Output Directory**: `dist`

### Note:
Serverless functions have cold starts, so the first request might be slower.

---

## Option 4: DigitalOcean App Platform 🌊

DigitalOcean App Platform offers reliable hosting with good Node.js support.

### Steps:
1. Push your code to GitHub (ensure latest changes are pushed)
2. Go to [DigitalOcean Cloud](https://cloud.digitalocean.com/apps)
3. Click "Create App"
4. Choose "GitHub" as source
5. Select repository: `librenews/weblog.social`
6. DigitalOcean will auto-detect Node.js and use these settings:
   - **Build Command**: `yarn install && yarn build` (from .do/app.yaml)
   - **Run Command**: `yarn start` (from .do/app.yaml)
   - **Instance Size**: Basic ($5/month)
7. Review and click "Create Resources"

### Features:
- ✅ **Reliable builds** with good Node.js support
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Built-in monitoring** and logs
- ✅ **Predictable pricing** ($5/month Basic)
- ✅ **Good documentation** and support

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

## Troubleshooting Deployments

### Build Failures
If you encounter build failures on deployment platforms:

1. **Manual Render Configuration**: If Render auto-detects incorrectly, manually set:
   - **Build Command**: `yarn install && yarn build`
   - **Start Command**: `yarn start`  
   - **Node Version**: 20.x (in Environment settings)

2. **Manual Railway Configuration**: Go to Settings → Deploy:
   - **Build Command**: `yarn install && yarn build`
   - **Start Command**: `yarn start`
   - **Node Version**: 18.x or 20.x (in Variables)

3. **Manual DigitalOcean Configuration**: If needed, go to App Settings → Components:
   - **Build Command**: `yarn install && yarn build`
   - **Run Command**: `yarn start`
   - **Node Version**: 18.x or 20.x

4. **Check Node.js version**: Ensure the platform uses Node.js 18+
5. **Verify dependencies**: Make sure both `dependencies` and `devDependencies` are properly installed

### Local Build Testing
Test your build locally before deploying:
```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Test the production build
node dist/index.js
```

---

## Recommendations by Use Case

- **Personal/Hobby Use**: Render (free tier)
- **Production/Business**: Railway (best developer experience) or VPS (most reliable)
- **Enterprise**: DigitalOcean App Platform or VPS
- **Minimal Traffic**: Vercel (serverless)

---

## Option 5: VPS/Server Deployment 🖥️

If the managed platforms continue to have issues, deploying to a VPS gives you full control.

### Deployment Tools Options:

#### A) **Manual Deployment** (Simplest)
```bash
# SSH into your server and run commands directly
ssh user@your-server.com
git clone https://github.com/librenews/weblog.social.git
cd weblog.social && yarn install && yarn build && yarn start
```

#### B) **GitHub Actions** (Automated - Recommended)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to VPS
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/weblog.social
            git pull origin main
            yarn install
            yarn build
            pm2 restart weblog-bridge
```

#### C) **Docker** (Containerized)
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3001
CMD ["yarn", "start"]
```

Then deploy:
```bash
docker build -t weblog-bridge .
docker run -d -p 3001:3001 --name weblog-bridge --restart unless-stopped weblog-bridge
```

#### D) **PM2 Ecosystem** (Recommended for experienced users)
The project includes `ecosystem.config.example.cjs` for PM2 process management:
```bash
# Copy and customize the example config
cp ecosystem.config.example.cjs ecosystem.config.cjs
# Edit ecosystem.config.cjs with your server details

# Deploy using PM2 ecosystem
pm2 start ecosystem.config.cjs --env production

# Or deploy remotely (after configuring host in ecosystem.config.cjs)
pm2 deploy production setup    # First time only
pm2 deploy production          # Deploy updates
```

#### E) **Deployment Scripts** (Custom automation)
Create `deploy.sh`:
```bash
#!/bin/bash
set -e
echo "🚀 Deploying weblog.social..."
git pull origin main
yarn install
yarn build
pm2 restart metaweblog-api || pm2 start ecosystem.config.cjs --env production
echo "✅ Deployment complete!"
```

### Steps:
1. **Get a VPS**: DigitalOcean Droplet ($4/month), Linode ($5/month), or Vultr ($2.50/month)
2. **Set up Node.js**:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install yarn
   npm install -g yarn
   ```

3. **Deploy your app**:
   ```bash
   # Clone repo
   git clone https://github.com/librenews/weblog.social.git
   cd weblog.social
   
   # Install and build
   yarn install
   yarn build
   
   # Test it works
   yarn start
   ```

4. **Set up process manager**:
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start app with PM2 using ecosystem config
   pm2 start ecosystem.config.cjs --env production
   pm2 startup
   pm2 save
   ```

5. **Set up reverse proxy** (optional):
   ```bash
   # Install nginx
   sudo apt install nginx
   
   # Configure nginx to proxy to your app
   # (port 3001 → port 80/443)
   ```

### Benefits:
- ✅ **Full control** over environment
- ✅ **No platform quirks** or buildpack issues
- ✅ **Same commands** that work locally
- ✅ **Cheap** ($2.50-$5/month)
- ✅ **Reliable** and predictable
- ✅ **Multiple deployment options** (manual, automated, containerized)

### Recommended Approach:
1. **Start with manual deployment** to get it working
2. **Add GitHub Actions** for automated deployments
3. **Consider Docker** for consistency across environments
