document.addEventListener("DOMContentLoaded", function() {
    const hamburguerBtn = document.querySelector(".hamburguer");
    const sideNav = document.querySelector(".sidenav");
  
    hamburguerBtn.addEventListener("click", function() {
      sideNav.classList.toggle("open");
    });
  });