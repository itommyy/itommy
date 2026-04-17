/**
 * iTommy - CORE JS
 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- NAVIGATION LOGIC ---
    const hamburger = document.getElementById('hamburger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const openMenu = () => {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.add('is-active');
        mobileMenu.classList.add('is-open');
        body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
        if (!hamburger || !mobileMenu) return;
        const isOpen = mobileMenu.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- SMOOTH SCROLLING ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // --- FORM HANDLING ---
    const contactForm = document.getElementById('main-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"], button');
            if (!submitBtn) return;

            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Odesílám poptávku...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Děkuji za zprávu. Vaše poptávka byla úspěšně odeslána a brzy se vám ozvu.');
                    contactForm.reset();
                } else {
                    alert('Jejda! Při odesílání formuláře došlo k chybě. Zkuste to prosím znovu.');
                }
            } catch (error) {
                alert('Došlo k chybě připojení. Zkontrolujte prosím připojení k internetu.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- COOKIE CONSENT ---
    const cookieBox = document.getElementById('cookie-box');
    const cookieBtn = document.getElementById('cookie-btn');
    const cookieStorageKey = 'itommy_cookies_accepted';

    if (cookieBox && cookieBtn) {
        if (!localStorage.getItem(cookieStorageKey)) {
            setTimeout(() => {
                cookieBox.style.display = 'block';
                cookieBox.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }, 1500);
        }

        cookieBtn.addEventListener('click', () => {
            localStorage.setItem(cookieStorageKey, 'accepted');
            cookieBox.style.display = 'none';
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll(
        '.section-intro, .s-card, .price-box, .price-column, .contact-wrapper, .info-item, .contact-form'
    );

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observerOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            revealObserver.observe(el);
        });
    }

    // --- HELPER CSS INJECTION ---
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});