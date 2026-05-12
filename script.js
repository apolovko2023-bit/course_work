document.addEventListener("DOMContentLoaded", () => {
  const cafeMapUrl = "https://www.google.com/maps/search/?api=1&query=%D0%B2%D1%83%D0%BB.+%D0%9A%D0%BD%D1%8F%D0%B3%D0%B8%D0%BD%D1%96+%D0%9E%D0%BB%D1%8C%D0%B3%D0%B8+43,+%D0%9B%D1%8C%D0%B2%D1%96%D0%B2";
  document.querySelectorAll("[data-map-link]").forEach((link) => {
    link.href = cafeMapUrl;
  });

  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", nav.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".menu-section, .order-section").forEach((section) => {
    const cards = section.querySelector(".cards");
    const buttons = section.querySelectorAll(".arrows button");

    if (!cards || buttons.length < 2) {
      return;
    }

    buttons[0].addEventListener("click", () => {
      cards.scrollBy({ left: -280, behavior: "smooth" });
    });

    buttons[1].addEventListener("click", () => {
      cards.scrollBy({ left: 280, behavior: "smooth" });
    });
  });

  const revealItems = document.querySelectorAll(
    ".card, .about, .story-grid, .founder, .feedback-grid, .feedback-actions, .site-footer"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const modal = document.querySelector("[data-review-modal]");
  const openReview = document.querySelector("[data-review-open]");
  const closeReview = document.querySelector("[data-review-close]");
  const reviewForm = document.querySelector("[data-review-form]");
  const reviewsPanel = document.querySelector("[data-reviews-panel]");
  const reviewsToggle = document.querySelector("[data-reviews-toggle]");
  const reviewsList = document.querySelector("[data-reviews-list]");
  const storageKey = "aromaStormReviews";

  const escapeHtml = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const getReviews = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  };

  const renderReviews = () => {
    if (!reviewsList) {
      return;
    }

    const reviews = getReviews();

    if (reviews.length === 0) {
      reviewsList.innerHTML = '<article class="review-item">Поки що відгуків немає. Будьте першими.</article>';
      return;
    }

    reviewsList.innerHTML = reviews.map((review) => `
      <article class="review-item">
        <strong>${escapeHtml(review.name)}</strong>
        <p>${escapeHtml(review.message)}</p>
      </article>
    `).join("");
  };

  const openModal = () => {
    if (modal) {
      modal.hidden = false;
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.hidden = true;
    }
  };

  openReview?.addEventListener("click", openModal);
  closeReview?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  reviewsToggle?.addEventListener("click", () => {
    if (!reviewsPanel) {
      return;
    }

    reviewsPanel.hidden = !reviewsPanel.hidden;
    renderReviews();
  });

  reviewForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(reviewForm);
    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !message) {
      return;
    }

    const reviews = getReviews();
    reviews.unshift({ name, message });
    localStorage.setItem(storageKey, JSON.stringify(reviews.slice(0, 12)));

    reviewForm.reset();
    closeModal();

    if (reviewsPanel) {
      reviewsPanel.hidden = false;
      renderReviews();
    }

  });

  renderReviews();
});
