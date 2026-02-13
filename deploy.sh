#!/bin/bash

echo "🚀 Spawn Deployment Helper"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Spawn agent reputation platform"
    echo "✅ Git repository initialized"
    echo ""
fi

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo "📥 Install it with: npm install -g vercel"
    echo ""
    read -p "Would you like to install Vercel CLI now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
    else
        echo "Skipping Vercel CLI installation"
    fi
fi

echo "Choose deployment option:"
echo "1. Deploy to Vercel (recommended)"
echo "2. Push to GitHub only"
echo "3. Both (GitHub + Vercel)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🌐 Deploying to Vercel..."
        vercel --prod
        ;;
    2)
        echo "📤 Pushing to GitHub..."
        read -p "Enter your GitHub username: " username
        read -p "Enter repository name (default: spawn-agent-reputation): " reponame
        reponame=${reponame:-spawn-agent-reputation}
        
        git remote add origin "https://github.com/$username/$reponame.git" 2>/dev/null || true
        git branch -M main
        git push -u origin main
        
        echo "✅ Pushed to GitHub!"
        echo "📝 Create the repository at: https://github.com/new"
        ;;
    3)
        echo "📤 Pushing to GitHub..."
        read -p "Enter your GitHub username: " username
        read -p "Enter repository name (default: spawn-agent-reputation): " reponame
        reponame=${reponame:-spawn-agent-reputation}
        
        git remote add origin "https://github.com/$username/$reponame.git" 2>/dev/null || true
        git branch -M main
        git push -u origin main
        
        echo "✅ Pushed to GitHub!"
        echo ""
        echo "🌐 Deploying to Vercel..."
        vercel --prod
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment complete!"
echo ""
