(() => {
    class BackgroundAnimation extends HTMLElement {
        connectedCallback() {
            if (this.dataset.ready) return;
            this.dataset.ready = 'true';
            this.setAttribute('aria-hidden', 'true');
            this.innerHTML = `
                <div class="home-animated-background">
                    <div class="home-animated-background__mesh"></div>
                    <div class="home-animated-background__grid"></div>
                    <div class="home-animated-background__glow home-animated-background__glow--right"></div>
                    <div class="home-animated-background__glow home-animated-background__glow--left"></div>
                    <span class="home-animated-background__shape home-animated-background__shape--one"></span>
                    <span class="home-animated-background__shape home-animated-background__shape--two"></span>
                    <span class="home-animated-background__shape home-animated-background__shape--three"></span>
                </div>
            `;
        }
    }

    if (!customElements.get('background-animation')) {
        customElements.define('background-animation', BackgroundAnimation);
    }
})();
