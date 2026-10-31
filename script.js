document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    const setMenuState = (isOpen) => {
        navList.classList.toggle('active', isOpen);
        mobileMenuBtn.classList.toggle('active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        document.body.classList.toggle('menu-open', isOpen);
    };

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            setMenuState(!navList.classList.contains('active'));
        });
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn && navList) setMenuState(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileMenuBtn && navList && navList.classList.contains('active')) {
            setMenuState(false);
            mobileMenuBtn.focus();
        }
    });

    // Smooth Scroll for Anchor Links (Optional, CSS often handles this well but JS adds control)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Scroll Effect (Glassmorphism enhance)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 2px 10px var(--shadow-color)";
        } else {
            header.style.boxShadow = "none";
        }
    });

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn?.querySelector('i');
    const body = document.body;

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light' && themeIcon) {
        body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');

            if (body.classList.contains('light-theme')) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
            }
        });
    }


    const projectFilters = document.querySelectorAll('#projects [data-project-filter]');
    const projectCards = document.querySelectorAll('#projects .project-card');

    projectFilters.forEach(button => {
        button.addEventListener('click', () => {
            projectFilters.forEach(filterButton => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });

            const filterValue = button.dataset.projectFilter;
            projectCards.forEach(card => card.classList.add('animating'));

            setTimeout(() => {
                projectCards.forEach(card => {
                    const tag = card.querySelector('.project-tag').textContent.toLowerCase();
                    card.classList.toggle('hide', filterValue !== 'all' && !tag.includes(filterValue));
                });

                projectCards.forEach((card, index) => {
                    if (!card.classList.contains('hide')) {
                        setTimeout(() => card.classList.remove('animating'), 50 + index * 50);
                    }
                });
            }, 300);
        });
    });

    const initializeVendorFilter = (sectionId, filterAttribute) => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const buttons = section.querySelectorAll(`[${filterAttribute}]`);
        const cards = section.querySelectorAll('.credential-card[data-vendor]');
        let filterTimeout;
        const revealTimeouts = [];

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                clearTimeout(filterTimeout);
                revealTimeouts.forEach(clearTimeout);
                revealTimeouts.length = 0;

                buttons.forEach(filterButton => {
                    const isActive = filterButton === button;
                    filterButton.classList.toggle('active', isActive);
                    filterButton.setAttribute('aria-pressed', String(isActive));
                });

                const vendor = button.getAttribute(filterAttribute);
                cards.forEach(card => card.classList.add('animating'));

                filterTimeout = setTimeout(() => {
                    cards.forEach(card => {
                        card.classList.toggle('hide', vendor !== 'all' && card.dataset.vendor !== vendor);
                    });

                    cards.forEach((card, index) => {
                        if (!card.classList.contains('hide')) {
                            revealTimeouts.push(setTimeout(() => {
                                card.classList.remove('animating');
                            }, 50 + index * 50));
                        }
                    });
                }, 300);
            });
        });
    };

    initializeVendorFilter('courses', 'data-course-filter');
    initializeVendorFilter('certifications', 'data-certification-filter');

});
