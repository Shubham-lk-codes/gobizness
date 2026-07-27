/**
 * TOP DESIGN - Main JavaScript
 * Production-ready client-side functionality
 */

// ==================== DATA ====================
const SERVICES_DATA = [
    { id: 'web', title: 'Website Design', icon: 'fa-laptop-code', color: 'web', desc: 'Custom, responsive websites that captivate visitors and convert them into customers with modern UX/UI.', features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'CMS Integration'] },
    { id: 'app', title: 'App Design', icon: 'fa-mobile-alt', color: 'app', desc: 'Intuitive mobile app interfaces for iOS and Android that users love to interact with daily.', features: ['iOS & Android', 'UI/UX Design', 'Prototyping', 'User Testing'] },
    { id: 'marketing', title: 'Digital Marketing', icon: 'fa-bullhorn', color: 'marketing', desc: 'Data-driven marketing campaigns that increase visibility, engagement, and ROI across all channels.', features: ['Social Media', 'PPC Campaigns', 'Content Strategy', 'Analytics'] },
    { id: 'seo', title: 'SEO Services', icon: 'fa-search', color: 'seo', desc: 'Rank higher on Google with our proven SEO strategies that drive organic traffic and leads.', features: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Technical SEO'] },
    { id: 'interior', title: 'Interior Design', icon: 'fa-couch', color: 'interior', desc: 'Transform spaces into stunning environments with our creative interior design solutions.', features: ['3D Visualization', 'Space Planning', 'Material Selection', 'Project Management'] },
    { id: 'print', title: 'Printing Services', icon: 'fa-print', color: 'print', desc: 'High-quality printing for all your business needs from business cards to large format banners.', features: ['Business Cards', 'Brochures & Flyers', 'Large Format', 'Packaging'] }
];

const TESTIMONIALS_DATA = [
    { id: 1, name: 'Vikram Singh', role: 'CEO, TechStart India', text: 'TOP DESIGN transformed our online presence completely. Our website traffic increased by 300% within 3 months. Highly recommended!', rating: 5 },
    { id: 2, name: 'Ananya Gupta', role: 'Marketing Director, StyleHub', text: 'The team at TOP DESIGN is incredibly talented. They understood our vision and delivered a stunning website that perfectly represents our brand.', rating: 5 },
    { id: 3, name: 'Rajesh Khanna', role: 'Owner, Khanna Interiors', text: 'Outstanding interior design services! They transformed our office space into a modern, functional environment. The 3D visualization was spot on.', rating: 5 },
    { id: 4, name: 'Meera Patel', role: 'Founder, Organic Foods', text: 'Their SEO services helped us rank on the first page of Google for our key terms. Sales have increased by 150% since we started working with them.', rating: 5 },
    { id: 5, name: 'Arjun Reddy', role: 'CTO, FinApp Solutions', text: 'The app design they created for us is intuitive and beautiful. User engagement increased by 200% after the redesign. Exceptional work!', rating: 5 }
];

let currentTestimonial = 0;
let testimonialInterval;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    renderServices();
    renderPortfolio();
    renderTestimonials();
    renderBlog();
    setupNavbar();
    setupScrollAnimations();
    setupTestimonialSlider();
    setupPortfolioFilter();
    setupPopup();
    setupServicePages();
    setupInteractions();
});

// ==================== PARTICLES ====================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 15 + 5}px;
            height: ${Math.random() * 15 + 5}px;
            animation-delay: ${Math.random() * 15}s;
            animation-duration: ${Math.random() * 10 + 10}s;
        `;
        container.appendChild(particle);
    }
}

// ==================== NAVBAR ====================
function setupNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function toggleMenu() {
    document.getElementById('navLinks')?.classList.toggle('active');
}

// ==================== SCROLL ANIMATIONS ====================
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ==================== SERVICES ====================
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    grid.innerHTML = SERVICES_DATA.map(service => `
        <div class="service-card fade-in">
            <div class="service-icon ${service.color}"><i class="fas ${service.icon}"></i></div>
            <h3>${service.title}</h3>
            <p>${service.desc}</p>
            <ul class="service-features">
                ${service.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
            </ul>
            <a href="/services/${service.id}" class="service-link" data-service-id="${service.id}">Learn More <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');
}

// ==================== PORTFOLIO ====================
function renderPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    fetch('/api/portfolio')
        .then(r => r.json())
        .then(items => {
            grid.innerHTML = items.map(item => `
                <div class="portfolio-item" data-category="${item.category}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <span class="portfolio-tag">${item.category.toUpperCase()}</span>
                    <div class="portfolio-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');
        })
        .catch(() => {
            // Fallback static data
            const fallbackItems = [
                { title: 'TechCorp Website', category: 'web', description: 'Corporate website redesign', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' },
                { title: 'Fitness App UI', category: 'app', description: 'Mobile fitness tracking app', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800' },
                { title: 'Brand Campaign', category: 'marketing', description: 'Social media marketing campaign', image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800' },
                { title: 'E-commerce SEO', category: 'marketing', description: 'SEO optimization for online store', image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=800' },
                { title: 'Modern Apartment', category: 'interior', description: '3BHK interior design project', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' },
                { title: 'Business Cards', category: 'print', description: 'Premium business card design', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800' },
                { title: 'Restaurant Website', category: 'web', description: 'Food & dining website', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800' },
                { title: 'Banking App', category: 'app', description: 'Mobile banking interface', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800' },
                { title: 'Office Interior', category: 'interior', description: 'Corporate office redesign', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' }
            ];
            grid.innerHTML = fallbackItems.map(item => `
                <div class="portfolio-item" data-category="${item.category}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <span class="portfolio-tag">${item.category.toUpperCase()}</span>
                    <div class="portfolio-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');
        });
}

function setupPortfolioFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;

            document.querySelectorAll('.portfolio-item').forEach(item => {
                const show = filter === 'all' || item.dataset.category === filter;
                item.style.display = show ? 'block' : 'none';
                if (show) {
                    item.style.animation = 'none';
                    item.offsetHeight; // Trigger reflow
                    item.style.animation = 'fadeIn 0.5s ease';
                }
            });
        });
    });
}

// ==================== TESTIMONIALS ====================
function renderTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const nav = document.getElementById('sliderNav');
    if (!track || !nav) return;

    track.innerHTML = TESTIMONIALS_DATA.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-avatar">${t.name.charAt(0)}</div>
            <div class="testimonial-rating">${'★'.repeat(t.rating)}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author">${t.name}</div>
            <div class="testimonial-role">${t.role}</div>
        </div>
    `).join('');

    nav.innerHTML = TESTIMONIALS_DATA.map((_, i) => `
        <button class="slider-dot ${i === 0 ? 'active' : ''}" type="button" data-testimonial-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>
    `).join('');
}

function setupTestimonialSlider() {
    testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % TESTIMONIALS_DATA.length;
        updateTestimonialSlider();
    }, 5000);
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialSlider();
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % TESTIMONIALS_DATA.length;
        updateTestimonialSlider();
    }, 5000);
}

function updateTestimonialSlider() {
    const track = document.getElementById('testimonialsTrack');
    const dots = document.querySelectorAll('.slider-dot');
    if (track) track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentTestimonial));
}

// ==================== BLOG ====================
function renderBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    fetch('/api/blog')
        .then(r => r.json())
        .then(posts => {
            grid.innerHTML = posts.slice(0, 6).map(post => createBlogCard(post)).join('');
        })
        .catch(() => {
            // Fallback data
            const fallbackPosts = [
                { id: 1, title: '10 Web Design Trends to Watch in 2024', category: 'Design', author: 'TOP DESIGN Team', date: '2024-07-10', excerpt: 'Discover the latest trends shaping the future of web design, from AI-powered interfaces to immersive 3D experiences.', image: 'https://images.unsplash.com/photo-1468056709990-75f315717b99?w=800' },
                { id: 2, title: 'The Complete Guide to SEO in 2024', category: 'SEO', author: 'Rajesh Verma', date: '2024-07-08', excerpt: 'Learn how to optimize your website for search engines with our comprehensive guide to modern SEO strategies.', image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=800' },
                { id: 3, title: 'Digital Marketing Strategies for Small Business', category: 'Marketing', author: 'Priya Sharma', date: '2024-07-05', excerpt: 'Effective and budget-friendly digital marketing tactics that can help small businesses grow their online presence.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' },
                { id: 4, title: 'Interior Design Tips for Modern Homes', category: 'Interior', author: 'Design Team', date: '2024-07-01', excerpt: 'Transform your living space with these expert interior design tips that blend aesthetics with functionality.', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' },
                { id: 5, title: 'Mobile App UI Design Best Practices', category: 'Design', author: 'Tech Team', date: '2024-06-28', excerpt: 'Create user-friendly mobile app interfaces with these proven design principles and best practices.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800' },
                { id: 6, title: 'Print Marketing in the Digital Age', category: 'Printing', author: 'Marketing Team', date: '2024-06-25', excerpt: 'Why print marketing still matters and how to integrate it with your digital strategy for maximum impact.', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800' }
            ];
            grid.innerHTML = fallbackPosts.map(post => createBlogCard(post)).join('');
        });
}

function createBlogCard(post) {
    return `
        <div class="blog-card">
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="blog-category">${post.category}</span>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="fas fa-calendar"></i> ${post.date}</span>
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="/blog/${post.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `;
}

// ==================== ENQUIRY POPUP ====================
function setupPopup() {
    const popup = document.getElementById('enquiryPopup');
    if (!popup) return;

    popup.addEventListener('click', (e) => {
        if (e.target === popup) closeEnquiry();
    });
}

function setupInteractions() {
    document.getElementById('mobileMenuButton')?.addEventListener('click', toggleMenu);
    document.getElementById('closeEnquiryButton')?.addEventListener('click', closeEnquiry);
    document.getElementById('enquiryForm')?.addEventListener('submit', submitEnquiry);

    document.addEventListener('click', (event) => {
        const openButton = event.target.closest('.js-open-enquiry');
        if (openButton) {
            event.preventDefault();
            openEnquiry();
            return;
        }

        const serviceLink = event.target.closest('[data-service-id]');
        if (serviceLink) {
            event.preventDefault();
            showService(serviceLink.dataset.serviceId);
            return;
        }

        const testimonialButton = event.target.closest('[data-testimonial-index]');
        if (testimonialButton) {
            goToTestimonial(Number(testimonialButton.dataset.testimonialIndex));
            return;
        }

        if (event.target.closest('[data-action="home"]')) {
            event.preventDefault();
            showHome();
        }
    });
}

function openEnquiry() {
    document.getElementById('enquiryPopup')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEnquiry() {
    document.getElementById('enquiryPopup')?.classList.remove('active');
    document.body.style.overflow = '';
}

async function submitEnquiry(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const submitButton = form.querySelector('[type="submit"]');

    if (submitButton) submitButton.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.emailDelivered) {
            form.reset();
            closeEnquiry();
            showToast('Enquiry sent successfully! We will contact you soon.');
        } else {
            showToast(result.error || 'Failed to send. Please try again.');
        }
    } catch (err) {
        showToast('Unable to send your enquiry. Check your connection and try again.');
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

// ==================== SERVICE PAGES ====================
function setupServicePages() {
    const container = document.getElementById('servicePages');
    if (!container) return;

    const servicePagesHtml = SERVICES_DATA.map(service => `
        <div class="service-page" id="service-${service.id}">
            <div class="service-hero">
                <h1>${service.title}</h1>
                <p>${service.desc}</p>
            </div>
            <div class="service-content">
                <a href="#home" class="back-btn" data-action="home"><i class="fas fa-arrow-left"></i> Back to Home</a>
                <h2 style="font-size: 36px; color: var(--primary); margin-bottom: 20px;">Why Choose Our ${service.title}?</h2>
                <p style="color: var(--text-light); line-height: 1.8; margin-bottom: 40px; font-size: 18px;">We provide top-notch ${service.title.toLowerCase()} services tailored to your specific needs and business goals.</p>
                <div class="service-features-grid">
                    ${service.features.map((feature, i) => `
                        <div class="feature-box">
                            <i class="fas fa-star"></i>
                            <h3>${feature}</h3>
                            <p>Professional ${feature.toLowerCase()} services delivered with excellence and attention to detail.</p>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; padding: 60px 0;">
                    <h2 style="font-size: 36px; color: var(--primary); margin-bottom: 20px;">Ready to Get Started?</h2>
                    <p style="color: var(--text-light); margin-bottom: 30px; font-size: 18px;">Let's discuss your ${service.title.toLowerCase()} project today.</p>
                    <button class="btn-primary js-open-enquiry" type="button" style="font-size: 16px;"><i class="fas fa-paper-plane"></i> Get a Quote</button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = servicePagesHtml;
}

function showService(serviceId) {
    document.getElementById('mainContent').style.display = 'none';
    document.querySelectorAll('.service-page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('service-' + serviceId);
    if (page) {
        page.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function showHome() {
    document.querySelectorAll('.service-page').forEach(p => p.classList.remove('active'));
    document.getElementById('mainContent').style.display = 'block';
    window.scrollTo(0, 0);
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEnquiry();
    }
});

// ==================== PERFORMANCE ====================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Register service worker for offline support (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered:', reg))
            .catch(err => console.log('SW registration failed:', err));
    });
}
