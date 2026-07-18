(function () {
    "use strict";

    var root = document.documentElement;
    var savedTheme = localStorage.getItem("vamshi-theme");
    var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    var initialTheme = savedTheme || (prefersLight ? "light" : "dark");
    root.setAttribute("data-theme", initialTheme);

    var loader = document.getElementById("loaderScreen");
    window.addEventListener("load", function () {
        window.setTimeout(function () {
            loader.classList.add("is-hidden");
            window.setTimeout(function () {
                loader.style.display = "none";
            }, 560);
        }, 520);
    });

    var themeToggle = document.getElementById("themeToggle");
    var themeIcon = themeToggle.querySelector("i");

    function syncThemeIcon() {
        var isLight = root.getAttribute("data-theme") === "light";
        themeIcon.className = isLight ? "fa fa-sun-o" : "fa fa-moon-o";
        themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    }

    syncThemeIcon();
    themeToggle.addEventListener("click", function () {
        var nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", nextTheme);
        localStorage.setItem("vamshi-theme", nextTheme);
        syncThemeIcon();
    });

    var menuToggle = document.getElementById("menuToggle");
    var navLinks = document.getElementById("navLinks");
    menuToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("is-open");
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
            target.scrollIntoView({ behavior: "smooth", block: "start" });
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
        }, { threshold: 0.14 });

        document.querySelectorAll(".reveal").forEach(function (el) {
            revealObserver.observe(el);
        });

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                document.querySelectorAll(".nav-links a").forEach(function (link) {
                    link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
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
            color: "#9ec5ff",
            image: "assets/images/projects/robyn-mcp.jpg",
            link: "https://github.com/Vamshi0104/robyn_mcp",
            packageLink: "https://pypi.org/project/robyn-mcp/",
            summary: "A published Python package that turns Robyn APIs into governed MCP tools, resources, and prompts.",
            detail: "Built as a Robyn reference adapter for AI clients, with route discovery, schema inference, OpenAPI enrichment, policy-aware context, caching, observability, CLI validation, and a playground-style developer surface."
        },
        {
            title: "URL Shorten Service",
            type: "Distributed Backend",
            language: ["Java", "Spring Boot", "Ehcache", "SQL"],
            color: "#8df7d2",
            image: "assets/images/projects/url-service.png",
            link: "https://github.com/Vamshi0104",
            summary: "A scalable URL shortening service focused on reliable redirects, cache-aware lookup paths, and high availability.",
            detail: "Designed for efficient URL management with a fast cache layer, clean service boundaries, and operational thinking around availability."
        },
        {
            title: "Vocal Verse",
            type: "AI Package",
            language: ["Python", "OpenAI", "Whisper", "NLP"],
            color: "#ffcf6d",
            image: "assets/images/projects/vocal-verse.png",
            link: "https://pypi.org/project/vocal-verse/",
            summary: "A published PyPI package for text translation, speech synthesis, and audio transcription workflows.",
            detail: "Combines Python packaging, OpenAI Whisper, and Google text-to-speech workflows into a reusable developer-facing utility."
        },
        {
            title: "Multilingual AI Chatbot",
            type: "AI/ML Development",
            language: ["Python", "OpenAI", "LLaMA3", "NLP"],
            color: "#ff7a90",
            image: "assets/images/projects/multi-lang-chatbot.png",
            link: "https://github.com/Vamshi0104",
            summary: "Text and voice chatbot experience using LLaMA3, OpenAI, and multilingual Python workflows.",
            detail: "Built around conversational UX, multilingual support, and practical voice interaction patterns for broader accessibility."
        },
        {
            title: "Analysis of Clickstream Data",
            type: "Machine Learning",
            language: ["Python", "ML", "Pandas", "scikit-learn"],
            color: "#9ec5ff",
            image: "assets/images/projects/clickstream-data-analysis.png",
            link: "https://github.com/Vamshi0104",
            summary: "Consumer behavior analysis for online shopping data using machine learning and e-commerce pattern discovery.",
            detail: "Explored clickstream behavior across online clothing data to surface patterns that can improve merchandising and conversion strategy."
        },
        {
            title: "Time Series Agriculture Detection",
            type: "Research ML",
            language: ["Python", "ML", "Active Learning"],
            color: "#c6a6ff",
            image: "assets/images/projects/Time-Series-Mining-Approach-for-Agriculture-Area-Detection.jpeg",
            link: "https://github.com/Vamshi0104",
            summary: "Active learning framework for crop monitoring with seasonal time-series signals.",
            detail: "Used time-series mining to improve agricultural area detection and support more precise crop monitoring workflows."
        },
        {
            title: "Text Summarization",
            type: "Python Web App",
            language: ["Python", "Flask", "NLP"],
            color: "#8df7d2",
            image: "assets/images/projects/text-summarize.png",
            link: "https://textsummarization.pythonanywhere.com",
            summary: "A Flask app that creates exportable summaries from uploaded or pasted text.",
            detail: "Focused on turning long-form content into concise summaries through a lightweight web interface."
        },
        {
            title: "Retail Store Management",
            type: "Full Stack",
            language: ["PHP", "MySQL", "JavaScript"],
            color: "#ffcf6d",
            image: "assets/images/projects/retail-store-management.jpeg",
            link: "https://github.com/Vamshi0104",
            summary: "Freelance CRUD product with inventory, users, cart flows, and invoice generation.",
            detail: "Designed practical retail modules for product management, user workflows, cart handling, and invoice generation."
        },
        {
            title: "Hospital Management System",
            type: "Full Stack",
            language: ["Java", "JSP", "MySQL"],
            color: "#ff7a90",
            image: "assets/images/projects/Hospital-Management-System.jpg",
            link: "https://github.com/Vamshi0104",
            summary: "MVC hospital application covering admin, patient, doctor, and reception modules.",
            detail: "Built a real-time CRUD application using JSP and MVC patterns for clinical operations and appointment workflows."
        },
        {
            title: "Vintage Knowledge",
            type: "Educational Web",
            language: ["PHP", "HTML", "CSS", "JavaScript"],
            color: "#9ec5ff",
            image: "assets/images/projects/vintage-knowledge.png",
            link: "https://vamshi0104.github.io/vintage-knowledge",
            summary: "Interactive learning site for C programming with simple query search and clear lessons.",
            detail: "Created an approachable C programming resource with searchable content and frontend-first learning flows."
        },
        {
            title: "Secure Password Suggester",
            type: "Security Utility",
            language: ["PHP", "JavaScript", "Security"],
            color: "#c6a6ff",
            image: "assets/images/projects/secured-password-generator.png",
            link: "https://github.com/Vamshi0104",
            summary: "Password-strength helper that recommends stronger encrypted password alternatives.",
            detail: "Focused on practical security education through immediate password feedback and suggestion flows."
        },
        {
            title: "Instant WA Messenger",
            type: "Web Utility",
            language: ["JavaScript", "HTML", "CSS"],
            color: "#8df7d2",
            image: "assets/images/projects/insta-wa.png",
            link: "https://vamshi0104.github.io/inst-wa",
            summary: "Send a WhatsApp message without saving the contact first.",
            detail: "Built as a lightweight utility to remove friction from one-off WhatsApp conversations."
        },
        {
            title: "Simple Virtual Assistant",
            type: "CLI Tool",
            language: ["Python"],
            color: "#ffcf6d",
            image: "assets/images/projects/virtual-assist.jpg",
            link: "https://github.com/Vamshi0104",
            summary: "Command-line assistant with calculator, date, time, and keyword search modules.",
            detail: "A Python CLI exploration of modular assistant interactions and everyday automation."
        },
        {
            title: "Song Recommender",
            type: "NLP Experiment",
            language: ["Python", "NLP", "VADER"],
            color: "#ff7a90",
            image: "assets/images/projects/song-recommender.png",
            link: "https://github.com/Vamshi0104",
            summary: "Sentiment analyzer that recommends songs based on quiz outcomes and VADER scoring.",
            detail: "Connected lightweight personality input to sentiment scoring and recommendation behavior."
        },
        {
            title: "Find Me",
            type: "Location Tool",
            language: ["JavaScript", "HTML", "CSS"],
            color: "#9ec5ff",
            image: "assets/images/projects/vintage-knowledge.png",
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

    function renderFilters() {
        filters.innerHTML = languages.map(function (language) {
            return '<button type="button" class="' + (language === activeLanguage ? "is-active" : "") + '" data-language="' + language + '">' + language + "</button>";
        }).join("");
    }

    function projectMatches(project, term) {
        var haystack = [project.title, project.type, project.summary, project.detail].concat(project.language).join(" ").toLowerCase();
        var matchesSearch = !term || haystack.indexOf(term) > -1;
        var matchesLanguage = activeLanguage === "All" || project.language.indexOf(activeLanguage) > -1;
        return matchesSearch && matchesLanguage;
    }

    function renderProjects() {
        var term = search.value.trim().toLowerCase();
        var visibleProjects = projects.filter(function (project) {
            return projectMatches(project, term);
        });

        grid.innerHTML = visibleProjects.map(function (project, index) {
            return [
                '<article class="project-card" tabindex="0" role="button" data-project-index="' + projects.indexOf(project) + '" style="--accent-card:' + project.color + '">',
                '<div>',
                '<div class="project-media"><img src="' + project.image + '" alt="' + project.title + ' preview" loading="lazy"></div>',
                '<div class="modal-kicker">' + project.type + "</div>",
                "<h3>" + project.title + "</h3>",
                "<p>" + project.summary + "</p>",
                "</div>",
                '<div>',
                '<div class="project-meta">' + project.language.slice(0, 4).map(function (language) { return "<span>" + language + "</span>"; }).join("") + "</div>",
                '<span class="project-open" aria-hidden="true"><i class="fa fa-arrow-right"></i></span>',
                "</div>",
                "</article>"
            ].join("");
        }).join("");

        emptyState.classList.toggle("is-visible", visibleProjects.length === 0);
    }

    renderFilters();
    renderProjects();

    filters.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-language]");
        if (!button) return;
        activeLanguage = button.getAttribute("data-language");
        renderFilters();
        renderProjects();
    });

    search.addEventListener("input", renderProjects);

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
        modalDescription.textContent = project.detail;
        modalStack.innerHTML = project.language.map(function (language) {
            return "<span>" + language + "</span>";
        }).join("");
        modalLink.href = project.link;
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

    grid.addEventListener("click", function (event) {
        var card = event.target.closest(".project-card");
        if (card) openProject(card.getAttribute("data-project-index"));
    });

    grid.addEventListener("keydown", function (event) {
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
        if (event.target === projectModal) closeProjectModal();
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
        if (event.target === resumeModal) closeResumeModal();
    });

    var downloadResume = document.getElementById("downloadResume");
    var downloadDetailedResume = document.getElementById("downloadDetailedResume");
    var downloadStatus = document.getElementById("downloadStatus");
    var downloadLabel = downloadStatus.querySelector("small");

    function showDownloadProgress(label) {
        var progress = 0;
        downloadStatus.classList.add("is-active");
        downloadStatus.style.setProperty("--download-progress", "0%");
        downloadLabel.textContent = "Preparing " + label;
        var timer = window.setInterval(function () {
            progress += 20;
            downloadStatus.style.setProperty("--download-progress", progress + "%");
            downloadLabel.textContent = progress < 100 ? progress + "% ready" : label + " started";
            if (progress >= 100) {
                window.clearInterval(timer);
                window.setTimeout(function () {
                    downloadStatus.classList.remove("is-active");
                    downloadStatus.style.setProperty("--download-progress", "0%");
                    downloadLabel.textContent = "";
                }, 1700);
            }
        }, 160);
    }

    downloadResume.addEventListener("click", function () {
        showDownloadProgress("resume download");
    });

    downloadDetailedResume.addEventListener("click", function () {
        showDownloadProgress("detailed resume download");
    });

    var contactForm = document.getElementById("contactForm");
    var formStatus = document.getElementById("formStatus");
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(contactForm);
        var email = (data.get("email") || "").trim();
        var phone = (data.get("phone") || "").trim();
        if (!email && !phone) {
            formStatus.textContent = "Add an email address or phone number so I can reply.";
            contactForm.querySelector("[name='email']").focus();
            return;
        }
        var subject = "Portfolio inquiry from " + data.get("name");
        var body = [
            "Name: " + data.get("name"),
            "Email: " + (email || "Not provided"),
            "Phone: " + (phone || "Not provided"),
            "",
            "Message:",
            data.get("message")
        ].join("\n");
        var mailto = "mailto:vamshi-madhavan@outlook.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        window.location.href = mailto;
        formStatus.textContent = "Opening your email app with the full message.";
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        if (projectModal.open) closeProjectModal();
        if (resumeModal.open) closeResumeModal();
    });
})();
