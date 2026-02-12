document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active'); // Optional: for animating hamburger
        });
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        });
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
    const themeIcon = themeToggleBtn.querySelector('i');
    const body = document.body;

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');

            if (body.classList.contains('light-theme')) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }


    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projects .project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // 1. Fade out ALL cards first using the 'animating' class defined in CSS
                projectCards.forEach(card => {
                    card.classList.add('animating');
                });

                // 2. Wait for fade out to finish (300ms matches CSS transition)
                setTimeout(() => {
                    projectCards.forEach(card => {
                        const tag = card.querySelector('.project-tag').textContent.toLowerCase();
                        let shouldShow = false;

                        if (filterValue === 'all') {
                            shouldShow = true;
                        } else if (filterValue === 'hardware') {
                            if (tag.includes('hardware')) {
                                shouldShow = true;
                            }
                        } else {
                            if (tag.includes(filterValue)) {
                                shouldShow = true;
                            }
                        }

                        if (shouldShow) {
                            card.classList.remove('hide');
                        } else {
                            card.classList.add('hide');
                        }
                    });

                    // 3. Fade in visible cards with a stagger effect
                    const visibleCards = Array.from(projectCards).filter(c => !c.classList.contains('hide'));

                    visibleCards.forEach((card, index) => {
                        // Stagger delay: 50ms initial + 50ms per item
                        setTimeout(() => {
                            card.classList.remove('animating');
                        }, 50 + (index * 50));
                    });

                }, 300);
            });
        });
    }

});
