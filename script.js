/* ============================================
   PARTICLES + SCROLL ANIMATIONS + COUNTER
   ============================================ */

// ============ PARTICLE BACKGROUND ============
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(10, 132, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        const count = Math.min(Math.floor((w * h) / 15000), 80);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(10, 132, 255, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
    });

    init();
    animate();
})();


// ============ SCROLL REVEAL ============
(function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-card, .feature-item, .link-card, .links-group-title, ' +
        '.form-cta, .event-detail-card, .tutrain-hero-card, .tutrain-boards, .stats-row, .certifications, ' +
        '.video-card, .brochure-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                const el = entry.target;
                const siblings = [...el.parentElement.children].filter(child =>
                    revealElements instanceof NodeList ?
                        [...revealElements].includes(child) : false
                );
                const siblingIndex = siblings.indexOf(el);
                const delay = Math.max(siblingIndex, 0) * 80;

                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
})();


// ============ COUNTER ANIMATION ============
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                counters.forEach(c => animateCounter(c));
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    if (counters.length > 0) {
        observer.observe(counters[0].closest('.stats-row'));
    }
})();


// ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
// ============ VIDEO SOUND TOGGLE ============
(function initVideoSoundToggle() {
    document.querySelectorAll('.video-sound-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const wrapper = this.closest('.video-wrapper');
            const video = wrapper.querySelector('video');
            const icon = this.querySelector('i');

            if (video.muted) {
                // Mute all other videos first
                document.querySelectorAll('.video-wrapper video').forEach(v => {
                    if (v !== video) {
                        v.muted = true;
                        const otherBtn = v.closest('.video-wrapper').querySelector('.video-sound-btn');
                        if (otherBtn) {
                            otherBtn.classList.remove('unmuted');
                            otherBtn.querySelector('i').className = 'fas fa-volume-xmark';
                            const otherSpan = otherBtn.querySelector('span');
                            if (otherSpan) otherSpan.textContent = 'Tap to unmute';
                        }
                    }
                });

                video.muted = false;
                icon.className = 'fas fa-volume-high';
                this.classList.add('unmuted');
            } else {
                video.muted = true;
                icon.className = 'fas fa-volume-xmark';
                this.classList.remove('unmuted');
                const span = this.querySelector('span');
                if (span) span.textContent = 'Tap to unmute';
            }
        });
    });
})();


// ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
