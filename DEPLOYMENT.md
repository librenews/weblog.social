# 🚀 Deployment Guide

This project is pre-configured for easy deployment to multiple platforms. Choose your preferred option:

**Package Manager Notes:**
- **Local development**: Uses yarn for better dependency resolution
- **Render**: Configured for yarn (best compatibility)  
- **Railway**: Configured for npm (platform requirement)
- **Other platforms**: Support both yarn and npm

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
   - **Build Command**: `npm install && npm run build` (auto-detected)
   - **Start Command**: `npm start` (from railway.json)
5. Click "Deploy"

### Features:
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Built-in monitoring** and comprehensive logs
- ✅ **Auto-scaling** based on traffic
- ✅ **npm compatibility** with dependency caching
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

2. **Manual Railway Configuration**: Railway works best with npm. Go to Settings → Deploy:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18.x or 20.x (in Variables)

3. **Manual DigitalOcean Configuration**: If needed, go to App Settings → Components:
   - **Build Command**: `yarn install && yarn build`
   - **Run Command**: `yarn start`
   - **Node Version**: 18.x or 20.x

4. **Fallback to npm if yarn fails**: Only if yarn is unavailable on the platform:
   ```bash
   # Fallback build command:
   npm install && npm run build
   ```

4. **Check Node.js version**: Ensure the platform uses Node.js 18+
5. **Verify dependencies**: Make sure both `dependencies` and `devDependencies` are properly installed

### Local Build Testing
Test your build locally before deploying:
```bash
# Install dependencies
yarn install  # or npm install

# Build the project
yarn build    # or npm run build

# Test the production build
node dist/index.js
```

---

## Recommendations by Use Case

- **Personal/Hobby Use**: Render (free tier)
- **Production/Business**: Railway (best developer experience)
- **Enterprise**: DigitalOcean App Platform
- **Minimal Traffic**: Vercel (serverless)
