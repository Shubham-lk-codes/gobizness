# Vercel Deployment Guide for TOP DESIGN

## 🚀 Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Navigate to project directory
cd topdesign-github

# 4. Deploy (interactive setup)
vercel

# 5. Deploy to production
vercel --prod
```

### Option 2: Git Integration (Auto-Deploy)

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects settings from `vercel.json`
5. Click **Deploy**

### Option 3: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Import from GitHub
4. Framework preset: **Other**
5. Build command: `npm run build`
6. Output directory: `public`
7. Click **Deploy**

---

## ⚙️ Configuration

### vercel.json

The `vercel.json` file configures:
- **Routes:** SPA routing, API endpoints
- **Headers:** Security headers, caching
- **Redirects:** HTTP → HTTPS, www → non-www
- **Functions:** Serverless function settings

### Environment Variables

Add in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `DOMAIN` | `www.topdesign.co.in` | Production |
| `ADMIN_EMAIL` | `info@topdesign.co.in` | All |
| `SMTP_HOST` | your-smtp-host | Production |
| `SMTP_USER` | your-email | Production |
| `SMTP_PASS` | your-password | Production |

---

## 🌐 Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project → Settings → Domains
2. Add: `www.topdesign.co.in`
3. Vercel provides DNS records

### Step 2: Configure DNS

At your domain registrar (GoDaddy, Namecheap, etc.):

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B: A Record**
```
Type: A
Name: www
Value: 76.76.21.21
TTL: 3600
```

### Step 3: Verify

```bash
# Check DNS propagation
dig www.topdesign.co.in

# Or use online tool:
# https://www.whatsmydns.net
```

### Step 4: Enable HTTPS

Vercel automatically provisions SSL certificates via Let's Encrypt. Just enable:

Project → Settings → Domains → `www.topdesign.co.in` → **"Enable HTTPS"**

---

## 📊 Vercel Features Used

| Feature | Configuration |
|---------|--------------|
| **Serverless Functions** | `api/index.js` - Express adapter |
| **Edge Network** | Global CDN (70+ locations) |
| **Auto HTTPS** | Let's Encrypt SSL |
| **Preview Deployments** | Every PR gets a preview URL |
| **Analytics** | Built-in Web Analytics |
| **Speed Insights** | Real User Monitoring |
| **Image Optimization** | Next-Gen formats (WebP, AVIF) |
| **Cron Jobs** | Scheduled API calls |

---

## 🔧 API Endpoints on Vercel

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/contact` | POST | Submit enquiry |
| `/api/blog` | GET | List blog posts |
| `/api/portfolio` | GET | List portfolio |

---

## 🔄 CI/CD with GitHub

The `.github/workflows/deploy.yml` includes Vercel deployment:

```yaml
- name: Deploy to Vercel
  uses: vercel/action-deploy@v1
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Required Secrets:**
- `VERCEL_TOKEN` - Get from [vercel.com/tokens](https://vercel.com/tokens)
- `VERCEL_ORG_ID` - From `vercel teams list`
- `VERCEL_PROJECT_ID` - From project settings

---

## 📈 Monitoring

### Vercel Dashboard
- **Analytics:** Real-time traffic, performance
- **Speed Insights:** Core Web Vitals
- **Logs:** Function invocations, errors
- **Deployments:** Rollback to any version

### CLI Commands
```bash
# View logs
vercel logs

# View deployments
vercel list

# Inspect deployment
vercel inspect

# Rollback
vercel rollback
```

---

## 💰 Pricing

| Plan | Cost | Best For |
|------|------|----------|
| **Hobby** | FREE | Personal projects, testing |
| **Pro** | $20/mo | Commercial, team collaboration |
| **Enterprise** | Custom | Large scale, SLA |

**Free Tier Limits:**
- 100GB bandwidth/month
- 1000 serverless function invocations/day
- 10s serverless function duration
- 1 concurrent build

---

## 🆘 Troubleshooting

### Issue: "Command not found: vercel"
```bash
npm install -g vercel
# Or use npx
npx vercel
```

### Issue: "Deployment failed"
```bash
# Check build logs
vercel --debug

# Verify vercel.json syntax
npx jsonlint vercel.json
```

### Issue: "Custom domain not working"
1. Check DNS propagation: `dig www.topdesign.co.in`
2. Verify CNAME value: `cname.vercel-dns.com`
3. Wait 24-48 hours for full propagation
4. Check Vercel dashboard for DNS errors

### Issue: "API not responding"
```bash
# Test locally
vercel dev

# Check function logs
vercel logs --all
```

---

## 📞 Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **TOP DESIGN:** info@topdesign.co.in | +91 92660 41927
