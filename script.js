// ===== DOM ELEMENTS =====
const mobileMenuButton = document.getElementById("mobileMenu");
const navLinks = document.querySelector(".nav-links");
const navbar = document.getElementById("navbar");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.querySelector(".submit-btn");
const loader = document.getElementById("loader");
const backToTop = document.getElementById("backToTop");
const footerRotating = document.querySelector(".footer-rotating");
const skillIcons = document.querySelectorAll(".skill-item i");
const serviceCards = document.querySelectorAll(".service-card");
const heroIcons = document.querySelectorAll(".hero-icon");
const parallaxElements = document.querySelectorAll("[data-parallax]");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ===== LOADER =====
window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");

      setTimeout(() => {
        loader.remove();

        requestAnimationFrame(() => {
          updateParallax();
          handleNavbarScroll();

          const hero = document.querySelector(".hero");
          if (hero) {
            hero.style.transform = "translateY(0)";
            hero.offsetHeight;
          }

          window.AOS?.refresh();
        });
      }, 600);
    }, 1600);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  }

  heroIcons.forEach((icon, index) => {
    setTimeout(() => icon.classList.add("visible"), index * 180);
  });
});

// ===== SCROLL / NAVBAR =====
const handleNavbarScroll = () => {
  window.scrollY > 40
    ? navbar?.classList.add("scrolled")
    : navbar?.classList.remove("scrolled");
};

const toggleBackToTop = () => {
  if (!backToTop) return;
  window.scrollY > 320
    ? backToTop.classList.add("visible")
    : backToTop.classList.remove("visible");
};

const updateParallax = () => {
  if (prefersReducedMotion) return;
  parallaxElements.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || "0");
    el.style.setProperty("--parallax-offset", `${window.scrollY * speed}px`);
  });
};

const handleScroll = () => {
  handleNavbarScroll();
  toggleBackToTop();
  updateParallax();
};

handleScroll();
window.addEventListener("scroll", handleScroll);

backToTop?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// ===== MOBILE MENU =====
mobileMenuButton?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  mobileMenuButton.classList.toggle("active");
});

navLinks?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    mobileMenuButton?.classList.remove("active");
  }),
);

// ===== AOS =====
window.AOS?.init({
  duration: 900,
  once: false,
  mirror: true,
  offset: 100,
  easing: "ease-out-cubic",
});

// ===== SKILLS / SERVICES =====
const iconObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        iconObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.4 },
);

skillIcons.forEach((icon) => iconObserver.observe(icon));
serviceCards.forEach((card) =>
  card.addEventListener("focus", () => card.classList.add("visible")),
);

// ===== PROJECT CARDS =====
const projectCards = document.querySelectorAll(".project-card");
let expandedProjectCard = null;

const setProjectToggleState = (card, expanded) => {
  const btn = card.querySelector(".project-toggle");
  if (!btn) return;

  btn.textContent = expanded ? "⛶" : "⤢";
  btn.setAttribute(
    "aria-label",
    expanded
      ? "Contraer detalles del proyecto"
      : "Expandir detalles del proyecto",
  );
  btn.setAttribute("aria-expanded", String(expanded));
};

const openProjectCard = (card) => {
  if (expandedProjectCard && expandedProjectCard !== card) {
    expandedProjectCard.classList.remove("expanded");
    setProjectToggleState(expandedProjectCard, false);
  }

  card.classList.add("expanded");
  setProjectToggleState(card, true);
  expandedProjectCard = card;
};

const closeProjectCard = (card) => {
  card.classList.remove("expanded");
  setProjectToggleState(card, false);
  expandedProjectCard = null;
};

projectCards.forEach((card) => {
  const toggle = card.querySelector(".project-toggle");

  setProjectToggleState(card, false);

  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    card === expandedProjectCard
      ? closeProjectCard(card)
      : openProjectCard(card);
  });

  card.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    card === expandedProjectCard
      ? closeProjectCard(card)
      : openProjectCard(card);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card === expandedProjectCard
        ? closeProjectCard(card)
        : openProjectCard(card);
    }
  });
});

document.addEventListener("click", (e) => {
  if (!expandedProjectCard) return;
  if (!e.target.closest(".project-card")) {
    closeProjectCard(expandedProjectCard);
  }
});

// ===== FOOTER TEXT =====
if (footerRotating) {
  const phrases = [
    "Creado con ❤️",
    "Desarrollado con pasión",
    "Inspirado por la tecnología",
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % phrases.length;
    footerRotating.textContent = phrases[i];
  }, 2500);
}

// ===== CONTACT FORM =====
const simulateSubmission = () =>
  new Promise((resolve) => setTimeout(resolve, 1100));

const setButtonState = (state) => {
  if (!submitBtn) return;
  const icon = submitBtn.querySelector("i");
  const text = submitBtn.querySelector(".btn-text");

  submitBtn.classList.remove("loading", "success", "error");
  submitBtn.disabled = false;

  if (!icon || !text) return;

  const states = {
    loading: ["Enviando...", "fa-spinner fa-spin", true],
    success: ["Mensaje enviado", "fa-circle-check"],
    error: ["Intenta nuevamente", "fa-circle-exclamation"],
    default: ["Enviar mensaje", "fa-paper-plane"],
  };

  const [label, iconClass, disabled] = states[state] || states.default;
  text.textContent = label;
  icon.className = `fa-solid ${iconClass}`;
  if (disabled) submitBtn.disabled = true;
};

const updateFormStatus = (msg, type) => {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.className = `form-status visible ${type || ""}`;
};

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setButtonState("loading");
  updateFormStatus("Enviando mensaje...");

  try {
    await simulateSubmission();
    form.reset();
    updateFormStatus("¡Mensaje enviado correctamente!", "success");
    setButtonState("success");
  } catch {
    updateFormStatus("Error al enviar el mensaje.", "error");
    setButtonState("error");
  } finally {
    setTimeout(() => {
      formStatus.textContent = "";
      formStatus.className = "form-status";
      setButtonState();
    }, 5000);
  }
});
