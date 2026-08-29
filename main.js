// ----------- mobile menu -----------

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

const header = document.querySelector(".header");

// ----------- header scroll -----------

function updateHeaderOnScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 600);
}

window.addEventListener("scroll", updateHeaderOnScroll);

updateHeaderOnScroll();

// ----------- yacht catalog -----------

const yachtList = document.querySelector(".yacht-catalog-list");
const yachtCards = document.querySelectorAll(".yacht-catalog-card");
const prevYachtBtn = document.querySelector(".yacht-catalog-prev");
const nextYachtBtn = document.querySelector(".yacht-catalog-next");

let currentYachtIndex = 0;

function getVisibleYachts() {
  if (window.innerWidth >= 1280) {
    return 3;
  }

  if (window.innerWidth >= 768) {
    return 2;
  }

  return 1;
}

function updateYachtCarousel() {
  const cardWidth = yachtCards[0].getBoundingClientRect().width;
  const styles = window.getComputedStyle(yachtList);
  const gap = parseFloat(styles.gap);

  const offset = currentYachtIndex * (cardWidth + gap);

  yachtList.style.transform = `translateX(-${offset}px)`;

  updateYachtControls();
}

function updateYachtControls() {
  const visibleYachts = getVisibleYachts();
  const maxIndex = yachtCards.length - visibleYachts;

  prevYachtBtn.disabled = currentYachtIndex === 0;
  nextYachtBtn.disabled = currentYachtIndex === maxIndex;
}

nextYachtBtn.addEventListener("click", () => {
  const visibleYachts = getVisibleYachts();
  const maxIndex = yachtCards.length - visibleYachts;

  if (currentYachtIndex < maxIndex) {
    currentYachtIndex += 1;
    updateYachtCarousel();
  }
});

prevYachtBtn.addEventListener("click", () => {
  if (currentYachtIndex > 0) {
    currentYachtIndex -= 1;
    updateYachtCarousel();
  }
});

updateYachtControls();

function handleYachtResize() {
  const visibleYachts = getVisibleYachts();
  const maxIndex = yachtCards.length - visibleYachts;

  if (currentYachtIndex > maxIndex) {
    currentYachtIndex = maxIndex;
  }

  updateYachtCarousel();
}

window.addEventListener("resize", handleYachtResize);

let startX = 0;
let currentX = 0;
let isDragging = false;
let startOffset = 0;

yachtList.addEventListener("pointerdown", (event) => {
  isDragging = true;
  startX = event.clientX;
  currentX = startX;

  yachtList.setPointerCapture(event.pointerId);

  const cardWidth = yachtCards[0].getBoundingClientRect().width;
  const styles = window.getComputedStyle(yachtList);
  const gap = parseFloat(styles.gap);

  startOffset = currentYachtIndex * (cardWidth + gap);

  yachtList.style.transition = "none";
});

yachtList.addEventListener("pointermove", (event) => {
  if (!isDragging) return;

  currentX = event.clientX;

  const dragDistance = currentX - startX;
  const offset = startOffset - dragDistance;

  yachtList.style.transform = `translateX(-${offset}px)`;
});

yachtList.addEventListener("pointerup", (event) => {
  if (!isDragging) return;

  const swipeDistance = currentX - startX;
  const swipeThreshold = 50;

  yachtList.style.transition = "";

  const visibleYachts = getVisibleYachts();
  const maxIndex = yachtCards.length - visibleYachts;

  if (swipeDistance < -swipeThreshold && currentYachtIndex < maxIndex) {
    currentYachtIndex += 1;
  } else if (swipeDistance > swipeThreshold && currentYachtIndex > 0) {
    currentYachtIndex -= 1;
  }

  updateYachtCarousel();

  yachtList.releasePointerCapture(event.pointerId);

  isDragging = false;
  startX = 0;
  currentX = 0;
});

yachtList.addEventListener("pointercancel", () => {
  if (!isDragging) return;

  yachtList.style.transition = "";
  updateYachtCarousel();

  isDragging = false;
  startX = 0;
  currentX = 0;
});
