# TOP DESIGN 🎨

> **Complete Design & Marketing Solutions** — Website Design, App Design, Digital Marketing, SEO, Interior Design & Printing Services

[![Deploy Status](https://github.com/YOUR_USERNAME/topdesign-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/topdesign-website/actions)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.topdesign.co.in)
![Uptime](https://img.shields.io/uptimerobot/status/m1234567890-abcdef1234567890abcdef12)

---

## 🌐 Live Website

**Production:** [https://www.topdesign.co.in](https://www.topdesign.co.in)

**Staging:** [https://staging.topdesign.co.in](https://staging.topdesign.co.in)

---

## 📋 Services Offered

| Service | Description | Link |
|---------|-------------|------|
| 🌐 **Website Design** | Custom, responsive websites | [View](https://www.topdesign.co.in/services/website-design) |
| 📱 **App Design** | iOS & Android UI/UX | [View](https://www.topdesign.co.in/services/app-design) |
| 📢 **Digital Marketing** | Social media, PPC, content | [View](https://www.topdesign.co.in/services/digital-marketing) |
| 🔍 **SEO Services** | Rank higher on Google | [View](https://www.topdesign.co.in/services/seo) |
| 🏠 **Interior Design** | Transform your spaces | [View](https://www.topdesign.co.in/services/interior-design) |
| 🖨️ **Printing Services** | Business cards, banners, more | [View](https://www.topdesign.co.in/services/printing) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/topdesign-website.git
cd topdesign-website

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
topdesign-website/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   │   ├── deploy.yml      # Main deployment workflow
│   │   └── pr-checks.yml   # PR validation
│   └── ISSUE_TEMPLATE/     # Issue templates
├── config/
│   └── database.js         # Database configuration
├── public/                 # Static assets
│   ├── index.html           # Main HTML
│   ├── css/
│   │   └── main.min.css     # Compiled styles
│   ├── js/
│   │   └── main.min.js      # Compiled scripts
│   └── images/              # Image assets
├── src/
│   ├── css/
│   │   └── main.css         # Source styles
│   ├── js/
│   │   └── main.js          # Source scripts
│   ├── views/               # View templates
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   └── utils/               # Utility functions
├── nginx/
│   └── nginx.conf           # Nginx configuration
├── server.js                # Express server
├── Dockerfile               # Docker image
├── docker-compose.yml       # Docker orchestration
├── ecosystem.config.js      # PM2 configuration
├── package.json
└── README.md
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Build optimized CSS & JS |
| `npm run build:css` | Compile and minify CSS |
| `npm run build:js` | Minify JavaScript |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and deploy with PM2 |
| `npm run logs` | View PM2 logs |
| `npm run stop` | Stop PM2 process |

---

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t topdesign .
docker run -p 3000:3000 -d topdesign
```

---

## ☁️ Deployment Platforms

### GitHub Pages (Free)
1. Go to **Settings → Pages**
2. Select **GitHub Actions** as source
3. Push to `main` branch — auto-deploys!

### Vercel (Free)
1. Install [Vercel GitHub App](https://github.com/apps/vercel)
2. Add secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
3. Auto-deploys on every push!

### Netlify (Free)
1. Install [Netlify GitHub App](https://github.com/apps/netlify)
2. Add secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
3. Auto-deploys with PR previews!

### AWS S3 + CloudFront
1. Add AWS credentials to repository secrets
2. Push to `main` — auto-deploys to S3 + CloudFront invalidation

### VPS / Dedicated Server
1. Add SSH key to `SSH_PRIVATE_KEY` secret
2. Add server details: `SERVER_HOST`, `SERVER_USER`, `SERVER_PORT`
3. Push to `main` — auto-deploys via SSH + PM2 restart

---

## 🔐 Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# Server
NODE_ENV=production
PORT=3000
DOMAIN=www.topdesign.co.in

# Email (for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=info@topdesign.co.in

# Security
JWT_SECRET=your-super-secret-jwt-key

# Optional: Database
# DATABASE_URL=mongodb://localhost:27017/topdesign
```

---

## 📞 Contact Information

| | |
|---|---|
| **Phone** | +91 92660 41927 |
| **Email** | [info@topdesign.co.in](mailto:info@topdesign.co.in) |
| **Address** | Dwarka, More, Delhi, India |
| **Website** | [www.topdesign.co.in](https://www.topdesign.co.in) |
| **Hours** | Mon - Sat: 9:00 AM - 7:00 PM |

---

## 📝 Admin Panel

Access the admin panel at `/admin`

**Default Credentials:**
- Username: `admin`
- Password: `topdesign2024`

> ⚠️ **Change default credentials immediately after first login!**

### Admin Features
- 📊 Dashboard with statistics
- 📥 Enquiry management (view, export CSV, mark read)
- 📝 Blog post creation & management
- 🖼️ Portfolio item management
- ⚙️ Website content editor
- 🔧 Settings & credentials

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern=contact

# Run with coverage
npm test -- --coverage
```

---

## 📊 Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Page Load:** < 2s on 3G
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 3s

---

## 🛡️ Security

- Helmet.js for security headers
- Rate limiting on API endpoints
- CORS configured
- XSS protection
- Content Security Policy
- Input validation
- SQL injection prevention (prepared statements)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Typography
- [Unsplash](https://unsplash.com/) - Stock images

---

<p align="center">
  <strong>TOP DESIGN</strong> — Design • Develop • Deliver
  <br>
  <sub>Made with ❤️ in Delhi, India</sub>
</p>
