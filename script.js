// Header Scroll Effect
window.addEventListener("scroll", function () {
  const header = document.querySelector(".luxury-nav");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Mobile Menu Toggle
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

menu.addEventListener("click", function () {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
});
const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('closeBtn');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('overlay');

// Open Menu
hamburger.addEventListener('click', () => {
    navLinks.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scrolling when menu open
});

// Close Menu
function closeMenu() {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);