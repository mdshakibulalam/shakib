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
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const body = document.body;

    function setTheme(theme, save = true) {
        if (theme === 'light') {
            body.classList.add('light-theme');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            if (save) localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            if (save) localStorage.setItem('theme', 'dark');
        }
    }

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedTheme) {
        setTheme(savedTheme, false);
    } else if (!systemPrefersDark.matches) {
        // Default to light if system prefers light and no preference saved
        // Note: CSS :root is dark by default, so we apply light-theme
        setTheme('light', false);
    }

    // Listen for system theme changes
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = body.classList.contains('light-theme');
            setTheme(isLight ? 'dark' : 'light', true);
        });
    }

});
