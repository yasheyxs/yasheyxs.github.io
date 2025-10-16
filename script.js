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
  "(prefers-reduced-motion: reduce)"
).matches;

// ===== Loader =====
window.addEventListener("load", () => {
  if (loader) {
    // Animación de salida del loader
    setTimeout(() => {
      loader.classList.add("hide");

      // Esperar a que la animación termine y luego removerlo
      setTimeout(() => {
        loader.remove();

        // Reiniciar scroll y parallax después de remover loader
        requestAnimationFrame(() => {
          updateParallax();
          handleNavbarScroll();

          // Fuerza un reflow visual del hero tras el loader
          const hero = document.querySelector(".hero");
          if (hero) {
            hero.style.transform = "translateY(0)"; // forzar repintado
            hero.offsetHeight; // trigger reflow
          }

          if (window.AOS) {
            window.AOS.refresh();
          }
        });
      }, 600);
    }, 1600);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  }

  // Mostrar íconos del hero
  heroIcons.forEach((icon, index) => {
    setTimeout(() => icon.classList.add("visible"), index * 180);
  });
});

// ===== Navbar sticky y scroll general =====
const handleNavbarScroll = () => {
  if (window.scrollY > 40) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }
};

const toggleBackToTop = () => {
  if (!backToTop) return;
  if (window.scrollY > 320) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
};

const updateParallax = () => {
  if (prefersReducedMotion) return;
  parallaxElements.forEach((element) => {
    const speed = parseFloat(element.dataset.parallax || "0");
    const offset = window.scrollY * speed;
    element.style.setProperty("--parallax-offset", `${offset}px`);
  });
};

const handleScroll = () => {
  handleNavbarScroll();
  toggleBackToTop();
  updateParallax();
};

handleScroll();
window.addEventListener("scroll", handleScroll);

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Menú móvil =====
mobileMenuButton?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  mobileMenuButton.classList.toggle("active");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    mobileMenuButton?.classList.remove("active");
  });
});

// ===== AOS Animations =====
if (window.AOS) {
  window.AOS.init({
    duration: 900,
    once: false,
    mirror: true,
    offset: 100,
    easing: "ease-out-cubic",
  });
}

// ===== Animaciones de habilidades y servicios =====
const iconObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        iconObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

skillIcons.forEach((icon) => iconObserver.observe(icon));
serviceCards.forEach((card) => {
  card.addEventListener("focus", () => card.classList.add("visible"));
});

// ===== Hover adicional =====
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  card.addEventListener("focus", () => card.classList.add("hovered"));
  card.addEventListener("blur", () => card.classList.remove("hovered"));
});


// ===== Texto rotativo en footer =====
if (footerRotating) {
  const phrases = [
    "Creado con ❤️",
    "Desarrollado con pasión",
    "Inspirado por la tecnología",
  ];
  let phraseIndex = 0;
  setInterval(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    footerRotating.textContent = phrases[phraseIndex];
  }, 2500);
}

// ===== Formulario contacto =====
const simulateSubmission = () =>
  new Promise((resolve) => setTimeout(resolve, 1100));

const setButtonState = (state) => {
  if (!submitBtn) return;
  const icon = submitBtn.querySelector("i");
  const text = submitBtn.querySelector(".btn-text");
  submitBtn.classList.remove("loading", "success", "error");
  submitBtn.removeAttribute("disabled");
  if (!icon || !text) return;

  switch (state) {
    case "loading":
      submitBtn.classList.add("loading");
      submitBtn.setAttribute("disabled", "disabled");
      text.textContent = "Enviando...";
      icon.className = "fa-solid fa-spinner fa-spin";
      break;
    case "success":
      submitBtn.classList.add("success");
      text.textContent = "Mensaje enviado";
      icon.className = "fa-solid fa-circle-check";
      break;
    case "error":
      submitBtn.classList.add("error");
      text.textContent = "Intenta nuevamente";
      icon.className = "fa-solid fa-circle-exclamation";
      break;
    default:
      text.textContent = "Enviar mensaje";
      icon.className = "fa-solid fa-paper-plane";
      break;
  }
};

const updateFormStatus = (message, type) => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove("success", "error", "visible");
  formStatus.classList.add("visible");
  if (type) {
    formStatus.classList.add(type);
  }
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form) return;

  const formData = new FormData(form);
  const name = (formData.get("name") || "").toString().trim();
  const endpoint = form.getAttribute("action");
  const shouldSimulate = !endpoint || endpoint.includes("xxxxx");

  updateFormStatus("Enviando mensaje...", "");
  setButtonState("loading");

  try {
    if (shouldSimulate) {
      await simulateSubmission();
    } else {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Error enviando el formulario");
      }
    }

    form.reset();
    updateFormStatus(
      `¡Gracias ${
        name || "por tu mensaje"
      }! Tu mensaje fue enviado correctamente.`,
      "success"
    );
    setButtonState("success");
  } catch (error) {
    console.error(error);
    updateFormStatus(
      "Hubo un error al enviar el mensaje. Por favor, inténtalo nuevamente.",
      "error"
    );
    setButtonState("error");
  } finally {
    setTimeout(() => {
      formStatus?.classList.remove("visible", "success", "error");
      if (formStatus) {
        formStatus.textContent = "";
      }
      setButtonState();
    }, 5000);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.querySelector(".submit-btn");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    status.textContent = "Enviando mensaje...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent =
          "Mensaje enviado correctamente. ¡Gracias por contactarme!";
        form.reset();
      } else {
        status.textContent =
          "Ocurrió un error al enviar. Por favor, intenta nuevamente.";
      }
    } catch (error) {
      status.textContent =
        "No se pudo conectar con el servidor. Revisa tu conexión.";
    }

    submitBtn.disabled = false;
    setTimeout(() => (status.textContent = ""), 6000);
  });
});
