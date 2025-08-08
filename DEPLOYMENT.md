# 🚀 Deployment Guide

This project uses **yarn** for package management consistently across all platforms.

**Important**: Only `yarn.lock` is included - no `package-lock.json` to avoid conflicts.

---

## Option 1: VPS/Server Deployment 🖥️ (Recommended)

**Why VPS First?** After testing multiple managed platforms, VPS deployment with PM2 provides the most reliable and predictable experience. You have full control over the environment and avoid platform-specific buildpack issues.

### PM2 Ecosystem Deployment (Recommended)

The project includes `ecosystem.config.example.cjs` for professional PM2 process management:

**Important Setup:**
1. **Copy example to shared directory** (not in repo):
   ```bash
   # On your server, create the shared config
   mkdir -p /home/deploy/weblog/shared/
   cp ecosystem.config.example.cjs /home/deploy/weblog/shared/ecosystem.config.cjs
   # Edit the shared config with your specific settings
   ```

2. **Configure paths in your local ecosystem.config.cjs:**
   ```bash
   # Copy and customize the example config locally
   cp ecosystem.config.example.cjs ecosystem.config.cjs
   # Update with your server details, NVM paths, and PM2 location
   ```

**Usage:**
```bash
# Deploy using PM2 ecosystem
pm2 deploy production setup    # First time only
pm2 deploy production          # Deploy updates
```

**Key Features:**
- ✅ **Zero-downtime deployments** with PM2
- ✅ **Full NVM path support** for yarn builds  
- ✅ **Memory-optimized** TypeScript compilation
- ✅ **Shared configuration** (persists across deployments)
- ✅ **Professional process management**

### VPS Setup Steps:
1. **Get a VPS**: DigitalOcean Droplet ($4/month), Linode ($5/month), or Vultr ($2.50/month)
2. **Set up Node.js**:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install yarn and PM2
   npm install -g yarn pm2
   ```

3. **Deploy your app** using PM2 ecosystem (see above)

4. **Set up reverse proxy** (optional):
   ```bash
   # Install nginx for custom domains and HTTPS
   sudo apt install nginx certbot python3-certbot-nginx
   ```

---

## Option 2: Render 🆓 (Alternative - Has Build Issues)

**⚠️ Known Issue**: Render builds dependencies successfully but fails to compile TypeScript, resulting in missing `dist/index.js` file during deployment.

**Error you'll see**: `Error: Cannot find module '/opt/render/project/src/dist/index.js'`

**Root Cause**: Render's build process runs `yarn install` but doesn't execute `yarn build` (TypeScript compilation).

If you want to try Render anyway:

### Steps:
1. Push your code to GitHub  
2. Go to [Render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `librenews/weblog.social`
5. Render will detect Node.js but **manually configure**:
   - **Build Command**: `yarn install && yarn build` (⚠️ Must add yarn build manually)
   - **Start Command**: `yarn start` (should be auto-detected)
6. Click "Deploy"

### Features:
- ✅ **Generous free tier** (750 hours/month)
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Auto-deploy** on git push
- ❌ **TypeScript build issues** - requires manual build command configuration
- ❌ **May still fail** due to buildpack auto-detection problems

**Recommendation**: Use VPS deployment instead for reliable TypeScript compilation.

---

## Environment Variables

All deployments will automatically use:
- `PORT` - Set by the platform (or 3001 for VPS)
- `NODE_ENV=production` - For production optimizations

No additional environment variables needed! The service uses Bluesky credentials from the client requests.

---

## Custom Domain Setup

**VPS**: Configure nginx reverse proxy for custom domains and HTTPS
**Render**: Service Settings → Custom Domains

---

## Health Check

All deployments include a health check endpoint at `/health` that can be used for monitoring.

---

## Troubleshooting Deployments

### Platform Build Failures
If you encounter build failures on managed platforms:

1. **Render TypeScript Build Issues**: 
   - **Error**: `Cannot find module '/opt/render/project/src/dist/index.js'`
   - **Cause**: Render doesn't auto-detect that TypeScript needs compilation
   - **Fix**: Manually set **Build Command** to: `yarn install && yarn build`
   - **Note**: Even with manual config, may still encounter platform detection issues
   - **Recommendation**: Use VPS deployment to avoid these problems entirely

2. **General Platform Issues**:
   - Check Node.js version compatibility (requires 18+)  
   - Verify both `dependencies` and `devDependencies` install correctly
   - **Recommendation**: Use VPS deployment to avoid platform-specific issues

### PM2 Deployment Issues

1. **TypeScript Build Killed**: If builds fail with "Killed" (exit code 137):
   - Increase memory limit: `NODE_OPTIONS="--max_old_space_size=1024"`
   - Use NVM path for yarn: `/home/user/.nvm/versions/node/vXX.XX.X/bin/yarn`

2. **yarn: command not found**: 
   - Find yarn location: `ssh user@host 'which yarn'`
   - Use full path in post-deploy commands
   - Common locations: `/home/user/.nvm/versions/node/vXX.XX.X/bin/yarn`

3. **PM2 app not starting**:
   - Check PM2 location: `which pm2` (usually `/usr/local/bin/pm2`)
   - Verify ecosystem config is symlinked to shared directory
   - Use correct working directory for relative paths

4. **Script not found errors**:
   - Ensure build completed: check `dist/index.js` exists
   - Verify ecosystem config uses correct paths
   - PM2 runs relative to deployment directory structure

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

- **Production/Business** (Recommended): **VPS with PM2** - Most reliable, full control
- **Personal/Hobby Use**: **VPS with PM2** - Cheap ($2.50-5/month) and reliable  
- **Quick Testing Only**: Render free tier (with build caveats)

**Why VPS?** After testing multiple platforms, VPS deployment with PM2 ecosystem provides:
- ✅ Consistent, predictable builds
- ✅ No platform-specific buildpack conflicts  
- ✅ Professional process management
- ✅ Cost-effective ($2.50-5/month vs $5+ on managed platforms)
- ✅ Full control over Node.js, yarn, and PM2 versions
