const openMenuBtn = document.querySelector(".menu-open-btn");
const closeMenuBtn = document.querySelector(".mobile-menu-close-btn");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

function openMenu() {
  mobileMenu.classList.add("is-open");

  openMenuBtn.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  closeMenuBtn.focus();
}

function closeMenu(restoreFocus = true) {
  mobileMenu.classList.remove("is-open");

  openMenuBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (restoreFocus) {
    openMenuBtn.focus();
  }
}

openMenuBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
    closeMenu();
  }
});

const tabletMedia = window.matchMedia("(min-width: 768px)");

tabletMedia.addEventListener("change", (event) => {
  if (event.matches && mobileMenu.classList.contains("is-open")) {
    closeMenu(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab" || !mobileMenu.classList.contains("is-open")) {
    return;
  }

  const focusableElements = mobileMenu.querySelectorAll(
    "a[href], button:not([disabled])",
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});
