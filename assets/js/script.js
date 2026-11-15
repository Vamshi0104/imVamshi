(function () {
    "use strict";

    var root = document.documentElement;
    var storage = {
        getItem: function (key) { try { return window.localStorage.getItem(key); } catch (error) { return null; } },
        setItem: function (key, value) { try { window.localStorage.setItem(key, value); } catch (error) { /* Preferences are optional. */ } }
    };
    var savedTheme = storage.getItem("vamshi-theme");
    var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    var initialTheme = (savedTheme === "light" || savedTheme === "dark" ? savedTheme : null) || (prefersLight ? "light" : "dark");
    root.setAttribute("data-theme", initialTheme);

    var loader = document.getElementById("loaderScreen");
    var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    var loaderStart = performance.now();
    var loaderDismissed = false;
    function dismissLoader() {
        if (loaderDismissed) return;
        loaderDismissed = true;
        var delay = motionPreference.matches ? 0 : Math.max(0, 950 - (performance.now() - loaderStart));
        window.setTimeout(function () {
            loader.classList.add('is-hidden');
            document.body.classList.add('is-ready');
            window.setTimeout(function () { loader.style.display = 'none'; }, 850);
        }, delay);
    }
    // Never wait on third-party maps or images to reveal the portfolio.
    if (document.fonts) document.fonts.ready.then(dismissLoader);
    else dismissLoader();
    window.setTimeout(dismissLoader, 1800);
    window.addEventListener('pageshow', function (event) { if (event.persisted) { loader.style.display = 'none'; } });
    var header = document.getElementById('siteHeader');
    var readingProgress = document.querySelector('.reading-progress');


    // Type only while the heading is visible; keep one stable accessible sentence.
    var typewriter = document.getElementById('typewriterText');
    var typewriterHeading = document.getElementById('aboutTitle');
    var typePhrases = ['survive scale.', 'meet deadlines.', 'work for real people.'];
    var phraseIndex = 0;
    var letterIndex = typePhrases[0].length;
    var deleting = true;
    var typeTimer = 0;
    var typeVisible = false;
    function pauseTyping() {
        window.clearTimeout(typeTimer);
        typeTimer = 0;
        typewriterHeading.classList.remove('is-typing');
    }
    function queueTyping(delay) {
        if (typeTimer || !typeVisible || document.hidden || motionPreference.matches) return;
        typeTimer = window.setTimeout(typeStep, delay);
    }
    function typeStep() {
        typeTimer = 0;
        if (!typeVisible || document.hidden || motionPreference.matches) return;
        typewriterHeading.classList.add('is-typing');
        var phrase = typePhrases[phraseIndex];
        letterIndex += deleting ? -1 : 1;
        typewriter.textContent = phrase.slice(0, letterIndex);
        var delay = deleting ? 35 : 65;
        if (letterIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % typePhrases.length;
            delay = 280;
        } else if (letterIndex === phrase.length && !deleting) {
            deleting = true;
            typewriterHeading.classList.remove('is-typing');
            delay = 2200;
        }
        queueTyping(delay);
    }
    if ('IntersectionObserver' in window) {
        var typeObserver = new IntersectionObserver(function (entries) {
            typeVisible = entries[0].isIntersecting;
            if (typeVisible) queueTyping(1800); else pauseTyping();
        }, { threshold: .2 });
        typeObserver.observe(typewriterHeading);
    }
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) pauseTyping(); else queueTyping(1200);
    });
    motionPreference.addEventListener('change', function () {
        pauseTyping();
        if (motionPreference.matches) {
            typewriter.textContent = typePhrases[0];
            phraseIndex = 0; letterIndex = typePhrases[0].length; deleting = true;
        } else queueTyping(1800);
    });

    var themeToggle = document.getElementById("themeToggle");
    var themeIcon = themeToggle.querySelector("i");

    function syncThemeIcon() {
        var isLight = root.getAttribute("data-theme") === "light";
        themeIcon.className = isLight ? "fa fa-sun-o" : "fa fa-moon-o";
        themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
        document.querySelector('meta[name="theme-color"]').content = isLight ? '#f3f5fa' : '#080b12';
    }

    syncThemeIcon();
    themeToggle.addEventListener("click", function () {
        var nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", nextTheme);
        storage.setItem("vamshi-theme", nextTheme);
        syncThemeIcon();
    });

    var menuToggle = document.getElementById("menuToggle");
    var navLinks = document.getElementById("navLinks");
    var navBubble = document.createElement("span");
    navBubble.className = "nav-bubble";
    navBubble.setAttribute("aria-hidden", "true");
    navLinks.prepend(navBubble);

    function syncNavBubble(link) {
        link = link || navLinks.querySelector("a.is-active");
        if (!link || !navLinks.getClientRects().length) {
            navLinks.classList.remove("has-bubble");
            return;
        }
        navBubble.style.setProperty("--bubble-x", link.offsetLeft + "px");
        navBubble.style.setProperty("--bubble-y", link.offsetTop + "px");
        navBubble.style.setProperty("--bubble-width", link.offsetWidth + "px");
        navBubble.style.setProperty("--bubble-height", link.offsetHeight + "px");
        navLinks.classList.add("has-bubble");
    }
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("pointerenter", function () { syncNavBubble(link); });
        link.addEventListener("focus", function () { syncNavBubble(link); });
    });
    navLinks.addEventListener("pointerleave", function () { syncNavBubble(); });
    navLinks.addEventListener("focusout", function (event) {
        if (!navLinks.contains(event.relatedTarget)) syncNavBubble();
    });
    var navObserver = new MutationObserver(function () { syncNavBubble(); });
    navLinks.querySelectorAll("a").forEach(function (link) {
        navObserver.observe(link, { attributes: true, attributeFilter: ["class"] });
    });
    window.addEventListener("resize", function () { syncNavBubble(); });
    if (document.fonts) document.fonts.ready.then(function () { syncNavBubble(); });
    menuToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("is-open");
        syncNavBubble();
        menuToggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("menu-open", open);
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    document.querySelectorAll(".smoothscroll").forEach(function (link) {
        link.addEventListener("click", function (event) {
            var hash = link.getAttribute("href");
            if (!hash || hash.charAt(0) !== "#") return;
            var target = document.querySelector(hash);
            if (!target) return;
            event.preventDefault();
            navLinks.classList.remove("is-open");
            document.body.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open menu");
            target.scrollIntoView({ behavior: motionPreference.matches ? "instant" : "smooth", block: "start" });
            history.replaceState(null, "", hash);
        });
    });

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });

        document.querySelectorAll(".reveal").forEach(function (el) {
            revealObserver.observe(el);
        });

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                document.querySelectorAll(".nav-links a").forEach(function (link) {
                    var active = link.getAttribute("href") === "#" + entry.target.id;
                    link.classList.toggle("is-active", active);
                    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: "-40% 0px -52% 0px" });

        document.querySelectorAll("main section[id]").forEach(function (section) {
            sectionObserver.observe(section);
        });
    } else {
        document.querySelectorAll(".reveal").forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    var projects = [
        {
            title: "Robyn MCP",
            type: "AI Infrastructure",
            language: ["Python", "MCP", "Robyn", "OpenAPI"],
            color: "#8fc5ff",
            image: "assets/images/optimized/robyn-mcp.webp",
            link: "https://github.com/Vamshi0104/robyn_mcp",
            packageLink: "https://pypi.org/project/robyn-mcp/",
            summary: "A published Python package that turns Robyn APIs into governed MCP tools, resources, and prompts.",
            detail: "Built as a Robyn reference adapter for AI clients, with route discovery, schema inference, OpenAPI enrichment, policy-aware context, caching, observability, CLI validation, and a playground-style developer surface."
        },
        {
            title: "URL Shorten Service",
            type: "Distributed Backend",
            language: ["Java", "Spring Boot", "Ehcache", "SQL"],
            color: "#71b7ff",
            image: "assets/images/optimized/url-service.webp",
            link: "https://github.com/Vamshi0104",
            summary: "A scalable URL shortening service focused on reliable redirects, cache-aware lookup paths, and high availability.",
            detail: "Designed for efficient URL management with a fast cache layer, clean service boundaries, and operational thinking around availability."
        },
        {
            title: "Vocal Verse",
            type: "AI Package",
            language: ["Python", "OpenAI", "Whisper", "NLP"],
            color: "#a6cfff",
            image: "assets/images/optimized/vocal-verse.webp",
            link: "https://github.com/Vamshi0104/vocalverse",
            packageLink: "https://pypi.org/project/vocal-verse/",
            summary: "A published PyPI package for text translation, speech synthesis, and audio transcription workflows.",
            detail: "Combines Python packaging, OpenAI Whisper, and Google text-to-speech workflows into a reusable developer-facing utility."
        },
        {
            title: "Multilingual AI Chatbot",
            type: "AI/ML Development",
            language: ["Python", "OpenAI", "LLaMA3", "NLP"],
            color: "#819bff",
            image: "assets/images/covers/multilingual-chatbot.svg",
            imageAlt: "multilingual chatbot workflow concept illustration",
            link: "https://github.com/Vamshi0104",
            summary: "Text and voice chatbot experience using LLaMA3, OpenAI, and multilingual Python workflows.",
            detail: "Built around conversational UX, multilingual support, and practical voice interaction patterns for broader accessibility."
        },
        {
            title: "Analysis of Clickstream Data",
            type: "Machine Learning",
            language: ["Python", "ML", "Pandas", "scikit-learn"],
            color: "#8fc5ff",
            image: "assets/images/optimized/clickstream-data-analysis.webp",
            link: "https://github.com/Vamshi0104/clickstream-data-analysis",
            summary: "Consumer behavior analysis for online shopping data using machine learning and e-commerce pattern discovery.",
            detail: "Explored clickstream behavior across online clothing data to surface patterns that can improve merchandising and conversion strategy."
        },
        {
            title: "Time Series Agriculture Detection",
            type: "Research ML",
            language: ["Python", "ML", "Active Learning"],
            color: "#9eafff",
            image: "assets/images/covers/crop-monitoring.svg",
            imageAlt: "crop monitoring workflow concept illustration",
            link: "https://github.com/Vamshi0104/Time-Series-Mining-Approach-for-Agriculture-Area-Detection",
            summary: "Active learning framework for crop monitoring with seasonal time-series signals.",
            detail: "Used time-series mining to improve agricultural area detection and support more precise crop monitoring workflows."
        },
        {
            title: "Text Summarization",
            sourceLink: "https://github.com/Vamshi0104/Text-Summarization",
            type: "Python Web App",
            language: ["Python", "Flask", "NLP"],
            color: "#71b7ff",
            image: "assets/images/optimized/text-summarize.webp",
            link: "https://textsummarization.pythonanywhere.com",
            summary: "A Flask app that creates exportable summaries from uploaded or pasted text.",
            detail: "Focused on turning long-form content into concise summaries through a lightweight web interface."
        },
        {
            title: "Retail Store Management",
            type: "Full Stack",
            language: ["PHP", "MySQL", "JavaScript"],
            color: "#a6cfff",
            image: "assets/images/covers/retail-management.svg",
            imageAlt: "retail management workflow concept illustration",
            link: "https://github.com/Vamshi0104/RetailStoreManagement",
            summary: "Freelance CRUD product with inventory, users, cart flows, and invoice generation.",
            detail: "Designed practical retail modules for product management, user workflows, cart handling, and invoice generation."
        },
        {
            title: "Hospital Management System",
            type: "Full Stack",
            language: ["Java", "JSP", "MySQL"],
            color: "#819bff",
            image: "assets/images/optimized/hospital-management-system.webp",
            link: "https://github.com/Vamshi0104/myHospitalManagement",
            summary: "MVC hospital application covering admin, patient, doctor, and reception modules.",
            detail: "Built a real-time CRUD application using JSP and MVC patterns for clinical operations and appointment workflows."
        },
        {
            title: "Vintage Knowledge",
            sourceLink: "https://github.com/Vamshi0104/vintage-knowledge",
            type: "Educational Web",
            language: ["PHP", "HTML", "CSS", "JavaScript"],
            color: "#8fc5ff",
            image: "assets/images/optimized/vintage-knowledge.webp",
            link: "https://vamshi0104.github.io/vintage-knowledge",
            summary: "Interactive learning site for C programming with simple query search and clear lessons.",
            detail: "Created an approachable C programming resource with searchable content and frontend-first learning flows."
        },
        {
            title: "Secure Password Suggester",
            type: "Security Utility",
            language: ["PHP", "JavaScript", "Security"],
            color: "#9eafff",
            image: "assets/images/covers/secure-passwords.svg",
            imageAlt: "secure passwords workflow concept illustration",
            link: "https://github.com/Vamshi0104/SforSecure",
            summary: "Password-strength helper that recommends stronger encrypted password alternatives.",
            detail: "Focused on practical security education through immediate password feedback and suggestion flows."
        },
        {
            title: "Instant WA Messenger",
            sourceLink: "https://github.com/Vamshi0104/inst-wa",
            type: "Web Utility",
            language: ["JavaScript", "HTML", "CSS"],
            color: "#71b7ff",
            image: "assets/images/optimized/insta-wa.webp",
            link: "https://vamshi0104.github.io/inst-wa",
            summary: "Send a WhatsApp message without saving the contact first.",
            detail: "Built as a lightweight utility to remove friction from one-off WhatsApp conversations."
        },
        {
            title: "Simple Virtual Assistant",
            type: "CLI Tool",
            language: ["Python"],
            color: "#a6cfff",
            image: "assets/images/optimized/virtual-assist.webp",
            link: "https://github.com/Vamshi0104/myVirtualAssistant",
            summary: "Command-line assistant with calculator, date, time, and keyword search modules.",
            detail: "A Python CLI exploration of modular assistant interactions and everyday automation."
        },
        {
            title: "Song Recommender",
            type: "NLP Experiment",
            language: ["Python", "NLP", "VADER"],
            color: "#819bff",
            image: "assets/images/optimized/song-recommender.webp",
            link: "https://github.com/Vamshi0104",
            summary: "Sentiment analyzer that recommends songs based on quiz outcomes and VADER scoring.",
            detail: "Connected lightweight personality input to sentiment scoring and recommendation behavior."
        },
        {
            title: "Find Me",
            type: "Location Tool",
            language: ["Java", "Spring Boot", "JavaScript"],
            color: "#8fc5ff",
            image: "assets/images/covers/find-me.svg",
            imageAlt: "Location-sharing workflow concept illustration",
            link: "https://github.com/Vamshi0104/findme-at",
            summary: "A portal for accurate location finding and quick location sharing.",
            detail: "Built around geolocation workflows and a simple sharing interface for practical location handoff."
        }
    ];

    var grid = document.getElementById("projectGrid");
    var filters = document.getElementById("languageFilters");
    var search = document.getElementById("projectSearch");
    var emptyState = document.getElementById("emptyState");
    var activeLanguage = "All";
    var languages = ["All"].concat(Array.from(new Set(projects.flatMap(function (project) {
        return project.language;
    })))).filter(function (language) {
        return ["All", "Java", "Python", "JavaScript", "PHP", "Spring Boot", "AWS", "SQL", "ML", "NLP", "OpenAI", "MCP", "Robyn", "OpenAPI"].indexOf(language) !== -1;
    });

    var imageSizes = {"assets/images/optimized/my-avatar.webp": [720, 720], "assets/images/optimized/clickstream-data-analysis.webp": [1000, 537], "assets/images/optimized/vocal-verse.webp": [1000, 486], "assets/images/optimized/time-series-mining-approach-for-agriculture-area-detection.webp": [281, 179], "assets/images/optimized/vintage-knowledge.webp": [1000, 476], "assets/images/optimized/robyn-mcp.webp": [1000, 594], "assets/images/optimized/song-recommender.webp": [1000, 563], "assets/images/optimized/url-service.webp": [1000, 544], "assets/images/optimized/insta-wa.webp": [1000, 612], "assets/images/optimized/virtual-assist.webp": [1000, 563], "assets/images/optimized/text-summarize.webp": [1000, 500], "assets/images/optimized/hospital-management-system.webp": [950, 500], "assets/images/optimized/retail-store-management.webp": [250, 165], "assets/images/optimized/secured-password-generator.webp": [416, 227], "assets/images/optimized/multi-lang-chatbot.webp": [284, 177]};
    function imageMarkup(project) {
        var size = imageSizes[project.image] || [960, 540];
        return '<img src="' + project.image + '" width="' + size[0] + '" height="' + size[1] + '" alt="' + (project.imageAlt || project.title + ' preview') + '" loading="lazy" decoding="async">';
    }
    function renderFilters() {
        filters.innerHTML = languages.map(function (language) {
            return '<button type="button" class="' + (language === activeLanguage ? "is-active" : "") + '" aria-pressed="' + (language === activeLanguage) + '" data-language="' + language + '">' + language + "</button>";
        }).join("");
    }

    function projectMatches(project, term) {
        var haystack = [project.title, project.type, project.summary, project.detail].concat(project.language).join(" ").toLowerCase();
        var matchesSearch = !term || term.split(/\s+/).every(function (word) { return haystack.indexOf(word) > -1; });
        var matchesLanguage = activeLanguage === "All" || project.language.indexOf(activeLanguage) > -1;
        return matchesSearch && matchesLanguage;
    }

    var projectSection = document.getElementById("projects");
    var showcase = document.getElementById("projectShowcase");
    var toolbar = document.getElementById("projectToolbar");
    var searchToggle = document.getElementById("searchToggle");
    var searchOpen = false;

    function projectCard(project, featured) {
        var index = projects.indexOf(project);
        return '<article class="project-card' + (featured ? ' featured-card' : '') + '" tabindex="0" role="button" aria-label="View ' + project.title + ' details" data-project-index="' + index + '" style="--accent-card:' + project.color + ';--card-order:' + index + '">' +
            '<div class="project-media">' + imageMarkup(project) + '</div>' +
            '<div class="project-card-copy"><div class="modal-kicker">' + project.type + '</div>' +
            '<h3>' + project.title + '</h3><p>' + project.summary + '</p>' +
            '<div class="project-meta">' + project.language.slice(0, 4).map(function (language) { return '<span>' + language + '</span>'; }).join('') + '</div></div>' +
            '<span class="project-open" aria-hidden="true"><i class="fa fa-arrow-right"></i></span>' +
            (featured ? '<span class="project-number" aria-hidden="true">0' + (index + 1) + ' / 04</span>' : '') + '</article>';
    }

    showcase.innerHTML = '<div class="project-fan-stage"><div class="project-fan-track">' + projects.slice(0, 4).map(function (project) { return projectCard(project, true); }).join('') + '</div><p class="fan-hint">Scroll to explore <span aria-hidden="true">↘</span></p></div>';
    var fanCards = Array.from(showcase.querySelectorAll('.featured-card'));
    fanCards.forEach(function (card, index) {
        card.addEventListener('focus', function () {
            if (reducedMotion.matches) return;
            var travel = showcase.offsetHeight - window.innerHeight;
            window.scrollTo({ top: window.scrollY + showcase.getBoundingClientRect().top + (index / 3) * travel, behavior: 'smooth' });
        });
    });
    function renderProjects() {
        var term = search.value.trim().toLowerCase();
        var visibleProjects = searchOpen ? projects.filter(function (project) { return projectMatches(project, term); }) : projects.slice(4);
        grid.innerHTML = visibleProjects.map(function (project) { return projectCard(project, false); }).join('');
        showcase.hidden = searchOpen;
        document.getElementById("collectionHeading").hidden = searchOpen;
        document.getElementById("projectCount").textContent = searchOpen ? visibleProjects.length + ' project' + (visibleProjects.length === 1 ? '' : 's') + ' found' : '01 — 04 / Featured projects';
        emptyState.classList.toggle("is-visible", visibleProjects.length === 0);
        projectSection.classList.toggle("is-searching", searchOpen);
        scheduleScrollUpdate();
    }
    function setSearchOpen(open) {
        searchOpen = open;
        toolbar.hidden = !open;
        searchToggle.setAttribute("aria-expanded", String(open));
        if (!open) { search.value = ''; activeLanguage = 'All'; renderFilters(); }
        renderProjects();
        if (open) search.focus(); else searchToggle.focus();
    }
    searchToggle.addEventListener('click', function () { setSearchOpen(!searchOpen); });
    document.getElementById('closeSearch').addEventListener('click', function () { setSearchOpen(false); });
    toolbar.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { event.preventDefault(); setSearchOpen(false); }
    });

    // One frame per scroll: animate only the visible featured cards.
    var expertiseCards = Array.from(document.querySelectorAll('.expertise-card'));
    var scrollFrame = 0;
    var fanPosition = null;
    var lastFrameTime = 0;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updateScrollScenes(timestamp) {
        scrollFrame = 0;
        var elapsed = Math.min(64, timestamp - (lastFrameTime || timestamp - 16));
        lastFrameTime = timestamp;
        header.classList.toggle('is-compact', window.scrollY > 100);
        var pageTravel = document.documentElement.scrollHeight - window.innerHeight;
        readingProgress.style.transform = 'scaleX(' + (pageTravel > 0 ? window.scrollY / pageTravel : 0) + ')';
        expertiseCards.forEach(function (card, index, cards) {
            var next = cards[index + 1];
            var cover = !next || reducedMotion.matches ? 0 : Math.max(0, Math.min(1, (window.innerHeight - next.getBoundingClientRect().top) / (window.innerHeight - 140)));
            card.style.setProperty('--stack-scale', (1 - cover * .045).toFixed(3));
            card.style.setProperty('--stack-dim', (cover * .2).toFixed(3));
        });
        if (searchOpen || reducedMotion.matches) return;
        var rect = showcase.getBoundingClientRect();
        var travel = Math.max(1, showcase.offsetHeight - window.innerHeight);
        var progress = Math.max(0, Math.min(1, -rect.top / travel));
        var width = fanCards[0].offsetWidth;
        var gap = width * 1.14;
        var targetCenter = window.innerWidth <= 680 ? progress * 3 : .65 + progress * 1.7;
        if (fanPosition === null || rect.bottom < 0 || rect.top > window.innerHeight) fanPosition = targetCenter;
        fanPosition += (targetCenter - fanPosition) * (1 - Math.exp(-elapsed / 100));
        var center = fanPosition;
        fanCards.forEach(function (card, index) {
            var distance = index - center;
            card.style.setProperty('--fan-x', (distance * gap).toFixed(1) + 'px');
            card.style.setProperty('--fan-y', (Math.pow(distance, 2) * 24).toFixed(1) + 'px');
            card.style.setProperty('--fan-angle', (distance * 7).toFixed(2) + 'deg');
        });
        if (Math.abs(targetCenter - fanPosition) > .0005) scheduleScrollUpdate();
    }
    function scheduleScrollUpdate() {
        if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollScenes);
    }
    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollUpdate);
    window.addEventListener('pageshow', scheduleScrollUpdate);
    document.querySelectorAll('.recommendation-details').forEach(function (detail) { detail.addEventListener('toggle', scheduleScrollUpdate); });
    reducedMotion.addEventListener('change', function () { fanPosition = null; scheduleScrollUpdate(); });
    if (document.fonts) document.fonts.ready.then(scheduleScrollUpdate);

    renderFilters();
    renderProjects();

    filters.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-language]");
        if (!button) return;
        activeLanguage = button.getAttribute("data-language");
        renderFilters();
        renderProjects();
        filters.querySelector('[data-language="' + activeLanguage + '"]').focus();
    });

    search.addEventListener("input", renderProjects);
    document.getElementById('resetProjects').addEventListener('click', function () {
        search.value = ''; activeLanguage = 'All'; renderFilters(); renderProjects(); search.focus();
    });

    var projectModal = document.getElementById("projectModal");
    var closeModal = document.getElementById("closeModal");
    var modalKicker = document.getElementById("modalKicker");
    var modalTitle = document.getElementById("modalTitle");
    var modalDescription = document.getElementById("modalDescription");
    var modalStack = document.getElementById("modalStack");
    var modalLink = document.getElementById("modalLink");
    var modalPackageLink = document.getElementById("modalPackageLink");

    function openProject(index) {
        var project = projects[index];
        modalKicker.textContent = project.type;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.summary;
        document.getElementById('modalApproach').textContent = project.detail;
        document.getElementById('modalBuild').textContent = project.language.join(' · ');
        var workflows = {
            'Robyn MCP': ['Robyn routes', 'Discovery & schemas', 'Governed MCP tools'],
            'URL Shorten Service': ['Short URL', 'Cache-aware lookup', 'Redirect'],
            'Vocal Verse': ['Text or audio', 'Language processing', 'Translation & speech'],
            'Multilingual AI Chatbot': ['Text or voice', 'Language model', 'Multilingual response']
        };
        var workflow = workflows[project.title] || [];
        document.getElementById('modalFlow').innerHTML = workflow.map(function (step) { return '<span>' + step + '</span>'; }).join('<i class="fa fa-arrow-right" aria-hidden="true"></i>');
        document.getElementById('modalFlow').hidden = workflow.length === 0;
        var demoLink = project.title === 'Robyn MCP' ? 'https://vamshi0104.github.io/robyn_mcp/' : project.sourceLink ? project.link : null;
        document.getElementById('modalDemoLink').hidden = !demoLink;
        if (demoLink) document.getElementById('modalDemoLink').href = demoLink;
        var sourceLink = project.sourceLink || project.link;
        var profileOnly = sourceLink === 'https://github.com/Vamshi0104';
        document.getElementById('modalSourceNote').textContent = profileOnly ? 'A dedicated public project link is not listed. The link below opens my GitHub profile.' : 'Explore the public project for implementation details.';
        modalStack.innerHTML = project.language.map(function (language) {
            return "<span>" + language + "</span>";
        }).join("");
        modalLink.href = sourceLink;
        modalLink.innerHTML = '<i class="fa fa-external-link" aria-hidden="true"></i> ' + (profileOnly ? 'GitHub profile' : sourceLink.indexOf('pypi.org') > -1 ? 'View package' : sourceLink.indexOf('github.com') > -1 ? 'View source' : 'Visit project');
        if (project.packageLink) {
            modalPackageLink.href = project.packageLink;
            modalPackageLink.style.display = "inline-flex";
        } else {
            modalPackageLink.removeAttribute("href");
            modalPackageLink.style.display = "none";
        }
        projectModal.showModal();
        document.body.classList.add("modal-open");
    }

    projectSection.addEventListener("click", function (event) {
        var card = event.target.closest(".project-card");
        if (card) openProject(card.getAttribute("data-project-index"));
    });

    projectSection.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        var card = event.target.closest(".project-card");
        if (!card) return;
        event.preventDefault();
        openProject(card.getAttribute("data-project-index"));
    });

    function closeProjectModal() {
        projectModal.close();
        document.body.classList.remove("modal-open");
    }

    closeModal.addEventListener("click", closeProjectModal);
    projectModal.addEventListener("click", function (event) {
        if (event.target !== projectModal) return;
        var bounds = projectModal.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProjectModal();
    });

    var resumeModal = document.getElementById("resumeModal");
    var closeResume = document.getElementById("closeResume");
    document.querySelectorAll("[data-resume-view]").forEach(function (button) {
        button.addEventListener("click", function () {
            resumeModal.showModal();
            document.body.classList.add("modal-open");
        });
    });

    function closeResumeModal() {
        resumeModal.close();
        document.body.classList.remove("modal-open");
    }

    closeResume.addEventListener("click", closeResumeModal);
    resumeModal.addEventListener("click", function (event) {
        if (event.target !== resumeModal) return;
        var bounds = resumeModal.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeResumeModal();
    });

    var downloadStatus = document.getElementById('downloadStatus');
    var downloadPrompt = document.getElementById('resumeDownloadPrompt');
    var downloadMessageTimer;
    var downloadOpener = null;
    var returnToResume = false;

    function closeDownloadPrompt(value) { downloadPrompt.close(value || 'cancel'); }
    document.querySelectorAll('[data-resume-download]').forEach(function (button) {
        button.addEventListener('click', function () {
            downloadOpener = button;
            returnToResume = resumeModal.open;
            if (returnToResume) resumeModal.close();
            downloadStatus.classList.remove('is-visible');
            downloadPrompt.returnValue = '';
            downloadPrompt.showModal();
            document.body.classList.add('modal-open');
        });
    });
    document.getElementById('closeResumeDownload').addEventListener('click', function () { closeDownloadPrompt(); });
    downloadPrompt.addEventListener('click', function (event) {
        var choice = event.target.closest('[data-resume-choice]');
        if (choice) {
            window.clearTimeout(downloadMessageTimer);
            downloadStatus.textContent = (choice.getAttribute('data-resume-choice') === 'one-page' ? 'One-page resume' : 'Detailed resume') + ' download requested. Check your browser’s downloads.';
            downloadStatus.classList.add('is-visible');
            closeDownloadPrompt('download');
            downloadMessageTimer = window.setTimeout(function () { downloadStatus.classList.remove('is-visible'); }, 5500);
            return;
        }
        if (event.target !== downloadPrompt) return;
        var bounds = downloadPrompt.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDownloadPrompt();
    });
    downloadPrompt.addEventListener('close', function () {
        if (returnToResume && downloadPrompt.returnValue !== 'download') {
            resumeModal.showModal();
            document.body.classList.add('modal-open');
            if (downloadOpener) downloadOpener.focus();
        } else {
            if (!projectModal.open && !resumeModal.open && !downloadPrompt.open) document.body.classList.remove('modal-open');
            var target = downloadOpener && downloadOpener.getClientRects().length ? downloadOpener : document.getElementById('downloadResume');
            target.focus({ preventScroll: true });
        }
    });

    var contactForm = document.getElementById("contactForm");
    var formStatus = document.getElementById("formStatus");
    var successSnackbar = document.getElementById("successSnackbar");
    var snackbarTimer;
    var submitting = false;
    var mapButton = document.getElementById('loadMap');
    mapButton.addEventListener('click', function () {
        var frame = document.createElement('iframe');
        frame.title = 'Map showing Dallas, Texas';
        frame.src = 'https://www.google.com/maps?q=Dallas%2C%20TX&output=embed';
        frame.referrerPolicy = 'no-referrer-when-downgrade';
        mapButton.replaceWith(frame);
    });

    function showSuccessSnackbar() {
        window.clearTimeout(snackbarTimer);
        successSnackbar.classList.add("is-visible");
        successSnackbar.setAttribute("aria-hidden", "false");
        snackbarTimer = window.setTimeout(function () {
            successSnackbar.classList.remove("is-visible");
            successSnackbar.setAttribute("aria-hidden", "true");
        }, 5200);
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(contactForm);
        var email = (data.get("email") || "").trim();
        var submitButton = contactForm.querySelector("button[type='submit']");
        if (submitting) return;

        if ((data.get("_gotcha") || "").trim()) {
            formStatus.textContent = "Thanks. Your message was received.";
            contactForm.reset();
            return;
        }

        if (!email) {
            formStatus.textContent = "Add your email address so I can reply.";
            contactForm.querySelector("[name='email']").focus();
            return;
        }

        data.set("subject", "Portfolio inquiry from " + data.get("name"));
        data.set("submitted_at", new Date().toISOString());

        formStatus.textContent = "Sending your message...";
        submitButton.disabled = true;
        submitting = true;
        contactForm.setAttribute('aria-busy', 'true');
        var submissionController = new AbortController();
        var submissionTimeout = window.setTimeout(function () { submissionController.abort(); }, 15000);

        fetch(contactForm.action, {
            method: "POST",
            signal: submissionController.signal,
            body: data,
            headers: {
                Accept: "application/json"
            }
        }).then(function (response) {
            if (!response.ok) throw new Error("Form submission failed");
            contactForm.reset();
            formStatus.textContent = "Delivered.";
            showSuccessSnackbar();
        }).catch(function () {
            formStatus.textContent = "Something went wrong. Please try again or email me directly.";
        }).finally(function () {
            window.clearTimeout(submissionTimeout);
            submitButton.disabled = false;
            submitting = false;
            contactForm.removeAttribute('aria-busy');
        });
    });

    [projectModal, resumeModal].forEach(function (dialog) {
        dialog.addEventListener('close', function () {
            if (!projectModal.open && !resumeModal.open && !downloadPrompt.open) document.body.classList.remove('modal-open');
        });
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
            navLinks.classList.remove('is-open'); document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu'); menuToggle.focus();
        }
    });
})();
