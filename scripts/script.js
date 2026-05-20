const root = document.documentElement;
const loader = document.querySelector('.loader');
const themeToggle = document.querySelector('.theme-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const backToTop = document.querySelector('.back-to-top');
const statusMessage = document.getElementById('status-message');
const statusTime = document.getElementById('status-time');

const STATUS_LINES = [
    'Building the next thing',
    'Open to internships & collabs',
    'RIT · Game Design and Development',
    'Shipped on Heroku',
];

let statusIndex = 0;

function initLoader() {
    document.body.classList.add('is-loading');
    window.setTimeout(() => {
        loader?.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
    }, 950);
}

function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', saved);

    themeToggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMobileMenu();
        });
    });
}

function initMobileMenu() {
    mobileMenuBtn?.addEventListener('click', () => {
        const isOpen = mobileMenuBtn.classList.toggle('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        if (mobileMenu) mobileMenu.hidden = !isOpen;
    });
}

function closeMobileMenu() {
    mobileMenuBtn?.classList.remove('is-open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    if (mobileMenu) mobileMenu.hidden = true;
}

function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (!backToTop) return;
        backToTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
}

function initStatusBar() {
    const updateClock = () => {
        if (!statusTime) return;
        const now = new Date();
        statusTime.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const rotateMessage = () => {
        if (!statusMessage) return;
        statusIndex = (statusIndex + 1) % STATUS_LINES.length;
        statusMessage.textContent = STATUS_LINES[statusIndex];
    };

    updateClock();
    window.setInterval(updateClock, 30_000);
    window.setInterval(rotateMessage, 5000);
}

function initReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll(
        '.hub-card, .about-panel, .featured-project, .project-card, .section-header'
    );

    if (prefersReduced) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    targets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
}

function initAcademicFilters() {
    const section = document.getElementById('academic');
    if (!section) return;

    const filterButtons = section.querySelectorAll('.filter-btn');
    const projectCards = section.querySelectorAll('.project-card');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const categories = card.getAttribute('data-category')?.split(' ') || [];
                const show = filterValue === 'all' || categories.includes(filterValue);
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
}

initLoader();
initTheme();
initSmoothScroll();
initMobileMenu();
initBackToTop();
initStatusBar();
initReveal();
initAcademicFilters();
