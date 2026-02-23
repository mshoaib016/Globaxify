const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector("#nav-menu");

menu.addEventListener("click", function () {
  // Menu ko open/close karne ke liye
  menuLinks.classList.toggle("active");

  // Hamburger icon ko "X" banane ke liye (Optional animation)
  menu.classList.toggle("is-active");
});
