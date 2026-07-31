(() => {
    const highlights = [
        ['fa-laptop-code', 'Websites that convert'],
        ['fa-mobile-screen-button', 'Useful mobile apps'],
        ['fa-bullhorn', 'Data-led marketing'],
        ['fa-magnifying-glass-chart', 'SEO built for visibility'],
        ['fa-shield-halved', 'Trusted by 500+ projects'],
        ['fa-people-group', 'One expert team'],
        ['fa-bolt', 'Fast, thoughtful delivery'],
        ['fa-star', '98% client satisfaction']
    ];

    const createItems = () => highlights.map(([icon, label]) => `
        <span class="inline-flex flex-none items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm sm:px-5">
            <i class="fas ${icon} text-amber-500" aria-hidden="true"></i>${label}
        </span>
    `).join('');

    class MarqueeSection extends HTMLElement {
        connectedCallback() {
            if (this.dataset.ready) return;
            this.dataset.ready = 'true';
            const items = createItems();
            this.innerHTML = `
                <section class="home-marquee" aria-label="Gobizness Rocket capabilities and achievements">
                    <p class="sr-only">Gobizness Rocket provides websites that convert, useful mobile apps, data-led marketing, SEO, fast delivery, and has delivered over 500 projects with 98 percent client satisfaction.</p>
                    <div class="home-marquee__viewport" aria-hidden="true">
                        <div class="home-marquee__track">
                            <div class="home-marquee__group">${items}</div>
                            <div class="home-marquee__group">${items}</div>
                        </div>
                    </div>
                </section>
            `;
        }
    }

    if (!customElements.get('marquee-section')) {
        customElements.define('marquee-section', MarqueeSection);
    }
})();
