const sections = Array.from(document.querySelectorAll("main section"));
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const header = document.querySelector(".header");
const rootHtml = document.documentElement;
const razonesCards = Array.from(document.querySelectorAll(".razones-grid .razon-card"));

// ===== MODO DIAPOSITIVAS SEGÚN FILA DE TARJETAS =====
function areFourCardsInOneRow() {
    if (razonesCards.length < 4) {
        return true;
    }

    const firstRowTop = razonesCards[0].offsetTop;
    return razonesCards.slice(0, 4).every((card) => Math.abs(card.offsetTop - firstRowTop) <= 1);
}

function syncSlideMode() {
    const keepSlideMode = areFourCardsInOneRow();
    rootHtml.classList.toggle("no-slide-mode", !keepSlideMode);
}

if (razonesCards.length >= 4) {
    let resizeTimeout;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(syncSlideMode, 120);
    });

    window.addEventListener("load", syncSlideMode);
    syncSlideMode();

    const razonesGrid = document.querySelector(".razones-grid");
    if (razonesGrid && "ResizeObserver" in window) {
        const gridResizeObserver = new ResizeObserver(syncSlideMode);
        gridResizeObserver.observe(razonesGrid);
    }
}

// ===== MENU HAMBURGUESA =====
if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

// ===== NAVEGACION / LINK ACTIVO =====
function updateActiveLink(sectionId) {
    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === `#${sectionId}`) {
            link.classList.add("active");
        } else if (href && href.startsWith("#")) {
            link.classList.remove("active");
        }
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";

        if (href.startsWith("#")) {
            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }

        if (hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
            updateActiveLink(entry.target.id);
        }
    });
}, {
    threshold: 0.45
});

sections.forEach((section) => {
    if (section.id) {
        sectionObserver.observe(section);
    }
});

// ===== FAQ ACORDEON =====
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
    const pregunta = item.querySelector(".faq-pregunta");
    if (!pregunta) return;

    pregunta.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((faq) => faq.classList.remove("active"));
        if (!isActive) {
            item.classList.add("active");
        }
    });
});

// ===== FORMULARIO DE CONTACTO =====
const contactForm = document.getElementById("contactForm");
if (contactForm && contactForm.dataset.demoSubmit === "true") {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Mensaje enviado (demo). Te contactaremos pronto.");
        contactForm.reset();
    });
}

// ===== HEADER DINAMICO =====
if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            header.style.background = "rgba(255, 255, 255, 0.98)";
            header.style.boxShadow = "0 6px 22px rgba(0, 0, 0, 0.1)";
        } else {
            header.style.background = "rgba(255, 255, 255, 0.95)";
            header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
        }
    });
}

// ===== ANIMACIONES DE ENTRADA =====
const revealGroups = [
    { selector: "main section", effect: "reveal" },
    { selector: ".hero-content", effect: "reveal-left" },
    { selector: ".hero-image", effect: "reveal-right" },
    { selector: ".section-title", effect: "reveal" },
    { selector: ".razon-card, .servicio-card, .proceso-card, .caso-card, .equipo-card, .valor-item, .red-social", effect: "reveal-zoom" },
    { selector: ".por-que-item, .contacto-item, .faq-item", effect: "reveal-left" },
    { selector: ".contacto-form, .contacto-info, .footer-container > div", effect: "reveal-right" }
];

revealGroups.forEach(({ selector, effect }) => {
    document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add("reveal", effect);
        el.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
    });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
});

document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
});
