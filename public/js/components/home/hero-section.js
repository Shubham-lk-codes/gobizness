(() => {
    class HeroSection extends HTMLElement {
        connectedCallback() {
            if (this.dataset.ready) return;
            this.dataset.ready = 'true';
            this.innerHTML = `
                <section class="hero home-hero relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#061a3c] px-0 pb-20 pt-36 md:min-h-[52rem] md:pb-28 md:pt-44" id="home" aria-labelledby="home-hero-title">
                    <background-animation></background-animation>
                    <div class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-12 lg:px-8">
                        <div class="home-hero__content max-w-3xl">
                            <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-100 shadow-lg shadow-slate-950/10 backdrop-blur-sm">
                                <i class="fas fa-wand-magic-sparkles text-amber-300" aria-hidden="true"></i>
                                Strategy, design &amp; growth
                            </p>
                            <h1 class="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]" id="home-hero-title">
                                Build a brand people <span class="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">choose first.</span>
                            </h1>
                            <p class="mt-7 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg sm:leading-8">
                                Gobizness Rocket brings strategic websites, high-performing apps, and measurable marketing together to turn attention into lasting business growth.
                            </p>
                            <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <a class="home-hero__primary relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-amber-200 to-amber-400 px-7 py-4 text-sm font-extrabold text-[#071a36] shadow-xl shadow-amber-400/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-300/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200" href="#services">
                                    <span class="relative z-10"><i class="fas fa-rocket mr-2" aria-hidden="true"></i>Explore services</span>
                                </a>
                                <a class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#portfolio">
                                    <i class="fas fa-arrow-up-right-from-square text-amber-300" aria-hidden="true"></i>
                                    See our work
                                </a>
                            </div>
                            <dl class="mt-11 grid max-w-2xl grid-cols-3 border-t border-white/15 pt-6 text-white sm:mt-14 sm:pt-8">
                                <div class="border-r border-white/10 pr-3 sm:pr-6">
                                    <dt class="text-xs font-medium leading-5 text-slate-300 sm:text-sm">Projects delivered</dt>
                                    <dd class="mt-1 text-2xl font-extrabold tracking-[-0.05em] text-amber-300 sm:text-3xl" data-count="500" data-suffix="+">500+</dd>
                                </div>
                                <div class="border-r border-white/10 px-3 sm:px-6">
                                    <dt class="text-xs font-medium leading-5 text-slate-300 sm:text-sm">Client satisfaction</dt>
                                    <dd class="mt-1 text-2xl font-extrabold tracking-[-0.05em] text-amber-300 sm:text-3xl" data-count="98" data-suffix="%">98%</dd>
                                </div>
                                <div class="pl-3 sm:pl-6">
                                    <dt class="text-xs font-medium leading-5 text-slate-300 sm:text-sm">Years of experience</dt>
                                    <dd class="mt-1 text-2xl font-extrabold tracking-[-0.05em] text-amber-300 sm:text-3xl" data-count="10" data-suffix="+">10+</dd>
                                </div>
                            </dl>
                        </div>

                        <aside class="home-hero__signal relative hidden min-h-[31rem] items-center justify-center lg:flex" aria-label="Our digital growth expertise">
                            <div class="home-hero__signal-ring" aria-hidden="true"></div>
                            <div class="home-hero__signal-panel relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/25 p-7 backdrop-blur-xl">
                                <div class="flex items-center justify-between border-b border-white/10 pb-5">
                                    <div>
                                        <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Growth system</p>
                                        <p class="mt-1 text-xl font-bold text-white">Designed to perform</p>
                                    </div>
                                    <span class="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-lg text-[#071a36] shadow-lg shadow-amber-300/20"><i class="fas fa-chart-line" aria-hidden="true"></i></span>
                                </div>
                                <div class="mt-7 grid grid-cols-2 gap-3">
                                    <div class="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
                                        <i class="fas fa-pen-ruler text-amber-300" aria-hidden="true"></i>
                                        <p class="mt-5 text-sm font-bold text-white">Strategic design</p>
                                        <p class="mt-1 text-xs leading-5 text-slate-300">Clear, compelling touchpoints.</p>
                                    </div>
                                    <div class="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
                                        <i class="fas fa-bolt text-amber-300" aria-hidden="true"></i>
                                        <p class="mt-5 text-sm font-bold text-white">Smart execution</p>
                                        <p class="mt-1 text-xs leading-5 text-slate-300">Fast, reliable digital delivery.</p>
                                    </div>
                                </div>
                                <div class="mt-5 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-400/20 to-amber-300/10 p-4">
                                    <div class="flex items-center justify-between text-xs font-semibold text-slate-200"><span>Momentum score</span><span class="text-amber-300">98 / 100</span></div>
                                    <div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><span class="block h-full w-[98%] rounded-full bg-gradient-to-r from-blue-300 via-sky-300 to-amber-300"></span></div>
                                </div>
                            </div>
                            <div class="home-hero__signal-chip absolute -left-3 top-[17%] rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-[#071a36] backdrop-blur">
                                <p class="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-slate-500">Visibility</p>
                                <p class="mt-1 text-sm font-extrabold"><i class="fas fa-arrow-trend-up mr-1 text-emerald-500" aria-hidden="true"></i>Built to grow</p>
                            </div>
                            <div class="home-hero__signal-chip home-hero__signal-chip--delayed absolute -bottom-2 right-0 rounded-2xl border border-white/15 bg-[#0a2f68]/95 px-4 py-3 text-white backdrop-blur">
                                <p class="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-blue-200">One expert team</p>
                                <p class="mt-1 text-sm font-extrabold"><i class="fas fa-check-circle mr-1 text-amber-300" aria-hidden="true"></i>From idea to impact</p>
                            </div>
                        </aside>
                    </div>
                </section>
            `;
        }
    }

    if (!customElements.get('hero-section')) {
        customElements.define('hero-section', HeroSection);
    }
})();
