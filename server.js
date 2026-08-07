/**
 * TOP DESIGN - Production Server
 * Express.js server for website deployment
 * Supports: Static files, API routes, Admin panel, Contact form handling
 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sendEnquiryEmail } = require('./lib/mailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust the first hop's X-Forwarded-For header so rate limiters key on the
// real client IP when the app runs behind Vercel, nginx, or any other proxy.
// Without this, every request appears to come from 127.0.0.1, which means
// Postman tests and browser submissions share the same rate-limit bucket and
// exhaust each other's quota.
app.set('trust proxy', 1);

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrcAttr: ["'none'"],
            workerSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            // 'self' covers same-origin fetch() calls in production (HTTPS).
            // In development the page is served over HTTP, so 'self' resolves to
            // http://localhost:3000 — but helmet also injects upgrade-insecure-requests
            // which causes some browsers to upgrade the fetch to HTTPS, then fail.
            // Listing the localhost origins explicitly avoids this CSP block.
            connectSrc: [
                "'self'",
                "http://localhost:3000",
                "http://localhost:5500",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5500",
                "https://gobiznessrocket.com",
                "https://www.gobiznessrocket.com",
                "https://gobiznessrocket.co.in",
                "https://www.gobiznessrocket.co.in",
            ],
            frameSrc: ["'none'"],
            // upgrade-insecure-requests is intentionally omitted: it causes browsers
            // to silently upgrade HTTP fetch() calls to HTTPS, which breaks local dev
            // (no TLS on localhost) and blocks the /api/contact fetch call with a
            // CSP violation even though the request is same-origin.
            upgradeInsecureRequests: NODE_ENV === 'production' ? [] : null,
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Resolve the allowed-origins list from the environment variable, falling back
// to every known production domain. Keeping 'null' covers file:// origins used
// during local HTML-only testing without a dev server.
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : [
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://gobiznessrocket.com',
        'https://www.gobiznessrocket.com',
        'https://gobiznessrocket.co.in',
        'https://www.gobiznessrocket.co.in',
      ];

const corsOptions = {
    // Allow requests where Origin matches the whitelist OR where no Origin
    // header is present (same-origin requests from the browser omit it).
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204   // IE11 chokes on 204; most browsers are fine
};

// Handle CORS preflight for every route before any other middleware touches it.
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Compression
app.use(compression({
    level: 6,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Write request logs to stdout so they are captured by Vercel without
// attempting to write to its read-only serverless filesystem.
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for contact form
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 submissions per IP per hour in production
    message: { error: 'Too many contact submissions. Please try again later.' },
    standardHeaders: true,  // send RateLimit-* headers so clients can see quota state
    legacyHeaders: false,
    // In development, skip the rate limit entirely so local testing and Postman
    // calls never consume the quota that the browser form depends on.
    skip: () => NODE_ENV !== 'production'
});

// ==================== STATIC FILES ====================

app.get('/sw.js', (req, res) => {
    res.type('application/javascript');
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: NODE_ENV === 'production' ? '1y' : 0,
    etag: true,
    lastModified: true
}));

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
        version: require('./package.json').version
    });
});

// Contact/Enquiry form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const fields = ['name', 'email', 'phone', 'service', 'budget', 'message'];
        const requestBody = req.body || {};
        const submitted = Object.fromEntries(fields.map(field => [
            field,
            typeof requestBody[field] === 'string' ? requestBody[field].trim() : ''
        ]));
        const { name, email, phone, service, budget, message } = submitted;

        // Validation
        if (!name || !email || !phone || !service || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['name', 'email', 'phone', 'service', 'message']
            });
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Phone validation (Indian format)
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        const maximumLengths = { name: 100, email: 254, phone: 30, service: 100, budget: 100, message: 5000 };
        const oversizedField = fields.find(field => submitted[field].length > maximumLengths[field]);
        if (oversizedField) {
            return res.status(400).json({ error: `${oversizedField} is too long` });
        }

        // Store enquiry (in production, use a database)
        const enquiry = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            service,
            budget: budget || 'Not specified',
            message,
            status: 'new',
            createdAt: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.headers['user-agent']
        };

        try {
            await sendEnquiryEmail(enquiry);
        } catch (error) {
            console.error('[contact] enquiry email delivery failed', {
                enquiryId: enquiry.id,
                code: error.code,
                stage: error.mailStage,
                smtpCode: error.smtpCode,
                responseCode: error.responseCode,
                smtpResponse: error.smtpResponse,
                command: error.command,
                diagnostics: error.diagnostics,
                message: error.message
            });
            const status = error.code === 'SMTP_NOT_CONFIGURED' ? 503 : 502;
            const response = {
                error: 'We could not send your enquiry right now. Please try again or contact us by phone.',
                referenceId: enquiry.id
            };

            // Local development can show the exact safe SMTP failure details in
            // the network response. Production keeps them in provider logs.
            if (NODE_ENV !== 'production') {
                response.debug = {
                    code: error.code,
                    stage: error.mailStage,
                    smtpCode: error.smtpCode,
                    responseCode: error.responseCode,
                    smtpResponse: error.smtpResponse,
                    diagnostics: error.diagnostics,
                    message: error.message
                };
            }

            return res.status(status).json(response);
        }

        // Vercel Functions have a read-only project filesystem. Locally, keep
        // a backup after SMTP has accepted the message.
        if (!process.env.VERCEL) {
            try {
                const fs = require('fs').promises;
                const dataPath = path.join(__dirname, 'data', 'enquiries.json');
                let enquiries = [];

                try {
                    const data = await fs.readFile(dataPath, 'utf8');
                    enquiries = JSON.parse(data);
                } catch (error) {
                    if (error.code !== 'ENOENT') throw error;
                }

                enquiries.unshift(enquiry);
                await fs.mkdir(path.dirname(dataPath), { recursive: true });
                await fs.writeFile(dataPath, JSON.stringify(enquiries, null, 2));
            } catch (error) {
                console.error('Enquiry backup failed:', error.message);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            enquiryId: enquiry.id,
            emailDelivered: true
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to submit enquiry. Please try again.' });
    }
});

// Get all enquiries (admin endpoint - add auth middleware in production)
app.get('/api/enquiries', (req, res) => {
    try {
        const fs = require('fs');
        const dataPath = path.join(__dirname, 'data', 'enquiries.json');

        if (!fs.existsSync(dataPath)) {
            return res.json([]);
        }

        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to load enquiries' });
    }
});

// Blog API
app.get('/api/blog', (req, res) => {
    try {
        const fs = require('fs');
        const dataPath = path.join(__dirname, 'data', 'blog.json');

        if (!fs.existsSync(dataPath)) {
            return res.json([]);
        }

        const data = fs.readFileSync(dataPath, 'utf8');
        const posts = JSON.parse(data);

        // Filter by category if provided
        const { category } = req.query;
        if (category) {
            return res.json(posts.filter(p => p.category.toLowerCase() === category.toLowerCase()));
        }

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load blog posts' });
    }
});

// Portfolio API
app.get('/api/portfolio', (req, res) => {
    try {
        const fs = require('fs');
        const dataPath = path.join(__dirname, 'data', 'portfolio.json');

        if (!fs.existsSync(dataPath)) {
            return res.json([]);
        }

        const data = fs.readFileSync(dataPath, 'utf8');
        const items = JSON.parse(data);

        const { category } = req.query;
        if (category && category !== 'all') {
            return res.json(items.filter(i => i.category === category));
        }

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load portfolio' });
    }
});

// ==================== SPA ROUTING ====================

// Serve main HTML for all routes (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(err.status || 500).json({
        error: NODE_ENV === 'production' ? 'Internal server error' : err.message,
        ...(NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ==================== START SERVER ====================

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   TOP DESIGN SERVER                                        ║
║   =================                                        ║
║   Environment: ${NODE_ENV.padEnd(30)}║
║   Port: ${PORT.toString().padEnd(39)}║
║   URL: http://localhost:${PORT.toString().padEnd(30)}║
║                                                            ║
║   Services:                                                ║
║   • Website Design                                         ║
║   • App Design                                             ║
║   • Digital Marketing                                      ║
║   • SEO Services                                           ║
║   • Interior Design                                        ║
║   • Printing Services                                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `);
    });
}

module.exports = app;
