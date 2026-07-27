# GitHub Pages Deployment Guide

## 🚀 Option 1: GitHub Pages (Free - Easiest)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `topdesign-website`
3. Description: `TOP DESIGN - Website Design, App Design, Digital Marketing, SEO, Interior Design & Printing Services`
4. Make it **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Upload Files

**Option A: Using Git Command Line**
```bash
cd topdesign-github
bash setup.sh
```

**Option B: Manual Upload**
1. Download the `topdesign-github` folder as ZIP
2. Extract it
3. Go to your GitHub repository
4. Click **"Add file" → "Upload files"**
5. Drag and drop all files
6. Commit with message: "Initial commit"

### Step 3: Enable GitHub Pages

1. Go to **Settings** tab in your repository
2. Scroll down to **Pages** section (left sidebar)
3. Under **Source**, select **"Deploy from a branch"**
4. Select **Branch: main** and **Folder: / (root)**
5. Click **Save**

Or use GitHub Actions (recommended):
1. Go to **Settings → Pages**
2. Under **Build and deployment**, select **"GitHub Actions"**
3. The workflow in `.github/workflows/deploy.yml` will auto-deploy

### Step 4: Access Your Website

Your site will be live at:
```
https://YOUR_USERNAME.github.io/topdesign-website
```

Example:
```
https://topdesignindia.github.io/topdesign-website
```

### Step 5: Custom Domain (www.topdesign.co.in)

1. In your repository, go to **Settings → Pages**
2. Under **Custom domain**, enter: `www.topdesign.co.in`
3. Click **Save**
4. GitHub will create a CNAME file automatically
5. Go to your domain registrar (where you bought topdesign.co.in)
6. Add DNS records:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** YOUR_USERNAME.github.io
   - **TTL:** 3600

7. Wait 5-10 minutes for DNS propagation
8. Enable **"Enforce HTTPS"** in GitHub Pages settings

---

## 🌐 Option 2: Vercel (Free - Best Performance)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your `topdesign-website` repository
5. Vercel auto-detects settings
6. Click **Deploy**

Your site will be live at:
```
https://topdesign-website.vercel.app
```

Add custom domain in Vercel dashboard:
1. Go to **Project Settings → Domains**
2. Add `www.topdesign.co.in`
3. Follow Vercel's DNS instructions

---

## 🌍 Option 3: Netlify (Free - Great Features)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Add new site" → "Import an existing project"**
4. Select your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `public`
6. Click **Deploy site**

Your site will be live at:
```
https://topdesign-website.netlify.app
```

---

## ☁️ Option 4: AWS S3 + CloudFront (Production)

1. Create S3 bucket: `topdesign-website`
2. Enable static website hosting
3. Upload `public/` folder contents
4. Create CloudFront distribution
5. Point to S3 bucket
6. Add SSL certificate via ACM

Cost: ~$1-5/month depending on traffic

---

## 🔧 Option 5: VPS / Dedicated Server (Full Control)

### Requirements:
- VPS with Ubuntu 20.04+ (DigitalOcean, Linode, AWS EC2)
- Domain pointed to server IP
- SSH access

### Quick Deploy:
```bash
# SSH into server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone repository
git clone https://github.com/YOUR_USERNAME/topdesign-website.git
cd topdesign-website

# Install dependencies
npm install

# Build assets
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Install Nginx
apt-get install -y nginx

# Copy Nginx config
cp nginx/nginx.conf /etc/nginx/sites-available/topdesign
ln -s /etc/nginx/sites-available/topdesign /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Setup SSL (Let's Encrypt)
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d www.topdesign.co.in -d topdesign.co.in
```

---

## 🐳 Option 6: Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ✅ Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All 6 service pages work
- [ ] Enquiry form submits
- [ ] Admin panel accessible at `/admin`
- [ ] Change default admin password
- [ ] SSL/HTTPS working
- [ ] Custom domain configured
- [ ] Google Analytics added
- [ ] Sitemap submitted to Google Search Console
- [ ] Social media meta tags working

---

## 📞 Support

Having issues? Contact us:
- **Email:** info@topdesign.co.in
- **Phone:** +91 92660 41927
- **Website:** www.topdesign.co.in
