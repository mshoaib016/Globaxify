// ===================================
// GLOBAXIFY - MAIN JAVASCRIPT (COMPLETE & CLEAN)
// ===================================

(function () {
  "use strict";

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // ===================================
  // STATE MANAGEMENT
  // ===================================

  const state = {
    observers: [],
    intervals: [],
    isTouch: window.matchMedia("(pointer: coarse)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    animatedCounters: new Set(),
  };

  // ===================================
  // DOM ELEMENTS CACHE
  // ===================================

  const elements = {
    header: document.getElementById("header"),
    backToTop: document.getElementById("backToTop"),
    hamburger: document.getElementById("hamburger"),
    navMenu: document.getElementById("navMenu"),
    navLinks: document.querySelectorAll(".nav-link"),
    contactForm: document.getElementById("contactForm"),
    newsletterForms: document.querySelectorAll(".newsletter-form"),
  };

  // ===================================
  // UNIFIED COUNTER ANIMATION SYSTEM
  // ===================================

  class CounterAnimator {
    constructor(element, options = {}) {
      this.element = element;
      this.target = parseInt(
        element.getAttribute("data-count") ||
          element.getAttribute("data-target"),
      );
      this.duration = options.duration || 2000;
      this.suffix = options.suffix || "";
      this.prefix = options.prefix || "";
      this.startTime = null;
      this.startValue = 0;
      this.isAnimating = false;
      this.hasAnimated = false;
    }

    easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    animate(currentTime) {
      if (!this.startTime) this.startTime = currentTime;
      const elapsed = currentTime - this.startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const easedProgress = this.easeOutQuart(progress);
      const currentValue = Math.floor(
        this.startValue + (this.target - this.startValue) * easedProgress,
      );

      this.element.textContent = this.prefix + currentValue + this.suffix;

      if (progress < 1) {
        requestAnimationFrame((time) => this.animate(time));
      } else {
        this.element.textContent = this.prefix + this.target + this.suffix;
        this.isAnimating = false;
        this.hasAnimated = true;
        this.element.classList.add("counted");

        // Scale effect on complete
        this.element.style.transform = "scale(1.1)";
        setTimeout(() => {
          this.element.style.transform = "scale(1)";
        }, 200);
      }
    }

    start() {
      if (!this.isAnimating && !this.hasAnimated) {
        // Check if target is valid number
        if (isNaN(this.target)) {
          console.warn("Invalid counter target:", this.element);
          return;
        }

        this.isAnimating = true;
        this.startTime = null;
        requestAnimationFrame((time) => this.animate(time));
      }
    }

    reset() {
      this.hasAnimated = false;
      this.isAnimating = false;
      this.element.textContent = this.prefix + "0" + this.suffix;
      this.element.classList.remove("counted");
    }
  }

  // Initialize all counters on the page
  function initAllCounters() {
    const counterConfigs = [
      // Hero section counters (data-count)
      { selector: ".stat-number[data-count]", options: { suffix: "+" } },
      // About section counters (data-count)
      { selector: ".counter-about[data-count]", options: {} },
      // Team section counters (data-target)
      { selector: ".counter-team[data-target]", options: { suffix: "+" } },
      // Luxury stats counters
      { selector: ".stat-number-lux[data-count]", options: { suffix: "+" } },
      // Any other counter with data-count
      {
        selector:
          "[data-count]:not(.stat-number):not(.counter-about):not(.stat-number-lux)",
        options: {},
      },
      // Any other counter with data-target
      { selector: "[data-target]:not(.counter-team)", options: {} },
    ];

    const allCounters = new Map();

    counterConfigs.forEach(({ selector, options }) => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        // Skip if already initialized
        if (allCounters.has(el)) return;

        // Special handling for different types
        let config = { ...options };

        // Check if it's the 24/7 text (non-numeric)
        const target = parseInt(
          el.getAttribute("data-count") || el.getAttribute("data-target"),
        );
        if (isNaN(target) && el.textContent.includes("24/7")) {
          return; // Skip static text like "24/7"
        }

        const animator = new CounterAnimator(el, config);
        allCounters.set(el, animator);
      });
    });

    // Single observer for all counters
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animator = allCounters.get(entry.target);
            if (animator) {
              animator.start();
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px" },
    );

    allCounters.forEach((animator, element) => {
      observer.observe(element);
    });

    state.observers.push(observer);

    // Store globally for re-init
    window.counterAnimators = allCounters;
  }

  // ===================================
  // HEADER SCROLL EFFECT
  // ===================================

  function initHeader() {
    if (!elements.header || !elements.backToTop) return;

    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      elements.header.classList.toggle("scrolled", scrollY > 100);
      elements.backToTop.classList.toggle("visible", scrollY > 100);
      updateActiveNav();
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // ===================================
  // MOBILE NAVIGATION
  // ===================================

  function initMobileNav() {
    if (!elements.hamburger || !elements.navMenu) return;

    const toggleMenu = () => {
      elements.hamburger.classList.toggle("active");
      elements.navMenu.classList.toggle("active");
    };

    elements.hamburger.addEventListener("click", toggleMenu);

    elements.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        elements.hamburger.classList.remove("active");
        elements.navMenu.classList.remove("active");
      });
    });
  }

  // ===================================
  // ACTIVE NAVIGATION LINK
  // ===================================

  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        elements.navLinks.forEach((link) => link.classList.remove("active"));
        if (navLink) navLink.classList.add("active");
      }
    });
  }

  // ===================================
  // AOS ANIMATION ON SCROLL
  // ===================================

  function initAOS() {
    if (state.reducedMotion) {
      document.querySelectorAll("[data-aos]").forEach((el) => {
        el.classList.add("aos-animate");
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-aos]").forEach((el) => {
      observer.observe(el);
    });

    state.observers.push(observer);
  }

  // ===================================
  // REVIEWS SLIDER
  // ===================================

  function initReviewsSlider() {
    const track = document.getElementById("sliderTrack");
    const cards = document.querySelectorAll(".review-card-luxury");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const progressBar = document.getElementById("progressBar");

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;
    const totalCards = cards.length;

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      cards.forEach((card, i) => {
        card.classList.toggle("active", i === currentIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });

      if (progressBar) {
        progressBar.style.width = `${((currentIndex + 1) / totalCards) * 100}%`;
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalCards;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateSlider();
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
      resetAutoSlide();
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));
    });

    // Touch support
    let startPos = 0;

    track.addEventListener(
      "touchstart",
      (e) => {
        startPos = e.touches[0].clientX;
        clearInterval(autoSlideInterval);
      },
      { passive: true },
    );

    track.addEventListener(
      "touchend",
      (e) => {
        const endPos = e.changedTouches[0].clientX;
        const diff = startPos - endPos;

        if (Math.abs(diff) > 50) {
          diff > 0 ? nextSlide() : prevSlide();
        }
        resetAutoSlide();
      },
      { passive: true },
    );

    track.addEventListener("mouseenter", () =>
      clearInterval(autoSlideInterval),
    );
    track.addEventListener("mouseleave", resetAutoSlide);

    resetAutoSlide();
    state.intervals.push(autoSlideInterval);
  }

  // ===================================
  // SERVICES TOGGLE
  // ===================================

  function initServicesToggle() {
    const serviceCards = document.querySelectorAll(".service-card-luxury");

    serviceCards.forEach((card) => {
      const header = card.querySelector(".service-header-luxury");
      const content = card.querySelector(".service-content-luxury");

      if (header && content) {
        header.addEventListener("click", () => {
          const isActive = card.classList.contains("active");

          // Close all others
          serviceCards.forEach((c) => {
            c.classList.remove("active");
            const content = c.querySelector(".service-content-luxury");
            if (content) content.style.maxHeight = null;
          });

          // Toggle current
          if (!isActive) {
            card.classList.add("active");
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      }
    });
  }

  // ===================================
  // CONTACT FORM
  // ===================================

  function initContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showNotification(
        "Thank you! Your message has been sent successfully.",
        "success",
      );
      elements.contactForm.reset();
    });
  }

  // ===================================
  // NOTIFICATION SYSTEM
  // ===================================

  function showNotification(message, type = "success") {
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
      <span>${message}</span>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      background: ${type === "success" ? "linear-gradient(135deg, #10b981, #3b82f6)" : "#ef4444"};
      color: white;
      padding: 15px 25px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-weight: 500;
      font-family: 'Poppins', sans-serif;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===================================
  // SMOOTH SCROLL
  // ===================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // ===================================
  // BACK TO TOP
  // ===================================

  function initBackToTop() {
    if (!elements.backToTop) return;

    elements.backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===================================
  // NEWSLETTER FORMS
  // ===================================

  function initNewsletterForms() {
    elements.newsletterForms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        showNotification("Thank you for subscribing!", "success");
        form.reset();
      });
    });
  }

  // ===================================
  // TYPING EFFECT
  // ===================================

  function initTypingEffect() {
    const typingElement = document.getElementById("typing-text");
    if (!typingElement) return;

    const words = [
      "Web Apps",
      "Mobile Solutions",
      "Cloud Architecture",
      "Digital Products",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // ===================================
  // BUTTON RIPPLE EFFECT
  // ===================================

  function initRippleEffect() {
    const btn = document.querySelector(".btn-ceo-cta");
    if (btn) {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty("--x", `${x}%`);
        btn.style.setProperty("--y", `${y}%`);
      });
    }
  }

  // ===================================
  // GLOBAL FUNCTIONS
  // ===================================

  window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  window.showComingSoon = function () {
    showNotification("Coming soon!", "success");
  };

  // Re-initialize counters (for dynamic content)
  window.reinitCounters = function () {
    initAllCounters();
  };

  // ===================================
  // CLEANUP ON PAGE UNLOAD
  // ===================================

  function cleanup() {
    state.observers.forEach((observer) => observer.disconnect());
    state.intervals.forEach((interval) => clearInterval(interval));
  }

  // ===================================
  // INITIALIZATION
  // ===================================

  function init() {
    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Initialize all modules
    initHeader();
    initMobileNav();
    initAOS();
    initAllCounters(); // Unified counter system
    initReviewsSlider();
    initServicesToggle();
    initContactForm();
    initSmoothScroll();
    initBackToTop();
    initNewsletterForms();
    initTypingEffect();
    initRippleEffect();

    // Cleanup on unload
    window.addEventListener("beforeunload", cleanup);
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
// Form submission handler
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value;

  // Simple validation
  if (name && email && service && message) {
    // Show success message (you can replace this with actual form submission)
    alert("Thank you " + name + "! Your message has been sent successfully.");
    this.reset();
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
