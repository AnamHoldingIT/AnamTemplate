// اطمینان از آماده بودن DOM
document.addEventListener('DOMContentLoaded', () => {
    /* =========================
       1. اسکرول نوبار (کلاس scrolled)
       ========================= */
    const nav = document.getElementById('mainNav');

    const handleNavbarScroll = () => {
        if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);

    /* =========================
       2. اسکرول نرم + بستن منوی موبایل
       ========================= */
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const offcanvasEl = document.getElementById('offcanvasNavbar');

    let offcanvasInstance = null;
    if (offcanvasEl && typeof bootstrap !== 'undefined') {
        offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // فقط لینک‌های داخلی #...
            if (href && href.startsWith('#')) {
                const targetId = href.replace('#', '');
                const targetEl = document.getElementById(targetId);

                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // بستن منوی موبایل بعد از کلیک
            if (offcanvasInstance && window.innerWidth < 992) {
                offcanvasInstance.hide();
            }
        });
    });

    /* =========================
       3. انیمیشن کانترها (Metrics)
       ========================= */
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // هرچه کمتر، سرعت بیشتر

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    let hasRun = false;
    const metricsSection = document.getElementById('metrics');

    if (metricsSection && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasRun) {
                animateCounters();
                hasRun = true;
            }
        }, {
            threshold: 0.4
        });

        sectionObserver.observe(metricsSection);
    } else {
        // اگر IntersectionObserver نبود (مرورگر قدیمی)، مستقیم اجرا کن
        animateCounters();
    }
});
