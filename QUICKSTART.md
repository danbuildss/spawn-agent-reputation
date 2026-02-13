# 🚀 Quick Deploy Guide

## Fastest Way to Deploy (2 minutes)

### Prerequisites
- Node.js 18+ installed
- GitHub account
- Vercel account (free - sign up with GitHub)

---

## Method 1: GitHub CLI + Vercel CLI (Recommended) ⚡

```bash
# 1. Navigate to project
cd spawn-agent-reputation

# 2. Install GitHub CLI (if needed)
# macOS: brew install gh
# Windows: winget install --id GitHub.cli
# Linux: sudo apt install gh

# 3. Login to GitHub
gh auth login

# 4. Create repo and push (one command!)
git init
git add .
git commit -m "Initial commit"
gh repo create spawn-agent-reputation --public --source=. --push

# 5. Install Vercel CLI
npm install -g vercel

# 6. Deploy to Vercel
vercel login
vercel --prod
```

**Done!** Your site is live at the URL shown in terminal.

---

## Method 2: GitHub Web + Vercel Dashboard (Most Visual) 🖱️

### Step 1: Push to GitHub

1. **Create repository on GitHub**:
   - Go to https://github.com/new
   - Name: `spawn-agent-reputation`
   - Make it Public
   - Click "Create repository"

2. **Push your code**:
   ```bash
   cd spawn-agent-reputation
   git init
   git add .
   git commit -m "Initial commit: Spawn platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/spawn-agent-reputation.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Click "Deploy" (settings auto-detected)
5. Wait ~2 minutes
6. **Live!** 🎉

---

## Method 3: Automated Script 🤖

```bash
cd spawn-agent-reputation
./deploy.sh
```

Follow the interactive prompts.

---

## 📋 Pre-Deployment Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Git installed (`git --version`)
- [ ] GitHub account created
- [ ] Vercel account created (vercel.com)

---

## 🌐 What You Get

After deployment:
- **Vercel URL**: `spawn-agent-reputation.vercel.app`
- **Auto-deploys**: Push to GitHub = auto-deploy
- **HTTPS**: Free SSL certificate
- **Edge Network**: Global CDN
- **Analytics**: Free basic analytics

---

## 🎨 Custom Domain (Optional)

1. Buy domain (e.g., Namecheap, GoDaddy)
2. In Vercel: Settings → Domains
3. Add your domain: `spawn.app`
4. Update DNS (Vercel shows exact records)
5. Wait 24-48 hours for DNS propagation

---

## 🔄 Making Updates

```bash
# Edit your files
git add .
git commit -m "Update: description of changes"
git push

# Auto-deploys to Vercel!
# Or force redeploy: vercel --prod
```

---

## ⚡ One-Liner Deploy

If you have gh and vercel CLIs installed:

```bash
gh repo create spawn-agent-reputation --public --source=. --push && vercel --prod
```

---

## 🆘 Common Issues

**"Permission denied"**
- Run: `chmod +x deploy.sh`

**"Command not found: gh"**
- Install GitHub CLI first

**"Command not found: vercel"**
- Run: `npm install -g vercel`

**Build fails on Vercel**
- Check Next.js version compatibility
- Ensure all dependencies in package.json

**Site looks broken**
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Check browser console for errors

---

## 📞 Need Help?

- GitHub: https://docs.github.com
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs

---

**Estimated Deploy Time**: 2-5 minutes total 🚀
