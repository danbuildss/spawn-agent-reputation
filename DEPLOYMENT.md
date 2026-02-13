# Deployment Guide

## 🚀 Push to GitHub

### Option 1: Using GitHub CLI (Recommended)

1. **Install GitHub CLI** (if not already installed):
   ```bash
   # macOS
   brew install gh
   
   # Windows
   winget install --id GitHub.cli
   
   # Linux
   sudo apt install gh
   ```

2. **Authenticate with GitHub**:
   ```bash
   gh auth login
   ```

3. **Create and push repository**:
   ```bash
   cd spawn-agent-reputation
   git init
   git add .
   git commit -m "Initial commit: Spawn agent reputation platform"
   gh repo create spawn-agent-reputation --public --source=. --push
   ```

### Option 2: Using Git + Manual GitHub Repo Creation

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `spawn-agent-reputation`
   - Description: "Agent Reputation OnChain - Trust scores for AI agents"
   - Choose Public or Private
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push your code**:
   ```bash
   cd spawn-agent-reputation
   git init
   git add .
   git commit -m "Initial commit: Spawn agent reputation platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/spawn-agent-reputation.git
   git push -u origin main
   ```

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI (Fastest)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd spawn-agent-reputation
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **spawn-agent-reputation**
   - In which directory is your code located? **./**
   - Want to override settings? **N**

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard (Most Visual)

1. **Go to Vercel**:
   - Visit https://vercel.com
   - Sign up or log in with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Click "Import" next to your GitHub repository
   - Or click "Import Git Repository" and paste your repo URL

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes for build and deployment
   - Your site will be live at `https://spawn-agent-reputation.vercel.app`

## 🎯 Post-Deployment

### Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `spawn.app`)
3. Follow DNS configuration instructions

### Environment Variables (If needed later)

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add any API keys or secrets
3. Redeploy for changes to take effect

## 📝 Quick Reference Commands

```bash
# Initial setup
cd spawn-agent-reputation
git init
git add .
git commit -m "Initial commit"

# Push to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/spawn-agent-reputation.git
git push -u origin main

# Deploy to Vercel
vercel --prod
```

## ✅ Verification

After deployment, verify:
- [ ] Site is accessible at your Vercel URL
- [ ] All animations are working
- [ ] Glass morphism effects render correctly
- [ ] Responsive design works on mobile
- [ ] No console errors in browser DevTools

## 🔄 Future Updates

To update your deployed site:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push

# Vercel will auto-deploy on push if GitHub integration is set up
# Or manually deploy:
vercel --prod
```

## 🆘 Troubleshooting

**Build fails on Vercel:**
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

**Styles not loading:**
- Clear browser cache
- Check that `globals.css` is imported in `layout.tsx`
- Verify Tailwind config is correct

**Need help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
