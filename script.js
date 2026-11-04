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
    const projectTimeline = document.querySelector('#projects .project-timeline');
    const projectLoadMore = document.getElementById('project-load-more');
    const projectGroups = new Map();
    let projectsExpanded = false;

    [...projectCards]
        .sort((first, second) => Number(first.dataset.projectOrder) - Number(second.dataset.projectOrder))
        .forEach(card => {
            const year = card.dataset.projectYear;
            let group = projectGroups.get(year);

            if (!group) {
                group = document.createElement('div');
                group.className = 'project-year-group';

                const heading = document.createElement('h3');
                heading.className = 'project-year-heading';
                heading.textContent = year;

                const grid = document.createElement('div');
                grid.className = 'projects-grid';

                group.append(heading, grid);
                projectTimeline.append(group);
                projectGroups.set(year, group);
            }

            group.querySelector('.projects-grid').append(card);
        });

    const updateProjectPagination = () => {
        let rowCount = 0;
        projectCards.forEach(card => card.classList.remove('load-more-hidden'));

        projectGroups.forEach(group => {
            const matchingCards = [...group.querySelectorAll('.project-card:not(.hide)')];
            group.classList.toggle('hide', matchingCards.length === 0);

            let previousTop = null;
            matchingCards.forEach(card => {
                if (card.offsetTop !== previousTop) {
                    rowCount += 1;
                    previousTop = card.offsetTop;
                }

                card.classList.toggle('load-more-hidden', !projectsExpanded && rowCount > 3);
            });
        });

        projectGroups.forEach(group => {
            group.classList.toggle('hide', !group.querySelector('.project-card:not(.hide):not(.load-more-hidden)'));
        });

        if (rowCount <= 3) {
            projectsExpanded = false;
            projectCards.forEach(card => card.classList.remove('load-more-hidden'));
        }

        projectLoadMore.hidden = rowCount <= 3;
        projectLoadMore.textContent = projectsExpanded ? 'Show less' : 'Load more projects';
        projectLoadMore.setAttribute('aria-expanded', String(projectsExpanded));
    };

    projectLoadMore.addEventListener('click', () => {
        projectsExpanded = !projectsExpanded;
        updateProjectPagination();
    });

    window.addEventListener('resize', updateProjectPagination);
    updateProjectPagination();

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

                projectGroups.forEach(group => {
                    group.classList.toggle('hide', !group.querySelector('.project-card:not(.hide)'));
                });

                projectsExpanded = false;
                updateProjectPagination();

                projectCards.forEach((card, index) => {
                    if (!card.classList.contains('hide')) {
                        setTimeout(() => card.classList.remove('animating'), 50 + index * 50);
                    }
                });
            }, 300);
        });
    });

    const initializeLoadMore = (sectionId, cardSelector, buttonId, buttonLabel) => {
        const section = document.getElementById(sectionId);
        const button = document.getElementById(buttonId);
        const cards = section.querySelectorAll(cardSelector);
        let expanded = false;

        const update = () => {
            let rowCount = 0;
            let previousTop = null;
            cards.forEach(card => card.classList.remove('load-more-hidden'));

            const visibleCards = [...cards].filter(card => !card.classList.contains('hide'));
            const cardRows = visibleCards.map(card => {
                const top = Math.round(card.getBoundingClientRect().top);
                if (top !== previousTop) {
                    rowCount += 1;
                    previousTop = top;
                }
                return rowCount;
            });

            if (rowCount <= 3) {
                expanded = false;
                cards.forEach(card => card.classList.remove('load-more-hidden'));
            } else if (!expanded) {
                visibleCards.forEach((card, index) => {
                    card.classList.toggle('load-more-hidden', cardRows[index] > 3);
                });
            }

            button.hidden = rowCount <= 3;
            button.textContent = expanded ? 'Show less' : buttonLabel;
            button.setAttribute('aria-expanded', String(expanded));
        };

        button.addEventListener('click', () => {
            expanded = !expanded;
            update();
        });
        window.addEventListener('resize', update);
        update();

        return update;
    };

    const updateCoursesPagination = initializeLoadMore(
        'courses',
        '.credential-card',
        'courses-load-more',
        'Load more courses'
    );
    const updateCertificationsPagination = initializeLoadMore(
        'certifications',
        '.credential-card',
        'certifications-load-more',
        'Load more certifications'
    );
    initializeLoadMore('research', '.project-card', 'research-load-more', 'Load more publications');

    const initializeVendorFilter = (sectionId, filterAttribute, updatePagination) => {
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

                    updatePagination();

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

    initializeVendorFilter('courses', 'data-course-filter', updateCoursesPagination);
    initializeVendorFilter('certifications', 'data-certification-filter', updateCertificationsPagination);

});
