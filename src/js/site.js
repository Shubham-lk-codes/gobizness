(() => {
  const onReady = callback => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
  };

  onReady(() => {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuButton');
    const navLinks = document.getElementById('navLinks');
    const navSubmenuTriggers = document.querySelectorAll('.nav-submenu-trigger');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    const updateNavigation = () => {
      const currentScrollY = window.scrollY;
      navbar?.classList.toggle('scrolled', currentScrollY > 24);
      navbar?.classList.toggle('nav-hidden', currentScrollY > lastScrollY && currentScrollY > 180);
      lastScrollY = currentScrollY;
      const progress = document.getElementById('scrollProgressBar');
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = `${maxScroll > 0 ? currentScrollY / maxScroll * 100 : 0}%`;
      scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateNavigation);
        scrollTicking = true;
      }
    }, { passive: true });
    updateNavigation();

    mobileMenuBtn?.addEventListener('click', () => {
      const isOpen = navLinks?.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', String(Boolean(isOpen)));
      mobileMenuBtn.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });

    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
      navLinks?.classList.remove('active');
      mobileMenuBtn?.setAttribute('aria-expanded', 'false');
      const icon = mobileMenuBtn?.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }));

    navSubmenuTriggers.forEach(trigger => trigger.addEventListener('click', event => {
      event.preventDefault();
      const dropdown = trigger.closest('.nav-dropdown');
      const willOpen = !dropdown.classList.contains('is-open');
      navSubmenuTriggers.forEach(other => {
        other.closest('.nav-dropdown').classList.remove('is-open');
        other.setAttribute('aria-expanded', 'false');
      });
      dropdown.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    }));

    document.addEventListener('click', event => {
      if (event.target.closest('.nav-dropdown')) return;
      navSubmenuTriggers.forEach(trigger => {
        trigger.closest('.nav-dropdown').classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    if ('IntersectionObserver' in window) {
      const primaryNavLinks = Array.from(document.querySelectorAll('#navLinks > li > a[href^="#"], #navLinks .nav-menu-link'));
      const navigationSpy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          primaryNavLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        });
      }, { rootMargin: '-35% 0px -57% 0px', threshold: 0 });
      document.querySelectorAll('#mainContent > section[id]').forEach(section => navigationSpy.observe(section));
    }

    const portfolioItems = [
      { title: 'E-commerce Website', category: 'web', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80' },
      { title: 'Fitness App', category: 'app', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&crop=center' },
      { title: 'Social Media Campaign', category: 'marketing', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80' },
      { title: 'Office Interior', category: 'interior', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=400&fit=crop&crop=center' },
      { title: 'Branding Brochure', category: 'print', image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80' },
      { title: 'Corporate Website', category: 'web', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop&crop=center' }
    ];
    const portfolioGrid = document.getElementById('portfolioGrid');
    const renderPortfolio = filter => {
      if (!portfolioGrid) return;
      const items = filter === 'all' ? portfolioItems : portfolioItems.filter(item => item.category === filter);
      portfolioGrid.innerHTML = items.map(item => `
        <article class="portfolio-item">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <div class="portfolio-overlay"><h3>${item.title}</h3><p>${item.category[0].toUpperCase() + item.category.slice(1)}</p></div>
          <span class="portfolio-tag">${item.category}</span>
        </article>`).join('');
    };
    document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      renderPortfolio(button.dataset.filter);
      requestAnimationFrame(refreshRevealAnimations);
    }));
    renderPortfolio('all');

    const testimonials = [
      { name: 'Priya Sharma', role: 'CEO, TechStart', text: 'Gobizness Rocket transformed our online presence. Our website traffic increased by 200% in just 3 months!', rating: 5 },
      { name: 'Rahul Verma', role: 'Founder, DesignStudio', text: 'The app design they delivered was beyond our expectations. Our users love the new interface.', rating: 5 },
      { name: 'Ananya Patel', role: 'Marketing Head, BrandLabs', text: 'Their digital marketing strategies are data-driven and highly effective. We saw a 150% ROI in the first quarter.', rating: 5 }
    ];
    const track = document.getElementById('testimonialsTrack');
    const dots = document.getElementById('sliderNav');
    let currentSlide = 0;
    const goToSlide = index => {
      if (!track || !dots) return;
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.querySelectorAll('.slider-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentSlide));
    };
    if (track && dots) {
      track.innerHTML = testimonials.map(item => `
        <article class="testimonial-card">
          <div class="testimonial-avatar">${item.name.charAt(0)}</div><div class="testimonial-rating">${'★'.repeat(item.rating)}</div>
          <p class="testimonial-text">“${item.text}”</p><div class="testimonial-author">${item.name}</div><div class="testimonial-role">${item.role}</div>
        </article>`).join('');
      dots.innerHTML = testimonials.map((_, index) => `<button class="slider-dot ${index === 0 ? 'active' : ''}" type="button" aria-label="Show testimonial ${index + 1}"></button>`).join('');
      dots.querySelectorAll('.slider-dot').forEach((dot, index) => dot.addEventListener('click', () => goToSlide(index)));
      if (!reduceMotion) setInterval(() => goToSlide((currentSlide + 1) % testimonials.length), 5000);
    }

    const blogPosts = [
      { title: '10 Web Design Trends for 2024', category: 'Design', excerpt: 'Stay ahead with the latest web design trends that are shaping the digital landscape.', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop&crop=center' },
      { title: 'The Ultimate Guide to App UX', category: 'App Design', excerpt: 'Learn the principles of creating intuitive and engaging mobile app experiences.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&crop=center' },
      { title: 'SEO Strategies That Work', category: 'Marketing', excerpt: 'Discover proven SEO techniques to boost your search rankings and drive organic traffic.', image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&h=400&fit=crop&crop=center' }
    ];
    const blogGrid = document.getElementById('blogGrid');
    if (blogGrid) blogGrid.innerHTML = blogPosts.map(post => `
      <article class="blog-card"><div class="blog-image"><img src="${post.image}" alt="${post.title}" loading="lazy"><span class="blog-category">${post.category}</span></div>
      <div class="blog-content"><div class="blog-meta"><span><i class="far fa-calendar-alt"></i> Jan 15, 2024</span><span><i class="far fa-clock"></i> 5 min read</span></div><h3>${post.title}</h3><p>${post.excerpt}</p><a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a></div></article>`).join('');

    const popup = document.getElementById('enquiryPopup');
    const form = document.getElementById('enquiryForm');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const openPopup = () => {
      popup?.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closePopup = () => {
      popup?.classList.remove('active');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.js-open-enquiry').forEach(button => button.addEventListener('click', openPopup));
    document.getElementById('closeEnquiryButton')?.addEventListener('click', closePopup);
    popup?.addEventListener('click', event => { if (event.target === popup) closePopup(); });
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.error || 'We could not send your enquiry. Please try again.');
        }

        if (toastMessage) toastMessage.textContent = "Enquiry sent successfully! We'll contact you soon.";
        toast?.classList.add('show');
        window.setTimeout(() => toast?.classList.remove('show'), 4000);
        closePopup();
        form.reset();
      } catch (error) {
        if (toastMessage) toastMessage.textContent = error.message || 'We could not send your enquiry. Please try again.';
        toast?.classList.add('show');
        window.setTimeout(() => toast?.classList.remove('show'), 5000);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      closePopup();
      navLinks?.classList.remove('active');
      mobileMenuBtn?.setAttribute('aria-expanded', 'false');
      const icon = mobileMenuBtn?.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
      navSubmenuTriggers.forEach(trigger => {
        trigger.closest('.nav-dropdown').classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    const revealSelector = '.section-header, .portfolio-filter, .service-card, .portfolio-item, .testimonial-card, .blog-card, .cta-content, .footer-column, .footer-brand';
    const observer = !reduceMotion && 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed', 'visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px' }) : null;
    function refreshRevealAnimations() {
      document.querySelectorAll(revealSelector).forEach((element, index) => {
        if (element.classList.contains('reveal-ready') || element.classList.contains('revealed')) return;
        element.classList.add('reveal-ready');
        element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
        if (observer) observer.observe(element);
        else element.classList.add('revealed', 'visible');
      });
    }
    refreshRevealAnimations();

    const counterObserver = !reduceMotion && 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.75 }) : null;
    const animateCounter = counter => {
      const target = Number(counter.dataset.count || 0);
      const suffix = counter.dataset.suffix || '';
      if (!target || reduceMotion) { counter.textContent = `${target}${suffix}`; return; }
      const startedAt = performance.now();
      const tick = now => {
        const progress = Math.min((now - startedAt) / 1050, 1);
        counter.textContent = `${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    document.querySelectorAll('[data-count]').forEach(counter => counterObserver ? counterObserver.observe(counter) : animateCounter(counter));
  });
})();
