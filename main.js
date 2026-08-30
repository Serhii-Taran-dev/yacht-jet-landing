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

// ----------- rent form -----------

const rentForm = document.querySelector(".rent-form");
const fullNameInput = document.querySelector("#full-name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const successMessage = document.querySelector(".form-success");

const fullNameError = document.querySelector("#full-name-error");
const emailError = document.querySelector("#email-error");
const phoneError = document.querySelector("#phone-error");

function showError(input, errorElement, successMessage) {
  input.classList.add("is-error");
  input.classList.remove("is-valid");

  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
}

function showValid(input, errorElement) {
  input.classList.remove("is-error");
  input.classList.add("is-valid");

  input.removeAttribute("aria-invalid");
  errorElement.textContent = "";
}

function validateFullName() {
  const value = fullNameInput.value.trim();

  if (value === "") {
    showError(fullNameInput, fullNameError, "Please enter your full name.");
    return false;
  }

  if (value.length < 2) {
    showError(
      fullNameInput,
      fullNameError,
      "Name must contain at least 2 characters.",
    );
    return false;
  }

  showValid(fullNameInput, fullNameError);
  return true;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s()-]+$/;

function validateEmail() {
  const value = emailInput.value.trim();

  if (value === "") {
    showError(emailInput, emailError, "Please enter your email address.");
    return false;
  }

  if (!emailPattern.test(value)) {
    showError(emailInput, emailError, "Please enter a valid email address.");
    return false;
  }

  showValid(emailInput, emailError);
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();

  if (value === "") {
    showError(phoneInput, phoneError, "Please enter your phone number.");
    return false;
  }

  if (!phonePattern.test(value)) {
    showError(phoneInput, phoneError, "Please enter a valid phone number.");
    return false;
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length < 7 || digits.length > 15) {
    showError(
      phoneInput,
      phoneError,
      "Phone number must contain 7 to 15 digits.",
    );
    return false;
  }

  showValid(phoneInput, phoneError);
  return true;
}

rentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isFullNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();

  if (!isFullNameValid || !isEmailValid || !isPhoneValid) {
    successMessage.textContent = "";
    return;
  }

  successMessage.textContent = "Thank you. Our team will contact you shortly.";

  rentForm.reset();
  resetFormStates();
});

function resetFormStates() {
  [fullNameInput, emailInput, phoneInput].forEach((input) => {
    input.classList.remove("is-valid", "is-error");
    input.removeAttribute("aria-invalid");
  });

  fullNameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";
}
